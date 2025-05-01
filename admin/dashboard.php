<?php
// Start sessie als deze nog niet is gestart
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Controleer of het de speciale voiceguy login is
$isSpecialVoiceGuy = false;
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true && 
    isset($_SESSION['username']) && $_SESSION['username'] === 'voiceguy' && 
    isset($_SESSION['role']) && $_SESSION['role'] === 'special_admin') {
    $isSpecialVoiceGuy = true;
} else {
    // Normale admin check via database
    require_once '../config/database.php';
    require_once '../includes/functions.php';
    
    // Controleer of gebruiker is ingelogd en admin is
    if (!isLoggedIn() || !isAdmin()) {
        header("Location: ../login.php");
        exit;
    }
}

// Haal alle gebruikers op als het geen speciale voiceguy login is
if (!$isSpecialVoiceGuy) {
    $users = getAllUsers();
    
    // Haal instellingen op
    $tiktok_username = getSetting('tiktok_username');
    $twitch_username = getSetting('twitch_username');
    $youtube_channel = getSetting('youtube_channel');
    $site_title = getSetting('site_title');
    $site_description = getSetting('site_description');
} else {
    // Voor speciale voiceguy login, stel standaardwaarden in
    $users = [];
    $tiktok_username = 'dutchvoiceimpressions';
    $twitch_username = 'voiceguy';
    $youtube_channel = 'voiceguy';
    $site_title = 'VoiceGuy Gaming Community';
    $site_description = 'De officiële website van VoiceGuy';
}

// Initialiseer variabelen
$success_message = '';
$errors = [];

// Controleer of het instellingen formulier is verzonden
if (isset($_POST['update_settings'])) {
    // Haal formuliergegevens op
    $new_tiktok_username = trim($_POST['tiktok_username']);
    $new_twitch_username = trim($_POST['twitch_username']);
    $new_youtube_channel = trim($_POST['youtube_channel']);
    $new_site_title = trim($_POST['site_title']);
    $new_site_description = trim($_POST['site_description']);
    
    // Update instellingen
    updateSetting('tiktok_username', $new_tiktok_username);
    updateSetting('twitch_username', $new_twitch_username);
    updateSetting('youtube_channel', $new_youtube_channel);
    updateSetting('site_title', $new_site_title);
    updateSetting('site_description', $new_site_description);
    
    // Update lokale variabelen
    $tiktok_username = $new_tiktok_username;
    $twitch_username = $new_twitch_username;
    $youtube_channel = $new_youtube_channel;
    $site_title = $new_site_title;
    $site_description = $new_site_description;
    
    $success_message = "Instellingen succesvol bijgewerkt!";
}

// Controleer of een gebruikersactie is uitgevoerd
if (isset($_GET['action']) && isset($_GET['user_id'])) {
    $action = $_GET['action'];
    $user_id = (int)$_GET['user_id'];
    
    if ($action === 'delete') {
        // Verwijder gebruiker
        $result = deleteUser($user_id);
        if ($result['success']) {
            $success_message = $result['message'];
            // Haal bijgewerkte gebruikerslijst op
            $users = getAllUsers();
        } else {
            $errors[] = $result['message'];
        }
    } elseif ($action === 'make_admin' || $action === 'remove_admin') {
        // Wijzig gebruikersrol
        $new_role = ($action === 'make_admin') ? 'admin' : 'user';
        $result = updateUserRole($user_id, $new_role);
        if ($result['success']) {
            $success_message = $result['message'];
            // Haal bijgewerkte gebruikerslijst op
            $users = getAllUsers();
        } else {
            $errors[] = $result['message'];
        }
    }
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - VoiceGuy</title>
    <link rel="stylesheet" href="../styles.css">
    <link rel="stylesheet" href="admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"> <!-- Font Awesome icons -->
</head>
<body class="admin-page">
    <!-- Header / Navbar -->
    <header>
        <nav class="navbar">
            <div class="logo">VoiceGuy Admin</div>
            <div class="menu-toggle" id="mobile-menu">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="menu" id="menu">
                <a href="../index.html">Website</a>
                <a href="../profile.php">Mijn Profiel</a>
                <a href="dashboard.php" class="active">Dashboard</a>
                <a href="../logout.php">Uitloggen</a>
            </div>
        </nav>
    </header>

    <!-- Admin Dashboard Content -->
    <main class="admin-content">
        <div class="admin-sidebar">
            <div class="admin-user">
                <div class="admin-avatar">
                    <img src="../images/default-avatar.png" alt="Admin Avatar">
                </div>
                <div class="admin-info">
                    <h3><?php echo htmlspecialchars($_SESSION['username']); ?></h3>
                    <span class="admin-role">Administrator</span>
                </div>
            </div>
            
            <nav class="admin-nav">
                <a href="#dashboard" class="admin-nav-item active" data-section="dashboard">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a href="#users" class="admin-nav-item" data-section="users">
                    <i class="fas fa-users"></i> Gebruikers
                </a>
                <a href="#settings" class="admin-nav-item" data-section="settings">
                    <i class="fas fa-cog"></i> Instellingen
                </a>
                <a href="#live-status" class="admin-nav-item" data-section="live-status">
                    <i class="fas fa-broadcast-tower"></i> Live Status
                </a>
            </nav>
        </div>
        
        <div class="admin-main">
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
            
            <section id="dashboard" class="admin-section active">
                <h1>Dashboard</h1>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Gebruikers</h3>
                            <p class="stat-value"><?php echo count($users); ?></p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Admins</h3>
                            <p class="stat-value">
                                <?php 
                                    $admin_count = 0;
                                    foreach ($users as $user) {
                                        if ($user['role'] === 'admin') $admin_count++;
                                    }
                                    echo $admin_count;
                                ?>
                            </p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-calendar-alt"></i>
                        </div>
                        <div class="stat-info">
                            <h3>Datum</h3>
                            <p class="stat-value"><?php echo date('d-m-Y'); ?></p>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-actions">
                    <div class="action-card">
                        <h3>Snelle Acties</h3>
                        <div class="action-buttons">
                            <a href="#users" class="btn btn-primary action-btn" data-section="users">
                                <i class="fas fa-users"></i> Gebruikers Beheren
                            </a>
                            <a href="#settings" class="btn btn-primary action-btn" data-section="settings">
                                <i class="fas fa-cog"></i> Instellingen Wijzigen
                            </a>
                            <a href="#live-status" class="btn btn-primary action-btn" data-section="live-status">
                                <i class="fas fa-broadcast-tower"></i> Live Status Beheren
                            </a>
                            <a href="../index.html" class="btn btn-secondary action-btn">
                                <i class="fas fa-home"></i> Naar Website
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            
            <section id="users" class="admin-section">
                <h1>Gebruikers Beheren</h1>
                
                <div class="users-table-container">
                    <table class="users-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Gebruikersnaam</th>
                                <th>E-mail</th>
                                <th>Weergavenaam</th>
                                <th>Rol</th>
                                <th>Aangemaakt</th>
                                <th>Acties</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($users as $user): ?>
                                <tr>
                                    <td><?php echo $user['id']; ?></td>
                                    <td><?php echo htmlspecialchars($user['username']); ?></td>
                                    <td><?php echo htmlspecialchars($user['email']); ?></td>
                                    <td><?php echo htmlspecialchars($user['display_name']); ?></td>
                                    <td>
                                        <span class="role-badge <?php echo $user['role']; ?>">
                                            <?php echo $user['role'] === 'admin' ? 'Admin' : 'Gebruiker'; ?>
                                        </span>
                                    </td>
                                    <td><?php echo date('d-m-Y', strtotime($user['created_at'])); ?></td>
                                    <td class="actions">
                                        <?php if ($user['role'] === 'admin'): ?>
                                            <?php if ($user['id'] != $_SESSION['user_id']): ?>
                                                <a href="dashboard.php?action=remove_admin&user_id=<?php echo $user['id']; ?>" class="action-link" title="Verwijder admin rechten">
                                                    <i class="fas fa-user"></i>
                                                </a>
                                            <?php endif; ?>
                                        <?php else: ?>
                                            <a href="dashboard.php?action=make_admin&user_id=<?php echo $user['id']; ?>" class="action-link" title="Maak admin">
                                                <i class="fas fa-user-shield"></i>
                                            </a>
                                        <?php endif; ?>
                                        
                                        <?php if ($user['id'] != $_SESSION['user_id']): ?>
                                            <a href="dashboard.php?action=delete&user_id=<?php echo $user['id']; ?>" class="action-link delete" title="Verwijder gebruiker" onclick="return confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?');">
                                                <i class="fas fa-trash-alt"></i>
                                            </a>
                                        <?php endif; ?>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </section>
            
            <section id="settings" class="admin-section">
                <h1>Website Instellingen</h1>
                
                <form action="dashboard.php" method="POST" class="settings-form">
                    <div class="settings-group">
                        <h3>Algemene Instellingen</h3>
                        
                        <div class="input-group">
                            <label for="site_title">Website Titel</label>
                            <input type="text" id="site_title" name="site_title" value="<?php echo htmlspecialchars($site_title); ?>">
                        </div>
                        
                        <div class="input-group">
                            <label for="site_description">Website Beschrijving</label>
                            <textarea id="site_description" name="site_description" rows="3"><?php echo htmlspecialchars($site_description); ?></textarea>
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Sociale Media</h3>
                        
                        <div class="input-group">
                            <label for="tiktok_username">TikTok Gebruikersnaam</label>
                            <input type="text" id="tiktok_username" name="tiktok_username" value="<?php echo htmlspecialchars($tiktok_username); ?>">
                        </div>
                        
                        <div class="input-group">
                            <label for="twitch_username">Twitch Gebruikersnaam</label>
                            <input type="text" id="twitch_username" name="twitch_username" value="<?php echo htmlspecialchars($twitch_username); ?>">
                        </div>
                        
                        <div class="input-group">
                            <label for="youtube_channel">YouTube Kanaal</label>
                            <input type="text" id="youtube_channel" name="youtube_channel" value="<?php echo htmlspecialchars($youtube_channel); ?>">
                        </div>
                    </div>
                    
                    <button type="submit" name="update_settings" class="btn btn-primary">Instellingen Opslaan</button>
                </form>
            </section>
            
            <section id="live-status" class="admin-section">
                <h1>Live Status Beheren</h1>
                
                <div class="live-status-controls">
                    <div class="status-card">
                        <h3>TikTok Live Status</h3>
                        <p>Stel handmatig in of je live bent op TikTok.</p>
                        
                        <div class="status-toggle">
                            <button id="tiktok-live-toggle" class="toggle-btn">
                                <span class="toggle-slider"></span>
                                <span class="toggle-text">Offline</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="status-card">
                        <h3>Twitch Live Status</h3>
                        <p>Stel handmatig in of je live bent op Twitch.</p>
                        
                        <div class="status-toggle">
                            <button id="twitch-live-toggle" class="toggle-btn">
                                <span class="toggle-slider"></span>
                                <span class="toggle-text">Offline</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="live-embed-preview">
                    <h3>Live Embed Voorbeeld</h3>
                    <div id="live-embed-container" class="embed-container">
                        <p class="embed-placeholder">Ga live om de embed te zien</p>
                    </div>
                </div>
            </section>
        </div>
    </main>

    <script src="../scripts.js"></script>
    <script>
        // Admin navigation
        document.querySelectorAll('.admin-nav-item, .action-btn').forEach(item => {
            item.addEventListener('click', function(e) {
                if (this.classList.contains('action-btn') && !this.dataset.section) {
                    return; // Skip if it's an external link
                }
                
                e.preventDefault();
                
                // Get section ID
                const sectionId = this.dataset.section;
                
                // Remove active class from all nav items and sections
                document.querySelectorAll('.admin-nav-item').forEach(navItem => {
                    navItem.classList.remove('active');
                });
                document.querySelectorAll('.admin-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                // Add active class to clicked nav item and corresponding section
                document.querySelector(`.admin-nav-item[data-section="${sectionId}"]`).classList.add('active');
                document.getElementById(sectionId).classList.add('active');
            });
        });
        
        // Live status toggles
        document.getElementById('tiktok-live-toggle').addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            this.querySelector('.toggle-text').textContent = isActive ? 'Live' : 'Offline';
            
            // Set manual override in localStorage
            localStorage.setItem('manualLiveOverride', JSON.stringify({
                isLive: isActive,
                timestamp: Date.now(),
                platform: 'tiktok'
            }));
            
            updateLiveEmbed();
        });
        
        document.getElementById('twitch-live-toggle').addEventListener('click', function() {
            this.classList.toggle('active');
            const isActive = this.classList.contains('active');
            this.querySelector('.toggle-text').textContent = isActive ? 'Live' : 'Offline';
            
            // Set manual override in localStorage
            localStorage.setItem('twitchLiveOverride', JSON.stringify({
                isLive: isActive,
                timestamp: Date.now()
            }));
            
            updateLiveEmbed();
        });
        
        // Update live embed preview
        function updateLiveEmbed() {
            const tiktokLive = document.getElementById('tiktok-live-toggle').classList.contains('active');
            const twitchLive = document.getElementById('twitch-live-toggle').classList.contains('active');
            const embedContainer = document.getElementById('live-embed-container');
            
            if (tiktokLive) {
                embedContainer.innerHTML = `
                    <div class="tiktok-embed-preview">
                        <div class="embed-header">
                            <i class="fab fa-tiktok"></i>
                            <span>TikTok Live</span>
                        </div>
                        <div class="embed-content">
                            <p><strong>@<?php echo htmlspecialchars($tiktok_username); ?></strong> is nu live!</p>
                            <div class="embed-placeholder">TikTok Live Embed</div>
                        </div>
                    </div>
                `;
            } else if (twitchLive) {
                embedContainer.innerHTML = `
                    <div class="twitch-embed-preview">
                        <div class="embed-header">
                            <i class="fab fa-twitch"></i>
                            <span>Twitch Live</span>
                        </div>
                        <div class="embed-content">
                            <p><strong><?php echo htmlspecialchars($twitch_username); ?></strong> is nu live!</p>
                            <div class="embed-placeholder">Twitch Live Embed</div>
                        </div>
                    </div>
                `;
            } else {
                embedContainer.innerHTML = `<p class="embed-placeholder">Ga live om de embed te zien</p>`;
            }
        }
        
        // Initialize live status toggles from localStorage
        window.addEventListener('load', function() {
            // Check TikTok status
            const tiktokStatus = localStorage.getItem('manualLiveOverride');
            if (tiktokStatus) {
                const status = JSON.parse(tiktokStatus);
                const isRecent = (Date.now() - status.timestamp) < 3600000; // 1 hour
                
                if (isRecent && status.isLive) {
                    document.getElementById('tiktok-live-toggle').classList.add('active');
                    document.getElementById('tiktok-live-toggle').querySelector('.toggle-text').textContent = 'Live';
                }
            }
            
            // Check Twitch status
            const twitchStatus = localStorage.getItem('twitchLiveOverride');
            if (twitchStatus) {
                const status = JSON.parse(twitchStatus);
                const isRecent = (Date.now() - status.timestamp) < 3600000; // 1 hour
                
                if (isRecent && status.isLive) {
                    document.getElementById('twitch-live-toggle').classList.add('active');
                    document.getElementById('twitch-live-toggle').querySelector('.toggle-text').textContent = 'Live';
                }
            }
            
            // Update embed preview
            updateLiveEmbed();
        });
    </script>
</body>
</html>