// Script om de footer bij te werken in alle HTML-bestanden
document.addEventListener('DOMContentLoaded', function() {
    // Functie om de footer bij te werken
    function updateFooter() {
        // Zoek de footer container
        const footerContainer = document.querySelector('.footer-container');
        const footerLinks = document.querySelector('.footer-links');
        
        if (!footerContainer || !footerLinks) return;
        
        // Voeg een compacte stijl toe aan de footer
        footerContainer.classList.add('compact-footer');
        
        // Reorganiseer de navigatie links
        const navSection = footerLinks.querySelector('.footer-section:first-child');
        const accountSection = footerLinks.querySelector('.footer-section:nth-child(2)');
        
        if (navSection && accountSection) {
            // Verplaats Profiel link naar Account sectie als deze in Navigatie staat
            const profileLink = navSection.querySelector('a[href="profile.html"]');
            if (profileLink) {
                navSection.removeChild(profileLink);
                accountSection.appendChild(profileLink);
            }
        }
        
        // Controleer of de Gaming Community sectie al bestaat
        const existingGamingSection = Array.from(footerLinks.querySelectorAll('.footer-section h3'))
            .find(h3 => h3.textContent === 'Gaming Community');
            
        if (!existingGamingSection) {
            // Zoek de sociale media sectie
            const socialSection = footerLinks.querySelector('.footer-section.social-links');
            
            if (socialSection) {
                // Maak de nieuwe Gaming Community sectie (compacte versie)
                const gamingSection = document.createElement('div');
                gamingSection.className = 'footer-section compact';
                gamingSection.innerHTML = `
                    <h3>Gaming Community</h3>
                    <p class="compact-text">VoiceGuy's inclusieve gaming community voor streams & events.</p>
                    <a href="chat.html">Join ons</a>
                `;
                
                // Voeg de nieuwe sectie toe voor de sociale media sectie
                footerLinks.insertBefore(gamingSection, socialSection);
            }
        } else {
            // Update bestaande Gaming Community sectie om deze compacter te maken
            const gamingSection = Array.from(footerLinks.querySelectorAll('.footer-section'))
                .find(section => section.querySelector('h3').textContent === 'Gaming Community');
            
            if (gamingSection) {
                gamingSection.classList.add('compact');
                
                // Update de inhoud om deze compacter te maken
                const paragraph = gamingSection.querySelector('p');
                if (paragraph) {
                    paragraph.className = 'compact-text';
                    paragraph.textContent = "VoiceGuy's inclusieve gaming community voor streams & events.";
                }
                
                // Update de link
                const link = gamingSection.querySelector('a');
                if (link && link.textContent.trim() !== 'Join ons') {
                    link.textContent = 'Join ons';
                }
            }
        }
        
        // Voeg CSS toe voor de compacte footer
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .compact-footer {
                padding: 1.5rem 0 !important;
            }
            .footer-section.compact {
                flex: 0 0 auto;
                margin-right: 2rem;
                max-width: 180px;
            }
            .footer-section h3 {
                margin-bottom: 0.5rem !important;
                font-size: 0.95rem !important;
            }
            .footer-section a, .footer-section p {
                font-size: 0.85rem !important;
                margin: 0.2rem 0 !important;
            }
            .compact-text {
                max-width: 180px;
                line-height: 1.3 !important;
            }
            .footer-links {
                flex-wrap: wrap;
                justify-content: space-between;
                row-gap: 1rem;
            }
            .footer-section {
                margin-bottom: 0 !important;
                margin-right: 1rem !important;
            }
            .social-icons {
                display: flex;
                gap: 0.5rem;
            }
            .social-icon {
                width: 32px !important;
                height: 32px !important;
            }
            .social-icon i {
                font-size: 16px !important;
            }
            .footer-bottom {
                padding: 12px !important;
                font-size: 12px !important;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Voer de functie uit
    updateFooter();
});