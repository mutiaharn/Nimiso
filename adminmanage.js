document.addEventListener('DOMContentLoaded', () => {
    // --- SIMULASI ROLE PENGGUNA SAAT INI ---
    const currentUserRole = 'supervisor';

    // --- Sidebar & Global Elements ---
    const categoriesDropdownToggle = document.getElementById('categoriesDropdownToggle');
    const categoriesDropdownMenu = document.getElementById('categoriesDropdownMenu');
    const categoriesDropdownWrapper = categoriesDropdownToggle.closest('.nav-item-wrapper');
    const nimisoLogo = document.querySelector('.logo');
    const manageAdminLink = document.getElementById('manageAdminLink');

    // ** Modals & Notifications (untuk AdminManage) **
    const adminGrid = document.getElementById('adminGrid');
    const addNewAdminButton = document.getElementById('addNewAdminButton');
    const addAdminModal = document.getElementById('addAdminModal');
    const closeAddAdminModalButton = document.getElementById('closeAddAdminModalButton');
    const addAdminForm = document.getElementById('addAdminForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const fullNameInput = document.getElementById('fullName');
    const phoneNumberInput = document.getElementById('phoneNumber');
    const adminRoleSelect = document.getElementById('adminRole');
    const deleteAdminConfirmModal = document.getElementById('deleteAdminConfirmModal');
    const adminToDeleteNameSpan = document.getElementById('adminToDeleteName');
    const confirmAdminDeleteYesButton = document.getElementById('confirmAdminDeleteYes');
    const confirmAdminDeleteNoButton = document.getElementById('confirmAdminDeleteNo');
    let adminToDeleteId = null;
    let adminToDeleteElement = null;
    const notificationToast = document.getElementById('notificationToast');
    const notificationMessage = document.getElementById('notificationMessage');
    let notificationTimeout;


    // --- Data Kategori Bawaan (Sumber utama, sama seperti di index.js/categories.js) ---
    const defaultCategories = [
        { id: 'cat-acc', name: 'Accessories' },
        { id: 'cat-elec', name: 'Electronics' },
        { id: 'cat-toys', name: 'Toys' },
        { id: 'cat-stat', name: 'Stationery' }
    ];

    // --- Inisialisasi categoriesData dari default dan localStorage ---
    let categoriesData = [...defaultCategories];

    const storedDynamicCategories = JSON.parse(localStorage.getItem('dynamicCategories') || '[]');
    storedDynamicCategories.forEach(newCat => {
        if (!categoriesData.some(existingCat => existingCat.id === newCat.id || existingCat.name.toLowerCase() === newCat.name.toLowerCase())) {
            categoriesData.push(newCat);
        }
    });

    // --- Global Utility Functions (untuk notifikasi, dll.) ---
    function showNotification(message, duration = 2000) {
        clearTimeout(notificationTimeout);
        notificationMessage.textContent = message;
        notificationToast.classList.add('show');

        notificationTimeout = setTimeout(() => {
            notificationToast.classList.remove('show');
        }, duration);
    }

    // --- Sidebar Dropdown Logic ---
    function renderSidebarCategoriesAdmin() {
        const dropdownMenu = document.getElementById('categoriesDropdownMenu');
        const addNewCategoryListItem = dropdownMenu.querySelector('.add-new-category')?.closest('li');
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

        if (addNewCategoryListItem) {
            dropdownMenu.appendChild(addNewCategoryListItem);
        } else {
            const newLi = document.createElement('li');
            const newA = document.createElement('a');
            newA.href = "#";
            newA.classList.add('add-new-category');
            newA.dataset.category = "add-new";
            newA.textContent = "+ Add New Categories";
            newLi.appendChild(newA);
            dropdownMenu.appendChild(newLi);
        }

        dropdownMenu.querySelectorAll('li a:not(.add-new-category)').forEach(item => {
            item.removeEventListener('click', handleCategoryNavLinkClickAdmin);
            item.addEventListener('click', handleCategoryNavLinkClickAdmin);
        });

        const addNewCategoryLink = dropdownMenu.querySelector('.add-new-category');
        if (addNewCategoryLink) {
            addNewCategoryLink.removeEventListener('click', handleAddNewCategoryLinkClickAdmin);
            addNewCategoryLink.addEventListener('click', handleAddNewCategoryLinkClickAdmin);
        }
    }

    function handleCategoryNavLinkClickAdmin(event) {
        event.preventDefault();
        const categoryName = event.target.dataset.category;
        window.location.href = `categories.html?category=${categoryName}`;
    }

    function handleAddNewCategoryLinkClickAdmin(event) {
        event.preventDefault();
        window.location.href = `categories.html?action=add-new-category`;
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


    // --- Data Admin: Muat dari localStorage atau gunakan default ---
    const defaultAdmins = [
        { id: 'admin1', username: 'john.doe', fullName: 'John Doe', role: 'supervisor', wa: '+6281234567890', createdDate: '2023-01-15', profilePic: 'https://via.placeholder.com/80/CDE9F9/A28C7A?text=JD' },
        { id: 'admin2', username: 'jane.smith', fullName: 'Jane Smith', role: 'admin', wa: '+6287654321098', createdDate: '2023-03-20', profilePic: 'https://via.placeholder.com/80/CDE9F9/A28C7A?text=JS' },
        { id: 'admin3', username: 'peter.jones', fullName: 'Peter Jones', role: 'admin', wa: '+6281122334455', createdDate: '2023-05-10', profilePic: 'https://via.placeholder.com/80/CDE9F9/A28C7A?text=PJ' },
        { id: 'admin4', username: 'sara.williams', fullName: 'Sara Williams', role: 'supervisor', wa: '+6285566778899', createdDate: '2023-07-01', profilePic: 'https://via.placeholder.com/80/CDE9F9/A28C7A?text=SW' },
    ];
    let admins = JSON.parse(localStorage.getItem('adminsData')) || defaultAdmins;

    // Helper function to get initials for profile pic placeholder
    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length === 1) return parts[0][0].toUpperCase();
        if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        return '';
    };

    // --- Function to save admins data to localStorage ---
    function saveAdminsToLocalStorage() {
        localStorage.setItem('adminsData', JSON.stringify(admins));
    }


    // --- Render Admin Grid ---
    function renderAdminGrid() {
        adminGrid.innerHTML = '';
        admins.forEach(admin => {
            const adminBox = document.createElement('div');
            adminBox.classList.add('admin-box');
            adminBox.dataset.adminId = admin.id;

            adminBox.innerHTML = `
                <div class="admin-profile-pic">
                    ${admin.profilePic ? `<img src="${admin.profilePic}" alt="${admin.fullName}">` : `<span>${getInitials(admin.fullName)}</span>`}
                </div>
                <div class="admin-details">
                    <p><span class="detail-label">Name:</span> <span class="detail-value admin-name">${admin.fullName}</span></p>
                    <p><span class="detail-label">Role:</span> <span class="detail-value admin-role">${admin.role.charAt(0).toUpperCase() + admin.role.slice(1)}</span></p>
                    <p><span class="detail-label">WA:</span> <span class="detail-value admin-wa">${admin.wa}</span></p>
                </div>
                <p class="admin-account-created">Account created: ${admin.createdDate}</p>
                <button class="delete-admin-button" data-admin-id="${admin.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            adminGrid.appendChild(adminBox);
        });

        if (currentUserRole === 'admin') {
            document.querySelectorAll('.delete-admin-button').forEach(button => {
                button.style.display = 'none';
            });
        }

        document.querySelectorAll('.delete-admin-button').forEach(button => {
            button.removeEventListener('click', handleDeleteAdminButtonClick);
            button.addEventListener('click', handleDeleteAdminButtonClick);
        });
    }

    // --- Event handler for delete admin button ---
    function handleDeleteAdminButtonClick(event) {
        event.stopPropagation();
        const adminId = event.currentTarget.dataset.adminId;
        const adminName = event.currentTarget.closest('.admin-box').querySelector('.admin-name').textContent;
        
        closeAddAdminModal(); // Close add admin modal if open
        adminToDeleteId = adminId;
        adminToDeleteElement = event.currentTarget.closest('.admin-box');
        adminToDeleteNameSpan.textContent = adminName;
        openDeleteAdminConfirmModal();
    }


    // --- Role-based UI Visibility ---
    function applyRolePermissions() {
        if (currentUserRole === 'admin') {
            addNewAdminButton.style.display = 'none';
        } else {
            addNewAdminButton.style.display = 'flex';
        }
        renderAdminGrid();
    }

    // --- Add New Admin Modal Logic ---
    function openAddAdminModal() {
        closeDeleteAdminConfirmModal();
        addAdminForm.reset();
        addAdminModal.classList.add('show-modal');
    }

    function closeAddAdminModal() {
        addAdminModal.classList.remove('show-modal');
    }

    addNewAdminButton.addEventListener('click', openAddAdminModal);
    closeAddAdminModalButton.addEventListener('click', closeAddAdminModal);

    addAdminModal.addEventListener('click', (event) => {
        if (event.target === addAdminModal) {
            closeAddAdminModal();
        }
    });

    addAdminForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const fullName = fullNameInput.value.trim();
        const phoneNumber = phoneNumberInput.value.trim();
        const role = adminRoleSelect.value;

        if (password !== confirmPassword) {
            showNotification('Password dan konfirmasi password tidak cocok!', 3000);
            return;
        }
        if (admins.some(admin => admin.username === username)) {
            showNotification('Username sudah ada, gunakan username lain!', 3000);
            return;
        }

        const newAdminId = 'admin_' + Date.now() + Math.random().toString(36).substring(2, 6);
        const today = new Date();
        const createdDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;

        const newAdmin = {
            id: newAdminId,
            username,
            fullName,
            role,
            wa: phoneNumber,
            createdDate: createdDate,
            profilePic: `https://via.placeholder.com/80/CDE9F9/A28C7A?text=${getInitials(fullName)}`
        };

        admins.push(newAdmin);
        saveAdminsToLocalStorage(); // Simpan perubahan ke localStorage
        renderAdminGrid();
        closeAddAdminModal();
        showNotification(`Admin '${fullName}' berhasil ditambahkan!`);
        addAdminForm.reset();
    });

    // --- Delete Admin Confirmation Logic ---
    function openDeleteAdminConfirmModal() {
        closeAddAdminModal();
        deleteAdminConfirmModal.classList.add('show-modal');
    }

    function closeDeleteAdminConfirmModal() {
        deleteAdminConfirmModal.classList.remove('show-modal');
        adminToDeleteId = null;
        adminToDeleteElement = null;
    }

    confirmAdminDeleteYesButton.addEventListener('click', () => {
        if (adminToDeleteId && adminToDeleteElement) {
            admins = admins.filter(admin => admin.id !== adminToDeleteId);
            saveAdminsToLocalStorage(); // Simpan perubahan ke localStorage
            adminToDeleteElement.remove();

            closeDeleteAdminConfirmModal();
            showNotification(`Admin berhasil dihapus!`);
        }
    });

    confirmAdminDeleteNoButton.addEventListener('click', closeDeleteAdminConfirmModal);

    deleteAdminConfirmModal.addEventListener('click', (event) => {
        if (event.target === deleteAdminConfirmModal) {
            closeDeleteAdminConfirmModal();
        }
    });

    // --- Initial render when page loads ---
    applyRolePermissions();
    renderSidebarCategoriesAdmin(); // Panggil ini untuk mengisi dropdown Categories
});