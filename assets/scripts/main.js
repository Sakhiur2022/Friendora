// Common JavaScript functionality
class FriendoraCore {
    constructor() {
        this.isLoading = false;
        this.cache = new Map();
        this.eventListeners = new Map();
        this.init();
    }

    init() {
        this.initErrorHandling();
        this.initUtilities();
        this.initModalSystem();
        this.initNotifications();
        this.initLoadingSystem();
        this.initImageHandling();
        this.initFormValidation();
    }

    // Error Handling System
    initErrorHandling() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            console.error('Global Error:', { msg, url, lineNo, columnNo, error });
            this.showNotification('An unexpected error occurred', 'error');
            return false;
        };

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            this.showNotification('Network error occurred', 'error');
        });
    }

    // Utility Functions
    initUtilities() {
        // Debounce function
        this.debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // Throttle function
        this.throttle = (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        };

        // Format time ago
        this.timeAgo = (date) => {
            const now = new Date();
            const seconds = Math.floor((now - date) / 1000);
            
            const intervals = {
                year: 31536000,
                month: 2592000,
                week: 604800,
                day: 86400,
                hour: 3600,
                minute: 60
            };

            for (const [unit, secondsInUnit] of Object.entries(intervals)) {
                const interval = Math.floor(seconds / secondsInUnit);
                if (interval >= 1) {
                    return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
                }
            }
            return 'Just now';
        };

        // Format numbers
        this.formatNumber = (num) => {
            if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M';
            } else if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        };

        // Validate email
        this.isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Generate unique ID
        this.generateId = () => {
            return '_' + Math.random().toString(36).substr(2, 9);
        };
    }

    // Modal System
    initModalSystem() {
        this.activeModals = new Set();
        
        // Handle modal backdrop clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') && e.target.classList.contains('show')) {
                this.closeModal(e.target);
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModals.size > 0) {
                const topModal = Array.from(this.activeModals).pop();
                this.closeModal(topModal);
            }
        });
    }

    showModal(modalId, options = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) {
            console.error(`Modal with ID "${modalId}" not found`);
            return;
        }

        // Set modal content if provided
        if (options.title) {
            const titleEl = modal.querySelector('.modal-title');
            if (titleEl) titleEl.textContent = options.title;
        }
        
        if (options.body) {
            const bodyEl = modal.querySelector('.modal-body');
            if (bodyEl) bodyEl.innerHTML = options.body;
        }

        // Show modal
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        this.activeModals.add(modal);

        // Add backdrop
        if (!document.querySelector('.modal-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }

        // Trigger animation
        requestAnimationFrame(() => {
            modal.classList.add('fade');
        });

        // Auto-close if specified
        if (options.autoClose) {
            setTimeout(() => this.closeModal(modal), options.autoClose);
        }

        return modal;
    }

    closeModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        
        if (!modal) return;

        modal.classList.remove('show');
        modal.style.display = 'none';
        this.activeModals.delete(modal);

        // Remove backdrop if no more modals
        if (this.activeModals.size === 0) {
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.remove();
        }
    }

    // Notification System
    initNotifications() {
        this.notificationContainer = this.createNotificationContainer();
    }

    createNotificationContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 350px;
            `;
            document.body.appendChild(container);
        }
        return container;
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        const id = this.generateId();
        
        notification.className = `alert alert-${type} alert-dismissible fade show cyber-notification`;
        notification.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-${this.getNotificationIcon(type)} me-2"></i>
                <span class="flex-grow-1">${message}</span>
                <button type="button" class="btn-close" onclick="friendoraCore.dismissNotification('${id}')"></button>
            </div>
        `;
        notification.id = id;
        
        // Add to container
        this.notificationContainer.appendChild(notification);
        
        // Auto-remove
        if (duration > 0) {
            setTimeout(() => this.dismissNotification(id), duration);
        }

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        return id;
    }

    dismissNotification(id) {
        const notification = document.getElementById(id);
        if (notification) {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Loading System
    initLoadingSystem() {
        this.loadingOverlay = this.createLoadingOverlay();
    }

    createLoadingOverlay() {
        let overlay = document.querySelector('.loading-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <div class="cyber-loader">
                        <div class="cyber-loader-inner"></div>
                    </div>
                    <p class="loading-text">Loading...</p>
                </div>
            `;
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 9998;
                backdrop-filter: blur(5px);
            `;
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    showLoading(text = 'Loading...') {
        this.isLoading = true;
        const textElement = this.loadingOverlay.querySelector('.loading-text');
        if (textElement) textElement.textContent = text;
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoading() {
        this.isLoading = false;
        this.loadingOverlay.style.display = 'none';
    }

    // Image Handling
    initImageHandling() {
        // Lazy loading for images
        this.setupLazyLoading();
        
        // Image error handling
        document.addEventListener('error', (e) => {
            if (e.target.tagName === 'IMG') {
                this.handleImageError(e.target);
            }
        }, true);
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    handleImageError(img) {
        if (!img.dataset.fallbackAttempted) {
            img.dataset.fallbackAttempted = 'true';
            const fallbacks = [
                'https://via.placeholder.com/150/1a1a2e/00d4ff?text=No+Image',
                'assets/images/default-avatar.png',
                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWExYTJlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzAwZDRmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
            ];

            for (const fallback of fallbacks) {
                if (img.src !== fallback) {
                    img.src = fallback;
                    break;
                }
            }
        }
    }

    // Form Validation
    initFormValidation() {
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.classList.contains('needs-validation')) {
                this.validateForm(form, e);
            }
        });

        // Real-time validation
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('form-control')) {
                this.validateField(e.target);
            }
        });
    }

    validateForm(form, event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
            
            // Focus first invalid field
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid) {
                firstInvalid.focus();
                this.showNotification('Please fill in all required fields correctly', 'warning');
            }
        }
        form.classList.add('was-validated');
    }

    validateField(field) {
        const isValid = field.checkValidity();
        field.classList.toggle('is-valid', isValid);
        field.classList.toggle('is-invalid', !isValid);
        
        // Custom validation messages
        const feedback = field.parentNode.querySelector('.invalid-feedback');
        if (feedback && !isValid) {
            feedback.textContent = this.getValidationMessage(field);
        }
    }

    getValidationMessage(field) {
        if (field.validity.valueMissing) {
            return `${field.name || 'This field'} is required`;
        } else if (field.validity.typeMismatch) {
            return `Please enter a valid ${field.type}`;
        } else if (field.validity.patternMismatch) {
            return field.dataset.patternError || 'Invalid format';
        } else if (field.validity.tooShort) {
            return `Minimum ${field.minLength} characters required`;
        } else if (field.validity.tooLong) {
            return `Maximum ${field.maxLength} characters allowed`;
        }
        return 'Invalid input';
    }

    // API Helper Functions
    async makeRequest(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin'
        };

        const finalOptions = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, finalOptions);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }

    // Cache Management
    setCache(key, value, ttl = 300000) { // 5 minutes default TTL
        const item = {
            value,
            timestamp: Date.now(),
            ttl
        };
        this.cache.set(key, item);
    }

    getCache(key) {
        const item = this.cache.get(key);
        if (!item) return null;
        
        if (Date.now() - item.timestamp > item.ttl) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    clearCache(pattern = null) {
        if (pattern) {
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                }
            }
        } else {
            this.cache.clear();
        }
    }

    // Event Management
    on(element, event, handler, options = {}) {
        const wrappedHandler = (e) => {
            try {
                handler(e);
            } catch (error) {
                console.error('Event handler error:', error);
            }
        };

        element.addEventListener(event, wrappedHandler, options);
        
        // Store for cleanup
        const key = `${element}_${event}`;
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, []);
        }
        this.eventListeners.get(key).push({ handler: wrappedHandler, original: handler });
    }

    off(element, event, handler = null) {
        const key = `${element}_${event}`;
        const listeners = this.eventListeners.get(key);
        
        if (listeners) {
            if (handler) {
                const index = listeners.findIndex(l => l.original === handler);
                if (index >= 0) {
                    element.removeEventListener(event, listeners[index].handler);
                    listeners.splice(index, 1);
                }
            } else {
                // Remove all listeners for this event
                listeners.forEach(l => {
                    element.removeEventListener(event, l.handler);
                });
                this.eventListeners.delete(key);
            }
        }
    }

    // Cleanup
    destroy() {
        // Remove all event listeners
        for (const [key, listeners] of this.eventListeners) {
            const [element, event] = key.split('_');
            listeners.forEach(l => {
                element.removeEventListener(event, l.handler);
            });
        }
        this.eventListeners.clear();
        
        // Clear cache
        this.cache.clear();
        
        // Remove notification container
        if (this.notificationContainer && this.notificationContainer.parentNode) {
            this.notificationContainer.parentNode.removeChild(this.notificationContainer);
        }
        
        // Remove loading overlay
        if (this.loadingOverlay && this.loadingOverlay.parentNode) {
            this.loadingOverlay.parentNode.removeChild(this.loadingOverlay);
        }
    }
}

// Initialize when DOM is ready
let friendoraCore;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        friendoraCore = new FriendoraCore();
    });
} else {
    friendoraCore = new FriendoraCore();
}

// Global utility functions
window.showNotification = (message, type, duration) => {
    if (friendoraCore) {
        return friendoraCore.showNotification(message, type, duration);
    }
};

window.showLoading = (text) => {
    if (friendoraCore) {
        friendoraCore.showLoading(text);
    }
};

window.hideLoading = () => {
    if (friendoraCore) {
        friendoraCore.hideLoading();
    }
};

window.showModal = (modalId, options) => {
    if (friendoraCore) {
        return friendoraCore.showModal(modalId, options);
    }
};

window.closeModal = (modal) => {
    if (friendoraCore) {
        friendoraCore.closeModal(modal);
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FriendoraCore;
}

// 404 Page Specific Functionality
class Error404Page {
    constructor() {
        this.particles = [];
        this.backgroundMusic = null;
        this.isMusicPlaying = false;
        if (document.body.classList.contains('error-404')) {
            this.init();
        }
    }

    init() {
        this.createParticles();
        this.setupMusicControl();
        this.addInteractiveEffects();
        this.startAnimations();
        this.setupPage();
    }

    setupPage() {
        this.createFloatingElements();
        this.createCyberGrid();
        this.addGlitchEffects();
        this.setupKeyboardShortcuts();
    }

    createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                this.createParticle();
            }, i * 100);
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.style.animationDuration = (Math.random() * 5 + 3) + 's';
        particle.style.animationDelay = Math.random() * 2 + 's';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.createParticle();
            }
        }, 8000);
    }

    createFloatingElements() {
        const shapes = [
            { type: 'circle', class: 'floating-element circle' },
            { type: 'triangle', class: 'floating-element triangle' },
            { type: 'square', class: 'floating-element square' }
        ];

        shapes.forEach((shape, index) => {
            const element = document.createElement('div');
            element.className = shape.class;
            element.style.animationDelay = (index * 2) + 's';
            document.body.appendChild(element);
        });
    }

    createCyberGrid() {
        const grid = document.createElement('div');
        grid.className = 'cyber-grid';
        document.body.appendChild(grid);
    }

    setupMusicControl() {
        const musicControl = document.createElement('div');
        musicControl.className = 'music-control';
        musicControl.innerHTML = `
            <button class="music-toggle" id="musicToggle" title="Toggle Background Music">
                <i class="bi bi-music-note"></i>
            </button>
        `;
        document.body.appendChild(musicControl);

        const audio = document.createElement('audio');
        audio.id = 'bgMusic';
        audio.loop = true;
        audio.volume = 0.3;
        audio.preload = 'auto';
        
        const sources = [
            { src: '<?=ROOT?>/assets/audio/cyberpunk-ambient.mp3', type: 'audio/mpeg' },
            { src: '<?=ROOT?>/assets/audio/cyberpunk-ambient.ogg', type: 'audio/ogg' }
        ];
        
        sources.forEach(source => {
            const sourceElement = document.createElement('source');
            sourceElement.src = source.src;
            sourceElement.type = source.type;
            audio.appendChild(sourceElement);
        });
        
        document.body.appendChild(audio);
        this.backgroundMusic = audio;

        const musicToggle = document.getElementById('musicToggle');
        if (musicToggle) {
            musicToggle.addEventListener('click', () => this.toggleBackgroundMusic());
        }
    }

    toggleBackgroundMusic() {
        const musicToggle = document.getElementById('musicToggle');
        const musicIcon = musicToggle.querySelector('i');
        
        if (this.isMusicPlaying) {
            this.backgroundMusic.pause();
            musicIcon.className = 'bi bi-music-note';
            this.isMusicPlaying = false;
            friendoraCore.showNotification('Music paused', 'info');
        } else {
            const playPromise = this.backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicIcon.className = 'bi bi-music-note-beamed';
                    this.isMusicPlaying = true;
                    friendoraCore.showNotification('Music playing', 'success');
                }).catch(() => {
                    friendoraCore.showNotification('Music failed to play', 'error');
                });
            }
        }
    }

    addInteractiveEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cyber-btn')) {
                this.createClickRipple(e);
            }
        });

        document.addEventListener('mousemove', (e) => {
            this.createCursorTrail(e);
        });

        const errorCode = document.querySelector('.error-code');
        if (errorCode) {
            errorCode.addEventListener('mouseenter', () => {
                this.intensifyGlitch();
            });
            
            errorCode.addEventListener('mouseleave', () => {
                this.normalizeGlitch();
            });
        }
    }

    createClickRipple(e) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(0, 212, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            left: ${e.clientX - 10}px;
            top: ${e.clientY - 10}px;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(ripple);
        
        ripple.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(4)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            ripple.remove();
        };
    }

    createCursorTrail(e) {
        const trail = document.createElement('div');
        trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--cyber-primary);
            border-radius: 50%;
            left: ${e.clientX - 3}px;
            top: ${e.clientY - 3}px;
            pointer-events: none;
            z-index: 9998;
            box-shadow: 0 0 10px var(--cyber-primary);
            opacity: 0.8;
        `;
        
        document.body.appendChild(trail);
        
        setTimeout(() => {
            trail.style.transition = 'opacity 0.5s ease-out';
            trail.style.opacity = '0';
            setTimeout(() => trail.remove(), 500);
        }, 50);
    }

    intensifyGlitch() {
        const errorCode = document.querySelector('.error-code');
        if (errorCode) {
            errorCode.style.animationDuration = '0.5s';
        }
    }

    normalizeGlitch() {
        const errorCode = document.querySelector('.error-code');
        if (errorCode) {
            errorCode.style.animationDuration = '3s';
        }
    }

    addGlitchEffects() {
        setInterval(() => {
            this.randomTextGlitch();
        }, 5000);
    }

    randomTextGlitch() {
        const glitchElements = document.querySelectorAll('.error-title, .error-subtitle');
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)];
        
        if (randomElement) {
            const originalText = randomElement.textContent;
            const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            let glitchedText = '';
            
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() < 0.1) {
                    glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                } else {
                    glitchedText += originalText[i];
                }
            }
            
            randomElement.textContent = glitchedText;
            
            setTimeout(() => {
                randomElement.textContent = originalText;
            }, 100);
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case 'm':
                    this.toggleBackgroundMusic();
                    break;
                case 'escape':
                    window.history.back();
                    break;
                case 'h':
                    window.location.href = '<?=ROOT?>/';
                    break;
            }
        });
    }

    startAnimations() {
        this.pulseBackground();
        
        setInterval(() => {
            if (document.querySelectorAll('.particle').length < 30) {
                this.createParticle();
            }
        }, 200);
    }

    pulseBackground() {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            document.documentElement.style.setProperty(
                '--cyber-primary-hsl', 
                `hsl(${hue}, 100%, 50%)`
            );
        }, 100);
    }
}

// Initialize 404 page if on error page
let error404Page;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        error404Page = new Error404Page();
    });
} else {
    error404Page = new Error404Page();
}
