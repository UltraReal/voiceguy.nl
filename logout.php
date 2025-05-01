<?php
// Start sessie als deze nog niet is gestart
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if this is the special voiceguy account
if (isset($_SESSION['user_id']) && $_SESSION['user_id'] === 'special_voiceguy') {
    // Verwijder alle sessievariabelen
    $_SESSION = [];
    
    // Vernietig de sessie
    session_destroy();
    
    // Redirect naar homepage
    header("Location: index.html");
    exit;
} else {
    // Laad functies voor normale gebruikers
    require_once 'includes/functions.php';
    
    // Log de gebruiker uit
    logoutUser();
}
?>