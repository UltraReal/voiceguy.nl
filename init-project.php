<?php
// Script om het project te initialiseren na het klonen van GitHub

// Controleer of de configuratiebestanden al bestaan
$database_config_exists = file_exists(__DIR__ . '/config/database.php');
$setup_database_exists = file_exists(__DIR__ . '/config/setup_database.php');

// HTML output
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Initialisatie</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .step {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .complete {
            border-left: 5px solid green;
        }
        .pending {
            border-left: 5px solid orange;
        }
        .error {
            border-left: 5px solid red;
        }
        code {
            background: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
        }
        pre {
            background: #f4f4f4;
            padding: 10px;
            border-radius: 5px;
            overflow-x: auto;
        }
        .btn {
            display: inline-block;
            padding: 8px 16px;
            background: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            border: none;
            cursor: pointer;
        }
        .btn:hover {
            background: #45a049;
        }
    </style>
</head>
<body>
    <h1>VoiceGuy Website - Project Initialisatie</h1>
    
    <div class="step <?php echo $database_config_exists ? 'complete' : 'pending'; ?>">
        <h2>Stap 1: Database Configuratie</h2>
        <?php if ($database_config_exists): ?>
            <p>✅ Het bestand <code>config/database.php</code> bestaat al.</p>
        <?php else: ?>
            <p>⚠️ Het bestand <code>config/database.php</code> bestaat nog niet.</p>
            <p>Kopieer het voorbeeldbestand en pas het aan met je database gegevens:</p>
            <pre>cp config/database.sample.php config/database.php</pre>
            <p>Open daarna <code>config/database.php</code> en vul je database gegevens in.</p>
        <?php endif; ?>
    </div>
    
    <div class="step <?php echo $setup_database_exists ? 'complete' : 'pending'; ?>">
        <h2>Stap 2: Database Setup Script</h2>
        <?php if ($setup_database_exists): ?>
            <p>✅ Het bestand <code>config/setup_database.php</code> bestaat al.</p>
        <?php else: ?>
            <p>⚠️ Het bestand <code>config/setup_database.php</code> bestaat nog niet.</p>
            <p>Kopieer het voorbeeldbestand en pas het aan met je database gegevens:</p>
            <pre>cp config/setup_database.sample.php config/setup_database.php</pre>
            <p>Open daarna <code>config/setup_database.php</code> en vul je database gegevens in.</p>
        <?php endif; ?>
    </div>
    
    <div class="step <?php echo ($database_config_exists && $setup_database_exists) ? 'pending' : 'error'; ?>">
        <h2>Stap 3: Database Initialiseren</h2>
        <?php if ($database_config_exists && $setup_database_exists): ?>
            <p>Je kunt nu de database initialiseren door naar het setup script te gaan:</p>
            <p><a href="config/setup_database.php" class="btn">Database Initialiseren</a></p>
            <p><strong>Let op:</strong> Dit zal de database structuur aanmaken en een standaard admin account toevoegen.</p>
        <?php else: ?>
            <p>⚠️ Je moet eerst stap 1 en 2 voltooien voordat je de database kunt initialiseren.</p>
        <?php endif; ?>
    </div>
    
    <div class="step">
        <h2>Stap 4: Inloggen</h2>
        <p>Nadat je de database hebt geïnitialiseerd, kun je inloggen met de standaard admin gegevens:</p>
        <ul>
            <li>Gebruikersnaam: <code>admin</code></li>
            <li>Wachtwoord: <code>change_this_password</code> (of wat je hebt ingesteld in setup_database.php)</li>
        </ul>
        <p><strong>Belangrijk:</strong> Verander direct het standaard wachtwoord na je eerste login!</p>
        <p><a href="login.html" class="btn">Naar Login Pagina</a></p>
    </div>
    
    <div class="step">
        <h2>Volgende Stappen</h2>
        <p>Nadat je het project hebt geïnitialiseerd:</p>
        <ol>
            <li>Pas de site-instellingen aan in het admin dashboard</li>
            <li>Voeg content toe aan je website</li>
            <li>Pas de styling aan indien nodig</li>
        </ol>
    </div>
    
    <footer>
        <p>Voor meer informatie, zie de <a href="README.md">README.md</a> en <a href="INSTALLATION.md">INSTALLATION.md</a> bestanden.</p>
    </footer>
</body>
</html>