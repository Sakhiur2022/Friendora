<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" type="image/svg+xml" href="<?=ROOT?>/assets/images/favicon.svg">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?=$title ?? 'Friendora'?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/profile.css">
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/friend.css">
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/messenger.css">
</head>
<body>
    <!-- Background Music -->
    <audio id="bgMusic" loop>
        <source src="<?=ROOT?>/assets/musics/profile-music.mp3" type="audio/mpeg">
    </audio>

    <!-- Enhanced Navigation Bar -->
<nav class="navbar navbar-expand-lg fixed-top cyber-nav">
    <div class="container-fluid">
        <!-- Mobile Hamburger Button -->
        <button class="navbar-toggler cyber-hamburger d-lg-none" type="button" onclick="toggleMobileMenu()">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>

        <!-- Logo -->
        <a class="navbar-brand cyber-logo" href="<?=ROOT?>/home">
            <i class="bi bi-hexagon-fill me-2"></i>
            Friendora
        </a>

        <!-- Desktop Search Bar -->
        <div class="search-container mx-3 flex-grow-1 d-none d-lg-block">
            <div class="input-group position-relative">
                <span class="input-group-text cyber-search-icon">
                    <i class="bi bi-search"></i>
                </span>
                <input
                    type="text"
                    class="form-control cyber-search"
                    placeholder="Search Friendora..."
                    id="searchInput"
                    autocomplete="off"
                />
                <button class="btn cyber-btn-ghost advanced-search-btn" type="button" onclick="openAdvancedSearch()" title="Advanced Search">
                    <i class="bi bi-three-dots"></i>
                </button>
                
                <!-- Autosuggestion Dropdown -->
                <div class="search-suggestions" id="searchSuggestions">
                    <!-- PHP: Search suggestions would be populated here -->
                </div>
            </div>
        </div>

        <!-- Desktop Navigation Icons -->
        <div class="navbar-nav flex-row d-none d-lg-flex">
            <a class="nav-link cyber-nav-icon" href="<?=ROOT?>/home" title="Home">
                <i class="bi bi-house-fill"></i>
            </a>
            
            <!-- Friends Dropdown -->
            <div class="nav-item dropdown">
                <a class="nav-link cyber-nav-icon dropdown-toggle" href="#" id="friendsDropdown" role="button" onclick="toggleFriendsDropdown()" title="Friends">
                    <i class="bi bi-person-fill"></i>
                    <span class="friend-request-badge" id="friendRequestBadge" style="display: none;">0</span>
                </a>
                <div class="friends-dropdown-container" id="friendsDropdownContainer">
                    <div class="friends-dropdown-content">
                        <div class="friends-dropdown-header">
                            <h6>Friend Requests</h6>
                            <button class="btn btn-link btn-sm" onclick="markAllFriendRequestsAsSeen()" title="Mark all as seen">
                                <i class="bi bi-check2-all"></i>
                            </button>
                        </div>
                        <div class="friends-dropdown-body">
                            <ul class="friends-list" id="friendRequestsList">
                                <li class="no-friends-message">No pending friend requests</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <a class="nav-link cyber-nav-icon" href="<?=ROOT?>/messenger" title="Messages">
                <i class="bi bi-chat-dots-fill"></i>
                <span class="notification-badge text-center" id="unreadMessagesBadge" style="display: none;">0</span>
            </a>
            
            <!-- Enhanced Notification Dropdown -->
            <div class="nav-item dropdown">
                <a class="nav-link cyber-nav-icon dropdown-toggle" href="#" id="notificationDropdown" role="button" onclick="toggleNotificationDropdown()" title="Notifications">
                    <i class="bi bi-bell-fill"></i>
                    <span class="notification-badge" id="notificationCount">7</span>
                </a>
                <div class="notification-dropdown-container" id="notificationDropdownContainer">
                    <div class="notification-dropdown">
                        <div class="notification-header">
                            <h6>Notifications</h6>
                            <button class="btn btn-sm cyber-btn-ghost" onclick="markAllAsRead()">Mark all as read</button>
                        </div>
                        <div class="notification-list" id="notificationsList">
                            <!-- Notifications will be populated here -->
                        </div>
                        <div class="notification-footer">
                            <a href="notifications.php" class="btn cyber-btn-ghost w-100">See All Notifications</a>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- User Dropdown -->
            <div class="nav-item dropdown">
                <a class="nav-link user-dropdown-toggle" href="#" id="userDropdown" role="button" onclick="toggleUserDropdown()">
                 
                    <img src="<?= Utils::getProfilePicture(); ?>" class="profile-pic-nav" alt="Profile">
                </a>
                <div class="user-dropdown-container" id="userDropdownContainer">
                    <div class="user-dropdown">
                        <div class="user-dropdown-header">
                            <img src="<?= Utils::getProfilePicture(); ?>" class="user-dropdown-avatar" alt="Profile">
                            <div class="user-dropdown-info">
                                <h6><?= Utils::user('fname') . " " . Utils::user('lname') ?></h6>
                                <p><a href="<?= Utils::profileUrl() ?>" style="color: inherit; text-decoration: none;">See your profile</a></p>
                            </div>
                        </div>
                        <hr class="dropdown-divider">
                        <a class="user-dropdown-item" href="<?=ROOT?>/settings">
                            <i class="bi bi-gear-fill"></i>
                            <span>Settings & Privacy</span>
                        </a>
                        <a class="user-dropdown-item" href="help.php">
                            <i class="bi bi-question-circle-fill"></i>
                            <span>Help & Support</span>
                        </a>
                        <a class="user-dropdown-item" href="display.php">
                            <i class="bi bi-moon-fill"></i>
                            <span>Display & Accessibility</span>
                        </a>
                        <hr class="dropdown-divider">
                        <a class="user-dropdown-item logout-item" href="<?=ROOT?>/logout" onclick="handleLogout()">
                            <i class="bi bi-box-arrow-right"></i>
                            <span>Log Out</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Mobile User Icon -->
        <div class="d-lg-none">
            <a class="nav-link user-dropdown-toggle" href="#" onclick="toggleUserDropdown()">
                <img src="<?=Utils::getProfilePicture(); ?>" class="profile-pic-nav" alt="Profile">
            </a>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu-content">
            <!-- Mobile Search -->
            <div class="mobile-search-section">
                <div class="input-group position-relative">
                    <span class="input-group-text cyber-search-icon">
                        <i class="bi bi-search"></i>
                    </span>
                    <input 
                        type="text" 
                        class="form-control cyber-search" 
                        placeholder="Search Friendora..." 
                        id="mobileSearchInput" 
                        autocomplete="off" />
                    <button class="btn cyber-btn-ghost advanced-search-btn" type="button" onclick="openAdvancedSearch()" title="Advanced Search">
                        <i class="bi bi-three-dots"></i>
                    </button>
                </div>
                <div class="search-suggestions" id="mobileSearchSuggestions">
                    <!-- Mobile search suggestions -->
                </div>
            </div>

            <!-- Mobile Navigation Links -->
            <div class="mobile-nav-links">
                <a class="mobile-nav-item" href="<?=ROOT?>/home">
                    <i class="bi bi-house-fill"></i>
                    <span>Home</span>
                </a>
                <a class="mobile-nav-item" href="#" onclick="toggleMobileFriends()">
                    <i class="bi bi-person-fill"></i>
                    <span>Friends</span>
                    <span class="friend-request-badge mobile" id="mobileFriendRequestBadge" style="display: none;">0</span>
                </a>
                <a class="mobile-nav-item" href="<?=ROOT?>/messenger">
                    <i class="bi bi-chat-dots-fill"></i>
                    <span>Messages</span>
                    <span class="notification-badge">3</span>
                </a>
                <a class="mobile-nav-item" href="#" onclick="toggleMobileNotifications()">
                    <i class="bi bi-bell-fill"></i>
                    <span>Notifications</span>
                    <span class="notification-badge" id="mobileNotificationCount" style="display: none;">0</span>
                </a>
            </div>

            <!-- Mobile Notifications Section -->
            <div class="mobile-notifications-section" id="mobileNotificationsSection" style="display: none;">
                <div class="mobile-notifications-header">
                    <h6>Notifications</h6>
                    <button class="btn btn-sm cyber-btn-ghost" onclick="markAllAsRead()">Mark all as read</button>
                </div>
                <div class="mobile-notifications-list" id="mobileNotificationsList">
                    <!-- Mobile notifications will be populated here -->
                </div>
            </div>

            <!-- Mobile Friends Section -->
            <div class="mobile-friends-section" id="mobileFriendsSection" style="display: none;">
                <div class="mobile-section-header">
                    <h6>Friend Requests</h6>
                    <button class="btn btn-link btn-sm" onclick="markAllFriendRequestsAsSeen()">
                        <i class="bi bi-check2-all"></i>
                    </button>
                </div>
                <ul class="mobile-friends-list" id="mobileFriendRequestsList">
                    <li class="no-friends-message">No pending friend requests</li>
                </ul>
            </div>
        </div>
    </div>
</nav>
