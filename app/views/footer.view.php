 <!-- Music Control -->
    <div class="music-control">
        <button class="btn cyber-btn-ghost" id="musicToggle" title="Toggle Background Music">
            <i class="bi bi-music-note-beamed"></i>
        </button>
    </div>

    <!-- Enhanced Notification System -->
<div class="notification-system" id="notificationSystem">
    <!-- Notifications will be dynamically added here -->
</div>

<!-- User Dropdown (for mobile) -->
<div class="user-dropdown-container mobile-user-dropdown" id="mobileUserDropdownContainer">
    <div class="user-dropdown">
        <div class="user-dropdown-header">
            <img src="<?=Utils::getProfilePicture()?>" class="user-dropdown-avatar" alt="Profile">
            <div class="user-dropdown-info">
                <h6><?=Utils::user('fname') . " " . Utils::user('lname')?></h6>
                <p>See your profile</p>
            </div>
        </div>
        <hr class="dropdown-divider">
        <a class="user-dropdown-item" href="settings.php">
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

<!-- Floating particles effect -->
<div class="floating-particles"></div>

<?php
$this->loadView(
    'footer_scripts',
    [
        "jsData" => !empty($jsData) ? $jsData : [],
        "scripts" => !empty($scripts) ? $scripts : []
    ]
);
 ?>

</body>
</html>
