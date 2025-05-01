<?php
// Start sessie als deze nog niet is gestart
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Functie om gebruiker te registreren
function registerUser($username, $email, $password, $confirm_password) {
    global $conn;
    
    // Valideer input
    $errors = [];
    
    // Controleer of gebruikersnaam geldig is
    if (empty($username)) {
        $errors[] = "Gebruikersnaam is verplicht";
    } elseif (!preg_match('/^[a-zA-Z0-9_]{3,20}$/', $username)) {
        $errors[] = "Gebruikersnaam mag alleen letters, cijfers en underscores bevatten en moet tussen 3 en 20 tekens lang zijn";
    }
    
    // Controleer of e-mail geldig is
    if (empty($email)) {
        $errors[] = "E-mail is verplicht";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Ongeldig e-mailadres";
    }
    
    // Controleer of wachtwoord geldig is
    if (empty($password)) {
        $errors[] = "Wachtwoord is verplicht";
    } elseif (strlen($password) < 8) {
        $errors[] = "Wachtwoord moet minimaal 8 tekens lang zijn";
    }
    
    // Controleer of wachtwoorden overeenkomen
    if ($password !== $confirm_password) {
        $errors[] = "Wachtwoorden komen niet overeen";
    }
    
    // Als er fouten zijn, return deze
    if (!empty($errors)) {
        return ['success' => false, 'errors' => $errors];
    }
    
    // Controleer of gebruikersnaam of e-mail al bestaat
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        return ['success' => false, 'errors' => ["Gebruikersnaam of e-mail is al in gebruik"]];
    }
    
    // Hash het wachtwoord
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Voeg gebruiker toe aan database
    $stmt = $conn->prepare("INSERT INTO users (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashed_password);
    
    if ($stmt->execute()) {
        // Haal de user_id op van de nieuwe gebruiker
        $user_id = $conn->insert_id;
        
        // Maak een profiel aan voor de gebruiker
        $stmt = $conn->prepare("INSERT INTO profiles (user_id, display_name) VALUES (?, ?)");
        $stmt->bind_param("is", $user_id, $username);
        $stmt->execute();
        
        return ['success' => true, 'message' => "Account succesvol aangemaakt! Je kunt nu inloggen."];
    } else {
        return ['success' => false, 'errors' => ["Er is een fout opgetreden bij het aanmaken van je account. Probeer het later opnieuw."]];
    }
}

// Functie om gebruiker in te loggen
function loginUser($username, $password) {
    global $conn;
    
    // Valideer input
    $errors = [];
    
    if (empty($username)) {
        $errors[] = "Gebruikersnaam is verplicht";
    }
    
    if (empty($password)) {
        $errors[] = "Wachtwoord is verplicht";
    }
    
    // Als er fouten zijn, return deze
    if (!empty($errors)) {
        return ['success' => false, 'errors' => $errors];
    }
    
    // Zoek gebruiker in database
    $stmt = $conn->prepare("SELECT id, username, email, password, role FROM users WHERE username = ? OR email = ?");
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        
        // Verifieer wachtwoord
        if (password_verify($password, $user['password'])) {
            // Wachtwoord is correct, sla gebruikersgegevens op in sessie
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['logged_in'] = true;
            
            return ['success' => true, 'user' => $user];
        } else {
            return ['success' => false, 'errors' => ["Ongeldige gebruikersnaam of wachtwoord"]];
        }
    } else {
        return ['success' => false, 'errors' => ["Ongeldige gebruikersnaam of wachtwoord"]];
    }
}

// Functie om te controleren of gebruiker is ingelogd
function isLoggedIn() {
    return isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;
}

// Functie om te controleren of gebruiker een admin is
function isAdmin() {
    return isLoggedIn() && isset($_SESSION['role']) && $_SESSION['role'] === 'admin';
}

// Functie om gebruiker uit te loggen
function logoutUser() {
    // Verwijder alle sessievariabelen
    $_SESSION = [];
    
    // Vernietig de sessie
    session_destroy();
    
    // Redirect naar homepage
    header("Location: index.html");
    exit;
}

// Functie om gebruikersprofiel op te halen
function getUserProfile($user_id) {
    global $conn;
    
    $stmt = $conn->prepare("
        SELECT u.id, u.username, u.email, u.role, p.* 
        FROM users u 
        LEFT JOIN profiles p ON u.id = p.user_id 
        WHERE u.id = ?
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        return $result->fetch_assoc();
    } else {
        return null;
    }
}

// Functie om gebruikersprofiel bij te werken
function updateUserProfile($user_id, $data) {
    global $conn;
    
    // Update profiles tabel
    $stmt = $conn->prepare("
        UPDATE profiles 
        SET display_name = ?, bio = ?, social_twitch = ?, social_tiktok = ?, social_youtube = ? 
        WHERE user_id = ?
    ");
    $stmt->bind_param("sssssi", 
        $data['display_name'], 
        $data['bio'], 
        $data['social_twitch'], 
        $data['social_tiktok'], 
        $data['social_youtube'], 
        $user_id
    );
    
    return $stmt->execute();
}

// Functie om een instelling op te halen
function getSetting($setting_name) {
    global $conn;
    
    $stmt = $conn->prepare("SELECT setting_value FROM settings WHERE setting_name = ?");
    $stmt->bind_param("s", $setting_name);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 1) {
        $row = $result->fetch_assoc();
        return $row['setting_value'];
    } else {
        return null;
    }
}

// Functie om een instelling bij te werken
function updateSetting($setting_name, $setting_value) {
    global $conn;
    
    $stmt = $conn->prepare("
        INSERT INTO settings (setting_name, setting_value) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE setting_value = ?
    ");
    $stmt->bind_param("sss", $setting_name, $setting_value, $setting_value);
    
    return $stmt->execute();
}

// Functie om alle gebruikers op te halen (voor admin)
function getAllUsers() {
    global $conn;
    
    $stmt = $conn->prepare("
        SELECT u.id, u.username, u.email, u.role, u.created_at, p.display_name 
        FROM users u 
        LEFT JOIN profiles p ON u.id = p.user_id 
        ORDER BY u.id
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    
    $users = [];
    while ($row = $result->fetch_assoc()) {
        $users[] = $row;
    }
    
    return $users;
}

// Functie om een gebruiker te verwijderen (voor admin)
function deleteUser($user_id) {
    global $conn;
    
    // Controleer of het niet de laatste admin is
    $stmt = $conn->prepare("SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin'");
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $admin_count = $row['admin_count'];
    
    // Controleer of de te verwijderen gebruiker een admin is
    $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    // Als dit de laatste admin is, sta verwijdering niet toe
    if ($user['role'] === 'admin' && $admin_count <= 1) {
        return ['success' => false, 'message' => "Kan de laatste admin niet verwijderen"];
    }
    
    // Verwijder de gebruiker
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
    $stmt->bind_param("i", $user_id);
    
    if ($stmt->execute()) {
        return ['success' => true, 'message' => "Gebruiker succesvol verwijderd"];
    } else {
        return ['success' => false, 'message' => "Fout bij verwijderen gebruiker"];
    }
}

// Functie om gebruikersrol te wijzigen (voor admin)
function updateUserRole($user_id, $new_role) {
    global $conn;
    
    // Controleer of het niet de laatste admin is
    if ($new_role !== 'admin') {
        $stmt = $conn->prepare("SELECT COUNT(*) as admin_count FROM users WHERE role = 'admin'");
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $admin_count = $row['admin_count'];
        
        // Controleer of de te wijzigen gebruiker een admin is
        $stmt = $conn->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        
        // Als dit de laatste admin is, sta wijziging niet toe
        if ($user['role'] === 'admin' && $admin_count <= 1) {
            return ['success' => false, 'message' => "Kan de rol van de laatste admin niet wijzigen"];
        }
    }
    
    // Update de gebruikersrol
    $stmt = $conn->prepare("UPDATE users SET role = ? WHERE id = ?");
    $stmt->bind_param("si", $new_role, $user_id);
    
    if ($stmt->execute()) {
        return ['success' => true, 'message' => "Gebruikersrol succesvol bijgewerkt"];
    } else {
        return ['success' => false, 'message' => "Fout bij bijwerken gebruikersrol"];
    }
}
?>