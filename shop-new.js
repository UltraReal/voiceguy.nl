// Shop functionality
document.addEventListener('DOMContentLoaded', function() {
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

    // Initialize the shopping cart - gebruik cookies als ze zijn geaccepteerd, anders localStorage
    let cart = [];
    
    // Controleer of functionele cookies zijn geaccepteerd
    if (typeof isCookieAccepted === 'function' && isCookieAccepted('functional')) {
        // Haal winkelwagen uit cookies
        cart = getCartFromCookies();
    } else {
        // Gebruik localStorage als fallback
        cart = JSON.parse(localStorage.getItem('voiceguy_cart')) || [];
    }
    
    // Laad producten dynamisch in de shop
    loadShopItems();
    
    // Update winkelwagen weergave
    updateCartDisplay();

    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the filter value
            const filterValue = button.getAttribute('data-filter');
            
            // Filter the shop items
            const shopItems = document.querySelectorAll('.shop-item');
            shopItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Sla de filtervoorkeur op als cookies zijn geaccepteerd
            if (typeof saveUserPreferences === 'function' && typeof isCookieAccepted === 'function' && isCookieAccepted('functional')) {
                const preferences = getUserPreferences();
                preferences.shopFilter = filterValue;
                saveUserPreferences(preferences);
            }
        });
    });
    
    // Laad opgeslagen filtervoorkeur als cookies zijn geaccepteerd
    if (typeof getUserPreferences === 'function' && typeof isCookieAccepted === 'function' && isCookieAccepted('functional')) {
        const preferences = getUserPreferences();
        if (preferences.shopFilter) {
            const savedFilterBtn = document.querySelector(`.filter-btn[data-filter="${preferences.shopFilter}"]`);
            if (savedFilterBtn) {
                savedFilterBtn.click();
            }
        }
    }
    
    // Functie om producten dynamisch te laden
    function loadShopItems() {
        const shopItemsContainer = document.querySelector('.shop-items');
        
        if (!shopItemsContainer) return;
        
        // Leeg de container
        shopItemsContainer.innerHTML = '';
        
        // Filter actieve producten
        const activeProducts = products.filter(product => product.status === 'active');
        
        // Voeg elk product toe aan de container
        activeProducts.forEach(product => {
            const shopItem = document.createElement('div');
            shopItem.className = 'shop-item';
            shopItem.setAttribute('data-category', product.category);
            shopItem.setAttribute('data-id', product.id);
            
            shopItem.innerHTML = `
                <div class="shop-item-image">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="shop-item-overlay">
                        <a href="#" class="view-details-btn" data-id="${product.id}">Bekijk Details</a>
                    </div>
                </div>
                <div class="shop-item-info">
                    <h3>${product.name}</h3>
                    <p class="shop-item-price">€${product.price.toFixed(2).replace('.', ',')}</p>
                    <div class="shop-item-actions">
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> In Winkelwagen
                        </button>
                    </div>
                </div>
            `;
            
            shopItemsContainer.appendChild(shopItem);
        });
        
        // Voeg event listeners toe aan de nieuwe knoppen
        addEventListenersToButtons();
    }

    // Functie om event listeners toe te voegen aan knoppen
    function addEventListenersToButtons() {
        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                
                if (!product) return;
                
                // Check if item is already in cart
                const existingItemIndex = cart.findIndex(item => item.id === productId);
                
                if (existingItemIndex !== -1) {
                    // Item already in cart, increase quantity
                    cart[existingItemIndex].quantity += 1;
                } else {
                    // Add new item to cart
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        quantity: 1
                    });
                }
                
                // Save cart to cookies if accepted, otherwise localStorage
                saveCart(cart);
                
                // Update cart display
                updateCartDisplay();
                
                // Show notification
                showNotification(`${product.name} toegevoegd aan winkelwagen!`);
            });
        });
        
        // View details functionality
        const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
        
        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                
                if (product) {
                    showProductDetails(product);
                }
            });
        });
    }
    
    // Functie om productdetails te tonen
    function showProductDetails(product) {
        // Controleer of er al een modal bestaat, zo niet, maak er een
        let modal = document.getElementById('product-details-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'product-details-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        // Vul de modal met productdetails
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${product.name}</h2>
                    <span class="close-modal">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="product-details">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <p class="product-price">€${product.price.toFixed(2).replace('.', ',')}</p>
                            <p class="product-description">${product.description}</p>
                            <p class="product-stock">${product.stock === -1 ? 'Onbeperkte voorraad' : `Nog ${product.stock} op voorraad`}</p>
                            <button class="add-to-cart-btn" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> In Winkelwagen
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Toon de modal
        modal.style.display = 'block';
        
        // Sluit de modal wanneer op het kruisje wordt geklikt
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Sluit de modal wanneer buiten de modal wordt geklikt
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
        
        // Voeg event listener toe aan de "In Winkelwagen" knop in de modal
        const addToCartButton = modal.querySelector('.add-to-cart-btn');
        addToCartButton.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (!product) return;
            
            // Check if item is already in cart
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            
            if (existingItemIndex !== -1) {
                // Item already in cart, increase quantity
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category,
                    quantity: 1
                });
            }
            
            // Save cart to cookies if accepted, otherwise localStorage
            saveCart(cart);
            
            // Update cart display
            updateCartDisplay();
            
            // Show notification
            showNotification(`${product.name} toegevoegd aan winkelwagen!`);
            
            // Sluit de modal
            modal.style.display = 'none';
        });
    }

    // Function to update cart display
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total-price');
        const checkoutButton = document.getElementById('checkout-btn');
        
        // Clear current cart display
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                // Cart is empty
                cartItemsContainer.innerHTML = '<div class="empty-cart-message">Je winkelwagen is leeg</div>';
                if (cartTotalElement) cartTotalElement.textContent = '€0,00';
                if (checkoutButton) checkoutButton.disabled = true;
            } else {
                // Cart has items
                let total = 0;
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'cart-item';
                    cartItemElement.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p class="cart-item-price">€${item.price.toFixed(2).replace('.', ',')}</p>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-index="${index}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn increase" data-index="${index}">+</button>
                            </div>
                        </div>
                        <button class="remove-item-btn" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    
                    cartItemsContainer.appendChild(cartItemElement);
                });
                
                // Update total price
                if (cartTotalElement) cartTotalElement.textContent = `€${total.toFixed(2).replace('.', ',')}`;
                if (checkoutButton) checkoutButton.disabled = false;
                
                // Add event listeners to quantity buttons and remove buttons
                addCartItemEventListeners();
            }
        }
        
        // Update cart count in header if it exists
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            
            if (totalItems > 0) {
                cartCountElement.style.display = 'flex';
            } else {
                cartCountElement.style.display = 'none';
            }
        }
    }

    // Function to add event listeners to cart item buttons
    function addCartItemEventListeners() {
        // Quantity decrease buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                } else {
                    // Remove item if quantity would be 0
                    cart.splice(index, 1);
                }
                
                // Save cart and update display
                saveCart(cart);
                updateCartDisplay();
            });
        });
        
        // Quantity increase buttons
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                
                // Controleer of er voldoende voorraad is (behalve voor onbeperkte voorraad)
                const product = products.find(p => p.id === cart[index].id);
                
                if (product && product.stock !== -1 && cart[index].quantity >= product.stock) {
                    showNotification(`Sorry, er zijn maar ${product.stock} exemplaren van dit product beschikbaar.`);
                    return;
                }
                
                cart[index].quantity += 1;
                
                // Save cart and update display
                saveCart(cart);
                updateCartDisplay();
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const removedItem = cart[index].name;
                
                // Remove item from cart
                cart.splice(index, 1);
                
                // Save cart and update display
                saveCart(cart);
                updateCartDisplay();
                
                // Show notification
                showNotification(`${removedItem} verwijderd uit winkelwagen`);
            });
        });
    }

    // Checkout button functionality
    const checkoutButton = document.getElementById('checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            if (cart.length > 0) {
                // Controleer voorraad voor alle items in de winkelwagen
                let outOfStockItems = [];
                
                cart.forEach(item => {
                    const product = products.find(p => p.id === item.id);
                    if (product && product.stock !== -1 && item.quantity > product.stock) {
                        outOfStockItems.push({
                            name: item.name,
                            available: product.stock
                        });
                    }
                });
                
                if (outOfStockItems.length > 0) {
                    let message = 'De volgende producten zijn niet meer voldoende op voorraad:\n\n';
                    outOfStockItems.forEach(item => {
                        message += `- ${item.name}: nog ${item.available} beschikbaar\n`;
                    });
                    alert(message);
                    return;
                }
                
                // Verwerk de bestelling
                alert('Bedankt voor je bestelling! Dit is een demo, dus er wordt geen echte betaling verwerkt.');
                
                // Update voorraad
                cart.forEach(item => {
                    const productIndex = products.findIndex(p => p.id === item.id);
                    if (productIndex !== -1 && products[productIndex].stock !== -1) {
                        products[productIndex].stock -= item.quantity;
                    }
                });
                
                // Sla bijgewerkte producten op
                localStorage.setItem('voiceguy_products', JSON.stringify(products));
                
                // Maak een nieuwe bestelling aan
                const orders = JSON.parse(localStorage.getItem('voiceguy_orders')) || [];
                const newOrder = {
                    id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
                    customer: 'Klant', // In een echte applicatie zou dit de ingelogde gebruiker zijn
                    date: new Date().toLocaleDateString('nl-NL'),
                    items: cart.reduce((total, item) => total + item.quantity, 0),
                    total: cart.reduce((total, item) => total + (item.price * item.quantity), 0),
                    status: 'pending'
                };
                
                orders.push(newOrder);
                localStorage.setItem('voiceguy_orders', JSON.stringify(orders));
                
                // Clear cart after checkout
                cart = [];
                saveCart(cart);
                updateCartDisplay();
            }
        });
    }

    // Function to save cart (using cookies if accepted, otherwise localStorage)
    function saveCart(cartData) {
        if (typeof isCookieAccepted === 'function' && isCookieAccepted('functional')) {
            saveCartToCookies(cartData);
        } else {
            localStorage.setItem('voiceguy_cart', JSON.stringify(cartData));
        }
    }
    
    // Function to get cart from cookies
    function getCartFromCookies() {
        if (typeof getCookie === 'function') {
            const cartCookie = getCookie('voiceguy_cart');
            if (cartCookie) {
                try {
                    return JSON.parse(cartCookie);
                } catch (e) {
                    console.error('Error parsing cart cookie:', e);
                    return [];
                }
            }
        }
        return [];
    }
    
    // Function to save cart to cookies
    function saveCartToCookies(cartData) {
        if (typeof setCookie === 'function') {
            setCookie('voiceguy_cart', JSON.stringify(cartData), 30); // Bewaar 30 dagen
        }
    }

    // Function to show notification
    function showNotification(message) {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.shop-notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'shop-notification';
            document.body.appendChild(notification);
        }
        
        // Set message and show notification
        notification.textContent = message;
        notification.classList.add('show');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Toggle cart visibility if cart toggle button exists
    const cartToggleButton = document.getElementById('cart-toggle');
    const cartSidebar = document.querySelector('.cart-sidebar');
    
    if (cartToggleButton && cartSidebar) {
        cartToggleButton.addEventListener('click', function() {
            cartSidebar.classList.toggle('open');
        });
    }
    
    // Voeg CSS toe voor de product details modal
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.8);
        }
        
        .modal-content {
            background-color: #1e1e1e;
            margin: 10% auto;
            padding: 0;
            width: 80%;
            max-width: 800px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            animation: modalFadeIn 0.3s;
        }
        
        @keyframes modalFadeIn {
            from {opacity: 0; transform: translateY(-50px);}
            to {opacity: 1; transform: translateY(0);}
        }
        
        .modal-header {
            padding: 15px 20px;
            background: linear-gradient(45deg, #ff33cc, #00ff99);
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 10px 10px 0 0;
        }
        
        .modal-header h2 {
            margin: 0;
            font-size: 24px;
        }
        
        .close-modal {
            color: white;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        
        .close-modal:hover {
            color: #ddd;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .product-details {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
        
        .product-image {
            flex: 1;
            min-width: 300px;
        }
        
        .product-image img {
            width: 100%;
            border-radius: 5px;
        }
        
        .product-info {
            flex: 1;
            min-width: 300px;
        }
        
        .product-price {
            font-size: 24px;
            font-weight: bold;
            color: #ff33cc;
            margin-bottom: 15px;
        }
        
        .product-description {
            color: #ddd;
            margin-bottom: 15px;
            line-height: 1.6;
        }
        
        .product-stock {
            color: #aaa;
            margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 5% auto;
            }
            
            .product-details {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(modalStyle);
});