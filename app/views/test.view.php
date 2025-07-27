<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" type="image/svg+xml" href="<?=ROOT?>/assets/images/favicon.svg">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Friendora</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/profile.css">
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
        <a class="navbar-brand cyber-logo" href="#">
            <i class="bi bi-hexagon-fill me-2"></i>
            Friendora
        </a>

        <!-- Desktop Search Bar -->
        <div class="search-container mx-3 flex-grow-1 d-none d-lg-block">
            <div class="input-group position-relative">
                <span class="input-group-text cyber-search-icon">
                    <i class="bi bi-search"></i>
                </span>
                <input type="text" class="form-control cyber-search" placeholder="Search Friendora..." id="searchInput" autocomplete="off">
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
            <a class="nav-link cyber-nav-icon" href="#" title="Friends">
                <i class="bi bi-person-fill"></i>
            </a>
            <a class="nav-link cyber-nav-icon" href="#" title="Messages">
                <i class="bi bi-chat-dots-fill"></i>
                <span class="notification-badge">3</span>
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
                    <?php
                    // Use current user's profile pic for navbar, not the profile being viewed
                    $currentUserProfile = $data['current_user'];
                    $currentUserProfileData = null;
                    if (isset($data['profile']) && $data['is_own_profile']) {
                        $currentUserProfileData = $data['profile'];
                    } else {
                        // Fetch current user's profile data for navbar
                        $user_profile_temp = new Profiles;
                        $currentUserProfileData = $user_profile_temp->first(['user_id' => $data['current_user']->id]);
                    }
                    $navbarProfilePic = $currentUserProfileData->pfp ?? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face';
                    ?>
                    <img src="<?php echo $navbarProfilePic; ?>" class="profile-pic-nav" alt="Profile">
                </a>
                <div class="user-dropdown-container" id="userDropdownContainer">
                    <div class="user-dropdown">
                        <div class="user-dropdown-header">
                            <img src="<?php echo $navbarProfilePic; ?>" class="user-dropdown-avatar" alt="Profile">
                            <div class="user-dropdown-info">
                                <h6><?php echo $data['current_user']->fname . " " . $data['current_user']->lname; ?></h6>
                                <p><a href="<?= Utils::profileUrl(); ?>" style="color: inherit; text-decoration: none;">See your profile</a></p>
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
            </div>
        </div>

        <!-- Mobile User Icon -->
        <div class="d-lg-none">
            <a class="nav-link user-dropdown-toggle" href="#" onclick="toggleUserDropdown()">
                <img src="<?php echo  $navbarProfilePic; ?>" class="profile-pic-nav" alt="Profile">
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
                    <input type="text" class="form-control cyber-search" placeholder="Search Friendora..." id="mobileSearchInput" autocomplete="off">
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
                <a class="mobile-nav-item" href="#">
                    <i class="bi bi-person-fill"></i>
                    <span>Friends</span>
                </a>
                <a class="mobile-nav-item" href="#">
                    <i class="bi bi-chat-dots-fill"></i>
                    <span>Messages</span>
                    <span class="notification-badge">3</span>
                </a>
                <a class="mobile-nav-item" href="#" onclick="toggleMobileNotifications()">
                    <i class="bi bi-bell-fill"></i>
                    <span>Notifications</span>
                    <span class="notification-badge" id="mobileNotificationCount">7</span>
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
        </div>
    </div>
</nav>

    <!-- Main Content -->
    <div class="container-fluid main-content">
        <div class="row">
            <!-- Profile Section -->
            <div class="col-lg-8 mx-auto">
                <!-- Cover Photo Section -->
                <div class="cover-section">
                    <div class="cover-photo">
                        <?php
                        $coverPhoto = $profile->coverpic ?? 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop';
                        ?>
                        <img src="<?php echo $coverPhoto; ?>" alt="Cover Photo" class="cover-img" id="coverPhoto">
                        
                        <div class="cover-overlay">
                            <?php if($data['is_own_profile']): // Check if own profile ?>
                            <button class="btn cyber-btn-secondary edit-cover-btn" onclick="openCoverPhotoModal()">
                                <i class="bi bi-camera-fill me-2"></i>Edit Cover
                            </button>
                            <?php endif; ?>
                        </div>
                    </div>

                    <!-- Profile Picture and Basic Info -->
                    <div class="profile-header">
                        <div class="profile-pic-container">
                            <?php
                            $profilePicMain = $profile->pfp ?? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
                            ?>
                            <img src="<?php echo $profilePicMain; ?>" alt="Profile Picture" class="profile-pic-main" id="profilePic">
                            
                            <?php if($data['is_own_profile']): // Check if own profile ?>
                            <button class="btn cyber-btn-primary edit-pic-btn" onclick="openProfilePhotoModal()">
                                <i class="bi bi-camera-fill"></i>
                            </button>
                            <?php endif; ?>
                        </div>

                        <div class="profile-info">
                            <h1 class="profile-name"><?php echo $data['profile_user']->fname . " " . $data['profile_user']->minit . " " . $data['profile_user']->lname; ?></h1>
                            
                            <p class="profile-bio" ><?php echo $profile->shortBio ?? 'Digital artist exploring the boundaries between reality and dreams ✨'; ?></p>
                            
                            <div class="profile-stats">
                                <span class="stat-item">
                                    <strong>1.2K</strong> Friends
                                </span>
                                <span class="stat-item">
                                    <strong>847</strong> Following
                                </span>
                            </div>
                        </div>

                        <!-- Conditional Profile Actions -->
                        <div class="profile-actions">
                            <?php if($data['is_own_profile']): // Own profile ?>
                            <button class="btn cyber-btn-primary" id="ownProfileActions" style="display: block;">
                                <i class="bi bi-plus-circle me-2"></i>Add Story
                            </button>
                            <button class="btn cyber-btn-secondary" id="editProfileBtn" style="display: block;">
                                <i class="bi bi-pencil me-2"></i>Edit Profile
                            </button>
                            <?php else: // Other user's profile ?>
                            <button class="btn cyber-btn-primary" id="followBtn" onclick="followUser()" style="display: block;">
                                <i class="bi bi-person-plus me-2"></i>
                                <span id="followBtnText">Follow</span>
                            </button>
                            <button class="btn cyber-btn-secondary" id="messageBtn" onclick="messageUser()" style="display: block;">
                                <i class="bi bi-chat-dots me-2"></i>Message
                            </button>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

                <!-- Profile Content -->
                <div class="row mt-4">
                    <!-- Left Column - About -->
                    <div class="col-lg-5">
                        <div class="cyber-card about-card">
                            <div class="card-header">
                                <h5><i class="bi bi-person-circle me-2"></i>About</h5>
                                <?php if($data['is_own_profile']): ?>
                                <button class="btn btn-sm cyber-btn-ghost" id="editAboutBtn" onclick="openEditProfileModal()">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <?php endif; ?>
                            </div>
                            <div class="card-body">
                                <div class="about-grid" id="aboutSection">
                                    <?php if($profile): ?>
                                    <div class="about-item">
                                        <i class="bi bi-geo-alt-fill"></i>
                                        <span class="about-label">Lives in:</span>
                                        <span class="about-value"><?php echo $profile->city ?? 'Not specified'; ?></span>
                                    </div>
                                    <div class="about-item">
                                        <i class="bi bi-house-fill"></i>
                                        <span class="about-label">From:</span>
                                        <span class="about-value"><?php echo $profile->hometown ?? 'Not specified'; ?></span>
                                    </div>
                                    <div class="about-item">
                                        <i class="bi bi-calendar-fill"></i>
                                        <span class="about-label">Born:</span>
                                        <span class="about-value"><?php echo $data['profile_user']->DOB ? Utils::getDate($data['profile_user']->DOB) : 'Not specified'; ?></span>
                                    </div>
                                    <div class="about-item">
                                        <i class="bi bi-gender-ambiguous"></i>
                                        <span class="about-label">Gender:</span>
                                        <span class="about-value"><?php echo $data['profile_user']->gender ?? 'Not specified'; ?></span>
                                    </div>
                                    <div class="about-item">
                                        <i class="bi bi-mortarboard-fill"></i>
                                        <span class="about-label">Studied at:</span>
                                        <span class="about-value"><?php echo $profile->university ?? 'Not specified'; ?></span>
                                    </div>
                                    <div class="about-item">
                                        <i class="bi bi-briefcase-fill"></i>
                                        <span class="about-label">Works at:</span>
                                        <span class="about-value"><?php echo $profile->work ?? 'Not specified'; ?></span>
                                    </div>
                                    <?php if($websites && count($websites) > 0): ?>
                                    <div class="about-item">
                                        <i class="bi bi-globe"></i>
                                        <span class="about-label">Website:</span>
                                        <span class="about-value">
                                            <?php foreach($websites as $website): ?>
                                            <a href="<?php echo $website->url; ?>" target="_blank" class="text-decoration-none"><?php echo $website->url; ?></a><br>
                                            <?php endforeach; ?>
                                        </span>
                                    </div>
                                    <?php endif; ?>
                                    <div class="about-item">
                                        <i class="bi bi-translate"></i>
                                        <span class="about-label">Languages:</span>
                                        <span class="about-value"><?php echo $profile->lang ?? 'Not specified'; ?></span>
                                    </div>
                                    <div class="about-item">
                                        <i class="bi bi-quote"></i>
                                        <span class="about-label">Favorite Quote:</span>
                                        <span class="about-value"><?php echo $profile->socialQuote ?? 'Not specified'; ?></span>
                                    </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>

                        <!-- Photos Section -->
                        <div class="cyber-card photos-card mt-3">
                            <div class="card-header">
                                <h5><i class="bi bi-images me-2"></i>Photos</h5>
                                <a href="#" class="text-decoration-none" onclick="openPhotoGallery()">See All</a>
                            </div>
                            <div class="card-body">
                                <div class="photos-grid" id="photosGrid">
                                    <?php
                                    if($photos && count($photos) > 0):
                                        $displayPhotos = array_slice($photos, 0, 6);
                                        foreach($displayPhotos as $index => $photo):
                                    ?>
                                    <img src="<?php echo $photo->url; ?>" class="photo-item" onclick="openPhotoModal('<?php echo $photo->url; ?>', <?php echo $index; ?>)" alt="User Photo">
                                    <?php 
                                        endforeach;
                                    else:
                                    ?>
                                    <p class="text-muted">No photos yet</p>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Posts -->
                    <div class="col-lg-7">
                        <?php include 'post.view.php'; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Cover Photo Upload Modal -->
    <div class="modal fade" id="coverPhotoModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content cyber-modal">
                <div class="modal-header">
                    <h5 class="modal-title">Update Cover Photo</h5>
                    <button type="button" class="btn-close cyber-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form action="" method="POST" enctype="multipart/form-data" id="coverPhotoForm">
                        <div class="upload-area" id="coverUploadArea">
                            <div class="upload-placeholder">
                                <i class="bi bi-cloud-upload display-1"></i>
                                <h4>Upload Cover Photo</h4>
                                <p>Drag and drop or click to select</p>
                                <input type="file" id="coverPhotoInput" name="cover_photo" accept="image/*" style="display: none;">
                            </div>
                            <div class="upload-preview" id="coverPreview" style="display: none;">
                                <img id="coverPreviewImg" alt="Cover Preview">
                                <div class="preview-actions">
                                    <button type="button" class="btn cyber-btn-secondary" onclick="removeCoverPreview()">Remove</button>
                                    <button type="button" class="btn cyber-btn-primary" onclick="uploadCoverPhoto()">Upload</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Profile Photo Upload Modal -->
    <div class="modal fade" id="profilePhotoModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content cyber-modal">
                <div class="modal-header">
                    <h5 class="modal-title">Update Profile Picture</h5>
                    <button type="button" class="btn-close cyber-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form action="" method="POST" enctype="multipart/form-data" id="profilePhotoForm">
                        <div class="upload-area" id="profileUploadArea">
                            <div class="upload-placeholder">
                                <i class="bi bi-person-circle display-1"></i>
                                <h4>Upload Profile Picture</h4>
                                <p>Drag and drop or click to select</p>
                                <input type="file" id="profilePhotoInput" name="profile_photo" accept="image/*" style="display: none;">
                            </div>
                            <div class="upload-preview" id="profilePreview" style="display: none;">
                                <img id="profilePreviewImg" alt="Profile Preview">
                                <div class="preview-actions">
                                    <button type="button" class="btn cyber-btn-secondary" onclick="removeProfilePreview()">Remove</button>
                                    <button type="button" class="btn cyber-btn-primary" onclick="uploadProfilePhoto()">Upload</button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Photo Gallery Modal with Pagination -->
    <div class="modal fade" id="photoGalleryModal" tabindex="-1">
        <div class="modal-dialog modal-xl">
            <div class="modal-content cyber-modal">
                <div class="modal-header">
                    <h5 class="modal-title">Photo Gallery</h5>
                    <button type="button" class="btn-close cyber-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="photo-gallery-container">
                        <div class="gallery-main">
                            <img id="galleryMainImage" src="<?=ROOT?>/assets/images/placeholder.svg" alt="Gallery Image" class="gallery-main-img">
                            <button class="gallery-nav-btn gallery-prev" onclick="previousPhoto()">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                            <button class="gallery-nav-btn gallery-next" onclick="nextPhoto()">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                        <div class="gallery-thumbnails" id="galleryThumbnails">
                            <!-- Thumbnails will be populated by JavaScript -->
                        </div>
                        <div class="gallery-pagination">
                            <span id="photoCounter">1 of 1</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal fade" id="editProfileModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content cyber-modal">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Profile</h5>
                    <button type="button" class="btn-close cyber-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="editProfileForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Current City</label>
                                <input type="text" class="form-control cyber-input" id="currentCity" name="city" value="<?php echo isset($profile->city) ? $profile->city : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Hometown</label>
                                <input type="text" class="form-control cyber-input" id="hometown" name="hometown" value="<?php echo isset($profile->hometown) ? $profile->hometown : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Birthday</label>
                                <input type="date" class="form-control cyber-input" id="birthday" name="DOB" value="<?php echo $data['current_user']->DOB ?? ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Gender</label>
                                <select class="form-select cyber-input" id="gender" name="gender">
                                    <option value="">Select Gender</option>
                                    <option value="male" <?php echo $data['current_user']->gender == 'male' ? 'selected' : ''; ?>>Male</option>
                                    <option value="female" <?php echo $data['current_user']->gender == 'female' ? 'selected' : ''; ?>>Female</option>
                                    <option value="non-binary" <?php echo $data['current_user']->gender == 'non-binary' ? 'selected' : ''; ?>>Non-binary</option>
                                    <option value="prefer-not-to-say" <?php echo $data['current_user']->gender == 'prefer-not-to-say' ? 'selected' : ''; ?>>Prefer not to say</option>
                                </select>
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label">Bio</label>
                                <textarea class="form-control cyber-input" rows="3" id="bioInput" name="shortBio"><?php echo isset($profile->shortBio) ? $profile->shortBio : ''; ?></textarea>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">High School</label>
                                <input type="text" class="form-control cyber-input" id="highSchool" name="highschool" value="<?php echo isset($profile->highschool) ? $profile->highschool : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">College</label>
                                <input type="text" class="form-control cyber-input" id="college" name="college" value="<?php echo isset($profile->college) ? $profile->college : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">University</label>
                                <input type="text" class="form-control cyber-input" id="university" name="university" value="<?php echo isset($profile->university) ? $profile->university : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Workplace</label>
                                <input type="text" class="form-control cyber-input" id="workplace" name="work" value="<?php echo isset($profile->work) ? $profile->work : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Political Views</label>
                                <input type="text" class="form-control cyber-input" id="politicalViews" name="polViews" value="<?php echo isset($profile->polViews) ? $profile->polViews : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Religion</label>
                                <input type="text" class="form-control cyber-input" id="religion" name="religion" value="<?php echo isset($profile->religion) ? $profile->religion : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Country</label>
                                <input type="text" class="form-control cyber-input" id="country" name="country" value="<?php echo $profile->country ?? ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Website</label>
                                <input type="url" class="form-control cyber-input" id="website" name="website" value="<?php echo isset($websites[0]) ? $websites[0]->url : ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Language</label>
                                <input type="text" class="form-control cyber-input" id="language" name="lang" value="<?php echo $profile->lang ?? ''; ?>">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Professional</label>
                                <input type="text" class="form-control cyber-input" id="professional" name="professional" value="<?php echo $profile->professional ?? ''; ?>">
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label">Favorite Quote</label>
                                <textarea class="form-control cyber-input" rows="2" id="quotes" name="socialQuote"><?php echo $profile->socialQuote ?? ''; ?></textarea>
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label">Life Events</label>
                                <textarea class="form-control cyber-input" rows="3" id="lifeEvents" name="lifeEvent"><?php echo $profile->lifeEvent ?? ''; ?></textarea>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn cyber-btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn cyber-btn-primary" id="saveProfileBtn">Save Changes</button>
                </div>
            </div>
        </div>
    </div>

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
            <img src="<?php echo  $navbarProfilePic; ?>" class="user-dropdown-avatar" alt="Profile">
            <div class="user-dropdown-info">
                <h6><?php echo Utils::user('fname') . " " . Utils::user('lname'); ?></h6>
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Pass PHP data to JavaScript BEFORE loading profile.js -->
    <script>
        // Debug PHP variables in view
     
        
        // Pass profile data to JavaScript
        window.profileData = <?php echo json_encode($profile ?? new stdClass()); ?>;
        window.profileUser = <?php echo json_encode($data['profile_user'] ?? new stdClass()); ?>;
        window.currentUser = <?php echo json_encode($data['current_user'] ?? new stdClass()); ?>;
        window.websiteData = <?php echo json_encode($websites ?? []); ?>;
        window.photosData = <?php echo json_encode($photos ?? []); ?>;
        window.postsData = <?php echo json_encode($posts ?? []); ?>;
        window.currentUserId = <?php echo $data['current_user']->id ?? 0; ?>;
        window.profileUserId = <?php echo $data['profile_user']->id ?? 0; ?>;
        window.isOwnProfile = <?php echo json_encode($data['is_own_profile'] ?? false); ?>;
        window.currentUserProfilePic = "<?= $navbarProfilePic ?>";
        window.ROOT = "<?=ROOT?>";
</script>
    
    <script src="<?=ROOT?>/assets/scripts/profile.js"></script>
</body>
