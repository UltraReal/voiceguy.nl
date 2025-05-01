<?php
// Database configuratie
$db_host = "localhost";
$db_user = "root";  // Standaard XAMPP gebruikersnaam
$db_pass = "";      // Standaard XAMPP wachtwoord is leeg
$db_name = "voiceguy_db";

// Maak verbinding met de database
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Controleer verbinding
if ($conn->connect_error) {
    die("Database verbinding mislukt: " . $conn->connect_error);
}

// Stel karakterset in
$conn->set_charset("utf8mb4");
?>