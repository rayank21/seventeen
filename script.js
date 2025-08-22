// Animation au scroll
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu latéral
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const sidebarMenu = document.getElementById('sidebar-menu');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    // Fonction pour ouvrir le menu latéral
    function openSidebar() {
        sidebarMenu.classList.add('active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Fonction pour fermer le menu latéral
    function closeSidebarMenu() {
        sidebarMenu.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Event listeners pour le menu latéral
    hamburgerMenu.addEventListener('click', openSidebar);
    closeSidebar.addEventListener('click', closeSidebarMenu);
    sidebarOverlay.addEventListener('click', closeSidebarMenu);

    // Fermer le menu avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebarMenu();
        }
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', closeSidebarMenu);
    });

    // Indicateur d'ouverture/fermeture en temps réel
    function updateOpeningStatus() {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay(); // 0 = Dimanche, 1 = Lundi, etc.
        
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        const statusDot = document.getElementById('status-dot');
        
        // Horaires : Lundi au Dimanche 19h00 - 1h00
        let isOpen = false;
        
        if (currentDay >= 1 && currentDay <= 7) { // Lundi au Dimanche
            if (currentHour >= 19 || currentHour < 1) {
                isOpen = true;
            }
        }
        
        if (isOpen) {
            statusIndicator.classList.add('open');
            statusText.textContent = 'OUVERT';
        } else {
            statusIndicator.classList.remove('open');
            statusText.textContent = 'FERMÉ';
        }
    }

    // Mettre à jour le statut toutes les minutes
    updateOpeningStatus();
    setInterval(updateOpeningStatus, 60000);

    // Bouton retour en haut
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    function toggleScrollToTop() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Event listeners pour le bouton retour en haut
    window.addEventListener('scroll', toggleScrollToTop);
    scrollToTopBtn.addEventListener('click', scrollToTop);

    // Animations de scroll améliorées
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '-50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observer tous les éléments avec animation
    document.querySelectorAll('.menu-section, .jour, .plate, .menu-item, .starter, .avis-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Cache intelligent - Service Worker pour le cache
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }

    // Optimisation mobile - Détection du type d'appareil
    function isMobile() {
        return window.innerWidth <= 768;
    }

    // Ajuster les animations sur mobile
    if (isMobile()) {
        document.querySelectorAll('.menu-section, .jour, .plate, .menu-item, .starter, .avis-card').forEach(el => {
            el.style.animationDelay = '0s';
        });
    }

    // Smooth scroll amélioré
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Performance - Lazy loading des images (si ajoutées plus tard)
    function lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    // Initialiser le lazy loading
    lazyLoadImages();

    // Amélioration de l'accessibilité
    document.addEventListener('keydown', (e) => {
        // Navigation au clavier pour le menu latéral
        if (e.key === 'Tab' && sidebarMenu.classList.contains('active')) {
            const focusableElements = sidebarMenu.querySelectorAll('a, button, input, textarea, select');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Optimisation des performances - Debounce pour le scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Appliquer le debounce au scroll
    const debouncedToggleScrollToTop = debounce(toggleScrollToTop, 10);
    window.addEventListener('scroll', debouncedToggleScrollToTop);

    // Animation des éléments au scroll (améliorée)
    document.querySelectorAll('.menu-section, .jour, .plate, .menu-item, .starter').forEach(el => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Délai pour éviter les conflits avec le scroll
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: '0px 0px -100px 0px' // Marge augmentée pour déclencher plus tôt
        });
        
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease'; // Transition plus douce
        observer.observe(el);
    });

    // Smooth scrolling pour les liens d'ancrage (amélioré)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const headerHeight = document.querySelector('.header') ? document.querySelector('.header').offsetHeight : 0;
                const offset = navbarHeight + headerHeight + 20; // 20px de marge supplémentaire
                const targetPosition = target.offsetTop - offset;
                
                // Scroll fluide avec easing
                window.scrollTo({ 
                    top: targetPosition, 
                    behavior: 'smooth' 
                });
            }
        });
    });

    // Parallax effect pour le hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Animation des prix au hover
    document.querySelectorAll('.price').forEach(price => {
        price.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = '#1a1a1a';
            this.style.color = '#ffd700';
        });
        
        price.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = '#ffd700';
            this.style.color = '#1a1a1a';
        });
    });

    // Animation du logo
    document.querySelectorAll('.logo-container').forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animation des liens du menu latéral
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Animation du sélecteur de langue
    document.querySelectorAll('.language-selector').forEach(selector => {
        selector.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Effet de typewriter pour le titre principal
    const heroTitle = document.querySelector('.hero-content h2');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        // Démarrer l'animation après un délai
        setTimeout(typeWriter, 500);
    }

    // Animation des horaires
    document.querySelectorAll('.jour').forEach((jour, index) => {
        jour.style.animationDelay = `${index * 0.1}s`;
        jour.classList.add('animate-in');
    });

    // Effet de survol pour les liens sociaux
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // Animation des sections spéciales
    document.querySelectorAll('.signature-item, .special-item, .kids-menu').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(15px) scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Effet de pulsation pour le badge HALAL
    const halalBadge = document.querySelector('.halal-badge');
    if (halalBadge) {
        setInterval(() => {
            halalBadge.style.transform = 'scale(1.05)';
            setTimeout(() => {
                halalBadge.style.transform = 'scale(1)';
            }, 200);
        }, 3000);
    }

    // Animation des sauces
    document.querySelectorAll('.sauce-color').forEach(sauce => {
        sauce.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        sauce.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        });
    });

    // Effet de focus pour les liens du menu déroulant
    document.querySelectorAll('.dropdown-section a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });

    // ===== FONCTIONNALITÉ DE RECHERCHE SIMPLIFIÉE =====
    
    // Fonctionnalité de recherche intelligente
    const menuSearch = document.getElementById('menu-search');

    // Fonction pour normaliser le texte (enlever accents, espaces, etc.)
    function normalizeText(text) {
        return text.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
            .replace(/[^a-z0-9]/g, ''); // Garder seulement lettres et chiffres
    }

    // Fonction pour calculer la similarité entre deux textes
    function calculateSimilarity(text1, text2) {
        const normalized1 = normalizeText(text1);
        const normalized2 = normalizeText(text2);
        
        // Si l'un contient l'autre, c'est une correspondance
        if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
            return 1;
        }
        
        // Calculer la distance de Levenshtein simplifiée
        let distance = 0;
        const maxLength = Math.max(normalized1.length, normalized2.length);
        
        for (let i = 0; i < Math.min(normalized1.length, normalized2.length); i++) {
            if (normalized1[i] !== normalized2[i]) {
                distance++;
            }
        }
        distance += Math.abs(normalized1.length - normalized2.length);
        
        return 1 - (distance / maxLength);
    }

    // Event listener pour la recherche
    if (menuSearch) {
        menuSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            if (searchTerm.length === 0) {
                // Si la recherche est vide, tout afficher normalement
                document.querySelectorAll('.menu-section').forEach(section => {
                    section.style.display = 'block';
                });
                document.querySelectorAll('.menu-item, .plate, .viande, .starter').forEach(item => {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                });
                return;
            }
            
            // Rechercher dans tous les éléments du menu
            document.querySelectorAll('.menu-item, .plate, .viande, .starter').forEach(item => {
                const text = item.textContent.toLowerCase();
                const normalizedSearch = normalizeText(searchTerm);
                const normalizedText = normalizeText(text);
                
                // Vérifier les correspondances exactes et similaires
                let shouldShow = false;
                
                // Correspondance exacte
                if (text.includes(searchTerm) || normalizedText.includes(normalizedSearch)) {
                    shouldShow = true;
                }
                
                // Correspondance avec fautes de frappe (similarité > 0.7)
                if (!shouldShow) {
                    const similarity = calculateSimilarity(searchTerm, text);
                    if (similarity > 0.7) {
                        shouldShow = true;
                    }
                }
                
                // Correspondances intelligentes
                if (!shouldShow) {
                    const searchWords = searchTerm.split(' ').filter(word => word.length > 2);
                    const textWords = text.split(' ').filter(word => word.length > 2);
                    
                    for (let searchWord of searchWords) {
                        for (let textWord of textWords) {
                            const wordSimilarity = calculateSimilarity(searchWord, textWord);
                            if (wordSimilarity > 0.8) {
                                shouldShow = true;
                                break;
                            }
                        }
                        if (shouldShow) break;
                    }
                }
                
                if (shouldShow) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // Amélioration des effets de hover
    document.querySelectorAll('.menu-item, .plate, .viande, .starter').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform + ' scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });

    // Animation du breadcrumb
    document.querySelectorAll('.breadcrumbs a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Fonction pour afficher l'heure actuelle
function updateCurrentTime() {
    const now = new Date();
    const currentTime = now.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Ajouter l'heure actuelle dans le header si nécessaire
    const headerInfo = document.querySelector('.header-info');
    if (headerInfo) {
        let timeElement = headerInfo.querySelector('.current-time');
        if (!timeElement) {
            timeElement = document.createElement('p');
            timeElement.className = 'current-time';
            timeElement.innerHTML = '<i class="fas fa-clock"></i> <span></span>';
            headerInfo.appendChild(timeElement);
        }
        timeElement.querySelector('span').textContent = currentTime;
    }
}

// Mettre à jour l'heure toutes les secondes
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// Fonction pour vérifier si le restaurant est ouvert
function checkIfOpen() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = dimanche, 1 = lundi, etc.
    
    // Le restaurant est ouvert de 19h à 1h du matin
    const isOpen = currentHour >= 19 || currentHour < 1;
    
    // Ajouter un indicateur d'ouverture dans le header
    const header = document.querySelector('.header');
    if (header) {
        let openIndicator = header.querySelector('.open-indicator');
        if (!openIndicator) {
            openIndicator = document.createElement('div');
            openIndicator.className = 'open-indicator';
            openIndicator.style.position = 'absolute';
            openIndicator.style.top = '10px';
            openIndicator.style.right = '20px';
            openIndicator.style.padding = '5px 10px';
            openIndicator.style.borderRadius = '15px';
            openIndicator.style.fontSize = '0.8rem';
            openIndicator.style.fontWeight = 'bold';
            header.style.position = 'relative';
            header.appendChild(openIndicator);
        }
        
        if (isOpen) {
            openIndicator.textContent = 'OUVERT';
            openIndicator.style.background = '#28a745';
            openIndicator.style.color = 'white';
        } else {
            openIndicator.textContent = 'FERMÉ';
            openIndicator.style.background = '#dc3545';
            openIndicator.style.color = 'white';
        }
    }
}

// Vérifier l'état d'ouverture toutes les minutes
setInterval(checkIfOpen, 60000);
checkIfOpen();

// Gestion du scroll pour la navigation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(45, 45, 45, 0.95) 100%)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
            navbar.style.backdropFilter = 'none';
        }
    }
});

// Configuration des particules
particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffd700'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            }
        },
        opacity: {
            value: 0.3,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffd700',
            opacity: 0.2,
            width: 1
        },
        move: {
            enable: true,
            speed: 2,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

// Amélioration de la performance
window.addEventListener('load', function() {
    // Lazy loading des animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Optimisation mobile
if (window.innerWidth <= 768) {
    // Réduire le nombre de particules sur mobile
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 40
            },
            move: {
                speed: 1
            }
        }
    });
}
