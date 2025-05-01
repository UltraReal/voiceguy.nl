// Sociale Media functionaliteit
document.addEventListener('DOMContentLoaded', function() {
    // Haal sociale media accounts op uit localStorage
    const socialAccounts = JSON.parse(localStorage.getItem('voiceguySocialAccounts')) || [];
    
    // Update sociale media links in de footer
    updateSocialLinks();
    
    // Functie om sociale media links in de footer bij te werken
    function updateSocialLinks() {
        const footerSocialLinks = document.querySelector('.footer-section.social-links .social-icons');
        
        if (!footerSocialLinks) return;
        
        // Leeg huidige links
        footerSocialLinks.innerHTML = '';
        
        // Als er geen sociale media accounts zijn, gebruik de standaardaccounts
        if (socialAccounts.length === 0) {
            // Standaard sociale media accounts
            const defaultAccounts = [
                {
                    platform: 'twitch',
                    username: 'voiceguy',
                    url: 'https://www.twitch.tv/voiceguy',
                    status: 'active'
                },
                {
                    platform: 'tiktok',
                    username: 'dutchvoiceimpressions',
                    url: 'https://www.tiktok.com/@dutchvoiceimpressions',
                    status: 'active'
                },
                {
                    platform: 'youtube',
                    username: 'voiceguy',
                    url: 'https://www.youtube.com/c/voiceguy',
                    status: 'active'
                }
            ];
            
            // Voeg standaard sociale media accounts toe
            defaultAccounts.forEach(account => {
                const link = document.createElement('a');
                link.href = account.url;
                link.target = '_blank';
                link.className = `social-icon ${account.platform}`;
                
                link.innerHTML = `
                    <i class="fab fa-${account.platform}"></i>
                    <span>${getPlatformName(account.platform)}</span>
                `;
                
                footerSocialLinks.appendChild(link);
            });
        } else {
            // Voeg actieve sociale media accounts toe
            const activeAccounts = socialAccounts.filter(account => account.status === 'active');
            
            activeAccounts.forEach(account => {
                const link = document.createElement('a');
                link.href = account.url;
                link.target = '_blank';
                link.className = `social-icon ${account.platform}`;
                
                link.innerHTML = `
                    <i class="fab fa-${account.platform}"></i>
                    <span>${getPlatformName(account.platform)}</span>
                `;
                
                footerSocialLinks.appendChild(link);
            });
        }
    }
    
    // Helper functie om platformnaam te krijgen
    function getPlatformName(platform) {
        switch (platform) {
            case 'twitch':
                return 'Twitch';
            case 'tiktok':
                return 'TikTok';
            case 'youtube':
                return 'YouTube';
            case 'instagram':
                return 'Instagram';
            case 'twitter':
                return 'Twitter';
            case 'facebook':
                return 'Facebook';
            case 'discord':
                return 'Discord';
            default:
                return platform.charAt(0).toUpperCase() + platform.slice(1);
        }
    }
});