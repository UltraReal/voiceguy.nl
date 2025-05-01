// Site Instellingen
document.addEventListener('DOMContentLoaded', function() {
    // Default algemene instellingen
    const defaultGeneralSettings = {
        siteTitle: 'VoiceGuy - Gaming Community',
        siteDescription: 'De officiële website van VoiceGuy, waar je alle streams en content kunt volgen.',
        contactEmail: 'contact@voiceguy.nl',
        theme: 'dark',
        customColors: {
            primary: '#ff33cc',
            secondary: '#00ff99',
            background: '#121212'
        }
    };

    // Default weergave instellingen
    const defaultDisplaySettings = {
        showLiveNotification: true,
        showUpcomingEvents: true,
        showLatestContent: true,
        showFeaturedProducts: true,
        homepageLayout: 'standard',
        footerText: '&copy; 2025 VoiceGuy. Alle rechten voorbehouden.'
    };

    // Default geavanceerde instellingen
    const defaultAdvancedSettings = {
        cacheDuration: 60,
        maxItemsPerPage: 12,
        enableDebugMode: false
    };

    // Haal instellingen op uit localStorage of gebruik de standaardinstellingen
    const generalSettings = JSON.parse(localStorage.getItem('voiceguyGeneralSettings')) || defaultGeneralSettings;
    const displaySettings = JSON.parse(localStorage.getItem('voiceguyDisplaySettings')) || defaultDisplaySettings;
    const advancedSettings = JSON.parse(localStorage.getItem('voiceguyAdvancedSettings')) || defaultAdvancedSettings;

    // Pas instellingen toe op de website
    applySettings();

    // Functie om alle instellingen toe te passen
    function applySettings() {
        // Algemene instellingen
        applyGeneralSettings();
        
        // Weergave instellingen
        applyDisplaySettings();
        
        // Geavanceerde instellingen
        applyAdvancedSettings();
    }

    // Functie om algemene instellingen toe te passen
    function applyGeneralSettings() {
        // Pas titel en beschrijving toe
        document.title = generalSettings.siteTitle;
        
        // Pas thema toe
        const root = document.documentElement;
        
        if (generalSettings.theme === 'light') {
            root.style.setProperty('--background-color', '#f5f5f5');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--card-background', '#ffffff');
            root.style.setProperty('--primary-color', '#ff33cc');
            root.style.setProperty('--secondary-color', '#00ff99');
        } else if (generalSettings.theme === 'custom') {
            root.style.setProperty('--primary-color', generalSettings.customColors.primary);
            root.style.setProperty('--secondary-color', generalSettings.customColors.secondary);
            root.style.setProperty('--background-color', generalSettings.customColors.background);
        } else {
            // Donker thema (standaard)
            root.style.setProperty('--background-color', '#121212');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--card-background', '#1e1e1e');
            root.style.setProperty('--primary-color', '#ff33cc');
            root.style.setProperty('--secondary-color', '#00ff99');
        }
    }

    // Functie om weergave instellingen toe te passen
    function applyDisplaySettings() {
        // Pas footer tekst toe
        const footerBottomText = document.querySelector('.footer-bottom p');
        if (footerBottomText) {
            footerBottomText.innerHTML = displaySettings.footerText;
        }
        
        // Toon of verberg elementen
        const liveNotification = document.getElementById('live-notification');
        const upcomingEvents = document.querySelector('.upcoming-events');
        const latestContent = document.querySelector('.latest-content');
        const featuredProducts = document.querySelector('.featured-products');
        
        if (liveNotification) {
            liveNotification.style.display = displaySettings.showLiveNotification ? 'block' : 'none';
        }
        
        if (upcomingEvents) {
            upcomingEvents.style.display = displaySettings.showUpcomingEvents ? 'block' : 'none';
        }
        
        if (latestContent) {
            latestContent.style.display = displaySettings.showLatestContent ? 'block' : 'none';
        }
        
        if (featuredProducts) {
            featuredProducts.style.display = displaySettings.showFeaturedProducts ? 'block' : 'none';
        }
    }

    // Functie om geavanceerde instellingen toe te passen
    function applyAdvancedSettings() {
        // Debug modus
        if (advancedSettings.enableDebugMode) {
            console.log('Debug modus ingeschakeld');
            console.log('Algemene instellingen:', generalSettings);
            console.log('Weergave instellingen:', displaySettings);
            console.log('Geavanceerde instellingen:', advancedSettings);
        }
    }
});