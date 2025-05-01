// Global function to switch tabs
function switchTab(tabId) {
    console.log(`Global switchTab called for: ${tabId}`);
    
    // Check if the tab exists
    const targetTab = document.getElementById(tabId);
    if (!targetTab) {
        console.error(`Tab with ID ${tabId} not found`);
        return;
    }
    
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.admin-tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // Deactivate all tab buttons
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Activate the selected tab
    targetTab.classList.add('active');
    
    // Activate all tab buttons that point to this tab
    const activeButtons = document.querySelectorAll(`.tab-button[data-tab="${tabId}"]`);
    activeButtons.forEach(button => {
        button.classList.add('active');
    });
    
    // If we're in mobile view, scroll to the top of the tab content
    window.scrollTo({
        top: targetTab.offsetTop - 80,
        behavior: 'smooth'
    });
}

// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    const isLoggedIn = localStorage.getItem('voiceguy_logged_in') === 'true';
    
    // If not logged in, redirect to login page
    if (!isLoggedIn) {
        window.location.href = 'login-html.html';
        return;
    }
    
    // Display username
    const username = localStorage.getItem('voiceguy_username') || 'Admin';
    const usernameElement = document.getElementById('admin-username');
    if (usernameElement) {
        usernameElement.textContent = username;
    }
    
    // Initialize all components
    setupTabSwitching();
    setupQuickActions();
    initializeShop();
    setupLiveStatus();
    
    // Setup quick action buttons
    function setupQuickActions() {
        console.log("Setting up quick actions");
        
        // Get all quick action buttons
        const quickActionButtons = document.querySelectorAll('.action-btn.tab-button');
        console.log(`Found ${quickActionButtons.length} quick action buttons`);
        
        // Add click event listeners to all quick action buttons
        quickActionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                console.log(`Quick action button clicked: ${tabId}`);
                switchTab(tabId);
            });
        });
    }
    
    // Shop initialization
    function initializeShop() {
        // Load products and orders from localStorage
        loadProducts();
        loadOrders();
        
        // Set up event listeners for product management
        setupProductManagement();
        
        // Set up event listeners for order management
        setupOrderManagement();
        
        // Set up search and filter functionality
        setupSearchAndFilter();
    }
    
    // Setup live status functionality
    function setupLiveStatus() {
        const setLiveBtn = document.getElementById('set-live');
        const setOfflineBtn = document.getElementById('set-offline');
        const currentStatus = document.getElementById('current-status');
        
        if (!currentStatus) return;
        
        // Check current status
        const storedStatus = localStorage.getItem('manualLiveOverride');
        if (storedStatus) {
            const status = JSON.parse(storedStatus);
            if (status.isLive) {
                currentStatus.textContent = 'LIVE';
                currentStatus.className = 'status-live';
            } else {
                currentStatus.textContent = 'OFFLINE';
                currentStatus.className = 'status-offline';
            }
        } else {
            currentStatus.textContent = 'Niet handmatig ingesteld';
        }
        
        // Set live status
        if (setLiveBtn) {
            setLiveBtn.addEventListener('click', function() {
                localStorage.setItem('manualLiveOverride', JSON.stringify({
                    isLive: true,
                    timestamp: Date.now()
                }));
                currentStatus.textContent = 'LIVE';
                currentStatus.className = 'status-live';
            });
        }
        
        // Set offline status
        if (setOfflineBtn) {
            setOfflineBtn.addEventListener('click', function() {
                localStorage.setItem('manualLiveOverride', JSON.stringify({
                    isLive: false,
                    timestamp: Date.now()
                }));
                currentStatus.textContent = 'OFFLINE';
                currentStatus.className = 'status-offline';
            });
        }
    }
    
    // Load products from localStorage
    function loadProducts() {
        const productsTableBody = document.getElementById('products-table-body');
        if (!productsTableBody) return;
        
        // Clear table
        productsTableBody.innerHTML = '';
        
        // Get products from localStorage
        const products = JSON.parse(localStorage.getItem('voiceguy_products') || '[]');
        
        if (products.length === 0) {
            // Add sample products if none exist
            const sampleProducts = [
                {
                    id: 1,
                    name: 'VoiceGuy T-Shirt',
                    price: 24.99,
                    category: 'kleding',
                    stock: 50,
                    description: 'Een comfortabel T-shirt met het VoiceGuy logo.',
                    image: 'https://via.placeholder.com/400x300/333333/ff33cc?text=VoiceGuy+T-Shirt',
                    status: 'active'
                },
                {
                    id: 2,
                    name: 'VoiceGuy Mok',
                    price: 14.99,
                    category: 'accessoires',
                    stock: 30,
                    description: 'Een keramische mok met het VoiceGuy logo.',
                    image: 'https://via.placeholder.com/400x300/333333/ff33cc?text=VoiceGuy+Mok',
                    status: 'active'
                },
                {
                    id: 3,
                    name: 'Digitale Stemtraining',
                    price: 49.99,
                    category: 'digitaal',
                    stock: -1, // Unlimited stock
                    description: 'Een digitale cursus voor stemtraining.',
                    image: 'https://via.placeholder.com/400x300/333333/ff33cc?text=Digitale+Stemtraining',
                    status: 'active'
                }
            ];
            
            // Save sample products to localStorage
            localStorage.setItem('voiceguy_products', JSON.stringify(sampleProducts));
            
            // Use sample products
            products.push(...sampleProducts);
        }
        
        // Get filter values
        const searchTerm = document.getElementById('product-search')?.value.toLowerCase() || '';
        const categoryFilter = document.getElementById('category-filter')?.value || 'all';
        
        // Filter products
        const filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) || 
                                 product.description.toLowerCase().includes(searchTerm);
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            
            return matchesSearch && matchesCategory;
        });
        
        // Add products to table
        filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>€${product.price.toFixed(2)}</td>
                <td>${getCategoryName(product.category)}</td>
                <td>${product.stock === -1 ? 'Onbeperkt' : product.stock}</td>
                <td><span class="badge ${product.status === 'active' ? 'admin' : 'moderator'}">${product.status === 'active' ? 'Actief' : 'Inactief'}</span></td>
                <td class="actions">
                    <button class="action-link edit-product" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-link delete delete-product" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            productsTableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        document.querySelectorAll('.edit-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                editProduct(productId);
            });
        });
        
        document.querySelectorAll('.delete-product').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                deleteProduct(productId);
            });
        });
    }
    
    // Load orders from localStorage
    function loadOrders() {
        const ordersTableBody = document.getElementById('orders-table-body');
        if (!ordersTableBody) return;
        
        // Clear table
        ordersTableBody.innerHTML = '';
        
        // Get orders from localStorage
        const orders = JSON.parse(localStorage.getItem('voiceguy_orders') || '[]');
        
        if (orders.length === 0) {
            // Add sample orders if none exist
            const sampleOrders = [
                {
                    id: 1,
                    customer: 'Jan Jansen',
                    date: '2023-06-15',
                    items: [
                        { productId: 1, quantity: 2, price: 24.99 },
                        { productId: 2, quantity: 1, price: 14.99 }
                    ],
                    total: 64.97,
                    status: 'completed'
                },
                {
                    id: 2,
                    customer: 'Piet Pietersen',
                    date: '2023-06-20',
                    items: [
                        { productId: 3, quantity: 1, price: 49.99 }
                    ],
                    total: 49.99,
                    status: 'shipped'
                },
                {
                    id: 3,
                    customer: 'Klaas Klaassen',
                    date: '2023-06-25',
                    items: [
                        { productId: 1, quantity: 1, price: 24.99 },
                        { productId: 3, quantity: 1, price: 49.99 }
                    ],
                    total: 74.98,
                    status: 'pending'
                }
            ];
            
            // Save sample orders to localStorage
            localStorage.setItem('voiceguy_orders', JSON.stringify(sampleOrders));
            
            // Use sample orders
            orders.push(...sampleOrders);
        }
        
        // Get filter values
        const searchTerm = document.getElementById('order-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('order-status-filter')?.value || 'all';
        
        // Filter orders
        const filteredOrders = orders.filter(order => {
            const matchesSearch = order.customer.toLowerCase().includes(searchTerm) || 
                                 order.id.toString().includes(searchTerm);
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            
            return matchesSearch && matchesStatus;
        });
        
        // Add orders to table
        filteredOrders.forEach(order => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${formatDate(order.date)}</td>
                <td>${order.items.length} item(s)</td>
                <td>€${order.total.toFixed(2)}</td>
                <td><span class="badge ${getStatusClass(order.status)}">${getStatusName(order.status)}</span></td>
                <td class="actions">
                    <button class="action-link view-order" data-id="${order.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-link edit-order" data-id="${order.id}"><i class="fas fa-edit"></i></button>
                </td>
            `;
            
            ordersTableBody.appendChild(row);
        });
        
        // Add event listeners to view and edit buttons
        document.querySelectorAll('.view-order').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = parseInt(this.getAttribute('data-id'));
                viewOrder(orderId);
            });
        });
        
        document.querySelectorAll('.edit-order').forEach(button => {
            button.addEventListener('click', function() {
                const orderId = parseInt(this.getAttribute('data-id'));
                editOrder(orderId);
            });
        });
    }
    
    // Set up product management
    function setupProductManagement() {
        const addProductBtn = document.getElementById('add-product-btn');
        const productModal = document.getElementById('product-modal');
        const closeModalBtn = productModal?.querySelector('.close-modal-btn');
        const saveProductBtn = document.getElementById('save-product-btn');
        const cancelProductBtn = document.getElementById('cancel-product-btn');
        const unlimitedStockCheckbox = document.getElementById('unlimited-stock');
        const productStockInput = document.getElementById('product-stock');
        
        // Add product button
        if (addProductBtn) {
            addProductBtn.addEventListener('click', function() {
                showProductModal();
            });
        }
        
        // Close modal button
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', function() {
                hideProductModal();
            });
        }
        
        // Cancel button
        if (cancelProductBtn) {
            cancelProductBtn.addEventListener('click', function() {
                hideProductModal();
            });
        }
        
        // Save button
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', function() {
                const productForm = document.getElementById('product-form');
                if (productForm && productForm.checkValidity()) {
                    saveProduct();
                    hideProductModal();
                } else {
                    alert('Vul alle verplichte velden in.');
                }
            });
        }
        
        // Unlimited stock checkbox
        if (unlimitedStockCheckbox && productStockInput) {
            unlimitedStockCheckbox.addEventListener('change', function() {
                productStockInput.disabled = this.checked;
                if (this.checked) {
                    productStockInput.value = '';
                }
            });
        }
    }
    
    // Set up order management
    function setupOrderManagement() {
        // Order status filter
        const orderStatusFilter = document.getElementById('order-status-filter');
        if (orderStatusFilter) {
            orderStatusFilter.addEventListener('change', function() {
                loadOrders();
            });
        }
        
        // Order search
        const orderSearch = document.getElementById('order-search');
        if (orderSearch) {
            orderSearch.addEventListener('input', function() {
                loadOrders();
            });
        }
    }
    
    // Set up search and filter functionality
    function setupSearchAndFilter() {
        // Product search
        const productSearch = document.getElementById('product-search');
        if (productSearch) {
            productSearch.addEventListener('input', function() {
                loadProducts();
            });
        }
        
        // Category filter
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                loadProducts();
            });
        }
    }
    
    // Helper functions
    function getCategoryName(category) {
        const categories = {
            'kleding': 'Kleding',
            'accessoires': 'Accessoires',
            'digitaal': 'Digitaal'
        };
        
        return categories[category] || category;
    }
    
    function getStatusName(status) {
        const statuses = {
            'pending': 'In behandeling',
            'shipped': 'Verzonden',
            'completed': 'Voltooid',
            'cancelled': 'Geannuleerd'
        };
        
        return statuses[status] || status;
    }
    
    function getStatusClass(status) {
        const classes = {
            'pending': 'moderator',
            'shipped': 'admin',
            'completed': 'admin',
            'cancelled': 'moderator'
        };
        
        return classes[status] || '';
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('nl-NL');
    }
    
    // Product management functions
    function editProduct(productId) {
        const products = JSON.parse(localStorage.getItem('voiceguy_products') || '[]');
        const product = products.find(p => p.id === productId);
        
        if (product) {
            showProductModal(product);
        }
    }
    
    function deleteProduct(productId) {
        if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
            const products = JSON.parse(localStorage.getItem('voiceguy_products') || '[]');
            const updatedProducts = products.filter(p => p.id !== productId);
            
            localStorage.setItem('voiceguy_products', JSON.stringify(updatedProducts));
            
            loadProducts();
        }
    }
    
    // Order management functions
    function viewOrder(orderId) {
        const orders = JSON.parse(localStorage.getItem('voiceguy_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            alert(`Order #${order.id}\nKlant: ${order.customer}\nDatum: ${formatDate(order.date)}\nStatus: ${getStatusName(order.status)}\nTotaal: €${order.total.toFixed(2)}`);
        }
    }
    
    function editOrder(orderId) {
        const orders = JSON.parse(localStorage.getItem('voiceguy_orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        
        if (order) {
            const newStatus = prompt('Nieuwe status (pending, shipped, completed, cancelled):', order.status);
            
            if (newStatus && ['pending', 'shipped', 'completed', 'cancelled'].includes(newStatus)) {
                order.status = newStatus;
                
                localStorage.setItem('voiceguy_orders', JSON.stringify(orders));
                
                loadOrders();
            }
        }
    }
    
    // Display username (using the already declared username variable)
    const usernameElement2 = document.getElementById('admin-username');
    if (usernameElement2) {
        usernameElement2.textContent = username;
    }
    
    // Setup tab switching functionality
    function setupTabSwitching() {
        console.log("Setting up tab switching");
        
        // Get all tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        console.log(`Found ${tabButtons.length} tab buttons`);
        
        // Add click event listeners to all tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                console.log(`Tab button clicked: ${tabId}`);
                switchTab(tabId);
            });
        });
        
        // Add click event listeners specifically to action buttons
        const actionButtons = document.querySelectorAll('.action-btn.tab-button');
        console.log(`Found ${actionButtons.length} action buttons`);
        
        actionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                console.log(`Action button clicked: ${tabId}`);
                switchTab(tabId);
            });
        });
    }
    
    // Use the global switchTab function
    
    // Logout functionality
    const logoutLinks = document.querySelectorAll('#logout-link, #footer-logout');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear login info
            localStorage.removeItem('voiceguy_logged_in');
            localStorage.removeItem('voiceguy_username');
            
            // Redirect to home page
            window.location.href = 'index.html';
        });
    });
    
    // Update user stats
    updateUserStats();
    
    // Update content stats
    updateContentStats();
    
    // Update shop stats
    updateShopStats();
    
    // Function to update user stats
    function updateUserStats() {
        // In a real application, this would fetch data from a server
        document.getElementById('total-users').textContent = '1,245';
        document.getElementById('new-users').textContent = '+32';
        document.getElementById('active-users').textContent = '867';
    }
    
    // Function to update content stats
    function updateContentStats() {
        // In a real application, this would fetch data from a server
        document.getElementById('total-views').textContent = '24,891';
        document.getElementById('view-change').textContent = '+12%';
        document.getElementById('avg-watch-time').textContent = '8:45';
    }
    
    // Function to update shop stats
    function updateShopStats() {
        // In a real application, this would fetch data from a server
        document.getElementById('total-orders').textContent = '156';
        document.getElementById('order-change').textContent = '+8%';
        document.getElementById('total-revenue').textContent = '€4,325';
    }
    
    // Default products (worden gebruikt als er geen producten in localStorage zijn)
    const defaultProducts = [
        {
            id: 1,
            name: 'VoiceGuy T-shirt',
            price: 24.99,
            category: 'kleding',
            stock: 25,
            status: 'active',
            image: 'https://via.placeholder.com/400x300/333333/ff33cc?text=VoiceGuy+T-shirt',
            description: 'Een comfortabel T-shirt met het VoiceGuy logo.'
        },
        {
            id: 2,
            name: 'VoiceGuy Hoodie',
            price: 49.99,
            category: 'kleding',
            stock: 15,
            status: 'active',
            image: 'https://via.placeholder.com/400x300/333333/ff33cc?text=VoiceGuy+Hoodie',
            description: 'Een warme hoodie met het VoiceGuy logo.'
        },
        {
            id: 3,
            name: 'VoiceGuy Mok',
            price: 14.99,
            category: 'accessoires',
            stock: 30,
            status: 'active',
            image: 'https://via.placeholder.com/400x300/333333/00ff99?text=VoiceGuy+Mok',
            description: 'Een keramische mok met het VoiceGuy logo.'
        },
        {
            id: 4,
            name: 'VoiceGuy Pet',
            price: 19.99,
            category: 'accessoires',
            stock: 20,
            status: 'active',
            image: 'https://via.placeholder.com/400x300/333333/00ff99?text=VoiceGuy+Pet',
            description: 'Een stijlvolle pet met het VoiceGuy logo.'
        },
        {
            id: 5,
            name: 'Stream Emotes Pack',
            price: 9.99,
            category: 'digitaal',
            stock: -1, // Unlimited
            status: 'active',
            image: 'https://via.placeholder.com/400x300/333333/ff66cc?text=Stream+Emotes',
            description: 'Een set van 10 unieke emotes voor je stream.'
        },
        {
            id: 6,
            name: 'Stream Overlay Pack',
            price: 14.99,
            category: 'digitaal',
            stock: -1, // Unlimited
            status: 'active',
            image: 'https://via.placeholder.com/400x300/333333/ff66cc?text=Stream+Overlay',
            description: 'Een professionele stream overlay in VoiceGuy stijl.'
        }
    ];
    
    // Haal producten op uit localStorage of gebruik de standaardproducten
    let products = JSON.parse(localStorage.getItem('voiceguy_products')) || defaultProducts;
    
    // Als er geen producten in localStorage zijn, sla de standaardproducten op
    if (!localStorage.getItem('voiceguy_products')) {
        localStorage.setItem('voiceguy_products', JSON.stringify(defaultProducts));
    }
    
    // Default orders (worden gebruikt als er geen bestellingen in localStorage zijn)
    const defaultOrders = [
        {
            id: 'ORD-001',
            customer: 'Jan Jansen',
            date: '15-06-2023',
            items: 2,
            total: 74.98,
            status: 'shipped'
        },
        {
            id: 'ORD-002',
            customer: 'Piet Pietersen',
            date: '14-06-2023',
            items: 1,
            total: 24.99,
            status: 'completed'
        },
        {
            id: 'ORD-003',
            customer: 'Klaas Klaassen',
            date: '13-06-2023',
            items: 3,
            total: 84.97,
            status: 'pending'
        }
    ];
    
    // Haal bestellingen op uit localStorage of gebruik de standaardbestellingen
    let orders = JSON.parse(localStorage.getItem('voiceguy_orders')) || defaultOrders;
    
    // Als er geen bestellingen in localStorage zijn, sla de standaardbestellingen op
    if (!localStorage.getItem('voiceguy_orders')) {
        localStorage.setItem('voiceguy_orders', JSON.stringify(defaultOrders));
    }
    
    // Product modal elements
    const productModal = document.getElementById('product-modal');
    const closeProductModalBtn = productModal ? productModal.querySelector('.close-modal-btn') : null;
    const saveProductBtn = document.getElementById('save-product-btn');
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    const addProductBtn = document.getElementById('add-product-btn');
    const productForm = document.getElementById('product-form');
    const unlimitedStockCheckbox = document.getElementById('unlimited-stock');
    const productStockInput = document.getElementById('product-stock');
    
    // Initialize shop management
    if (addProductBtn && productModal) {
        // Show modal when Add Product button is clicked
        addProductBtn.addEventListener('click', function() {
            showProductModal();
        });
        
        // Close modal when Close button is clicked
        if (closeProductModalBtn) {
            closeProductModalBtn.addEventListener('click', function() {
                hideProductModal();
            });
        }
        
        // Close modal when Cancel button is clicked
        if (cancelProductBtn) {
            cancelProductBtn.addEventListener('click', function() {
                hideProductModal();
            });
        }
        
        // Save product when Save button is clicked
        if (saveProductBtn && productForm) {
            saveProductBtn.addEventListener('click', function() {
                if (productForm.checkValidity()) {
                    saveProduct();
                    hideProductModal();
                } else {
                    alert('Vul alle verplichte velden in.');
                }
            });
        }
        
        // Toggle stock input based on unlimited stock checkbox
        if (unlimitedStockCheckbox && productStockInput) {
            unlimitedStockCheckbox.addEventListener('change', function() {
                productStockInput.disabled = this.checked;
                if (this.checked) {
                    productStockInput.value = '';
                }
            });
        }
        
        // Initialize product table
        updateProductTable();
        
        // Initialize order table
        updateOrderTable();
        
        // Add event listeners for search and filter
        const productSearch = document.getElementById('product-search');
        const categoryFilter = document.getElementById('category-filter');
        const orderSearch = document.getElementById('order-search');
        const orderStatusFilter = document.getElementById('order-status-filter');
        
        if (productSearch) {
            productSearch.addEventListener('input', function() {
                updateProductTable();
            });
        }
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', function() {
                updateProductTable();
            });
        }
        
        if (orderSearch) {
            orderSearch.addEventListener('input', function() {
                updateOrderTable();
            });
        }
        
        if (orderStatusFilter) {
            orderStatusFilter.addEventListener('change', function() {
                updateOrderTable();
            });
        }
    }
    
    // Function to update product table
    function updateProductTable() {
        const tableBody = document.getElementById('products-table-body');
        const searchInput = document.getElementById('product-search');
        const categoryFilter = document.getElementById('category-filter');
        
        if (!tableBody) return;
        
        // Clear table
        tableBody.innerHTML = '';
        
        // Get search and filter values
        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
        const filterValue = categoryFilter ? categoryFilter.value : 'all';
        
        // Filter products
        const filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchValue) || 
                                product.description.toLowerCase().includes(searchValue);
            const matchesCategory = filterValue === 'all' || product.category === filterValue;
            
            return matchesSearch && matchesCategory;
        });
        
        // Add products to table
        filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>€${product.price.toFixed(2)}</td>
                <td>${getCategoryName(product.category)}</td>
                <td>${product.stock === -1 ? 'Onbeperkt' : product.stock}</td>
                <td><span class="badge ${product.status === 'active' ? 'admin' : 'moderator'}">${product.status === 'active' ? 'Actief' : 'Inactief'}</span></td>
                <td class="actions">
                    <button class="action-button edit" title="Bewerken" data-id="${product.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-button delete" title="Verwijderen" data-id="${product.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to edit and delete buttons
        const editButtons = tableBody.querySelectorAll('.action-button.edit');
        const deleteButtons = tableBody.querySelectorAll('.action-button.delete');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    showProductModal(product);
                }
            });
        });
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                
                if (confirm('Weet je zeker dat je dit product wilt verwijderen?')) {
                    // Remove product
                    products = products.filter(p => p.id !== productId);
                    
                    // Sla producten op in localStorage
                    localStorage.setItem('voiceguy_products', JSON.stringify(products));
                    
                    // Update table
                    loadProducts();
                    
                    // Show success message
                    alert('Product verwijderd!');
                }
            });
        });
    }
    
    // Function to update order table
    function updateOrderTable() {
        const tableBody = document.getElementById('orders-table-body');
        const searchInput = document.getElementById('order-search');
        const statusFilter = document.getElementById('order-status-filter');
        
        if (!tableBody) return;
        
        // Clear table
        tableBody.innerHTML = '';
        
        // Get search and filter values
        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
        const filterValue = statusFilter ? statusFilter.value : 'all';
        
        // Filter orders
        const filteredOrders = orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchValue) || 
                                order.customer.toLowerCase().includes(searchValue);
            const matchesStatus = filterValue === 'all' || order.status === filterValue;
            
            return matchesSearch && matchesStatus;
        });
        
        // Add orders to table
        filteredOrders.forEach(order => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${order.items} ${order.items === 1 ? 'item' : 'items'}</td>
                <td>€${order.total.toFixed(2)}</td>
                <td><span class="badge ${getStatusBadgeClass(order.status)}">${getStatusName(order.status)}</span></td>
                <td class="actions">
                    <button class="action-button edit" title="Details" data-id="${order.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-button" title="Status bijwerken" data-id="${order.id}"><i class="fas fa-sync-alt"></i></button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Add event listeners to buttons
        const statusButtons = tableBody.querySelectorAll('.action-button[title="Status bijwerken"]');
        
        statusButtons.forEach(button => {
            button.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                const order = orders.find(o => o.id === orderId);
                
                if (order) {
                    // Show status update dialog
                    const newStatus = prompt('Selecteer nieuwe status (pending, processing, shipped, completed, cancelled):', order.status);
                    
                    if (newStatus && ['pending', 'processing', 'shipped', 'completed', 'cancelled'].includes(newStatus)) {
                        // Update order status
                        order.status = newStatus;
                        
                        // Sla bestellingen op in localStorage
                        localStorage.setItem('voiceguy_orders', JSON.stringify(orders));
                        
                        // Update table
                        loadOrders();
                        
                        // Show success message
                        alert(`Status van bestelling ${orderId} bijgewerkt naar ${getStatusName(newStatus)}!`);
                    }
                }
            });
        });
    }
    
    // Function to show product modal
    function showProductModal(product = null) {
        const productForm = document.getElementById('product-form');
        const productModal = document.getElementById('product-modal');
        const productStockInput = document.getElementById('product-stock');
        
        // Reset form
        if (productForm) {
            productForm.reset();
            
            // Set modal title
            const modalTitle = document.getElementById('product-modal-title');
            
            if (product) {
                // Edit existing product
                if (modalTitle) modalTitle.textContent = 'Product Bewerken';
                
                // Fill form with product data
                const nameInput = document.getElementById('product-name');
                const priceInput = document.getElementById('product-price');
                const categorySelect = document.getElementById('product-category');
                const stockInput = document.getElementById('product-stock');
                const unlimitedStockCheckbox = document.getElementById('unlimited-stock');
                const descriptionTextarea = document.getElementById('product-description');
                const imageInput = document.getElementById('product-image');
                const statusSelect = document.getElementById('product-status');
                const productIdInput = document.getElementById('product-id');
                
                if (nameInput) nameInput.value = product.name;
                if (priceInput) priceInput.value = product.price;
                if (categorySelect) categorySelect.value = product.category;
                if (productIdInput) productIdInput.value = product.id;
                
                if (unlimitedStockCheckbox) {
                    unlimitedStockCheckbox.checked = product.stock === -1;
                    if (stockInput) {
                        stockInput.disabled = product.stock === -1;
                        stockInput.value = product.stock === -1 ? '' : product.stock;
                    }
                }
                
                if (descriptionTextarea) descriptionTextarea.value = product.description;
                if (imageInput) imageInput.value = product.image;
                if (statusSelect) statusSelect.value = product.status;
            } else {
                // Add new product
                if (modalTitle) modalTitle.textContent = 'Product Toevoegen';
                
                // Enable stock input
                if (productStockInput) productStockInput.disabled = false;
            }
        }
        
        // Show modal
        if (productModal) {
            productModal.classList.add('active');
            productModal.style.display = 'flex';
        }
    }
    
    // Function to hide product modal
    function hideProductModal() {
        const productModal = document.getElementById('product-modal');
        if (productModal) {
            productModal.classList.remove('active');
        }
    }
    
    // Function to save product
    function saveProduct() {
        // Get form data
        const name = document.getElementById('product-name').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const unlimitedStock = document.getElementById('unlimited-stock').checked;
        const stock = unlimitedStock ? -1 : parseInt(document.getElementById('product-stock').value);
        const description = document.getElementById('product-description').value;
        const image = document.getElementById('product-image').value || `https://via.placeholder.com/400x300/333333/ff33cc?text=${encodeURIComponent(name)}`;
        const status = document.getElementById('product-status').value;
        
        // Check if editing existing product
        const productId = parseInt(document.getElementById('product-id').value || '0');
        
        // Get products from localStorage
        const products = JSON.parse(localStorage.getItem('voiceguy_products') || '[]');
        
        if (productId) {
            // Update existing product
            const index = products.findIndex(p => p.id === productId);
            
            if (index !== -1) {
                products[index] = {
                    ...products[index],
                    name,
                    price,
                    category,
                    stock,
                    description,
                    image,
                    status
                };
            }
        } else {
            // Add new product
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            
            products.push({
                id: newId,
                name,
                price,
                category,
                stock,
                description,
                image,
                status
            });
        }
        
        // Save products to localStorage
        localStorage.setItem('voiceguy_products', JSON.stringify(products));
        
        // Reload products table
        loadProducts();
        
        // Show success message
        alert(productId ? 'Product bijgewerkt!' : 'Product toegevoegd!');
    }
    
    // Helper function to get category name
    function getCategoryName(category) {
        switch (category) {
            case 'kleding':
                return 'Kleding';
            case 'accessoires':
                return 'Accessoires';
            case 'digitaal':
                return 'Digitale Items';
            default:
                return category;
        }
    }
    
    // Helper function to get status name
    function getStatusName(status) {
        switch (status) {
            case 'pending':
                return 'In behandeling';
            case 'processing':
                return 'Wordt verwerkt';
            case 'shipped':
                return 'Verzonden';
            case 'completed':
                return 'Voltooid';
            case 'cancelled':
                return 'Geannuleerd';
            default:
                return status;
        }
    }
    
    // Helper function to get status badge class
    function getStatusBadgeClass(status) {
        switch (status) {
            case 'pending':
                return 'admin';
            case 'processing':
                return 'admin';
            case 'shipped':
                return 'moderator';
            case 'completed':
                return 'user';
            case 'cancelled':
                return 'moderator';
            default:
                return 'user';
        }
    }

    // Sociale Media Beheer Functionaliteit
    // Default sociale media accounts
    const defaultSocialAccounts = [
        {
            platform: 'twitch',
            username: 'voiceguy',
            url: 'https://www.twitch.tv/voiceguy',
            status: 'active'
        },
        {
            platform: 'tiktok',
            username: 'dutchvoiceimpressions',
            url: 'https://www.tiktok.com/@dutchvoiceimpressions',
            status: 'active'
        },
        {
            platform: 'youtube',
            username: 'voiceguy',
            url: 'https://www.youtube.com/c/voiceguy',
            status: 'active'
        }
    ];

    // Haal sociale media accounts op uit localStorage of gebruik de standaardaccounts
    let socialAccounts = JSON.parse(localStorage.getItem('voiceguySocialAccounts')) || defaultSocialAccounts;
    
    // Als er geen sociale media accounts in localStorage zijn, sla de standaardaccounts op
    if (!localStorage.getItem('voiceguySocialAccounts')) {
        localStorage.setItem('voiceguySocialAccounts', JSON.stringify(defaultSocialAccounts));
    }

    // Default sociale media feed instellingen
    const defaultFeedSettings = {
        showTwitch: true,
        showTikTok: true,
        showYouTube: true,
        itemsCount: 3
    };

    // Haal sociale media feed instellingen op uit localStorage of gebruik de standaardinstellingen
    let feedSettings = JSON.parse(localStorage.getItem('voiceguySocialFeedSettings')) || defaultFeedSettings;
    
    // Als er geen sociale media feed instellingen in localStorage zijn, sla de standaardinstellingen op
    if (!localStorage.getItem('voiceguySocialFeedSettings')) {
        localStorage.setItem('voiceguySocialFeedSettings', JSON.stringify(defaultFeedSettings));
    }

    // Sociale Media Modal functionaliteit
    const addSocialBtn = document.getElementById('add-social-btn');
    const socialModal = document.getElementById('social-modal');
    const closeSocialModalBtn = socialModal ? socialModal.querySelector('.close-modal-btn') : null;
    const saveSocialBtn = document.getElementById('save-social-btn');
    const cancelSocialBtn = document.getElementById('cancel-social-btn');
    const socialForm = document.getElementById('social-form');
    const saveFeedsSettingsBtn = document.getElementById('save-feeds-settings');

    // Initialize sociale media beheer
    if (addSocialBtn && socialModal) {
        // Toon modal wanneer op Nieuw Account wordt geklikt
        addSocialBtn.addEventListener('click', function() {
            showSocialModal();
        });

        // Sluit modal wanneer op Sluiten wordt geklikt
        if (closeSocialModalBtn) {
            closeSocialModalBtn.addEventListener('click', function() {
                hideSocialModal();
            });
        }

        // Sluit modal wanneer op Annuleren wordt geklikt
        if (cancelSocialBtn) {
            cancelSocialBtn.addEventListener('click', function() {
                hideSocialModal();
            });
        }

        // Sla sociale media account op wanneer op Opslaan wordt geklikt
        if (saveSocialBtn && socialForm) {
            saveSocialBtn.addEventListener('click', function() {
                if (socialForm.checkValidity()) {
                    saveSocialAccount();
                    hideSocialModal();
                } else {
                    alert('Vul alle verplichte velden in.');
                }
            });
        }

        // Initialiseer sociale media accounts tabel
        updateSocialAccountsTable();

        // Voeg event listeners toe aan bewerk- en verwijderknoppen
        addSocialAccountEventListeners();

        // Initialiseer sociale media feed instellingen
        initializeFeedSettings();

        // Sla sociale media feed instellingen op wanneer op Opslaan wordt geklikt
        if (saveFeedsSettingsBtn) {
            saveFeedsSettingsBtn.addEventListener('click', function() {
                saveFeedSettings();
            });
        }
    }

    // Functie om sociale media modal te tonen
    function showSocialModal(account = null) {
        // Reset formulier
        if (socialForm) {
            socialForm.reset();
            
            // Stel modaltitel in
            const modalTitle = document.getElementById('social-modal-title');
            
            if (account) {
                // Bewerk bestaand account
                if (modalTitle) modalTitle.textContent = 'Sociale Media Account Bewerken';
                
                // Vul formulier met accountgegevens
                const platformSelect = document.getElementById('social-platform');
                const usernameInput = document.getElementById('social-username');
                const urlInput = document.getElementById('social-url');
                const activeRadio = document.getElementById('social-active');
                const inactiveRadio = document.getElementById('social-inactive');
                
                if (platformSelect) platformSelect.value = account.platform;
                if (usernameInput) usernameInput.value = account.username;
                if (urlInput) urlInput.value = account.url;
                
                if (account.status === 'active') {
                    if (activeRadio) activeRadio.checked = true;
                } else {
                    if (inactiveRadio) inactiveRadio.checked = true;
                }
                
                // Sla platform op voor het bijwerken
                if (socialForm) socialForm.dataset.platform = account.platform;
            } else {
                // Voeg nieuw account toe
                if (modalTitle) modalTitle.textContent = 'Sociale Media Account Toevoegen';
                
                // Wis platform
                if (socialForm) delete socialForm.dataset.platform;
            }
        }
        
        // Toon modal
        if (socialModal) socialModal.style.display = 'flex';
    }

    // Functie om sociale media modal te verbergen
    function hideSocialModal() {
        if (socialModal) socialModal.style.display = 'none';
    }

    // Functie om sociale media account op te slaan
    function saveSocialAccount() {
        // Haal formuliergegevens op
        const platformSelect = document.getElementById('social-platform');
        const usernameInput = document.getElementById('social-username');
        const urlInput = document.getElementById('social-url');
        const statusRadios = document.getElementsByName('social-status');
        
        if (!platformSelect || !usernameInput || !urlInput || !statusRadios.length) return;
        
        const platform = platformSelect.value;
        const username = usernameInput.value;
        const url = urlInput.value;
        const status = Array.from(statusRadios).find(radio => radio.checked)?.value || 'active';
        
        // Controleer of we een bestaand account bewerken
        const editPlatform = socialForm ? socialForm.dataset.platform : null;
        
        if (editPlatform) {
            // Bewerk bestaand account
            const index = socialAccounts.findIndex(account => account.platform === editPlatform);
            
            if (index !== -1) {
                // Als het platform is gewijzigd, verwijder het oude account
                if (platform !== editPlatform) {
                    socialAccounts.splice(index, 1);
                    
                    // Voeg nieuw account toe
                    socialAccounts.push({
                        platform,
                        username,
                        url,
                        status
                    });
                } else {
                    // Update bestaand account
                    socialAccounts[index] = {
                        platform,
                        username,
                        url,
                        status
                    };
                }
            }
        } else {
            // Controleer of het platform al bestaat
            const existingIndex = socialAccounts.findIndex(account => account.platform === platform);
            
            if (existingIndex !== -1) {
                // Update bestaand account
                socialAccounts[existingIndex] = {
                    platform,
                    username,
                    url,
                    status
                };
            } else {
                // Voeg nieuw account toe
                socialAccounts.push({
                    platform,
                    username,
                    url,
                    status
                });
            }
        }
        
        // Sla sociale media accounts op in localStorage
        localStorage.setItem('voiceguySocialAccounts', JSON.stringify(socialAccounts));
        
        // Update sociale media accounts tabel
        updateSocialAccountsTable();
        
        // Update sociale media links in de footer
        updateSocialLinks();
        
        // Toon succesmelding
        alert(editPlatform ? 'Sociale media account bijgewerkt!' : 'Sociale media account toegevoegd!');
    }

    // Functie om sociale media accounts tabel bij te werken
    function updateSocialAccountsTable() {
        const tableBody = document.getElementById('social-accounts-table');
        
        if (!tableBody) return;
        
        // Leeg tabel
        tableBody.innerHTML = '';
        
        // Voeg accounts toe aan tabel
        socialAccounts.forEach(account => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><i class="fab fa-${account.platform}"></i> ${getPlatformName(account.platform)}</td>
                <td>${account.username}</td>
                <td><a href="${account.url}" target="_blank">${account.url}</a></td>
                <td><span class="badge ${account.status === 'active' ? 'admin' : 'moderator'}">${account.status === 'active' ? 'Actief' : 'Inactief'}</span></td>
                <td class="actions">
                    <button class="action-button edit" title="Bewerken" data-platform="${account.platform}"><i class="fas fa-edit"></i></button>
                    <button class="action-button delete" title="Verwijderen" data-platform="${account.platform}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // Voeg event listeners toe aan bewerk- en verwijderknoppen
        addSocialAccountEventListeners();
    }

    // Functie om event listeners toe te voegen aan sociale media account knoppen
    function addSocialAccountEventListeners() {
        const tableBody = document.getElementById('social-accounts-table');
        
        if (!tableBody) return;
        
        // Bewerkknoppen
        const editButtons = tableBody.querySelectorAll('.action-button.edit');
        
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                const account = socialAccounts.find(acc => acc.platform === platform);
                
                if (account) {
                    showSocialModal(account);
                }
            });
        });
        
        // Verwijderknoppen
        const deleteButtons = tableBody.querySelectorAll('.action-button.delete');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const platform = this.getAttribute('data-platform');
                
                if (confirm(`Weet je zeker dat je het ${getPlatformName(platform)} account wilt verwijderen?`)) {
                    // Verwijder account
                    socialAccounts = socialAccounts.filter(acc => acc.platform !== platform);
                    
                    // Sla sociale media accounts op in localStorage
                    localStorage.setItem('voiceguySocialAccounts', JSON.stringify(socialAccounts));
                    
                    // Update sociale media accounts tabel
                    updateSocialAccountsTable();
                    
                    // Update sociale media links in de footer
                    updateSocialLinks();
                    
                    // Toon succesmelding
                    alert('Sociale media account verwijderd!');
                }
            });
        });
    }

    // Functie om sociale media feed instellingen te initialiseren
    function initializeFeedSettings() {
        const showTwitchCheckbox = document.getElementById('show-twitch-feed');
        const showTikTokCheckbox = document.getElementById('show-tiktok-feed');
        const showYouTubeCheckbox = document.getElementById('show-youtube-feed');
        const itemsCountInput = document.getElementById('feed-items-count');
        
        if (showTwitchCheckbox) showTwitchCheckbox.checked = feedSettings.showTwitch;
        if (showTikTokCheckbox) showTikTokCheckbox.checked = feedSettings.showTikTok;
        if (showYouTubeCheckbox) showYouTubeCheckbox.checked = feedSettings.showYouTube;
        if (itemsCountInput) itemsCountInput.value = feedSettings.itemsCount;
    }

    // Functie om sociale media feed instellingen op te slaan
    function saveFeedSettings() {
        const showTwitchCheckbox = document.getElementById('show-twitch-feed');
        const showTikTokCheckbox = document.getElementById('show-tiktok-feed');
        const showYouTubeCheckbox = document.getElementById('show-youtube-feed');
        const itemsCountInput = document.getElementById('feed-items-count');
        
        if (!showTwitchCheckbox || !showTikTokCheckbox || !showYouTubeCheckbox || !itemsCountInput) return;
        
        // Update instellingen
        feedSettings = {
            showTwitch: showTwitchCheckbox.checked,
            showTikTok: showTikTokCheckbox.checked,
            showYouTube: showYouTubeCheckbox.checked,
            itemsCount: parseInt(itemsCountInput.value) || 3
        };
        
        // Sla instellingen op in localStorage
        localStorage.setItem('voiceguySocialFeedSettings', JSON.stringify(feedSettings));
        
        // Toon succesmelding
        alert('Sociale media feed instellingen opgeslagen!');
    }

    // Functie om sociale media links in de footer bij te werken
    function updateSocialLinks() {
        const footerSocialLinks = document.querySelector('.footer-section.social-links .social-icons');
        
        if (!footerSocialLinks) return;
        
        // Leeg huidige links
        footerSocialLinks.innerHTML = '';
        
        // Voeg actieve sociale media accounts toe
        const activeAccounts = socialAccounts.filter(account => account.status === 'active');
        
        activeAccounts.forEach(account => {
            const link = document.createElement('a');
            link.href = account.url;
            link.target = '_blank';
            link.className = `social-icon ${account.platform}`;
            
            link.innerHTML = `
                <i class="fab fa-${account.platform}"></i>
                <span>${getPlatformName(account.platform)}</span>
            `;
            
            footerSocialLinks.appendChild(link);
        });
    }

    // Helper functie om platformnaam te krijgen
    function getPlatformName(platform) {
        switch (platform) {
            case 'twitch':
                return 'Twitch';
            case 'tiktok':
                return 'TikTok';
            case 'youtube':
                return 'YouTube';
            case 'instagram':
                return 'Instagram';
            case 'twitter':
                return 'Twitter';
            case 'facebook':
                return 'Facebook';
            case 'discord':
                return 'Discord';
            default:
                return platform.charAt(0).toUpperCase() + platform.slice(1);
        }
    }

    // Update sociale media links bij het laden van de pagina
    updateSocialLinks();

    // Instellingen Beheer Functionaliteit
    // Default algemene instellingen
    const defaultGeneralSettings = {
        siteTitle: 'VoiceGuy - Gaming Community',
        siteDescription: 'De officiële website van VoiceGuy, waar je alle streams en content kunt volgen.',
        contactEmail: 'contact@voiceguy.nl',
        theme: 'dark',
        customColors: {
            primary: '#ff33cc',
            secondary: '#00ff99',
            background: '#121212'
        }
    };

    // Default weergave instellingen
    const defaultDisplaySettings = {
        showLiveNotification: true,
        showUpcomingEvents: true,
        showLatestContent: true,
        showFeaturedProducts: true,
        homepageLayout: 'standard',
        footerText: '&copy; 2025 VoiceGuy. Alle rechten voorbehouden.'
    };

    // Default geavanceerde instellingen
    const defaultAdvancedSettings = {
        cacheDuration: 60,
        maxItemsPerPage: 12,
        enableDebugMode: false
    };

    // Haal instellingen op uit localStorage of gebruik de standaardinstellingen
    let generalSettings = JSON.parse(localStorage.getItem('voiceguyGeneralSettings')) || defaultGeneralSettings;
    let displaySettings = JSON.parse(localStorage.getItem('voiceguyDisplaySettings')) || defaultDisplaySettings;
    let advancedSettings = JSON.parse(localStorage.getItem('voiceguyAdvancedSettings')) || defaultAdvancedSettings;

    // Als er geen instellingen in localStorage zijn, sla de standaardinstellingen op
    if (!localStorage.getItem('voiceguyGeneralSettings')) {
        localStorage.setItem('voiceguyGeneralSettings', JSON.stringify(defaultGeneralSettings));
    }
    if (!localStorage.getItem('voiceguyDisplaySettings')) {
        localStorage.setItem('voiceguyDisplaySettings', JSON.stringify(defaultDisplaySettings));
    }
    if (!localStorage.getItem('voiceguyAdvancedSettings')) {
        localStorage.setItem('voiceguyAdvancedSettings', JSON.stringify(defaultAdvancedSettings));
    }

    // Formulieren en knoppen
    const generalSettingsForm = document.getElementById('general-settings-form');
    const displaySettingsForm = document.getElementById('display-settings-form');
    const advancedSettingsForm = document.getElementById('advanced-settings-form');
    const saveGeneralSettingsBtn = document.getElementById('save-general-settings');
    const saveDisplaySettingsBtn = document.getElementById('save-display-settings');
    const saveAdvancedSettingsBtn = document.getElementById('save-advanced-settings');
    const themeOptions = document.querySelectorAll('.theme-option');
    const customThemeColors = document.getElementById('custom-theme-colors');

    // Initialiseer instellingen
    initializeSettings();

    // Event listeners voor formulieren
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveGeneralSettings();
        });
    }

    if (displaySettingsForm) {
        displaySettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveDisplaySettings();
        });
    }

    if (advancedSettingsForm) {
        advancedSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAdvancedSettings();
        });
    }

    // Event listeners voor thema opties
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Verwijder active class van alle opties
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Voeg active class toe aan geselecteerde optie
            this.classList.add('active');
            
            // Toon of verberg aangepaste kleuren
            const theme = this.getAttribute('data-theme');
            if (theme === 'custom' && customThemeColors) {
                customThemeColors.style.display = 'block';
            } else if (customThemeColors) {
                customThemeColors.style.display = 'none';
            }
        });
    });

    // Functie om instellingen te initialiseren
    function initializeSettings() {
        // Algemene instellingen
        const siteTitle = document.getElementById('site-title');
        const siteDescription = document.getElementById('site-description');
        const contactEmail = document.getElementById('contact-email');
        const primaryColor = document.getElementById('primary-color');
        const secondaryColor = document.getElementById('secondary-color');
        const backgroundColor = document.getElementById('background-color');
        
        if (siteTitle) siteTitle.value = generalSettings.siteTitle;
        if (siteDescription) siteDescription.value = generalSettings.siteDescription;
        if (contactEmail) contactEmail.value = generalSettings.contactEmail;
        if (primaryColor) primaryColor.value = generalSettings.customColors.primary;
        if (secondaryColor) secondaryColor.value = generalSettings.customColors.secondary;
        if (backgroundColor) backgroundColor.value = generalSettings.customColors.background;
        
        // Stel actieve thema in
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === generalSettings.theme) {
                option.classList.add('active');
                
                // Toon of verberg aangepaste kleuren
                if (generalSettings.theme === 'custom' && customThemeColors) {
                    customThemeColors.style.display = 'block';
                }
            } else {
                option.classList.remove('active');
            }
        });
        
        // Weergave instellingen
        const showLiveNotification = document.getElementById('show-live-notification');
        const showUpcomingEvents = document.getElementById('show-upcoming-events');
        const showLatestContent = document.getElementById('show-latest-content');
        const showFeaturedProducts = document.getElementById('show-featured-products');
        const homepageLayout = document.getElementById('homepage-layout');
        const footerText = document.getElementById('footer-text');
        
        if (showLiveNotification) showLiveNotification.checked = displaySettings.showLiveNotification;
        if (showUpcomingEvents) showUpcomingEvents.checked = displaySettings.showUpcomingEvents;
        if (showLatestContent) showLatestContent.checked = displaySettings.showLatestContent;
        if (showFeaturedProducts) showFeaturedProducts.checked = displaySettings.showFeaturedProducts;
        if (homepageLayout) homepageLayout.value = displaySettings.homepageLayout;
        if (footerText) footerText.value = displaySettings.footerText;
        
        // Geavanceerde instellingen
        const cacheDuration = document.getElementById('cache-duration');
        const maxItemsPerPage = document.getElementById('max-items-per-page');
        const enableDebugMode = document.getElementById('enable-debug-mode');
        
        if (cacheDuration) cacheDuration.value = advancedSettings.cacheDuration;
        if (maxItemsPerPage) maxItemsPerPage.value = advancedSettings.maxItemsPerPage;
        if (enableDebugMode) enableDebugMode.checked = advancedSettings.enableDebugMode;
    }

    // Functie om algemene instellingen op te slaan
    function saveGeneralSettings() {
        const siteTitle = document.getElementById('site-title');
        const siteDescription = document.getElementById('site-description');
        const contactEmail = document.getElementById('contact-email');
        const activeTheme = document.querySelector('.theme-option.active');
        const primaryColor = document.getElementById('primary-color');
        const secondaryColor = document.getElementById('secondary-color');
        const backgroundColor = document.getElementById('background-color');
        
        if (!siteTitle || !siteDescription || !contactEmail || !activeTheme) return;
        
        // Update instellingen
        generalSettings = {
            siteTitle: siteTitle.value,
            siteDescription: siteDescription.value,
            contactEmail: contactEmail.value,
            theme: activeTheme.getAttribute('data-theme'),
            customColors: {
                primary: primaryColor ? primaryColor.value : '#ff33cc',
                secondary: secondaryColor ? secondaryColor.value : '#00ff99',
                background: backgroundColor ? backgroundColor.value : '#121212'
            }
        };
        
        // Sla instellingen op in localStorage
        localStorage.setItem('voiceguyGeneralSettings', JSON.stringify(generalSettings));
        
        // Pas instellingen toe op de website
        applyGeneralSettings();
        
        // Toon succesmelding
        alert('Algemene instellingen opgeslagen!');
    }

    // Functie om weergave instellingen op te slaan
    function saveDisplaySettings() {
        const showLiveNotification = document.getElementById('show-live-notification');
        const showUpcomingEvents = document.getElementById('show-upcoming-events');
        const showLatestContent = document.getElementById('show-latest-content');
        const showFeaturedProducts = document.getElementById('show-featured-products');
        const homepageLayout = document.getElementById('homepage-layout');
        const footerText = document.getElementById('footer-text');
        
        if (!showLiveNotification || !showUpcomingEvents || !showLatestContent || 
            !showFeaturedProducts || !homepageLayout || !footerText) return;
        
        // Update instellingen
        displaySettings = {
            showLiveNotification: showLiveNotification.checked,
            showUpcomingEvents: showUpcomingEvents.checked,
            showLatestContent: showLatestContent.checked,
            showFeaturedProducts: showFeaturedProducts.checked,
            homepageLayout: homepageLayout.value,
            footerText: footerText.value
        };
        
        // Sla instellingen op in localStorage
        localStorage.setItem('voiceguyDisplaySettings', JSON.stringify(displaySettings));
        
        // Pas instellingen toe op de website
        applyDisplaySettings();
        
        // Toon succesmelding
        alert('Weergave instellingen opgeslagen!');
    }

    // Functie om geavanceerde instellingen op te slaan
    function saveAdvancedSettings() {
        const cacheDuration = document.getElementById('cache-duration');
        const maxItemsPerPage = document.getElementById('max-items-per-page');
        const enableDebugMode = document.getElementById('enable-debug-mode');
        
        if (!cacheDuration || !maxItemsPerPage || !enableDebugMode) return;
        
        // Update instellingen
        advancedSettings = {
            cacheDuration: parseInt(cacheDuration.value) || 60,
            maxItemsPerPage: parseInt(maxItemsPerPage.value) || 12,
            enableDebugMode: enableDebugMode.checked
        };
        
        // Sla instellingen op in localStorage
        localStorage.setItem('voiceguyAdvancedSettings', JSON.stringify(advancedSettings));
        
        // Pas instellingen toe op de website
        applyAdvancedSettings();
        
        // Toon succesmelding
        alert('Geavanceerde instellingen opgeslagen!');
    }

    // Functie om algemene instellingen toe te passen op de website
    function applyGeneralSettings() {
        // Pas titel en beschrijving toe
        document.title = generalSettings.siteTitle;
        
        // Pas thema toe
        const root = document.documentElement;
        
        if (generalSettings.theme === 'light') {
            root.style.setProperty('--background-color', '#f5f5f5');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--card-background', '#ffffff');
            root.style.setProperty('--primary-color', '#ff33cc');
            root.style.setProperty('--secondary-color', '#00ff99');
        } else if (generalSettings.theme === 'custom') {
            root.style.setProperty('--primary-color', generalSettings.customColors.primary);
            root.style.setProperty('--secondary-color', generalSettings.customColors.secondary);
            root.style.setProperty('--background-color', generalSettings.customColors.background);
        } else {
            // Donker thema (standaard)
            root.style.setProperty('--background-color', '#121212');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--card-background', '#1e1e1e');
            root.style.setProperty('--primary-color', '#ff33cc');
            root.style.setProperty('--secondary-color', '#00ff99');
        }
    }

    // Functie om weergave instellingen toe te passen op de website
    function applyDisplaySettings() {
        // Pas footer tekst toe
        const footerBottomText = document.querySelector('.footer-bottom p');
        if (footerBottomText) {
            footerBottomText.innerHTML = displaySettings.footerText;
        }
        
        // Toon of verberg elementen
        const liveNotification = document.getElementById('live-notification');
        const upcomingEvents = document.querySelector('.upcoming-events');
        const latestContent = document.querySelector('.latest-content');
        const featuredProducts = document.querySelector('.featured-products');
        
        if (liveNotification) {
            liveNotification.style.display = displaySettings.showLiveNotification ? 'block' : 'none';
        }
        
        if (upcomingEvents) {
            upcomingEvents.style.display = displaySettings.showUpcomingEvents ? 'block' : 'none';
        }
        
        if (latestContent) {
            latestContent.style.display = displaySettings.showLatestContent ? 'block' : 'none';
        }
        
        if (featuredProducts) {
            featuredProducts.style.display = displaySettings.showFeaturedProducts ? 'block' : 'none';
        }
    }

    // Functie om geavanceerde instellingen toe te passen op de website
    function applyAdvancedSettings() {
        // Debug modus
        if (advancedSettings.enableDebugMode) {
            console.log('Debug modus ingeschakeld');
            console.log('Algemene instellingen:', generalSettings);
            console.log('Weergave instellingen:', displaySettings);
            console.log('Geavanceerde instellingen:', advancedSettings);
        }
    }

    // Pas instellingen toe bij het laden van de pagina
    applyGeneralSettings();
    applyDisplaySettings();
    applyAdvancedSettings();
});