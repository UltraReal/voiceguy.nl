// Cookie consent en cookie management functies
document.addEventListener('DOMContentLoaded', function() {
    // Cookie consent banner tonen als er nog geen keuze is gemaakt
    if (!getCookie('cookie_consent')) {
        showCookieConsent();
    }

    // Event listeners voor cookie consent knoppen
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'accept-cookies') {
            acceptAllCookies();
        } else if (e.target && e.target.id === 'reject-cookies') {
            rejectNonEssentialCookies();
        } else if (e.target && e.target.id === 'customize-cookies') {
            showCookieSettings();
        }
    });
});

// Cookie consent banner tonen
function showCookieConsent() {
    // Maak de cookie consent banner aan als deze nog niet bestaat
    if (!document.getElementById('cookie-consent')) {
        const cookieConsent = document.createElement('div');
        cookieConsent.id = 'cookie-consent';
        cookieConsent.className = 'cookie-consent';
        cookieConsent.innerHTML = `
            <div class="cookie-content">
                <div class="cookie-header">
                    <h3>Cookie Instellingen</h3>
                    <i class="fas fa-cookie-bite"></i>
                </div>
                <p>Wij gebruiken cookies om je winkelervaring te verbeteren, je winkelwagen te onthouden en de website beter te laten functioneren. 
                Je kunt kiezen welke cookies je wilt accepteren. Essentiële cookies zijn altijd noodzakelijk voor het functioneren van de website.</p>
                <div class="cookie-links">
                    <a href="privacy.html" target="_blank">Privacybeleid</a>
                    <a href="terms.html" target="_blank">Gebruiksvoorwaarden</a>
                </div>
                <div class="cookie-buttons">
                    <button id="customize-cookies" class="cookie-btn customize">Aanpassen</button>
                    <button id="reject-cookies" class="cookie-btn reject">Alleen Essentiële Cookies</button>
                    <button id="accept-cookies" class="cookie-btn accept">Alle Cookies Accepteren</button>
                </div>
            </div>
        `;
        document.body.appendChild(cookieConsent);

        // Toon de banner met een animatie
        setTimeout(() => {
            cookieConsent.classList.add('show');
        }, 300);
    }
}

// Cookie instellingen modal tonen
function showCookieSettings() {
    // Verberg de cookie consent banner
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.classList.remove('show');
    }

    // Maak de cookie settings modal aan als deze nog niet bestaat
    if (!document.getElementById('cookie-settings')) {
        const cookieSettings = document.createElement('div');
        cookieSettings.id = 'cookie-settings';
        cookieSettings.className = 'cookie-settings';
        cookieSettings.innerHTML = `
            <div class="cookie-settings-content">
                <div class="cookie-settings-header">
                    <h3>Cookie Voorkeuren</h3>
                    <button id="close-cookie-settings" class="close-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="cookie-settings-body">
                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <h4>Essentiële Cookies</h4>
                            <label class="switch">
                                <input type="checkbox" id="essential-cookies" checked disabled>
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <p>Deze cookies zijn noodzakelijk voor het functioneren van de website en kunnen niet worden uitgeschakeld.</p>
                    </div>
                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <h4>Functionele Cookies</h4>
                            <label class="switch">
                                <input type="checkbox" id="functional-cookies">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <p>Deze cookies onthouden je voorkeuren en instellingen om je gebruikservaring te verbeteren.</p>
                    </div>
                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <h4>Analytische Cookies</h4>
                            <label class="switch">
                                <input type="checkbox" id="analytics-cookies">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <p>Deze cookies verzamelen anonieme informatie over hoe je de website gebruikt, zodat we de website kunnen verbeteren.</p>
                    </div>
                    <div class="cookie-option">
                        <div class="cookie-option-header">
                            <h4>Marketing Cookies</h4>
                            <label class="switch">
                                <input type="checkbox" id="marketing-cookies">
                                <span class="slider round"></span>
                            </label>
                        </div>
                        <p>Deze cookies worden gebruikt om advertenties relevanter te maken en je interesses te volgen.</p>
                    </div>
                </div>
                <div class="cookie-settings-footer">
                    <button id="save-cookie-settings" class="cookie-btn save">Voorkeuren Opslaan</button>
                </div>
            </div>
        `;
        document.body.appendChild(cookieSettings);

        // Toon de modal met een animatie
        setTimeout(() => {
            cookieSettings.classList.add('show');
        }, 300);

        // Event listeners voor de cookie settings modal
        document.getElementById('close-cookie-settings').addEventListener('click', function() {
            closeCookieSettings();
            showCookieConsent();
        });

        document.getElementById('save-cookie-settings').addEventListener('click', function() {
            saveCookieSettings();
        });
    }
}

// Cookie instellingen opslaan
function saveCookieSettings() {
    const functionalCookies = document.getElementById('functional-cookies').checked;
    const analyticsCookies = document.getElementById('analytics-cookies').checked;
    const marketingCookies = document.getElementById('marketing-cookies').checked;

    // Sla de cookie voorkeuren op
    setCookie('cookie_consent', 'custom', 365);
    setCookie('functional_cookies', functionalCookies ? 'true' : 'false', 365);
    setCookie('analytics_cookies', analyticsCookies ? 'true' : 'false', 365);
    setCookie('marketing_cookies', marketingCookies ? 'true' : 'false', 365);

    // Sluit de cookie settings modal
    closeCookieSettings();

    // Toon een bevestiging
    showCookieConfirmation('Je cookie voorkeuren zijn opgeslagen!');
}

// Cookie settings modal sluiten
function closeCookieSettings() {
    const cookieSettings = document.getElementById('cookie-settings');
    if (cookieSettings) {
        cookieSettings.classList.remove('show');
        setTimeout(() => {
            cookieSettings.remove();
        }, 300);
    }
}

// Alle cookies accepteren
function acceptAllCookies() {
    setCookie('cookie_consent', 'accepted', 365);
    setCookie('functional_cookies', 'true', 365);
    setCookie('analytics_cookies', 'true', 365);
    setCookie('marketing_cookies', 'true', 365);

    // Verberg de cookie consent banner
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.classList.remove('show');
        setTimeout(() => {
            cookieConsent.remove();
        }, 300);
    }

    // Toon een bevestiging
    showCookieConfirmation('Alle cookies zijn geaccepteerd!');
}

// Alleen essentiële cookies accepteren
function rejectNonEssentialCookies() {
    setCookie('cookie_consent', 'rejected', 365);
    setCookie('functional_cookies', 'false', 365);
    setCookie('analytics_cookies', 'false', 365);
    setCookie('marketing_cookies', 'false', 365);

    // Verberg de cookie consent banner
    const cookieConsent = document.getElementById('cookie-consent');
    if (cookieConsent) {
        cookieConsent.classList.remove('show');
        setTimeout(() => {
            cookieConsent.remove();
        }, 300);
    }

    // Toon een bevestiging
    showCookieConfirmation('Alleen essentiële cookies zijn geaccepteerd!');
}

// Bevestiging tonen na het opslaan van cookie voorkeuren
function showCookieConfirmation(message) {
    const confirmation = document.createElement('div');
    confirmation.className = 'cookie-confirmation';
    confirmation.innerHTML = `
        <div class="cookie-confirmation-content">
            <i class="fas fa-check-circle"></i>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(confirmation);

    // Toon de bevestiging met een animatie
    setTimeout(() => {
        confirmation.classList.add('show');
    }, 100);

    // Verberg de bevestiging na 3 seconden
    setTimeout(() => {
        confirmation.classList.remove('show');
        setTimeout(() => {
            confirmation.remove();
        }, 300);
    }, 3000);
}

// Cookie functies
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/; SameSite=Lax';
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999; path=/';
}

// Controleer of een bepaald type cookie is geaccepteerd
function isCookieAccepted(type) {
    const consent = getCookie('cookie_consent');
    
    // Als er geen consent is, dan zijn alleen essentiële cookies toegestaan
    if (!consent) return type === 'essential';
    
    // Als alle cookies zijn geaccepteerd
    if (consent === 'accepted') return true;
    
    // Als alleen essentiële cookies zijn geaccepteerd
    if (consent === 'rejected') return type === 'essential';
    
    // Als er aangepaste voorkeuren zijn
    if (consent === 'custom') {
        if (type === 'essential') return true;
        if (type === 'functional') return getCookie('functional_cookies') === 'true';
        if (type === 'analytics') return getCookie('analytics_cookies') === 'true';
        if (type === 'marketing') return getCookie('marketing_cookies') === 'true';
    }
    
    return false;
}

// Winkelwagen functies met cookie ondersteuning
function saveCartToCookies(cart) {
    if (isCookieAccepted('functional')) {
        setCookie('voiceguy_cart', JSON.stringify(cart), 30);
    }
}

function getCartFromCookies() {
    if (isCookieAccepted('functional')) {
        const cartCookie = getCookie('voiceguy_cart');
        return cartCookie ? JSON.parse(cartCookie) : [];
    }
    return [];
}

// Functie om gebruikersvoorkeuren op te slaan
function saveUserPreferences(preferences) {
    if (isCookieAccepted('functional')) {
        setCookie('user_preferences', JSON.stringify(preferences), 365);
    }
}

function getUserPreferences() {
    if (isCookieAccepted('functional')) {
        const prefCookie = getCookie('user_preferences');
        return prefCookie ? JSON.parse(prefCookie) : {};
    }
    return {};
}