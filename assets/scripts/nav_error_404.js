// Navigation functionality
class FriendoraNavigation {
    constructor() {
        this.searchCache = new Map();
        this.notificationCount = 0;
        this.lastSearchQuery = '';
        this.searchTimeout = null;
        this.isSearching = false;
        this.init();
    }

    init() {
        this.initSearchFunctionality();
        this.initNotifications();
        this.initMobileNavigation();
        this.initProfileDropdown();
        this.initKeyboardShortcuts();
        this.initScrollBehavior();
    }

    // Search Functionality
    initSearchFunctionality() {
        const searchInputs = document.querySelectorAll('.cyber-search');
        const suggestionContainers = document.querySelectorAll('.search-suggestions');

        searchInputs.forEach((input, index) => {
            const suggestionsContainer = suggestionContainers[index];
            
            // Real-time search
            input.addEventListener('input', (e) => {
                this.handleSearchInput(e.target.value, suggestionsContainer);
            });

            // Focus and blur events
            input.addEventListener('focus', () => {
                if (input.value.trim()) {
                    this.showSearchSuggestions(suggestionsContainer);
                }
            });

            input.addEventListener('blur', () => {
                // Delay hiding to allow clicking on suggestions
                setTimeout(() => {
                    this.hideSearchSuggestions(suggestionsContainer);
                }, 200);
            });

            // Keyboard navigation
            input.addEventListener('keydown', (e) => {
                this.handleSearchKeyboard(e, suggestionsContainer);
            });
        });

        // Advanced search buttons
        const advancedSearchBtns = document.querySelectorAll('.advanced-search-btn');
        advancedSearchBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.showAdvancedSearch();
            });
        });

        // Click outside to close suggestions
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container') && !e.target.closest('.mobile-search-container')) {
                suggestionContainers.forEach(container => {
                    this.hideSearchSuggestions(container);
                });
            }
        });
    }

    handleSearchInput(query, suggestionsContainer) {
        clearTimeout(this.searchTimeout);
        
        if (query.trim().length < 2) {
            this.hideSearchSuggestions(suggestionsContainer);
            return;
        }

        this.searchTimeout = setTimeout(() => {
            this.performSearch(query, suggestionsContainer);
        }, 300);
    }

    async performSearch(query, suggestionsContainer) {
        if (this.isSearching || query === this.lastSearchQuery) return;
        
        this.isSearching = true;
        this.lastSearchQuery = query;

        // Check cache first
        const cacheKey = `search_${query.toLowerCase()}`;
        let results = friendoraCore?.getCache(cacheKey);

        if (!results) {
            try {
                // Show loading state
                this.showSearchLoading(suggestionsContainer);

                const response = await friendoraCore?.makeRequest('search', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        query: query,
                        type: 'suggestions',
                        limit: 8 
                    })
                });

                results = response?.results || [];
                
                // Cache results for 5 minutes
                friendoraCore?.setCache(cacheKey, results, 300000);
                
            } catch (error) {
                console.error('Search error:', error);
                results = [];
                friendoraCore?.showNotification('Search temporarily unavailable', 'warning', 3000);
            }
        }

        this.displaySearchResults(results, suggestionsContainer, query);
        this.isSearching = false;
    }

    showSearchLoading(container) {
        if (!container) return;
        
        container.innerHTML = `
            <div class="suggestion-item">
                <div class="loading-shimmer suggestion-avatar"></div>
                <div class="suggestion-info">
                    <div class="loading-shimmer" style="height: 16px; width: 120px; margin-bottom: 4px;"></div>
                    <div class="loading-shimmer" style="height: 12px; width: 80px;"></div>
                </div>
            </div>
        `;
        container.style.display = 'block';
    }

    displaySearchResults(results, container, query) {
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = `
                <div class="suggestion-item text-center py-3">
                    <i class="fas fa-search text-muted mb-2"></i>
                    <div class="text-muted">No results found for "${this.escapeHtml(query)}"</div>
                </div>
            `;
        } else {
            container.innerHTML = results.map(result => `
                <div class="suggestion-item" data-id="${result.id}" data-type="${result.type}">
                    <img src="${result.avatar || 'assets/images/default-avatar.png'}" 
                         alt="${this.escapeHtml(result.name)}" 
                         class="suggestion-avatar"
                         onerror="this.src='assets/images/default-avatar.png'">
                    <div class="suggestion-info">
                        <div class="suggestion-name">${this.highlightMatch(result.name, query)}</div>
                        <div class="suggestion-type">${this.formatResultType(result.type)}</div>
                    </div>
                </div>
            `).join('');

            // Add click handlers
            container.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.selectSearchResult(item.dataset.id, item.dataset.type);
                });
            });
        }

        this.showSearchSuggestions(container);
    }

    highlightMatch(text, query) {
        const escapedText = this.escapeHtml(text);
        const escapedQuery = this.escapeHtml(query);
        const regex = new RegExp(`(${escapedQuery})`, 'gi');
        return escapedText.replace(regex, '<mark>$1</mark>');
    }

    formatResultType(type) {
        const types = {
            'user': 'User',
            'page': 'Page',
            'group': 'Group',
            'post': 'Post',
            'hashtag': 'Hashtag'
        };
        return types[type] || 'Result';
    }

    selectSearchResult(id, type) {
        // Navigate to the selected result
        const routes = {
            'user': `profile/${id}`,
            'page': `page/${id}`,
            'group': `group/${id}`,
            'post': `post/${id}`,
            'hashtag': `search?hashtag=${encodeURIComponent(id)}`
        };

        const route = routes[type];
        if (route) {
            window.location.href = route;
        }
    }

    showAdvancedSearch() {
        const modal = friendoraCore?.showModal('advancedSearchModal', {
            title: 'Advanced Search',
            body: this.getAdvancedSearchForm()
        });

        if (modal) {
            this.initAdvancedSearchForm(modal);
        }
    }

    getAdvancedSearchForm() {
        return `
            <form id="advancedSearchForm" class="needs-validation" novalidate>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label for="searchKeywords" class="form-label">Keywords</label>
                        <input type="text" class="form-control cyber-input" id="searchKeywords" 
                               placeholder="Enter keywords...">
                    </div>
                    <div class="col-md-6">
                        <label for="searchType" class="form-label">Search Type</label>
                        <select class="form-select cyber-input" id="searchType">
                            <option value="">All</option>
                            <option value="user">Users</option>
                            <option value="post">Posts</option>
                            <option value="page">Pages</option>
                            <option value="group">Groups</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="searchLocation" class="form-label">Location</label>
                        <input type="text" class="form-control cyber-input" id="searchLocation" 
                               placeholder="City, Country...">
                    </div>
                    <div class="col-md-6">
                        <label for="searchDateRange" class="form-label">Date Range</label>
                        <select class="form-select cyber-input" id="searchDateRange">
                            <option value="">Any time</option>
                            <option value="day">Past 24 hours</option>
                            <option value="week">Past week</option>
                            <option value="month">Past month</option>
                            <option value="year">Past year</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="searchVerified">
                            <label class="form-check-label" for="searchVerified">
                                Verified accounts only
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn cyber-btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn cyber-btn-primary">
                        <i class="fas fa-search me-2"></i>Search
                    </button>
                </div>
            </form>
        `;
    }

    initAdvancedSearchForm(modal) {
        const form = modal.querySelector('#advancedSearchForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const searchParams = new URLSearchParams();
            
            for (const [key, value] of formData.entries()) {
                if (value.trim()) {
                    searchParams.append(key.replace('search', '').toLowerCase(), value);
                }
            }
            
            window.location.href = `search?${searchParams.toString()}`;
        });
    }

    showSearchSuggestions(container) {
        if (container) {
            container.style.display = 'block';
        }
    }

    hideSearchSuggestions(container) {
        if (container) {
            container.style.display = 'none';
        }
    }

    handleSearchKeyboard(e, suggestionsContainer) {
        if (!suggestionsContainer || suggestionsContainer.style.display === 'none') return;

        const items = suggestionsContainer.querySelectorAll('.suggestion-item');
        let currentIndex = Array.from(items).findIndex(item => item.classList.contains('active'));

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                currentIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
                this.highlightSuggestion(items, currentIndex);
                break;
            case 'ArrowUp':
                e.preventDefault();
                currentIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
                this.highlightSuggestion(items, currentIndex);
                break;
            case 'Enter':
                e.preventDefault();
                if (currentIndex >= 0 && items[currentIndex]) {
                    items[currentIndex].click();
                }
                break;
            case 'Escape':
                this.hideSearchSuggestions(suggestionsContainer);
                e.target.blur();
                break;
        }
    }

    highlightSuggestion(items, index) {
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    // Notification System
    initNotifications() {
        this.loadNotifications();
        this.setupNotificationPolling();
        
        // Notification dropdown toggle
        const notificationToggles = document.querySelectorAll('.notification-toggle');
        notificationToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleNotificationDropdown();
            });
        });

        // Mark all as read
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mark-all-read')) {
                this.markAllNotificationsRead();
            }
        });
    }

    async loadNotifications() {
        try {
            const response = await friendoraCore?.makeRequest('notifications');
            const notifications = response?.notifications || [];
            
            this.updateNotificationBadge(notifications.filter(n => !n.read).length);
            this.renderNotifications(notifications);
            
        } catch (error) {
            console.error('Failed to load notifications:', error);
        }
    }

    updateNotificationBadge(count) {
        this.notificationCount = count;
        const badges = document.querySelectorAll('.notification-badge');
        
        badges.forEach(badge => {
            if (count > 0) {
                badge.textContent = count > 99 ? '99+' : count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    renderNotifications(notifications) {
        const containers = document.querySelectorAll('.notification-dropdown .dropdown-menu, #mobileNotifications .cyber-dropdown');
        
        containers.forEach(container => {
            const notificationList = container.querySelector('.notification-list') || container;
            
            if (notifications.length === 0) {
                notificationList.innerHTML = `
                    <div class="text-center py-4">
                        <i class="fas fa-bell-slash fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No notifications</p>
                    </div>
                `;
                return;
            }

            notificationList.innerHTML = notifications.map(notification => `
                <div class="notification-item ${!notification.read ? 'unread' : ''}" 
                     data-id="${notification.id}">
                    <img src="${notification.avatar || 'assets/images/default-avatar.png'}" 
                         alt="${this.escapeHtml(notification.sender_name)}" 
                         class="notification-avatar"
                         onerror="this.src='assets/images/default-avatar.png'">
                    <div class="notification-content flex-grow-1">
                        <p class="mb-1">${this.formatNotificationMessage(notification)}</p>
                        <small class="text-muted">${friendoraCore?.timeAgo(new Date(notification.created_at))}</small>
                    </div>
                    ${!notification.read ? '<div class="notification-dot"></div>' : ''}
                </div>
            `).join('');

            // Add click handlers
            notificationList.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.handleNotificationClick(item.dataset.id);
                });
            });
        });
    }

    formatNotificationMessage(notification) {
        const senderName = this.escapeHtml(notification.sender_name);
        const messages = {
            'like': `<strong>${senderName}</strong> liked your post`,
            'comment': `<strong>${senderName}</strong> commented on your post`,
            'follow': `<strong>${senderName}</strong> started following you`,
            'mention': `<strong>${senderName}</strong> mentioned you in a post`,
            'friend_request': `<strong>${senderName}</strong> sent you a friend request`,
            'friend_accept': `<strong>${senderName}</strong> accepted your friend request`,
            'group_invite': `<strong>${senderName}</strong> invited you to join a group`
        };

        return messages[notification.type] || `<strong>${senderName}</strong> ${notification.message}`;
    }

    async handleNotificationClick(notificationId) {
        try {
            // Mark as read
            await friendoraCore?.makeRequest('notifications/read', {
                method: 'POST',
                body: JSON.stringify({ id: notificationId })
            });

            // Update UI
            const items = document.querySelectorAll(`[data-id="${notificationId}"]`);
            items.forEach(item => {
                item.classList.remove('unread');
                const dot = item.querySelector('.notification-dot');
                if (dot) dot.remove();
            });

            // Update badge count
            this.updateNotificationBadge(Math.max(0, this.notificationCount - 1));

        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }

    async markAllNotificationsRead() {
        try {
            await friendoraCore?.makeRequest('notifications/read-all', {
                method: 'POST'
            });

            // Update UI
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
                const dot = item.querySelector('.notification-dot');
                if (dot) dot.remove();
            });

            this.updateNotificationBadge(0);
            friendoraCore?.showNotification('All notifications marked as read', 'success', 3000);

        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
            friendoraCore?.showNotification('Failed to update notifications', 'error', 3000);
        }
    }

    toggleNotificationDropdown() {
        const dropdowns = document.querySelectorAll('.notification-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.toggle('show');
        });
    }

    setupNotificationPolling() {
        // Poll for new notifications every 30 seconds
        setInterval(() => {
            this.loadNotifications();
        }, 30000);
    }

    // Mobile Navigation
    initMobileNavigation() {
        const offcanvasElement = document.getElementById('mobileNav');
        if (!offcanvasElement) return;

        // Handle offcanvas events
        offcanvasElement.addEventListener('show.bs.offcanvas', () => {
            document.body.classList.add('offcanvas-open');
        });

        offcanvasElement.addEventListener('hide.bs.offcanvas', () => {
            document.body.classList.remove('offcanvas-open');
        });

        // Enhanced mobile nav interactions
        const mobileNavLinks = offcanvasElement.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Add click effect
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);

                // Close offcanvas for navigation links (not dropdowns)
                if (!link.classList.contains('dropdown-toggle')) {
                    setTimeout(() => {
                        bootstrap.Offcanvas.getInstance(offcanvasElement)?.hide();
                    }, 200);
                }
            });
        });
    }

    // Profile Dropdown
    initProfileDropdown() {
        const profileToggles = document.querySelectorAll('.profile-dropdown-toggle');
        profileToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleProfileDropdown();
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.profile-dropdown')) {
                this.closeProfileDropdown();
            }
        });
    }

    toggleProfileDropdown() {
        const dropdowns = document.querySelectorAll('.profile-dropdown .dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.classList.toggle('show');
        });
    }

    closeProfileDropdown() {
        const dropdowns = document.querySelectorAll('.profile-dropdown .dropdown-menu.show');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    // Keyboard Shortcuts
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K for search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('.cyber-search');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Ctrl/Cmd + / for help
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showKeyboardShortcuts();
            }

            // Escape to close dropdowns
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
            }
        });
    }

    showKeyboardShortcuts() {
        const shortcuts = [
            { key: 'Ctrl/Cmd + K', action: 'Search' },
            { key: 'Ctrl/Cmd + /', action: 'Show this help' },
            { key: 'Escape', action: 'Close dropdowns/modals' },
            { key: '↑/↓', action: 'Navigate search results' },
            { key: 'Enter', action: 'Select search result' }
        ];

        const shortcutsList = shortcuts.map(shortcut => `
            <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="text-muted">${shortcut.action}</span>
                <kbd class="bg-secondary text-light px-2 py-1 rounded">${shortcut.key}</kbd>
            </div>
        `).join('');

        friendoraCore?.showModal('shortcutsModal', {
            title: 'Keyboard Shortcuts',
            body: `<div class="shortcuts-list">${shortcutsList}</div>`
        });
    }

    closeAllDropdowns() {
        // Close notification dropdowns
        document.querySelectorAll('.notification-dropdown.show').forEach(dropdown => {
            dropdown.classList.remove('show');
        });

        // Close profile dropdowns
        this.closeProfileDropdown();

        // Close search suggestions
        document.querySelectorAll('.search-suggestions').forEach(container => {
            this.hideSearchSuggestions(container);
        });
    }

    // Scroll Behavior
    initScrollBehavior() {
        let lastScrollTop = 0;
        const navbar = document.querySelector('.main-navbar');
        
        if (!navbar) return;

        window.addEventListener('scroll', friendoraCore?.throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Hide/show navbar on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
        }, 100));
    }

    // Utility Methods
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Public API
    refreshNotifications() {
        this.loadNotifications();
    }

    clearSearchCache() {
        this.searchCache.clear();
    }

    setNotificationCount(count) {
        this.updateNotificationBadge(count);
    }
}

// Initialize navigation when DOM is ready
let friendoraNav;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        friendoraNav = new FriendoraNavigation();
    });
} else {
    friendoraNav = new FriendoraNavigation();
}

// Navbar scroll handler for hide/show functionality
function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down - hide navbar
                    navbar.style.transform = 'translateY(-100%)';
                    navbar.style.transition = 'transform 0.3s ease-in-out';
                } else if (scrollTop < lastScrollTop) {
                    // Scrolling up - show navbar
                    navbar.style.transform = 'translateY(0)';
                    navbar.style.transition = 'transform 0.3s ease-in-out';
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
                isScrolling = false;
            });
        }
        isScrolling = true;
    });
}

// Initialize navbar functionality
document.addEventListener('DOMContentLoaded', function() {
    handleNavbarScroll();
});

// Export for global access
window.friendoraNav = friendoraNav;
