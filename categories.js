document.addEventListener('DOMContentLoaded', () => {
    // --- Sidebar & Global Elements ---
    const categoriesDropdownToggle = document.getElementById('categoriesDropdownToggle');
    const categoriesDropdownMenu = document.getElementById('categoriesDropdownMenu');
    const categoriesDropdownWrapper = categoriesDropdownToggle.closest('.nav-item-wrapper');
    const nimisoLogo = document.querySelector('.logo');
    const manageAdminLink = document.getElementById('manageAdminLink');

    const categoryTitleElement = document.getElementById('categoryTitle');
    const productGridElement = document.getElementById('productGrid');

    // ** MODAL EDIT PRODUCT ELEMENTS **
    const editModal = document.getElementById('editModal');
    const closeEditModalButton = document.getElementById('closeEditModalButton');
    const decrementButton = document.getElementById('decrementStock');
    const incrementButton = document.getElementById('incrementStock');
    const stockChangeValueSpan = document.getElementById('stockChangeValue');
    const updateStockButton = document.getElementById('updateStockButton');
    const editProductNameDisplay = document.getElementById('editProductName');
    const editProductCurrentStockDisplay = document.getElementById('editProductCurrentStock');
    let currentProductData = null;
    let stockChange = 0;

    // ** MODAL DELETE PRODUCT ELEMENTS **
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const confirmDeleteYesButton = document.getElementById('confirmDeleteYes');
    const confirmDeleteNoButton = document.getElementById('confirmDeleteNo');
    let productToDeleteElement = null;

    // ** MODAL ADD NEW CATEGORY ELEMENTS **
    const addCategoryModal = document.getElementById('addCategoryModal');
    const closeAddCategoryModalButton = document.getElementById('closeAddCategoryModalButton');
    const addCategoryForm = document.getElementById('addCategoryForm');
    const newCategoryNameInput = document.getElementById('newCategoryName');
    const addThisCategoryButton = document.getElementById('addThisCategoryButton');

    // ** MODAL ADD NEW PRODUCT ELEMENTS **
    const addProductModal = document.getElementById('addProductModal');
    const closeAddProductModalButton = document.getElementById('closeAddProductModalButton');
    const addProductForm = document.getElementById('addProductForm');
    const productNameInput = document.getElementById('productName');
    const productStockInput = document.getElementById('productStock');
    const productImageUrlInput = document.getElementById('productImageUrl');
    const addThisProductButton = document.getElementById('addThisProductButton');
    let currentCategoryForProductAdd = '';

    // ** NOTIFICATION TOAST ELEMENTS **
    const notificationToast = document.getElementById('notificationToast');
    const notificationMessage = document.getElementById('notificationMessage');
    let notificationTimeout;

    // --- Data Kategori Bawaan (Sumber utama) ---
    const defaultCategories = [
        { id: 'cat-acc', name: 'Accessories' },
        { id: 'cat-elec', name: 'Electronics' },
        { id: 'cat-toys', name: 'Toys' },
        { id: 'cat-stat', name: 'Stationery' }
    ];

    // --- Data Produk Bawaan ---
    const initialAllProducts = {
        'accessories': [
            { id: 'acc1', name: "Headband Contoh", stock: 25, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Acc+1" },
            { id: 'acc2', name: "Kalung Contoh", stock: 15, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Acc+2" },
            { id: 'acc3', name: "Gelang Contoh", stock: 30, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Acc+3" },
            { id: 'acc4', name: "Anting Contoh", stock: 20, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Acc+4" },
            { id: 'acc5', name: "Cincin Contoh", stock: 10, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Acc+5" },
            { id: 'acc6', name: "Topi Contoh", stock: 18, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Acc+6" },
            { id: 'acc7', name: "Syal Contoh", stock: 12, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Acc+7" },
            { id: 'acc8', name: "Kacamata Contoh", stock: 22, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Acc+8" }
        ],
        'electronics': [
            { id: 'elec1', name: "Earbuds Contoh", stock: 50, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Elec+1" },
            { id: 'elec2', name: "Power Bank Contoh", stock: 35, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Elec+2" },
            { id: 'elec3', name: "Kipas Portabel", stock: 40, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Elec+3" },
            { id: 'elec4', name: "Lampu LED Contoh", stock: 60, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Elec+4" },
            { id: 'elec5', name: "Mouse Wireless", stock: 28, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Elec+5" },
            { id: 'elec6', name: "Speaker Bluetooth", stock: 17, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Elec+6" },
            { id: 'elec7', name: "Kabel Charger", stock: 75, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Elec+7" },
            { id: 'elec8', name: "Smartwatch Contoh", stock: 20, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Elec+8" }
        ],
        'toys': [
            { id: 'toy1', name: "Robot Mini", stock: 45, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Toy+1" },
            { id: 'toy2', name: "Boneka Lucu", stock: 30, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Toy+2" },
            { id: 'toy3', name: "Puzzle Contoh", stock: 25, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Toy+3" },
            { id: 'toy4', name: "Mainan Edukasi", stock: 22, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Toy+4" },
            { id: 'toy5', name: "Model Kit", stock: 15, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Toy+5" },
            { id: 'toy6', name: "Balon Udara", stock: 50, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Toy+6" },
            { id: 'toy7', name: "Lego Set", stock: 10, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Toy+7" },
            { id: 'toy8', name: "Mobil Remote", stock: 18, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=Toy+8" }
        ],
        'stationery': [
            { id: 'st1', name: "Pulpen Gel", stock: 100, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=St+1" },
            { id: 'st2', name: "Buku Catatan", stock: 80, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=St+2" },
            { id: 'st3', name: "Spidol Warna", stock: 60, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=St+3" },
            { id: 'st4', name: "Pensil Mekanik", stock: 90, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=St+4" },
            { id: 'st5', name: "Penghapus Unik", stock: 70, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=St+5" },
            { id: 'st6', name: "Sticker Set", stock: 55, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=St+6" },
            { id: 'st7', name: "Kertas Binder", stock: 120, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=St+7" },
            { id: 'st8', name: "Binder Klip", stock: 95, imageUrl: "https://via.placeholder.com/150/CDE9F9/A28C7A?text=St+8" }
        ]
    };

    // --- Inisialisasi categoriesData dari default dan localStorage ---
    let categoriesData = [...defaultCategories];

    const storedDynamicCategories = JSON.parse(localStorage.getItem('dynamicCategories') || '[]');
    storedDynamicCategories.forEach(newCat => {
        if (!categoriesData.some(existingCat => existingCat.id === newCat.id || existingCat.name.toLowerCase() === newCat.name.toLowerCase())) {
            categoriesData.push(newCat);
        }
    });

    // --- Data Produk: Muat dari localStorage atau gunakan default ---
    // Pastikan struktur localStorage untuk produk adalah:
    // { "categoryNameNormalized": [product1, product2], "anotherCategory": [productA, productB] }
    let allProducts = JSON.parse(localStorage.getItem('allProductsData')) || initialAllProducts;

    // PENTING: Inisialisasi kategori baru dari localStorage ke allProducts
    // Ini harus dilakukan setelah defaultCategories dan allProducts didefinisikan
    storedDynamicCategories.forEach(newCat => {
        const normalizedName = newCat.name.toLowerCase().replace(/\s/g, '');
        if (!allProducts[normalizedName]) {
            allProducts[normalizedName] = []; // Tambahkan kategori baru ke allProducts jika belum ada
        }
    });

    // --- Function to save allProducts data to localStorage ---
    function saveAllProductsToLocalStorage() {
        localStorage.setItem('allProductsData', JSON.stringify(allProducts));
    }

    // --- Function to save dynamicCategories data to localStorage ---
    function saveDynamicCategoriesToLocalStorage() {
        // Simpan hanya kategori yang "dibuat" oleh user, bukan yang bawaan
        const categoriesToStore = categoriesData.filter(cat => 
            !defaultCategories.some(defCat => defCat.id === cat.id)
        );
        localStorage.setItem('dynamicCategories', JSON.stringify(categoriesToStore));
    }


    // --- Global Utility Functions ---
    function showNotification(message, duration = 2000) {
        clearTimeout(notificationTimeout);
        notificationMessage.textContent = message;
        notificationToast.classList.add('show');

        notificationTimeout = setTimeout(() => {
            notificationToast.classList.remove('show');
        }, duration);
    }

    // Fungsi untuk menutup semua modal
    function closeAllModals() {
        editModal.classList.remove('show-modal');
        deleteConfirmModal.classList.remove('show-modal');
        addCategoryModal.classList.remove('show-modal');
        addProductModal.classList.remove('show-modal');
    }

    // --- Sidebar Dropdown & Navigasi ---
    function renderSidebarCategories() {
        const dropdownMenu = document.getElementById('categoriesDropdownMenu');
        const addNewCategoryListItem = dropdownMenu.querySelector('.add-new-category').closest('li');
        dropdownMenu.innerHTML = '';
        
        categoriesData.forEach(cat => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = "#";
            a.dataset.category = cat.name.toLowerCase().replace(/\s/g, '');
            a.textContent = cat.name;
            li.appendChild(a);
            dropdownMenu.appendChild(li);
        });

        dropdownMenu.appendChild(addNewCategoryListItem); // Selalu tambahkan di paling bawah

        dropdownMenu.querySelectorAll('li a:not(.add-new-category)').forEach(item => {
            item.removeEventListener('click', handleCategoryNavLinkClick);
            item.addEventListener('click', handleCategoryNavLinkClick);
        });
        
        const addNewCategoryLink = dropdownMenu.querySelector('.add-new-category');
        if (addNewCategoryLink) {
            addNewCategoryLink.removeEventListener('click', handleAddNewCategoryLinkClick);
            addNewCategoryLink.addEventListener('click', handleAddNewCategoryLinkClick);
        }
    }

    function handleCategoryNavLinkClick(event) {
        event.preventDefault();
        const categoryName = event.target.dataset.category;
        loadProductsByCategory(categoryName);
        history.pushState({ category: categoryName }, '', `categories.html?category=${categoryName}`);
    }

    function handleAddNewCategoryLinkClick(event) {
        event.preventDefault();
        openAddCategoryModal();
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

    nimisoLogo.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    manageAdminLink.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.href = 'adminmanage.html';
    });


    // --- Produk Logic (Fix Edit & Delete Buttons) ---
    function loadProductsByCategory(categoryName) {
        productGridElement.innerHTML = '';
        const formattedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        categoryTitleElement.textContent = `${formattedCategoryName}`;
        currentCategoryForProductAdd = categoryName.toLowerCase().replace(/\s/g, ''); // Simpan kategori aktif

        let productsToDisplay = allProducts[categoryName.toLowerCase().replace(/\s/g, '')] || [];

        // Render produk yang ada
        productsToDisplay.forEach(product => {
            const productBox = document.createElement('div');
            productBox.classList.add('product-box');
            productBox.dataset.productId = product.id;
            productBox.dataset.productCategory = categoryName.toLowerCase().replace(/\s/g, '');

            productBox.innerHTML = `
                <i class="fas fa-trash-alt delete-product-icon" data-product-id="${product.id}"></i>
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}">
                </div>
                <div class="product-label">${product.name}</div>
                <div class="product-info-row">
                    <span class="product-stock">Stock: <span id="stock-${product.id}">${product.stock}</span></span>
                    <button class="edit-button" data-product-id="${product.id}">
                        Edit <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;
            productGridElement.appendChild(productBox);
        });

        // Tambahkan tombol "Add New Product" di akhir grid
        const addProductButtonBox = document.createElement('div');
        addProductButtonBox.classList.add('add-product-button-box');
        addProductButtonBox.innerHTML = `
            <i class="fas fa-plus-circle"></i>
            <span>Add New Product</span>
        `;
        addProductButtonBox.removeEventListener('click', openAddProductModal); // Hapus listener lama
        addProductButtonBox.addEventListener('click', openAddProductModal); // Event listener untuk membuka modal produk baru
        productGridElement.appendChild(addProductButtonBox);


        attachProductEventListeners(); // Pasang event listener setelah produk dirender
    }

    function attachProductEventListeners() {
        document.querySelectorAll('.edit-button').forEach(button => {
            button.removeEventListener('click', handleEditButtonClick);
            button.addEventListener('click', handleEditButtonClick);
        });

        document.querySelectorAll('.delete-product-icon').forEach(icon => {
            icon.removeEventListener('click', handleDeleteIconClick);
            icon.addEventListener('click', handleDeleteIconClick);
        });
    }

    function handleEditButtonClick(event) {
        const productId = event.currentTarget.dataset.productId;
        const productCategory = event.currentTarget.closest('.product-box').dataset.productCategory;
        openEditModal(productId, productCategory);
    }

    function handleDeleteIconClick(event) {
        event.stopPropagation();
        const productId = event.currentTarget.dataset.productId;
        productToDeleteElement = event.currentTarget.closest('.product-box');
        openDeleteConfirmModal(productId);
    }


    // ** MODAL EDIT LOGIC **
    function openEditModal(productId, productCategory) {
        closeAllModals();
        const product = allProducts[productCategory].find(p => p.id === productId);
        if (product) {
            currentProductData = { ...product, category: productCategory };
            stockChange = 0;
            stockChangeValueSpan.textContent = stockChange;
            editProductNameDisplay.textContent = product.name;
            editProductCurrentStockDisplay.textContent = `Current Stock: ${product.stock}`;
            updateDecrementButtonState();
            editModal.classList.add('show-modal');
        }
    }

    closeEditModalButton.addEventListener('click', () => {
        editModal.classList.remove('show-modal');
    });

    editModal.addEventListener('click', (event) => {
        if (event.target === editModal) {
            editModal.classList.remove('show-modal');
        }
    });

    decrementButton.addEventListener('click', () => {
        if (currentProductData.stock + (stockChange - 1) >= 0) {
             stockChange--;
        }
        stockChangeValueSpan.textContent = stockChange;
        updateDecrementButtonState();
    });

    incrementButton.addEventListener('click', () => {
        stockChange++;
        stockChangeValueSpan.textContent = stockChange;
        updateDecrementButtonState();
    });

    function updateDecrementButtonState() {
        if (stockChange === 0 && currentProductData.stock === 0) {
            decrementButton.disabled = true;
        } else if (currentProductData.stock + stockChange <= 0) {
            decrementButton.disabled = true;
        }
        else {
            decrementButton.disabled = false;
        }
    }

    updateStockButton.addEventListener('click', () => {
        if (currentProductData) {
            const currentStockElement = document.getElementById(`stock-${currentProductData.id}`);
            const newStock = currentProductData.stock + stockChange;

            if (newStock < 0) {
                showNotification("Error: Stock tidak bisa kurang dari 0.", 3000);
                return;
            }

            const productInArray = allProducts[currentProductData.category].find(p => p.id === currentProductData.id);
            if (productInArray) {
                productInArray.stock = newStock;
            }

            if (currentStockElement) {
                currentStockElement.textContent = newStock;
            }
            editModal.classList.remove('show-modal');
            saveAllProductsToLocalStorage(); // Simpan perubahan stock
            showNotification(`Stock ${currentProductData.name} berhasil diperbarui menjadi ${newStock}.`);
        }
    });


    // ** DELETE PRODUCT MODAL LOGIC **
    function openDeleteConfirmModal(productId) {
        closeAllModals();
        deleteConfirmModal.dataset.productIdToDelete = productId;
        deleteConfirmModal.classList.add('show-modal');
    }

    confirmDeleteYesButton.addEventListener('click', () => {
        const productId = deleteConfirmModal.dataset.productIdToDelete;
        if (productId && productToDeleteElement) {
            const productCategory = productToDeleteElement.dataset.productCategory;
            if (allProducts[productCategory]) {
                allProducts[productCategory] = allProducts[productCategory].filter(p => p.id !== productId);
            }
            
            productToDeleteElement.remove(); // Hapus dari DOM
            saveAllProductsToLocalStorage(); // Simpan perubahan penghapusan produk
            
            if (allProducts[productCategory].length === 0) {
                productGridElement.innerHTML = `<p>Tidak ada produk untuk kategori "${productCategory.charAt(0).toUpperCase() + productCategory.slice(1)}" saat ini.</p>`;
            }


            deleteConfirmModal.classList.remove('show-modal');
            showNotification('Produk berhasil dihapus!');
            productToDeleteElement = null;
        }
    });

    confirmDeleteNoButton.addEventListener('click', () => {
        deleteConfirmModal.classList.remove('show-modal');
        productToDeleteElement = null;
    });

    deleteConfirmModal.addEventListener('click', (event) => {
        if (event.target === deleteConfirmModal) {
            deleteConfirmModal.classList.remove('show-modal');
            productToDeleteElement = null;
        }
    });


    // ** ADD NEW CATEGORY MODAL LOGIC **
    function openAddCategoryModal() {
        closeAllModals();
        addCategoryForm.reset();
        addCategoryModal.classList.add('show-modal');
    }

    closeAddCategoryModalButton.addEventListener('click', () => {
        addCategoryModal.classList.remove('show-modal');
    });

    addCategoryModal.addEventListener('click', (event) => {
        if (event.target === addCategoryModal) {
            addCategoryModal.classList.remove('show-modal');
        }
    });

    addCategoryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newCategoryName = newCategoryNameInput.value.trim();
        const normalizedCategoryName = newCategoryName.toLowerCase().replace(/\s/g, '');

        if (newCategoryName) {
            if (categoriesData.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase())) {
                showNotification(`Kategori "${newCategoryName}" sudah ada!`, 3000);
                return;
            }

            const newCategoryId = 'cat-' + normalizedCategoryName + '-' + Date.now();
            
            const newCategory = {
                id: newCategoryId,
                name: newCategoryName
            };
            categoriesData.push(newCategory);

            // Inisialisasi kategori baru di allProducts dengan array kosong
            allProducts[normalizedCategoryName] = []; 
            saveAllProductsToLocalStorage(); // Simpan struktur allProducts yang diperbarui

            saveDynamicCategoriesToLocalStorage(); // Simpan data kategori yang diperbarui

            renderSidebarCategories(); // Perbarui sidebar dropdown
            addCategoryModal.classList.remove('show-modal');
            addCategoryForm.reset();
            showNotification(`Kategori "${newCategoryName}" berhasil ditambahkan!`);

            loadProductsByCategory(normalizedCategoryName);
            history.pushState({ category: normalizedCategoryName }, '', `categories.html?category=${normalizedCategoryName}`);

        } else {
            showNotification("Nama kategori tidak boleh kosong!", 2000);
        }
    });


    // ** ADD NEW PRODUCT MODAL LOGIC **
    function openAddProductModal() {
        closeAllModals(); // Pastikan semua modal lain tertutup
        addProductForm.reset(); // Bersihkan form
        productStockInput.value = 0; // Set default stock ke 0
        // currentCategoryForProductAdd sudah di-set di loadProductsByCategory
        addProductModal.classList.add('show-modal');
    }

    closeAddProductModalButton.addEventListener('click', () => {
        addProductModal.classList.remove('show-modal');
    });

    addProductModal.addEventListener('click', (event) => {
        if (event.target === addProductModal) {
            addProductModal.classList.remove('show-modal');
        }
    });

    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const productName = productNameInput.value.trim();
        const productStock = parseInt(productStockInput.value);
        // Default image jika URL kosong, menggunakan inisial produk
        const defaultImageUrl = `https://via.placeholder.com/150/CDE9F9/A28C7A?text=${productName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2)}`;
        const productImageUrl = productImageUrlInput.value.trim() || defaultImageUrl;


        if (productName && !isNaN(productStock) && productStock >= 0) {
            const newProductId = `prod-${currentCategoryForProductAdd}-${Date.now()}`;
            
            const newProduct = {
                id: newProductId,
                name: productName,
                stock: productStock,
                imageUrl: productImageUrl
            };

            // Tambahkan produk ke kategori yang sedang aktif di allProducts
            if (!allProducts[currentCategoryForProductAdd]) {
                allProducts[currentCategoryForProductAdd] = []; // Pastikan array ada
            }
            allProducts[currentCategoryForProductAdd].push(newProduct);

            saveAllProductsToLocalStorage(); // Simpan produk baru ke localStorage

            // Perbarui tampilan grid produk untuk kategori saat ini
            loadProductsByCategory(currentCategoryForProductAdd); 

            addProductModal.classList.remove('show-modal');
            addProductForm.reset();
            showNotification(`Produk "${productName}" berhasil ditambahkan ke ${currentCategoryForProductAdd.charAt(0).toUpperCase() + currentCategoryForProductAdd.slice(1)}!`);

        } else {
            showNotification("Nama produk dan stock tidak boleh kosong atau tidak valid!", 3000);
        }
    });


    // --- Initial Load & Popstate ---
    const urlParams = new URLSearchParams(window.location.search);
    const categoryFromUrl = urlParams.get('category');
    const actionFromUrl = urlParams.get('action');

    renderSidebarCategories(); // Panggil renderSidebarCategories saat DOMContentLoaded

    if (categoryFromUrl) {
        loadProductsByCategory(categoryFromUrl);
    } else {
        if (categoriesData.length > 0) {
            const firstCategoryNormalizedName = categoriesData[0].name.toLowerCase().replace(/\s/g, '');
            loadProductsByCategory(firstCategoryNormalizedName);
            history.replaceState({ category: firstCategoryNormalizedName }, '', `categories.html?category=${firstCategoryNormalizedName}`);
        } else {
            categoryTitleElement.textContent = "Pilih Kategori";
            productGridElement.innerHTML = "<p>Silakan pilih kategori dari sidebar untuk melihat produk.</p>";
        }
    }

    if (actionFromUrl === 'add-new-category') {
        openAddCategoryModal();
        history.replaceState({}, document.title, window.location.pathname + window.location.search.replace(/([&?])action=add-new-category/, '$1').replace(/\?$/, ''));
    }

    window.addEventListener('popstate', (event) => {
        const currentUrlParams = new URLSearchParams(window.location.search);
        const currentCategory = currentUrlParams.get('category');
        if (currentCategory) {
            loadProductsByCategory(currentCategory);
        } else {
            categoryTitleElement.textContent = "Pilih Kategori";
            productGridElement.innerHTML = "<p>Silakan pilih kategori dari sidebar untuk melihat produk.</p>";
        }
    });
});