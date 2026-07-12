// Renders the photo grid into <div class="gallery-grid" id="galleryGrid"></div>.
// Requires photos.js to be loaded first.
(function () {
    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function renderGrid(container, photos) {
        container.innerHTML = photos.map(name => {
            const override = PKC_GALLERY_OVERRIDES[name];
            const featuredClass = override && override.featured ? ' featured' : '';
            const caption = override && override.caption
                ? `<span class="gallery-caption">${esc(override.caption)}</span>`
                : '';
            const path = `./photos/${name}`;
            return `<a class="gallery-item${featuredClass}" href="${path}" target="_blank" rel="noopener noreferrer">
                <img src="${path}" alt="Trip photo" loading="lazy">
                ${caption}
            </a>`;
        }).join('');
    }

    async function initGallery() {
        const container = document.getElementById('galleryGrid');
        if (!container) return;

        let photos = pkcGetPhotosSync();
        renderGrid(container, photos);

        try {
            const fresh = await pkcLoadPhotos();
            if (fresh.length && fresh.join('|') !== photos.join('|')) {
                renderGrid(container, fresh);
            }
        } catch (err) { /* keep showing the sync/fallback list */ }
    }

    initGallery();
})();
