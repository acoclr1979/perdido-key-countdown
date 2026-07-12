// Renders the full-bleed photo mosaic background into <div class="mosaic-bg" id="mosaicBg"></div>.
// Requires photos.js to be loaded first.
(function () {
    function computeColumns() {
        return window.innerWidth <= 600 ? 4 : 5;
    }

    function renderTiles(container, photos) {
        const columns = computeColumns();
        const rows = Math.max(1, Math.ceil(photos.length / columns));
        container.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
        container.innerHTML = photos.map(name => {
            const crop = PKC_MOSAIC_OVERRIDES[name] || { position: 'center center', size: 'cover' };
            return `<div class="mc" style="background-image:url('./photos/${name}'); background-position:${crop.position}; background-size:${crop.size};"></div>`;
        }).join('');
    }

    async function initMosaic() {
        const container = document.getElementById('mosaicBg');
        if (!container) return;

        let photos = pkcGetPhotosSync();
        renderTiles(container, photos);

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => renderTiles(container, photos), 200);
        });

        try {
            const fresh = await pkcLoadPhotos();
            if (fresh.length && fresh.join('|') !== photos.join('|')) {
                photos = fresh;
                renderTiles(container, photos);
            }
        } catch (err) { /* keep showing the sync/fallback list */ }
    }

    initMosaic();
})();
