// Album Management Module
export function createAlbumManager(config, elements) {
    let personalImages = [];
    let companyImages = [];
    let currentPersonalIndex = 0;
    let currentCompanyIndex = 0;
    let personalInterval;
    let companyInterval;

    // Load saved images from localStorage
    function loadSavedImages() {
        const savedPersonal = localStorage.getItem('personalAlbumImages');
        const savedCompany = localStorage.getItem('companyAlbumImages');
        
        if (savedPersonal) {
            personalImages = JSON.parse(savedPersonal);
        }
        if (savedCompany) {
            companyImages = JSON.parse(savedCompany);
        }
    }

    // Save images to localStorage
    function saveImages() {
        localStorage.setItem('personalAlbumImages', JSON.stringify(personalImages));
        localStorage.setItem('companyAlbumImages', JSON.stringify(companyImages));
    }

    // Add image to personal album
    function addPersonalImage(imageUrl) {
        personalImages.push(imageUrl);
        saveImages();
        updatePersonalAlbum();
    }

    // Add image to company album
    function addCompanyImage(imageUrl) {
        companyImages.push(imageUrl);
        saveImages();
        updateCompanyAlbum();
    }

    // Remove image from personal album
    function removePersonalImage(index) {
        personalImages.splice(index, 1);
        saveImages();
        updatePersonalAlbum();
    }

    // Remove image from company album
    function removeCompanyImage(index) {
        companyImages.splice(index, 1);
        saveImages();
        updateCompanyAlbum();
    }

    // Update personal album display
    function updatePersonalAlbum() {
        const container = elements.personalAlbumContainer;
        if (!container) return;

        if (personalImages.length === 0) {
            container.innerHTML = `
                <div class="flex items-center justify-center h-full text-slate-400">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                        <p class="text-sm">Add personal photos</p>
                    </div>
                </div>
            `;
            return;
        }

        // Clear existing images
        container.innerHTML = '';
        
        // Add all images (hidden except current)
        personalImages.forEach((imageUrl, index) => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `Personal photo ${index + 1}`;
            img.className = 'absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000';
            if (index === currentPersonalIndex) {
                img.classList.add('opacity-100');
            }
            container.appendChild(img);
        });
    }

    // Update company album display
    function updateCompanyAlbum() {
        const container = elements.companyAlbumContainer;
        if (!container) return;

        if (companyImages.length === 0) {
            container.innerHTML = `
                <div class="flex items-center justify-center h-full text-slate-400">
                    <div class="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21,15 16,10 5,21"></polyline>
                        </svg>
                        <p class="text-sm">Add company logos</p>
                    </div>
                </div>
            `;
            return;
        }

        // Clear existing images
        container.innerHTML = '';
        
        // Add all images (hidden except current)
        companyImages.forEach((imageUrl, index) => {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = `Company logo ${index + 1}`;
            img.className = 'absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-1000';
            if (index === currentCompanyIndex) {
                img.classList.add('opacity-100');
            }
            container.appendChild(img);
        });
    }

    // Start personal album rotation
    function startPersonalRotation() {
        if (personalImages.length <= 1) return;
        
        clearInterval(personalInterval);
        personalInterval = setInterval(() => {
            currentPersonalIndex = (currentPersonalIndex + 1) % personalImages.length;
            updatePersonalAlbum();
        }, 5000); // Change every 5 seconds
    }

    // Start company album rotation
    function startCompanyRotation() {
        if (companyImages.length <= 1) return;
        
        clearInterval(companyInterval);
        companyInterval = setInterval(() => {
            currentCompanyIndex = (currentCompanyIndex + 1) % companyImages.length;
            updateCompanyAlbum();
        }, 3000); // Change every 3 seconds
    }

    // Stop rotations
    function stopRotations() {
        clearInterval(personalInterval);
        clearInterval(companyInterval);
    }

    // Initialize albums
    function init() {
        loadSavedImages();
        updatePersonalAlbum();
        updateCompanyAlbum();
        startPersonalRotation();
        startCompanyRotation();
    }

    // Destroy and cleanup
    function destroy() {
        stopRotations();
    }

    return {
        init,
        destroy,
        addPersonalImage,
        addCompanyImage,
        removePersonalImage,
        removeCompanyImage,
        getPersonalImages: () => [...personalImages],
        getCompanyImages: () => [...companyImages]
    };
}
