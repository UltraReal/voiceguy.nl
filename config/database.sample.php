<?php
// Database configuratie
$db_host = "localhost";
$db_user = "your_username";  // Vul hier je database gebruikersnaam in
$db_pass = "your_password";  // Vul hier je database wachtwoord in
$db_name = "your_database";

// Maak verbinding met de database
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Controleer verbinding
if ($conn->connect_error) {
    die("Database verbinding mislukt: " . $conn->connect_error);
}

// Stel karakterset in
$conn->set_charset("utf8mb4");
?>