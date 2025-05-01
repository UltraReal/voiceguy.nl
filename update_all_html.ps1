# PowerShell script om update_footer.js toe te voegen aan alle HTML-bestanden

# Haal alle HTML-bestanden op
$htmlFiles = Get-ChildItem -Path "." -Filter "*.html"

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Controleer of het script al is toegevoegd
    if ($content -notmatch '<script src="update_footer.js"></script>') {
        # Zoek de positie waar we het script moeten toevoegen (voor de sluitende body tag)
        if ($content -match '</body>') {
            # Voeg het script toe voor de sluitende body tag
            $updatedContent = $content -replace '</body>', '<script src="update_footer.js"></script>
</body>'
            
            # Schrijf de bijgewerkte inhoud terug naar het bestand
            Set-Content -Path $file.FullName -Value $updatedContent
            
            Write-Host "Script toegevoegd aan $($file.Name)"
        } else {
            Write-Host "Geen </body> tag gevonden in $($file.Name)"
        }
    } else {
        Write-Host "Script is al toegevoegd aan $($file.Name)"
    }
}

Write-Host "Klaar met het bijwerken van alle HTML-bestanden."