export async function createSlideshow(container, settings, photosUrl, fetchWithMock, activeIntervals) {
    const data = await fetchWithMock(photosUrl);
    let imageList = data?.imageUrls;
    if (!imageList && Array.isArray(data)) {
        imageList = data.map(photo => photo.urls?.regular).filter(Boolean);
    }
    if (!imageList || !imageList.length) return;

    if (settings.order === 'random') imageList.sort(() => Math.random() - 0.5);

    container.innerHTML = '';
    const img1 = document.createElement('img');
    const img2 = document.createElement('img');
    container.appendChild(img1);
    container.appendChild(img2);

    let currentIndex = 0;
    let activeImageIndex = 0;
    const imageElements = [img1, img2];

    const showNextImage = () => {
        const currentImg = imageElements[activeImageIndex];
        const nextImg = imageElements[1 - activeImageIndex];

        nextImg.src = imageList[currentIndex];
        currentImg.style.opacity = '0';
        nextImg.style.opacity = '1';

        activeImageIndex = 1 - activeImageIndex;
        currentIndex = (currentIndex + 1) % imageList.length;
    };

    showNextImage();
    activeIntervals.push(setInterval(showNextImage, settings.rotateSpeed));
}
