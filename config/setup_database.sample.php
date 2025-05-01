<?php
// Database configuratie
$db_host = "localhost";
$db_user = "your_username";  // Vervang dit met je database gebruikersnaam
$db_pass = "your_password";  // Vervang dit met je database wachtwoord

// Maak verbinding met MySQL (zonder database selectie)
$conn = new mysqli($db_host, $db_user, $db_pass);

// Controleer verbinding
if ($conn->connect_error) {
    die("Database verbinding mislukt: " . $conn->connect_error);
}

// Maak database aan als deze nog niet bestaat
$db_name = "your_database";
$sql = "CREATE DATABASE IF NOT EXISTS $db_name";

if ($conn->query($sql) === TRUE) {
    echo "Database '$db_name' succesvol aangemaakt of bestaat al.<br>";
} else {
    die("Fout bij aanmaken database: " . $conn->error);
}

// Selecteer de database
$conn->select_db($db_name);

// Maak users tabel aan
$sql = "CREATE TABLE IF NOT EXISTS users (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Tabel 'users' succesvol aangemaakt.<br>";
} else {
    echo "Fout bij aanmaken tabel 'users': " . $conn->error . "<br>";
}

// Maak profiles tabel aan
$sql = "CREATE TABLE IF NOT EXISTS profiles (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT(11) UNSIGNED NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar VARCHAR(255),
    social_twitch VARCHAR(100),
    social_tiktok VARCHAR(100),
    social_youtube VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
)";

if ($conn->query($sql) === TRUE) {
    echo "Tabel 'profiles' succesvol aangemaakt.<br>";
} else {
    echo "Fout bij aanmaken tabel 'profiles': " . $conn->error . "<br>";
}

// Maak settings tabel aan
$sql = "CREATE TABLE IF NOT EXISTS settings (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_name VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Tabel 'settings' succesvol aangemaakt.<br>";
} else {
    echo "Fout bij aanmaken tabel 'settings': " . $conn->error . "<br>";
}

// Voeg een standaard admin account toe als deze nog niet bestaat
$admin_username = "admin";
$admin_email = "admin@example.com";
$admin_password = password_hash("change_this_password", PASSWORD_DEFAULT); // Verander dit wachtwoord!

// Controleer of admin account al bestaat
$stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->bind_param("ss", $admin_username, $admin_email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    // Admin account bestaat nog niet, voeg toe
    $stmt = $conn->prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'admin')");
    $stmt->bind_param("sss", $admin_username, $admin_email, $admin_password);
    
    if ($stmt->execute()) {
        echo "Admin account succesvol aangemaakt.<br>";
        
        // Haal de user_id op van de nieuwe admin
        $admin_id = $conn->insert_id;
        
        // Maak een profiel aan voor de admin
        $stmt = $conn->prepare("INSERT INTO profiles (user_id, display_name) VALUES (?, 'Administrator')");
        $stmt->bind_param("i", $admin_id);
        $stmt->execute();
    } else {
        echo "Fout bij aanmaken admin account: " . $stmt->error . "<br>";
    }
} else {
    echo "Admin account bestaat al.<br>";
}

// Voeg standaard instellingen toe
$settings = [
    ["tiktok_username", "your_tiktok"],
    ["twitch_username", "your_twitch"],
    ["youtube_channel", "your_youtube"],
    ["site_title", "Your Site Title"],
    ["site_description", "Your site description goes here."]
];

foreach ($settings as $setting) {
    $stmt = $conn->prepare("INSERT IGNORE INTO settings (setting_name, setting_value) VALUES (?, ?)");
    $stmt->bind_param("ss", $setting[0], $setting[1]);
    $stmt->execute();
}

echo "Standaard instellingen toegevoegd.<br>";
echo "Database setup voltooid!";

// Sluit de verbinding
$conn->close();
?>