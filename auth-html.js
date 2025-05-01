// Function to check if user is logged in
function checkLoginStatus() {
    // Check if user is logged in as voiceguy
    const isLoggedIn = localStorage.getItem('voiceguy_logged_in') === 'true';
    const username = localStorage.getItem('voiceguy_username');
    
    if (isLoggedIn && username === 'voiceguy') {
        // User is logged in as voiceguy, update navbar
        updateNavbarForLoggedInUser();
    }
}

// Function to update navbar for logged in user
function updateNavbarForLoggedInUser() {
    const menu = document.getElementById('menu');
    
    if (menu) {
        // Remove login and register links
        const loginLink = menu.querySelector('a[href="login.html"], a[href="login-html.html"]');
        const registerLink = menu.querySelector('a[href="register.html"]');
        
        if (loginLink) {
            loginLink.remove();
        }
        
        if (registerLink) {
            registerLink.remove();
        }
        
        // Add admin panel link
        const adminLink = document.createElement('a');
        adminLink.href = 'admin-dashboard.html';
        adminLink.textContent = 'Admin Panel';
        adminLink.classList.add('admin-link');
        
        // Add logout link
        const logoutLink = document.createElement('a');
        logoutLink.href = '#';
        logoutLink.textContent = 'Uitloggen';
        logoutLink.id = 'logout-link';
        
        // Add event listener to logout link
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear login info
            localStorage.removeItem('voiceguy_logged_in');
            localStorage.removeItem('voiceguy_username');
            
            // Reload the page
            window.location.reload();
        });
        
        // Add links to menu
        menu.appendChild(adminLink);
        menu.appendChild(logoutLink);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);