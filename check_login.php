<?php
// Start session if not already started
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Set header to return JSON
header('Content-Type: application/json');

// Check if user is logged in
if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true) {
    // User is logged in, return user info
    echo json_encode([
        'logged_in' => true,
        'username' => $_SESSION['username'],
        'role' => $_SESSION['role'] ?? 'user'
    ]);
} else {
    // User is not logged in
    echo json_encode([
        'logged_in' => false
    ]);
}
?>