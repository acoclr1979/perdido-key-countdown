// Shared photo list for the mosaic background and gallery grid.
// Drop a new image into the /photos folder (e.g. via GitHub's web/mobile upload)
// and it shows up here automatically on next load — no code changes needed.
//
// This list is also the offline/rate-limit fallback if the GitHub API call below fails.
const PKC_FALLBACK_PHOTOS = [
    'IMG_1144.jpeg',
    'Photo-00-PKC.jpeg',
    'Photo-1-PKC.jpeg',
    'Photo-2-PKC.jpeg',
    'Photo-3-PKC.jpeg',
    'Photo-4-PKC.jpeg',
    'Photo-5-PKC.jpeg',
    'Photo-6-PKC.jpeg',
    'Photo-7-PKC.JPEG',
    'Photo-8-PKC.jpeg',
    'Photo-9-PKC.jpeg',
    'Photo-10-PKC.jpeg',
    'Photo-11-PKC.jpeg',
    'Photo-12-PKC.jpeg',
    'Photo-13-PKC.jpeg',
    'Photo-14-PKC.jpeg',
    'Photo-15-PKC.jpeg',
    'Photo-16-PKC.jpeg',
    'Photo-17-PKC.jpeg',
    'Photo-18-PKC.jpg',
    'Photo-19-PKC.jpeg',
    'Photo-20-PKC.JPG',
    'Photo-22-PKC.jpeg',
    'Photo-23-PKC.jpg',
    'Photo-25-PKC.jpeg',
    'Photo-26-PKC.jpeg',
    'Photo-29-PKC.jpeg',
    'Photo-35-PKC.jpeg',
];

// Decorative/non-candid assets that live in /photos for other uses (VREI mascot,
// generated art, etc.) but shouldn't be mixed into the "real trip photos" pool.
const PKC_EXCLUDE = new Set([
    'Photo-24-PKC.PNG', // painterly generated beach-chair graphic, unused so far
    'Photo-30-PKC.PNG', // Vacation Rick mascot avatar, used directly in the VREI panel
]);

// Hand-tuned crop for the original photo set (mosaic background only).
// Anything not listed here — i.e. any newly dropped-in photo — gets a plain
// center/cover crop, which is the tradeoff for not having to edit code per photo.
const PKC_MOSAIC_OVERRIDES = {
    'Photo-00-PKC.jpeg': { position: 'center 72%', size: '240%' },
    'IMG_1144.jpeg':      { position: 'center center', size: 'cover' },
    'Photo-1-PKC.jpeg':   { position: 'center 35%', size: '250%' },
    'Photo-2-PKC.jpeg':   { position: 'center 65%', size: '210%' },
    'Photo-3-PKC.jpeg':   { position: '80% 50%', size: '175%' },
    'Photo-4-PKC.jpeg':   { position: 'center 40%', size: '260%' },
    'Photo-5-PKC.jpeg':   { position: 'center 32%', size: '190%' },
    'Photo-6-PKC.jpeg':   { position: 'center 70%', size: '230%' },
    'Photo-7-PKC.JPEG':   { position: 'center center', size: 'cover' },
    'Photo-8-PKC.jpeg':   { position: 'center 48%', size: '200%' },
    'Photo-9-PKC.jpeg':   { position: 'center 42%', size: '170%' },
    'Photo-10-PKC.jpeg':  { position: '48% 38%', size: '130%' },
    'Photo-11-PKC.jpeg':  { position: 'center 44%', size: '210%' },
    'Photo-12-PKC.jpeg':  { position: 'center 55%', size: '170%' },
    'Photo-13-PKC.jpeg':  { position: 'center 50%', size: '210%' },
    'Photo-14-PKC.jpeg':  { position: 'center 8%', size: '120%' },
    'Photo-15-PKC.jpeg':  { position: 'center 55%', size: '200%' },
    'Photo-17-PKC.jpeg':  { position: 'center 50%', size: '180%' },
    'Photo-18-PKC.jpg':   { position: 'center 45%', size: '135%' },
    'Photo-19-PKC.jpeg':  { position: 'center 42%', size: '240%' },
};

// Gallery-only overrides: featured layout + caption.
const PKC_GALLERY_OVERRIDES = {
    'Photo-20-PKC.JPG': { featured: true, caption: 'The legends, post-swim 🍺' },
};

const PKC_GITHUB_REPO = 'acoclr1979/perdido-key-countdown';
const PKC_PHOTO_CACHE_KEY = 'pkc_photos_cache_v1';
const PKC_PHOTO_CACHE_TTL_MS = 5 * 60 * 1000;
const PKC_IMAGE_EXT_RE = /\.(jpe?g|png|heic|gif|webp)$/i;

// Synchronous best-guess list for an instant first paint — no network wait, no flash.
function pkcGetPhotosSync() {
    try {
        const cached = JSON.parse(sessionStorage.getItem(PKC_PHOTO_CACHE_KEY) || 'null');
        if (cached && Array.isArray(cached.files) && cached.files.length) return cached.files;
    } catch (err) { /* sessionStorage unavailable or corrupt — fall through */ }
    return PKC_FALLBACK_PHOTOS;
}

// Authoritative list from the repo's /photos folder. Falls back to the sync list on any error.
async function pkcLoadPhotos() {
    try {
        const cached = JSON.parse(sessionStorage.getItem(PKC_PHOTO_CACHE_KEY) || 'null');
        if (cached && Array.isArray(cached.files) && (Date.now() - cached.ts) < PKC_PHOTO_CACHE_TTL_MS) {
            return cached.files;
        }
    } catch (err) { /* ignore */ }

    try {
        const res = await fetch(`https://api.github.com/repos/${PKC_GITHUB_REPO}/contents/photos`);
        if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
        const data = await res.json();
        const files = data
            .filter(entry => entry.type === 'file' && PKC_IMAGE_EXT_RE.test(entry.name) && !PKC_EXCLUDE.has(entry.name))
            .map(entry => entry.name)
            .sort();
        if (files.length) {
            try {
                sessionStorage.setItem(PKC_PHOTO_CACHE_KEY, JSON.stringify({ ts: Date.now(), files }));
            } catch (err) { /* storage full/unavailable — non-fatal */ }
            return files;
        }
    } catch (err) { /* network/API error — use fallback below */ }

    return pkcGetPhotosSync();
}
