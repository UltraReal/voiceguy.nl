<?php
// Laad database configuratie en functies
require_once 'config/database.php';
require_once 'includes/functions.php';

// Initialiseer variabelen
$username = $email = '';
$errors = [];
$success_message = '';

// Controleer of het formulier is verzonden
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Haal formuliergegevens op
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = $_POST['password'];
    $confirm_password = $_POST['confirm-password'];
    
    // Registreer de gebruiker
    $result = registerUser($username, $email, $password, $confirm_password);
    
    if ($result['success']) {
        $success_message = $result['message'];
        // Reset formuliervelden na succesvolle registratie
        $username = $email = '';
    } else {
        $errors = $result['errors'];
    }
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registreren - VoiceGuy</title>
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
                <a href="login.php">Inloggen</a>
                <a href="register.php" class="active">Registreren</a>
            </div>
        </nav>
    </header>

    <!-- Register Form -->
    <main class="content">
        <section class="form-container">
            <h1>Registreren</h1>
            
            <?php if (!empty($errors)): ?>
                <div class="alert alert-error">
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($success_message)): ?>
                <div class="alert alert-success">
                    <?php echo htmlspecialchars($success_message); ?>
                    <p>Je wordt doorgestuurd naar de inlogpagina...</p>
                    <script>
                        setTimeout(function() {
                            window.location.href = 'login.php';
                        }, 3000);
                    </script>
                </div>
            <?php else: ?>
                <form action="register.php" method="POST" class="form">
                    <div class="input-group">
                        <label for="username">Gebruikersnaam</label>
                        <input type="text" id="username" name="username" placeholder="Kies een gebruikersnaam" value="<?php echo htmlspecialchars($username); ?>" required>
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="input-group">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="Voer je e-mailadres in" value="<?php echo htmlspecialchars($email); ?>" required>
                        <i class="fas fa-envelope"></i>
                    </div>
                    <div class="input-group">
                        <label for="password">Wachtwoord</label>
                        <input type="password" id="password" name="password" placeholder="Kies een sterk wachtwoord" required>
                        <i class="fas fa-lock"></i>
                    </div>
                    <div class="input-group">
                        <label for="confirm-password">Bevestig Wachtwoord</label>
                        <input type="password" id="confirm-password" name="confirm-password" placeholder="Bevestig je wachtwoord" required>
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <button type="submit" class="cta-button">Account Aanmaken</button>
                </form>
            <?php endif; ?>
            
            <div class="form-footer">
                Heb je al een account? <a href="login.php">Log hier in</a>
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