// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menu = document.getElementById('menu');
    const navbar = document.querySelector('.navbar');
    
    if (mobileMenu && menu) {
        mobileMenu.addEventListener('click', function() {
            menu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (menu && !menu.contains(event.target) && !mobileMenu.contains(event.target) && menu.classList.contains('active')) {
            menu.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
    
    // Add active class to current page link
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide navbar when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
});

// Function to check if VoiceGuy is live on TikTok
async function checkLiveStatus() {
    const liveStatusElement = document.getElementById('live-status');
    const tiktokEmbedContainer = document.getElementById('tiktok-embed-container');
    const refreshButton = document.getElementById('refresh-status');
    
    if (!liveStatusElement) return;
    
    // Set to checking state
    liveStatusElement.className = 'live-status-message checking';
    liveStatusElement.innerHTML = `
        <div class="live-indicator">
            <i class="fas fa-spinner fa-spin"></i>
            Status controleren...
        </div>
        <p>Even geduld terwijl we controleren of VoiceGuy live is...</p>
    `;
    
    if (refreshButton) {
        refreshButton.classList.add('loading');
        refreshButton.disabled = true;
    }
    
    try {
        const tiktokUsername = 'dutchvoiceimpressions';
        
        // Probeer de live status te controleren door de TikTok embed te laden
        // en te kijken of deze correct wordt weergegeven
        const isLive = await checkTikTokLiveStatus(tiktokUsername);
        
        if (isLive) {
            // VoiceGuy is live op TikTok
            liveStatusElement.className = 'live-status-message live';
            liveStatusElement.innerHTML = `
                <div class="live-indicator online">
                    <i class="fas fa-broadcast-tower"></i>
                    LIVE NU
                </div>
                <p><strong>VoiceGuy is nu live op TikTok!</strong></p>
                <p>Bekijk de stream nu en mis niets van de actie!</p>
            `;
            
            // Laad de TikTok embed als de streamer live is
            if (tiktokEmbedContainer) {
                tiktokEmbedContainer.innerHTML = `
                    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@${tiktokUsername}/live" data-embed-type="live" style="max-width: 605px; min-width: 325px;">
                        <section>
                            <a target="_blank" title="@${tiktokUsername}" href="https://www.tiktok.com/@${tiktokUsername}?refer=embed">@${tiktokUsername}</a>
                        </section>
                    </blockquote>
                    <script async src="https://www.tiktok.com/embed.js"></script>
                `;
                
                // Toon de embed container
                setTimeout(() => {
                    tiktokEmbedContainer.classList.add('active');
                }, 500);
            }
            
            // Sla de live status op in localStorage met een timestamp
            localStorage.setItem('tiktokLiveStatus', JSON.stringify({
                isLive: true,
                timestamp: Date.now(),
                username: tiktokUsername
            }));
        } else {
            // VoiceGuy is offline
            liveStatusElement.className = 'live-status-message offline';
            liveStatusElement.innerHTML = `
                <div class="live-indicator offline">
                    <i class="fas fa-power-off"></i>
                    OFFLINE
                </div>
                <p>VoiceGuy is momenteel niet live op TikTok.</p>
                <p>Volg op sociale media om notificaties te krijgen wanneer de stream begint!</p>
            `;
            
            // Verberg de embed container als de streamer offline is
            if (tiktokEmbedContainer) {
                tiktokEmbedContainer.classList.remove('active');
                // Wacht op de animatie voordat we de inhoud verwijderen
                setTimeout(() => {
                    tiktokEmbedContainer.innerHTML = '';
                }, 500);
            }
            
            // Sla de offline status op in localStorage met een timestamp
            localStorage.setItem('tiktokLiveStatus', JSON.stringify({
                isLive: false,
                timestamp: Date.now(),
                username: tiktokUsername
            }));
        }
    } catch (error) {
        console.error('Error fetching live status:', error);
        
        // Toon een foutmelding
        liveStatusElement.className = 'live-status-message offline';
        liveStatusElement.innerHTML = `
            <div class="live-indicator offline">
                <i class="fas fa-exclamation-triangle"></i>
                FOUT
            </div>
            <p>Er is een fout opgetreden bij het controleren van de live status.</p>
            <p>Probeer het later opnieuw of bezoek direct de TikTok pagina.</p>
        `;
    } finally {
        // Reset de refresh knop
        if (refreshButton) {
            refreshButton.classList.remove('loading');
            refreshButton.disabled = false;
        }
    }
}

// Functie om te controleren of een TikTok gebruiker live is
async function checkTikTokLiveStatus(username) {
    return new Promise((resolve) => {
        // Maak een verborgen iframe om de TikTok live pagina te laden
        const testFrame = document.createElement('iframe');
        testFrame.style.display = 'none';
        testFrame.src = `https://www.tiktok.com/@${username}/live`;
        document.body.appendChild(testFrame);
        
        // Stel een timeout in om te controleren of de pagina correct is geladen
        let timeoutId = setTimeout(() => {
            cleanup();
            // Als we hier komen, is de timeout verlopen zonder dat we een resultaat hebben
            // We gaan ervan uit dat de gebruiker niet live is
            resolve(false);
        }, 5000);
        
        // Functie om op te ruimen
        function cleanup() {
            clearTimeout(timeoutId);
            if (testFrame && testFrame.parentNode) {
                testFrame.parentNode.removeChild(testFrame);
            }
        }
        
        // Luister naar berichten van het iframe
        testFrame.onload = function() {
            try {
                // Probeer de inhoud van het iframe te controleren
                // Als de gebruiker live is, zou de pagina moeten laden zonder redirect
                // Als de gebruiker niet live is, wordt meestal doorverwezen naar het profiel
                
                // We kunnen niet direct de inhoud van het iframe bekijken vanwege CORS-beperkingen
                // Maar we kunnen controleren of de URL is veranderd
                
                setTimeout(() => {
                    try {
                        // Als we de URL kunnen lezen en deze bevat nog steeds '/live', 
                        // dan is de gebruiker waarschijnlijk live
                        const currentUrl = testFrame.contentWindow.location.href;
                        const isLive = currentUrl.includes('/live');
                        
                        cleanup();
                        resolve(isLive);
                    } catch (e) {
                        // CORS-fout bij het lezen van de URL
                        // We kunnen de URL niet lezen, dus we controleren op een andere manier
                        
                        // Controleer of er een localStorage item is met recente live status
                        const storedStatus = localStorage.getItem('tiktokLiveStatus');
                        if (storedStatus) {
                            const status = JSON.parse(storedStatus);
                            const isRecent = (Date.now() - status.timestamp) < 300000; // 5 minuten
                            
                            if (isRecent && status.username === username) {
                                cleanup();
                                resolve(status.isLive);
                                return;
                            }
                        }
                        
                        // Als laatste redmiddel, controleer of de gebruiker recent live is geweest
                        // via een alternatieve methode
                        checkTikTokLiveStatusAlternative(username).then(isLive => {
                            cleanup();
                            resolve(isLive);
                        });
                    }
                }, 3000);
            } catch (error) {
                console.error('Error in iframe onload:', error);
                cleanup();
                resolve(false);
            }
        };
    });
}

// Alternatieve methode om TikTok live status te controleren
async function checkTikTokLiveStatusAlternative(username) {
    try {
        // Controleer of er een handmatige override is ingesteld
        const manualOverride = localStorage.getItem('manualLiveOverride');
        if (manualOverride) {
            const override = JSON.parse(manualOverride);
            const isRecent = (Date.now() - override.timestamp) < 3600000; // 1 uur
            
            if (isRecent) {
                return override.isLive;
            }
        }
        
        // Als er geen override is of deze is verlopen, controleer de TikTok pagina
        // Dit is een eenvoudige controle die kijkt of de TikTok live embed kan worden geladen
        
        // Maak een test element om de embed te laden
        const testElement = document.createElement('div');
        testElement.style.display = 'none';
        testElement.innerHTML = `
            <blockquote class="tiktok-embed" cite="https://www.tiktok.com/@${username}/live" data-embed-type="live">
                <section></section>
            </blockquote>
        `;
        document.body.appendChild(testElement);
        
        // Laad het TikTok embed script
        const script = document.createElement('script');
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
        
        // Wacht even om het script de kans te geven om te laden
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Controleer of er een iframe is gemaakt in de embed
        // Als er een iframe is, is de gebruiker waarschijnlijk live
        const iframe = testElement.querySelector('iframe');
        const isLive = !!iframe;
        
        // Ruim op
        if (testElement.parentNode) {
            testElement.parentNode.removeChild(testElement);
        }
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
        
        return isLive;
    } catch (error) {
        console.error('Error in alternative TikTok live check:', error);
        return false;
    }
}

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Call the live status function when the page loads
window.addEventListener('load', function() {
    // Check live status when the page loads
    checkLiveStatus();
    
    // Add event listener for refresh button
    const refreshButton = document.getElementById('refresh-status');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            checkLiveStatus();
        });
    }
    
    // Setup admin controls
    setupAdminControls();
    
    // Auto refresh every 5 minutes (300000 ms)
    setInterval(checkLiveStatus, 300000);
});

// Setup admin controls for manual override
function setupAdminControls() {
    const adminControls = document.getElementById('admin-controls');
    const toggleLiveButton = document.getElementById('toggle-live');
    
    if (!adminControls || !toggleLiveButton) return;
    
    // Controleer of de gebruiker een beheerder is (via een geheim patroon)
    let clickCount = 0;
    let lastClickTime = 0;
    
    document.addEventListener('keydown', function(event) {
        // Geheim patroon: Druk 3 keer snel op de 'A' toets
        if (event.key.toLowerCase() === 'a') {
            const now = new Date().getTime();
            
            if (now - lastClickTime < 500) {
                clickCount++;
            } else {
                clickCount = 1;
            }
            
            lastClickTime = now;
            
            if (clickCount >= 3) {
                // Toon admin controls
                adminControls.classList.add('visible');
                clickCount = 0;
            }
        }
    });
    
    // Toggle live status button
    toggleLiveButton.addEventListener('click', function() {
        // Controleer de huidige status
        const currentStatus = localStorage.getItem('manualLiveOverride');
        let isCurrentlyLive = false;
        
        if (currentStatus) {
            const status = JSON.parse(currentStatus);
            isCurrentlyLive = status.isLive;
        }
        
        // Toggle de status
        const newStatus = !isCurrentlyLive;
        
        // Sla de nieuwe status op
        localStorage.setItem('manualLiveOverride', JSON.stringify({
            isLive: newStatus,
            timestamp: Date.now()
        }));
        
        // Update de button
        if (newStatus) {
            toggleLiveButton.classList.add('active');
            toggleLiveButton.querySelector('span').textContent = 'Live status: AAN';
        } else {
            toggleLiveButton.classList.remove('active');
            toggleLiveButton.querySelector('span').textContent = 'Live status: UIT';
        }
        
        // Ververs de status
        checkLiveStatus();
    });
    
    // Initialiseer de button status
    const storedStatus = localStorage.getItem('manualLiveOverride');
    if (storedStatus) {
        const status = JSON.parse(storedStatus);
        const isRecent = (Date.now() - status.timestamp) < 3600000; // 1 uur
        
        if (isRecent && status.isLive) {
            toggleLiveButton.classList.add('active');
            toggleLiveButton.querySelector('span').textContent = 'Live status: AAN';
        }
    }
}
