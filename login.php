<?php
// Laad database configuratie en functies
require_once 'config/database.php';
require_once 'includes/functions.php';

// Initialiseer variabelen
$username = '';
$errors = [];
$redirect = '';

// Controleer of gebruiker al is ingelogd
if (isLoggedIn()) {
    // Redirect naar profiel pagina of admin dashboard
    if (isAdmin()) {
        header("Location: admin/dashboard.php");
    } else {
        header("Location: profile.php");
    }
    exit;
}

// Controleer of het formulier is verzonden
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Haal formuliergegevens op
    $username = trim($_POST['username']);
    $password = $_POST['password'];
    
    // Speciale check voor voiceguy account
    if ($username === 'voiceguy' && $password === 'voiceguy123') {
        // Sla de speciale login op in de sessie
        $_SESSION['user_id'] = 'special_voiceguy';
        $_SESSION['username'] = 'voiceguy';
        $_SESSION['role'] = 'special_admin';
        $_SESSION['logged_in'] = true;
        
        // Redirect naar homepage
        header("Location: index.html");
        exit;
    } else {
        // Normale login procedure
        $result = loginUser($username, $password);
        
        if ($result['success']) {
            // Redirect naar juiste pagina op basis van rol
            if ($result['user']['role'] === 'admin') {
                header("Location: admin/dashboard.php");
            } else {
                header("Location: profile.php");
            }
            exit;
        } else {
            $errors = $result['errors'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inloggen - VoiceGuy</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"> <!-- Font Awesome icons -->
</head>
<body class="auth-page">
    <!-- Header / Navbar -->
    <header>
        <nav class="navbar">
            <div class="logo">VoiceGuy</div>
            <div class="menu-toggle" id="mobile-menu">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="menu" id="menu">
                <a href="index.html">Home</a>
                <a href="profile.html">Profiel</a>
                <a href="live.html">Live Status</a>
                <a href="login.php" class="active">Inloggen</a>
                <a href="register.php">Registreren</a>
            </div>
        </nav>
    </header>

    <!-- Login Form -->
    <main class="content">
        <section class="form-container">
            <h1>Inloggen</h1>
            
            <?php if (!empty($errors)): ?>
                <div class="alert alert-error">
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
            
            <form action="login.php" method="POST" class="form">
                <div class="input-group">
                    <label for="username">Gebruikersnaam of E-mail</label>
                    <input type="text" id="username" name="username" placeholder="Voer je gebruikersnaam of e-mail in" value="<?php echo htmlspecialchars($username); ?>" required>
                    <i class="fas fa-user"></i>
                </div>
                <div class="input-group">
                    <label for="password">Wachtwoord</label>
                    <input type="password" id="password" name="password" placeholder="Voer je wachtwoord in" required>
                    <i class="fas fa-lock"></i>
                </div>
                <div class="input-group" style="text-align: right;">
                    <a href="forgot-password.php" style="color: #aaa; font-size: 14px; text-decoration: none;">Wachtwoord vergeten?</a>
                </div>
                <button type="submit" class="cta-button">Inloggen</button>
            </form>
            
            <div class="form-footer">
                Nog geen account? <a href="register.php">Registreer nu</a>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer>
        <div class="footer-container">
            <div class="footer-logo">
                <div class="logo">VoiceGuy</div>
                <p class="tagline">Gaming Community</p>
            </div>
            
            <div class="footer-links">
                <div class="footer-section">
                    <h3>Navigatie</h3>
                    <a href="index.html">Home</a>
                    <a href="profile.html">Profiel</a>
                    <a href="live.html">Live Status</a>
                </div>
                
                <div class="footer-section">
                    <h3>Account</h3>
                    <a href="login.php">Inloggen</a>
                    <a href="register.php">Registreren</a>
                </div>
                
                <div class="footer-section social-links">
                    <h3>Volg VoiceGuy</h3>
                    <div class="social-icons">
                        <a href="https://www.twitch.tv/voiceguy" target="_blank" class="social-icon twitch">
                            <i class="fab fa-twitch"></i>
                            <span>Twitch</span>
                        </a>
                        <a href="https://www.tiktok.com/@dutchvoiceimpressions" target="_blank" class="social-icon tiktok">
                            <i class="fab fa-tiktok"></i>
                            <span>TikTok</span>
                        </a>
                        <a href="https://www.youtube.com/c/voiceguy" target="_blank" class="social-icon youtube">
                            <i class="fab fa-youtube"></i>
                            <span>YouTube</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2025 VoiceGuy. Alle rechten voorbehouden.</p>
        </div>
    </footer>

    <script src="scripts.js"></script>
</body>
</html>