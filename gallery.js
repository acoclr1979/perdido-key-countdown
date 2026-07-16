// Renders the sectioned photo grid (Beach / Flora-Bama / Cobalt / Crab Trap / Past Trips)
// into the #galleryGrid* containers on gallery.html.
// Requires photos.js to be loaded first.
(function () {
    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderGrid(container, photos, pathPrefix) {
        if (!container) return;
        if (!photos.length) {
            container.innerHTML = '<p class="gallery-empty">Nothing here yet — check back as the trip goes on.</p>';
            return;
        }
        container.innerHTML = photos.map(name => {
            const override = PKC_GALLERY_OVERRIDES[name];
            const featuredClass = override && override.featured ? ' featured' : '';
            const caption = override && override.caption
                ? `<span class="gallery-caption">${esc(override.caption)}</span>`
                : '';
            const path = `${pathPrefix}${name}`;
            return `<a class="gallery-item${featuredClass}" href="${path}" target="_blank" rel="noopener noreferrer">
                <img src="${path}" alt="Trip photo" loading="lazy">
                ${caption}
            </a>`;
        }).join('');
    }

    function splitRootPhotos(photos) {
        const beach = [], pastTrips = [];
        photos.forEach(name => (pkcIsPastTrip(name) ? pastTrips : beach).push(name));
        return { beach, pastTrips };
    }

    async function initGallery() {
        const beachGrid = document.getElementById('galleryGridBeach');
        if (!beachGrid) return; // not on gallery.html

        const pastGrid = document.getElementById('galleryGridPast');
        const florabamaGrid = document.getElementById('galleryGridFlorabama');
        const cobaltGrid = document.getElementById('galleryGridCobalt');
        const crabtrapGrid = document.getElementById('galleryGridCrabtrap');

        // Instant first paint from cache/fallback, refined once the live calls land.
        const rootSync = splitRootPhotos(pkcGetPhotosSync());
        renderGrid(beachGrid, rootSync.beach, './photos/');
        renderGrid(pastGrid, rootSync.pastTrips, './photos/');

        const [rootFresh, florabamaPhotos, cobaltPhotos, crabtrapPhotos] = await Promise.all([
            pkcLoadPhotos(),
            pkcLoadSubfolderPhotos('photos/florabama', 'pkc_florabama_photos_cache_v1'),
            pkcLoadSubfolderPhotos('photos/cobalt', 'pkc_cobalt_photos_cache_v1'),
            pkcLoadSubfolderPhotos('photos/crabtrap', 'pkc_crabtrap_photos_cache_v1'),
        ]);

        const rootFreshSplit = splitRootPhotos(rootFresh);
        renderGrid(beachGrid, rootFreshSplit.beach, './photos/');
        renderGrid(pastGrid, rootFreshSplit.pastTrips, './photos/');
        renderGrid(florabamaGrid, florabamaPhotos, './photos/florabama/');
        renderGrid(cobaltGrid, cobaltPhotos, './photos/cobalt/');
        renderGrid(crabtrapGrid, crabtrapPhotos, './photos/crabtrap/');
    }

    initGallery();
})();
