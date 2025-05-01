// Function to check if user is logged in
function checkLoginStatus() {
    // Check if there's a session cookie
    const cookies = document.cookie.split(';');
    let sessionExists = false;
    
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Check for PHP session cookie
        if (cookie.indexOf('PHPSESSID=') === 0) {
            sessionExists = true;
            break;
        }
    }
    
    if (sessionExists) {
        // Make an AJAX request to check login status
        fetch('check_login.php')
            .then(response => response.json())
            .then(data => {
                if (data.logged_in) {
                    // User is logged in
                    updateNavbarForLoggedInUser(data.username, data.role);
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    }
}

// Function to update navbar for logged in user
function updateNavbarForLoggedInUser(username, role) {
    const menu = document.getElementById('menu');
    
    if (menu) {
        // Remove login and register links
        const loginLink = menu.querySelector('a[href="login.html"], a[href="login.php"]');
        const registerLink = menu.querySelector('a[href="register.html"], a[href="register.php"]');
        
        if (loginLink) {
            loginLink.remove();
        }
        
        if (registerLink) {
            registerLink.remove();
        }
        
        // Add user-specific links
        const profileLink = document.createElement('a');
        profileLink.href = 'profile.php';
        profileLink.textContent = username;
        profileLink.classList.add('user-profile-link');
        menu.appendChild(profileLink);
        
        // Add logout link
        const logoutLink = document.createElement('a');
        logoutLink.href = 'logout.php';
        logoutLink.textContent = 'Uitloggen';
        menu.appendChild(logoutLink);
        
        // Add admin panel link if user is admin
        if (role === 'admin' || role === 'special_admin') {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin/dashboard.php';
            adminLink.textContent = 'Admin Panel';
            adminLink.classList.add('admin-link');
            
            // Insert before logout link
            menu.insertBefore(adminLink, logoutLink);
        }
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);