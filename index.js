document.addEventListener('DOMContentLoaded', () => {
    // --- Data Kategori Bawaan (Sumber utama) ---
    const defaultCategories = [
        { id: 'cat-acc', name: 'Accessories' },
        { id: 'cat-elec', name: 'Electronics' },
        { id: 'cat-toys', name: 'Toys' },
        { id: 'cat-stat', name: 'Stationery' }
    ];

    // --- Inisialisasi categoriesData dari default dan localStorage ---
    let categoriesData = [...defaultCategories]; // Mulai dengan kategori bawaan

    const storedDynamicCategories = JSON.parse(localStorage.getItem('dynamicCategories') || '[]');
    storedDynamicCategories.forEach(newCat => {
        // Hanya tambahkan jika belum ada (cek berdasarkan nama/id)
        if (!categoriesData.some(existingCat => existingCat.id === newCat.id || existingCat.name.toLowerCase() === newCat.name.toLowerCase())) {
            categoriesData.push(newCat);
        }
    });

    // --- Sidebar Dropdown Logic ---
    const categoriesDropdownToggle = document.getElementById('categoriesDropdownToggle');
    const categoriesDropdownMenu = document.getElementById('categoriesDropdownMenu');
    const categoriesDropdownWrapper = categoriesDropdownToggle.closest('.nav-item-wrapper');

    function renderSidebarCategoriesIndex() {
        const dropdownMenu = document.getElementById('categoriesDropdownMenu');
        // Simpan referensi ke list item '+ Add New Categories'
        const addNewCategoryListItem = dropdownMenu.querySelector('.add-new-category').closest('li');
        dropdownMenu.innerHTML = '';
        
        categoriesData.forEach(cat => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#"; // Atau sesuaikan dengan routing Anda
            a.dataset.category = cat.name.toLowerCase().replace(/\s/g, '');
            a.textContent = cat.name;
            li.appendChild(a);
            dropdownMenu.appendChild(li);
        });

        // Selalu tambahkan '+ Add New Categories' di paling bawah
        const existingAddNewCategoryLink = dropdownMenu.querySelector('.add-new-category');
        if (!existingAddNewCategoryLink) {
            dropdownMenu.appendChild(addNewCategoryListItem);
        } else {
            dropdownMenu.appendChild(existingAddNewCategoryLink.closest('li'));
        }

        dropdownMenu.querySelectorAll('li a:not(.add-new-category)').forEach(item => {
            item.removeEventListener('click', handleCategoryNavLinkClickIndex); // Hapus listener lama
            item.addEventListener('click', handleCategoryNavLinkClickIndex);
        });

        const addNewCategoryLink = dropdownMenu.querySelector('.add-new-category');
        if (addNewCategoryLink) {
            addNewCategoryLink.removeEventListener('click', handleAddNewCategoryLinkClickIndex); // Hapus listener lama
            addNewCategoryLink.addEventListener('click', handleAddNewCategoryLinkClickIndex);
        }
    }

    function handleCategoryNavLinkClickIndex(event) {
        event.preventDefault();
        const categoryName = event.target.dataset.category;
        window.location.href = `categories.html?category=${categoryName}`;
    }

    function handleAddNewCategoryLinkClickIndex(event) {
        event.preventDefault();
        alert('Silakan tambahkan kategori baru dari halaman Categories.');
    }


    if (categoriesDropdownToggle && categoriesDropdownMenu && categoriesDropdownWrapper) {
        categoriesDropdownToggle.addEventListener('click', () => {
            categoriesDropdownMenu.classList.toggle('show');
            categoriesDropdownToggle.classList.toggle('active');
            categoriesDropdownWrapper.classList.toggle('active');
        });

        document.addEventListener('click', (event) => {
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar.contains(event.target)) {
                categoriesDropdownMenu.classList.remove('show');
                categoriesDropdownToggle.classList.remove('active');
                categoriesDropdownWrapper.classList.remove('active');
            }
        });
    }

    // --- Navigasi Logo Nimiso ---
    const nimisoLogo = document.querySelector('.logo');
    if (nimisoLogo) {
        nimisoLogo.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // --- Navigasi Manage Admin Link ---
    const manageAdminLink = document.getElementById('manageAdminLink');
    if (manageAdminLink) {
        manageAdminLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.location.href = 'adminmanage.html';
        });
    }

    // --- Render Category Boxes di Dashboard ---
    const categoryBoxesSection = document.querySelector('.category-boxes');
    
    function renderCategoryBoxes() {
        categoryBoxesSection.innerHTML = '';
        categoriesData.forEach(cat => {
            const categoryBox = document.createElement('div');
            categoryBox.classList.add('category-box');
            let iconClass = 'fas fa-question';
            if (cat.name.toLowerCase() === 'accessories') iconClass = 'fas fa-gem';
            else if (cat.name.toLowerCase() === 'electronics') iconClass = 'fas fa-laptop';
            else if (cat.name.toLowerCase() === 'toys') iconClass = 'fas fa-robot';
            else if (cat.name.toLowerCase() === 'stationery') iconClass = 'fas fa-pencil-ruler';
            // Tambahkan ikon untuk kategori baru jika Anda memiliki aturannya
            // else if (cat.name.toLowerCase() === 'namakategoribaru') iconClass = 'fas fa-...')

            categoryBox.innerHTML = `
                <i class="${iconClass} category-icon"></i>
                <div class="category-label">${cat.name}</div>
            `;
            categoryBox.removeEventListener('click', handleCategoryBoxClick); // Hapus listener lama
            categoryBox.addEventListener('click', handleCategoryBoxClick);
            categoryBoxesSection.appendChild(categoryBox);
        });
    }

    function handleCategoryBoxClick(event) {
        const categoryLabel = event.currentTarget.querySelector('.category-label').textContent;
        const categoryParam = categoryLabel.toLowerCase().replace(/\s/g, '');
        if (categoryParam) {
             window.location.href = `categories.html?category=${categoryParam}`;
        }
    }


    // --- Stat Counter Update ---
    const totalItems = 1250;
    const totalProducts = 345;
    const totalCategories = categoriesData.length; // Perbarui berdasarkan data kategori dinamis

    const totalItemsElement = document.getElementById('totalItems');
    const totalProductsElement = document.getElementById('totalProducts');
    const totalCategoriesElement = document.getElementById('totalCategories');

    if (totalItemsElement) totalItemsElement.textContent = totalItems.toLocaleString();
    if (totalProductsElement) totalProductsElement.textContent = totalProducts.toLocaleString();
    if (totalCategoriesElement) totalCategoriesElement.textContent = totalCategories.toLocaleString();

    // --- Initial Renders ---
    renderSidebarCategoriesIndex();
    renderCategoryBoxes();
});