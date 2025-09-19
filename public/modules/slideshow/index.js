export async function createSlideshow(container, settings, photosUrl, fetchWithMock, activeIntervals) {
    const data = await fetchWithMock(photosUrl);
    let imageList = data?.imageUrls;
    if (!imageList && Array.isArray(data)) {
        imageList = data.map(photo => photo.urls?.regular).filter(Boolean);
    }
    
    // Add Cloudinary images to the slideshow
    const cloudinaryImages = await getCloudinaryImages(container);
    if (cloudinaryImages.length > 0) {
        imageList = imageList ? [...cloudinaryImages, ...imageList] : cloudinaryImages;
    }
    
    // Fallback to local images if no Cloudinary images
    if (!imageList || !imageList.length) {
        const localImages = getLocalImages(container);
        if (localImages.length > 0) {
            imageList = localImages;
        } else {
            return;
        }
    }

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

async function getCloudinaryImages(container) {
    try {
        // Determine album type based on container
        let albumType = 'personal'; // default
        
        if (container.id === 'company-album-container' || 
            container.classList.contains('company-album') ||
            container.querySelector('[data-album="company"]')) {
            albumType = 'company';
        }
        
        const response = await fetch(`https://prod-dash-proxy.vercel.app/api/albums?albumType=${albumType}`);
        const data = await response.json();
        
        if (data.success && data.images) {
            return data.images.map(img => img.url);
        }
        
        return [];
    } catch (error) {
        console.error('Error fetching Cloudinary images:', error);
        return [];
    }
}

function getLocalImages(container) {
    const localImages = [];
    
    // Check if this is the personal album container
    if (container.id === 'personal-album-container' || 
        container.classList.contains('personal-album') ||
        container.querySelector('[data-album="personal"]')) {
        // Add personal hiking image
        localImages.push('https://github.com/russellochoa/productivity-dashboard/raw/main/public/images/personal/hiking.jpg');
    }
    
    // Check if this is the company album container
    if (container.id === 'company-album-container' || 
        container.classList.contains('company-album') ||
        container.querySelector('[data-album="company"]')) {
        // Add company logo
        localImages.push('https://github.com/russellochoa/productivity-dashboard/raw/main/public/images/company/logo.png');
    }
    
    return localImages;
}
