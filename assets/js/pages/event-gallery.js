document.addEventListener('DOMContentLoaded', () => {
    const galleryElement = document.getElementById('light-gallery');
    if (!galleryElement) {
        return; // Exit if the gallery element doesn't exist
    }

    const eventName = galleryElement.dataset.eventName;
    if (!eventName) {
        console.error('The data-event-name attribute is not set on the gallery element.');
        return;
    }

    const messageElement = document.getElementById('gallery-message');

    fetch(`../../api/get_images.php?event=${eventName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            return response.json();
        })
        .then(mediaItems => {
            if (!mediaItems || mediaItems.length === 0) {
                if (messageElement) messageElement.textContent = 'As fotos e vídeos do evento serão disponibilizados em breve.';
                return;
            }

            if (messageElement) messageElement.textContent = ''; // Clear loading message

            const dynamicEls = mediaItems.map(item => {
                const subHtml = item.type === 'video' ? '<h4>Vídeo do evento</h4>' : '<h4>Foto do evento</h4>';

                if (item.type === 'video') {
                    return {
                        video: JSON.stringify({
                            source: [{
                                src: item.url,
                                type: 'video/mp4'
                            }],
                            attributes: {
                                preload: false,
                                controls: true,
                                playsinline: true // Boa prática para iOS
                            }
                        }),
                        thumb: item.thumbnail,
                        subHtml: subHtml
                    };
                }
                // Structure for image items remains the same
                return {
                    src: item.url,
                    thumb: item.thumbnail,
                    subHtml: subHtml
                };
            });

            // 1. Initialize lightGallery on the container
            const lg = lightGallery(galleryElement, {
                dynamic: true,
                dynamicEl: dynamicEls,
                plugins: [lgVideo, lgThumbnail],
                // Controls
                showCloseIcon: true,
                escKey: true,
                keyPress: true, // Enables keyboard navigation (arrows)
                controls: true, // Shows next/prev arrows
                mousewheel: true, // Enable mousewheel navigation
                download: false,
                counter: true,
            });

            // 2. Create and append thumbnails to the grid
            mediaItems.forEach((item, index) => {
                const link = document.createElement('a');
                link.href = item.url;
                link.dataset.lgIndex = index; // Custom attribute to know which slide to open

                const img = document.createElement('img');
                img.src = item.thumbnail;
                img.alt = 'Mídia do evento';

                if (item.type === 'video') {
                    link.classList.add('video-thumbnail');
                }

                link.appendChild(img);
                galleryElement.appendChild(link);

                // 3. Add a click listener to each thumbnail to open the gallery at the correct index
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Prevent default link behavior
                    lg.openGallery(index);
                });
            });

        })
        .catch(error => {
            console.error('Erro ao carregar a galeria:', error);
            if (messageElement) messageElement.textContent = 'Não foi possível carregar a galeria no momento. Tente novamente mais tarde.';
        });
});