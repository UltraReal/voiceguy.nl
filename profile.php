<?php
// Laad database configuratie en functies
require_once 'config/database.php';
require_once 'includes/functions.php';

// Controleer of gebruiker is ingelogd
if (!isLoggedIn()) {
    header("Location: login.php");
    exit;
}

// Haal gebruikersprofiel op
$user_id = $_SESSION['user_id'];
$profile = getUserProfile($user_id);

// Initialiseer variabelen
$success_message = '';
$errors = [];

// Controleer of het formulier is verzonden
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Haal formuliergegevens op
    $display_name = trim($_POST['display_name']);
    $bio = trim($_POST['bio']);
    $social_twitch = trim($_POST['social_twitch']);
    $social_tiktok = trim($_POST['social_tiktok']);
    $social_youtube = trim($_POST['social_youtube']);
    
    // Valideer input
    if (empty($display_name)) {
        $errors[] = "Weergavenaam is verplicht";
    }
    
    // Als er geen fouten zijn, update het profiel
    if (empty($errors)) {
        $data = [
            'display_name' => $display_name,
            'bio' => $bio,
            'social_twitch' => $social_twitch,
            'social_tiktok' => $social_tiktok,
            'social_youtube' => $social_youtube
        ];
        
        if (updateUserProfile($user_id, $data)) {
            $success_message = "Profiel succesvol bijgewerkt!";
            // Haal het bijgewerkte profiel op
            $profile = getUserProfile($user_id);
        } else {
            $errors[] = "Er is een fout opgetreden bij het bijwerken van je profiel";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mijn Profiel - VoiceGuy</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"> <!-- Font Awesome icons -->
</head>
<body>
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
                <a href="profile.php" class="active">Profiel</a>
                <a href="live.html">Live Status</a>
                <?php if (isAdmin()): ?>
                    <a href="admin/dashboard.php">Admin</a>
                <?php endif; ?>
                <a href="logout.php">Uitloggen</a>
            </div>
        </nav>
    </header>

    <!-- Profile Content -->
    <main class="content">
        <section class="profile-container">
            <h1>Mijn Profiel</h1>
            
            <?php if (!empty($success_message)): ?>
                <div class="alert alert-success">
                    <?php echo htmlspecialchars($success_message); ?>
                </div>
            <?php endif; ?>
            
            <?php if (!empty($errors)): ?>
                <div class="alert alert-error">
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
            
            <div class="profile-content">
                <div class="profile-sidebar">
                    <div class="profile-avatar">
                        <img src="<?php echo !empty($profile['avatar']) ? htmlspecialchars($profile['avatar']) : 'images/default-avatar.png'; ?>" alt="Profielfoto">
                        <button class="change-avatar-btn">Wijzig Foto</button>
                    </div>
                    
                    <div class="profile-info">
                        <h2><?php echo htmlspecialchars($profile['display_name']); ?></h2>
                        <p class="username">@<?php echo htmlspecialchars($profile['username']); ?></p>
                        <?php if (isAdmin()): ?>
                            <span class="admin-badge">Admin</span>
                        <?php endif; ?>
                    </div>
                    
                    <div class="profile-social">
                        <?php if (!empty($profile['social_twitch'])): ?>
                            <a href="https://www.twitch.tv/<?php echo htmlspecialchars($profile['social_twitch']); ?>" target="_blank" class="social-link twitch">
                                <i class="fab fa-twitch"></i> <?php echo htmlspecialchars($profile['social_twitch']); ?>
                            </a>
                        <?php endif; ?>
                        
                        <?php if (!empty($profile['social_tiktok'])): ?>
                            <a href="https://www.tiktok.com/@<?php echo htmlspecialchars($profile['social_tiktok']); ?>" target="_blank" class="social-link tiktok">
                                <i class="fab fa-tiktok"></i> <?php echo htmlspecialchars($profile['social_tiktok']); ?>
                            </a>
                        <?php endif; ?>
                        
                        <?php if (!empty($profile['social_youtube'])): ?>
                            <a href="https://www.youtube.com/c/<?php echo htmlspecialchars($profile['social_youtube']); ?>" target="_blank" class="social-link youtube">
                                <i class="fab fa-youtube"></i> <?php echo htmlspecialchars($profile['social_youtube']); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="profile-main">
                    <div class="profile-tabs">
                        <button class="tab-btn active" data-tab="edit-profile">Profiel Bewerken</button>
                        <button class="tab-btn" data-tab="account-settings">Account Instellingen</button>
                    </div>
                    
                    <div class="tab-content active" id="edit-profile">
                        <form action="profile.php" method="POST" class="profile-form">
                            <div class="input-group">
                                <label for="display_name">Weergavenaam</label>
                                <input type="text" id="display_name" name="display_name" value="<?php echo htmlspecialchars($profile['display_name']); ?>" required>
                            </div>
                            
                            <div class="input-group">
                                <label for="bio">Bio</label>
                                <textarea id="bio" name="bio" rows="4"><?php echo htmlspecialchars($profile['bio']); ?></textarea>
                            </div>
                            
                            <div class="input-group">
                                <label for="social_twitch">Twitch Gebruikersnaam</label>
                                <input type="text" id="social_twitch" name="social_twitch" value="<?php echo htmlspecialchars($profile['social_twitch']); ?>">
                            </div>
                            
                            <div class="input-group">
                                <label for="social_tiktok">TikTok Gebruikersnaam</label>
                                <input type="text" id="social_tiktok" name="social_tiktok" value="<?php echo htmlspecialchars($profile['social_tiktok']); ?>">
                            </div>
                            
                            <div class="input-group">
                                <label for="social_youtube">YouTube Kanaal</label>
                                <input type="text" id="social_youtube" name="social_youtube" value="<?php echo htmlspecialchars($profile['social_youtube']); ?>">
                            </div>
                            
                            <button type="submit" class="cta-button">Profiel Opslaan</button>
                        </form>
                    </div>
                    
                    <div class="tab-content" id="account-settings">
                        <h3>Account Instellingen</h3>
                        
                        <div class="account-info">
                            <p><strong>Gebruikersnaam:</strong> <?php echo htmlspecialchars($profile['username']); ?></p>
                            <p><strong>E-mail:</strong> <?php echo htmlspecialchars($profile['email']); ?></p>
                            <p><strong>Account aangemaakt:</strong> <?php echo date('d-m-Y', strtotime($profile['created_at'])); ?></p>
                        </div>
                        
                        <div class="account-actions">
                            <a href="change-password.php" class="btn btn-secondary">Wachtwoord Wijzigen</a>
                            <button class="btn btn-danger" id="delete-account-btn">Account Verwijderen</button>
                        </div>
                    </div>
                </div>
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
                    <a href="profile.php">Profiel</a>
                    <a href="live.html">Live Status</a>
                </div>
                
                <div class="footer-section">
                    <h3>Account</h3>
                    <a href="logout.php">Uitloggen</a>
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
    <script>
        // Tab switching functionality
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and content
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding content
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Delete account confirmation
        document.getElementById('delete-account-btn').addEventListener('click', function() {
            if (confirm('Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.')) {
                window.location.href = 'delete-account.php';
            }
        });
    </script>
</body>
</html>