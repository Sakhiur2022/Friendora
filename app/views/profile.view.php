<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Friendora</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    
    <!-- Modular CSS Files -->
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/style.css">
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/nav.css">
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/profile.css">
    
    <link rel="icon" type="image/svg+xml" href="<?=ROOT?>/assets/images/favicon.svg">
</head>
<body>
    <!-- Background Music -->
    <audio id="bgMusic" loop preload="auto">
       
      
        <!-- Fallback: Use a local file if available -->
        <source src="<?=ROOT?>/assets/musics/profile-music.mp3" type="audio/mpeg">
        <source src="<?=ROOT?>/assets/musics/profile-music.wav" type="audio/wav">
        <source src="<?=ROOT?>/assets/musics/profile-music.ogg" type="audio/ogg">
        Your browser does not support the audio element.
    </audio>

    <!-- Navigation Bar -->
    <nav class="navbar navbar-expand-lg fixed-top cyber-nav">
      <div class="container-fluid">
        <!-- Logo -->
        <a class="navbar-brand cyber-logo" href="#">
          <i class="bi bi-hexagon-fill me-2"></i>
          Friendora
        </a>
        
        <!-- Mobile Search Bar (visible only on mobile) -->
        <div class="mobile-search-container d-lg-none flex-grow-1 mx-3">
          <div class="input-group position-relative">
            <span class="input-group-text cyber-search-icon">
              <i class="bi bi-search"></i>
            </span>
            <input type="text" class="form-control cyber-search" placeholder="Search..." id="mobileSearchInput" autocomplete="off">
            <button class="btn cyber-btn-ghost advanced-search-btn" type="button" onclick="openAdvancedSearch()" title="Advanced Search">
              <i class="bi bi-three-dots"></i>
            </button>
            <div class="search-suggestions" id="mobileSearchSuggestions"></div>
          </div>
        </div>
        
        <!-- Hamburger for mobile -->
        <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#mobileNav" aria-controls="mobileNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <!-- Desktop Nav -->
        <div class="collapse navbar-collapse d-none d-lg-flex" id="navbarNav">
          <div class="search-container mx-3 flex-grow-1">
            <div class="input-group position-relative">
              <span class="input-group-text cyber-search-icon">
                <i class="bi bi-search"></i>
              </span>
              <input type="text" class="form-control cyber-search" placeholder="Search Friendora..." id="searchInput" autocomplete="off">
              <button class="btn cyber-btn-ghost advanced-search-btn" type="button" onclick="openAdvancedSearch()" title="Advanced Search">
                <i class="bi bi-three-dots"></i>
              </button>
              <div class="search-suggestions" id="searchSuggestions"></div>
            </div>
          </div>
          <div class="navbar-nav flex-row align-items-center ms-auto">
            <a class="nav-link cyber-nav-icon" href="#" title="Home">
              <i class="bi bi-house-fill"></i>
            </a>
            <a class="nav-link cyber-nav-icon" href="#" title="Groups">
              <i class="bi bi-people-fill"></i>
            </a>
            <a class="nav-link cyber-nav-icon position-relative" href="#" id="messagesIcon" title="Messages">
              <i class="bi bi-chat-dots-fill"></i>
              <span class="notification-badge">3</span>
            </a>
            <!-- Notification Dropdown -->
            <div class="nav-item dropdown">
              <a class="nav-link cyber-nav-icon dropdown-toggle" href="#" id="notificationDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" title="Notifications">
                <i class="bi bi-bell-fill"></i>
                <span class="notification-badge" id="notificationCount">7</span>
              </a>
              <ul class="dropdown-menu cyber-dropdown notification-dropdown dropdown-menu-end" aria-labelledby="notificationDropdown">
                <li class="dropdown-header d-flex justify-content-between align-items-center">
                  <span>Notifications</span>
                  <button class="btn btn-sm cyber-btn-ghost ms-2" onclick="markAllAsRead()">Mark all as read</button>
                </li>
                <div id="notificationsList">
                  <!-- Example notification -->
                  <li class="notification-item unread">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" class="notification-avatar">
                    <div class="notification-content">
                      <p>John Doe sent you a friend request.</p>
                      <small>2 min ago</small>
                    </div>
                  </li>
                  <li class="notification-item">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" class="notification-avatar">
                    <div class="notification-content">
                      <p>Jane Smith liked your post.</p>
                      <small>10 min ago</small>
                    </div>
                  </li>
                </div>
                <li class="dropdown-footer">
                  <a href="#" class="btn cyber-btn-ghost w-100">See All Notifications</a>
                </li>
              </ul>
            </div>
            <!-- User Profile Dropdown -->
            <div class="nav-item dropdown ms-2">
              <a class="nav-link p-0" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" class="profile-pic-nav" alt="Profile">
              </a>
              <ul class="dropdown-menu dropdown-menu-end cyber-dropdown" aria-labelledby="userDropdown">
                <li><a class="dropdown-item" href="#"><i class="bi bi-person-circle me-2"></i>View Profile</a></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Offcanvas Mobile Nav -->
        <div class="offcanvas offcanvas-start d-lg-none" tabindex="-1" id="mobileNav" aria-labelledby="mobileNavLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="mobileNavLabel">Friendora</h5>
            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body">
            <!-- User Profile Section at top -->
            <div class="user-profile-mobile mb-4">
              <div class="d-flex align-items-center p-3 rounded" style="background: linear-gradient(145deg, rgba(0, 212, 255, 0.1), rgba(131, 56, 236, 0.1)); border: 1px solid rgba(0, 212, 255, 0.2);">
                <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face" class="profile-pic-mobile me-3" alt="Profile" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--cyber-primary);">
                <div class="flex-grow-1">
                  <h6 class="mb-0" style="color: var(--cyber-text);">Alexandra Chen</h6>
                  <small style="color: var(--cyber-text-muted);">View your profile</small>
                </div>
                <!-- User Profile Dropdown Toggle -->
                <button class="btn btn-sm cyber-btn-ghost" type="button" data-bs-toggle="collapse" data-bs-target="#mobileUserOptions" aria-expanded="false" style="border: 1px solid rgba(0, 212, 255, 0.3); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                  <i class="bi bi-three-dots-vertical" style="color: var(--cyber-primary);"></i>
                </button>
              </div>
              
              <!-- User Profile Options Dropdown -->
              <div class="collapse mt-3" id="mobileUserOptions">
                <div class="d-flex flex-column gap-2 p-3 rounded" style="background: var(--cyber-glass); border: 1px solid var(--cyber-glass-border);">
                  <a class="nav-link cyber-nav-icon d-flex align-items-center" href="#" onclick="openEditProfileModal()">
                    <i class="bi bi-person-circle me-2" style="color: var(--cyber-primary);"></i>
                    <span>View Profile</span>
                  </a>
                  <a class="nav-link cyber-nav-icon d-flex align-items-center" href="#" onclick="openEditProfileModal()">
                    <i class="bi bi-gear me-2" style="color: var(--cyber-primary);"></i>
                    <span>Settings & Privacy</span>
                  </a>
                  <a class="nav-link cyber-nav-icon d-flex align-items-center" href="#" onclick="toggleBackgroundMusic()">
                    <i class="bi bi-music-note me-2" style="color: var(--cyber-primary);"></i>
                    <span>Toggle Music</span>
                  </a>
                  <hr style="border-color: var(--cyber-glass-border); margin: 0.5rem 0;">
                  <a class="nav-link cyber-nav-icon d-flex align-items-center text-danger" href="<?=ROOT?>/logout" onclick="confirmLogout(event)">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    <span>Logout</span>
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Main Navigation Menu -->
            <div class="mobile-nav-section">
              <h6 class="mobile-nav-header">Main Menu</h6>
              <div class="d-flex flex-column gap-3">
                <a class="nav-link cyber-nav-icon d-flex align-items-center" href="#">
                  <i class="bi bi-house-fill me-3"></i>
                  <span>Home</span>
                </a>
                <a class="nav-link cyber-nav-icon d-flex align-items-center" href="#">
                  <i class="bi bi-people-fill me-3"></i>
                  <span>Groups</span>
                </a>
                <a class="nav-link cyber-nav-icon d-flex align-items-center" href="#">
                  <i class="bi bi-compass me-3"></i>
                  <span>Discover</span>
                </a>
              </div>
            </div>
            
            <!-- Quick Actions Section -->
            <div class="mobile-nav-section">
              <h6 class="mobile-nav-header">Quick Actions</h6>
              <div class="d-flex flex-column gap-3">
                <!-- Messages with count -->
                <a class="nav-link cyber-nav-icon d-flex align-items-center justify-content-between" href="#" id="mobileMessagesLink">
                  <div class="d-flex align-items-center">
                    <i class="bi bi-chat-dots-fill me-3"></i>
                    <span>Messages</span>
                  </div>
                  <span class="notification-badge mobile-count-badge" id="mobileMessageCount">3</span>
                </a>
                
                <!-- Notifications - Always Expanded for Better Accessibility -->
                <div class="mobile-notifications-section">
                  <a class="nav-link cyber-nav-icon d-flex align-items-center justify-content-between" href="#" data-bs-toggle="collapse" data-bs-target="#mobileNotifications" aria-expanded="true">
                    <div class="d-flex align-items-center">
                      <i class="bi bi-bell-fill me-3"></i>
                      <span>Notifications</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <span class="notification-badge mobile-count-badge" id="mobileNotificationCount">7</span>
                      <i class="bi bi-chevron-down collapse-indicator"></i>
                    </div>
                  </a>
                  
                  <!-- Notifications List - More Accessible -->
                  <div class="collapse show" id="mobileNotifications">
                    <div class="mobile-notifications-container mt-3">
                      <div class="d-flex justify-content-between align-items-center mb-3">
                        <small class="text-muted">Recent Notifications</small>
                        <button class="btn btn-sm cyber-btn-ghost" onclick="markAllAsRead()" style="font-size: 0.8rem; padding: 0.25rem 0.5rem;">
                          Mark all read
                        </button>
                      </div>
                      <div id="mobileNotificationsList" class="mobile-notifications-list">
                        <div class="mobile-notification-item unread">
                          <img src="https://via.placeholder.com/40x40/007bff/ffffff?text=MT" class="notification-avatar" alt="User">
                          <div class="notification-content">
                            <p>Marcus Tech sent you a friend request.</p>
                            <small>2 min ago</small>
                          </div>
                        </div>
                        <div class="mobile-notification-item">
                          <img src="https://via.placeholder.com/40x40/28a745/ffffff?text=LD" class="notification-avatar" alt="User">
                          <div class="notification-content">
                            <p>Luna Digital liked your post.</p>
                            <small>10 min ago</small>
                          </div>
                        </div>
                      </div>
                      <div class="text-center mt-3">
                        <a href="#" class="btn cyber-btn-ghost btn-sm w-100">See All Notifications</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                        <img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop" 
                             alt="Cover Photo" class="cover-img" id="coverPhoto">
                        
                        <div class="cover-overlay">
                            <button class="btn cyber-btn-secondary edit-cover-btn" onclick="openCoverPhotoModal()">
                                <i class="bi bi-camera-fill me-2"></i>Edit Cover
                            </button>
                        </div>
                    </div>

                    <!-- Profile Picture and Basic Info -->
                    <div class="profile-header">
                        <div class="profile-pic-container">
                            <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" 
                                 alt="Profile Picture" class="profile-pic-main" id="profilePic">
                            
                            <button class="btn cyber-btn-primary edit-pic-btn" onclick="openProfilePhotoModal()">
                                <i class="bi bi-camera-fill"></i>
                            </button>
                        </div>

                        <div class="profile-info">
                            <h1 class="profile-name" id="userName">Alexandra Chen</h1>
                            
                            <p class="profile-bio" id="userBio">Digital artist exploring the boundaries between reality and dreams ✨</p>
                            
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
                            <!-- PHP: Check if viewing own profile -->
                            <!-- <?php if($profile_user_id == $_SESSION['user_id']): ?> -->
                            <button class="btn cyber-btn-primary" id="ownProfileActions" style="display: block;">
                                <i class="bi bi-plus-circle me-2"></i>Add Story
                            </button>
                            <button class="btn cyber-btn-secondary" id="editProfileBtn" style="display: block;">
                                <i class="bi bi-pencil me-2"></i>Edit Profile
                            </button>
                            <!-- <?php else: ?> -->
                            <button class="btn cyber-btn-primary" id="followBtn" onclick="followUser()" style="display: none;">
                                <i class="bi bi-person-plus me-2"></i>
                                <span id="followBtnText">Follow</span>
                            </button>
                            <button class="btn cyber-btn-secondary" id="messageBtn" onclick="messageUser()" style="display: none;">
                                <i class="bi bi-chat-dots me-2"></i>Message
                            </button>
                            <!-- <?php endif; ?> -->
                        </div>
                    </div>
                </div>

                <!-- Profile Content - Facebook Style Layout -->
                <div class="row mt-3">
                    <!-- Left Sidebar - About & Photos (Facebook style) -->
                    <div class="col-lg-5">
                        <!-- About Section -->
                        <div class="cyber-card about-card mb-3">
                            <div class="card-header">
                                <h5><i class="bi bi-person-circle me-2"></i>About</h5>
                                <button class="btn btn-sm cyber-btn-ghost" id="editAboutBtn">
                                    <i class="bi bi-pencil"></i>
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="about-grid" id="aboutSection">
                                    <!-- Will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>

                        <!-- Photos Section -->
                        <div class="cyber-card photos-card mb-3">
                            <div class="card-header">
                                <h5><i class="bi bi-images me-2"></i>Photos</h5>
                                <a href="#" class="see-all-link" onclick="openPhotoGallery()">See All</a>
                            </div>
                            <div class="card-body">
                                <div class="photos-grid" id="photosGrid">
                                    <!-- Will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>

                        <!-- Friends Section -->
                        <div class="cyber-card friends-card">
                            <div class="card-header">
                                <h5><i class="bi bi-people me-2"></i>Friends</h5>
                                <a href="#" class="see-all-link" onclick="openFriendsModal()">See All</a>
                            </div>
                            <div class="card-body">
                                <div class="friends-preview" id="friendsPreview">
                                    <!-- Will be populated by JavaScript -->
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Posts -->
                    <div class="col-lg-7">
                        <!-- Create Post -->
                        <div class="cyber-card create-post-card">
                            <div class="card-body">
                                <div class="d-flex align-items-center mb-3">
                                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face" 
                                         class="profile-pic-small me-3" alt="Your Profile">
                                    <input type="text" class="form-control create-post-input" placeholder="What's on your mind, Alexandra?" id="postInput">
                                </div>
                                <div class="post-actions">
                                    <button class="btn cyber-btn-ghost">
                                        <i class="bi bi-image me-2"></i>Photo
                                    </button>
                                    <button class="btn cyber-btn-ghost">
                                        <i class="bi bi-emoji-smile me-2"></i>Feeling
                                    </button>
                                    <button class="btn cyber-btn-primary ms-auto" id="sharePostBtn">
                                        Share
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Posts Feed -->
                        <div id="postsContainer">
                            <!-- Will be populated by JavaScript -->
                        </div>
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
                    <div class="upload-area" id="coverUploadArea">
                        <div class="upload-placeholder">
                            <i class="bi bi-cloud-upload display-1"></i>
                            <h4>Upload Cover Photo</h4>
                            <p>Drag and drop or click to select</p>
                            <input type="file" id="coverPhotoInput" accept="image/*" style="display: none;">
                            <!-- PHP: Form will submit to upload_cover.php -->
                            <!-- <form action="upload_cover.php" method="POST" enctype="multipart/form-data"> -->
                        </div>
                        <div class="upload-preview" id="coverPreview" style="display: none;">
                            <img id="coverPreviewImg" alt="Cover Preview">
                            <div class="preview-actions">
                                <button class="btn cyber-btn-secondary" onclick="removeCoverPreview()">Remove</button>
                                <button class="btn cyber-btn-primary" onclick="uploadCoverPhoto()">Upload</button>
                            </div>
                        </div>
                    </div>
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
                    <div class="upload-area" id="profileUploadArea">
                        <div class="upload-placeholder">
                            <i class="bi bi-person-circle display-1"></i>
                            <h4>Upload Profile Picture</h4>
                            <p>Drag and drop or click to select</p>
                            <input type="file" id="profilePhotoInput" accept="image/*" style="display: none;">
                            <!-- PHP: Form will submit to upload_profile.php -->
                            <!-- <form action="upload_profile.php" method="POST" enctype="multipart/form-data"> -->
                        </div>
                        <div class="upload-preview" id="profilePreview" style="display: none;">
                            <img id="profilePreviewImg" alt="Profile Preview">
                            <div class="preview-actions">
                                <button class="btn cyber-btn-secondary" onclick="removeProfilePreview()">Remove</button>
                                <button class="btn cyber-btn-primary" onclick="uploadProfilePhoto()">Upload</button>
                            </div>
                        </div>
                    </div>
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
                            <img id="galleryMainImage" src="/placeholder.svg" alt="Gallery Image" class="gallery-main-img">
                            <button class="gallery-nav-btn gallery-prev" onclick="previousPhoto()">
                                <i class="bi bi-chevron-left"></i>
                            </button>
                            <button class="gallery-nav-btn gallery-next" onclick="nextPhoto()">
                                <i class="bi bi-chevron-right"></i>
                            </button>
                        </div>
                        <div class="gallery-thumbnails" id="galleryThumbnails">
                            <!-- PHP: Loop through all user photos -->
                            <!-- <?php foreach($all_user_photos as $index => $photo): ?>
                            <img src="<?php echo $photo['thumbnail_url']; ?>" 
                                 class="gallery-thumbnail" 
                                 onclick="selectPhoto(<?php echo $index; ?>)"
                                 data-full-url="<?php echo $photo['full_url']; ?>">
                            <?php endforeach; ?> -->
                        </div>
                        <div class="gallery-pagination">
                            <span id="photoCounter">1 of 24</span>
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
                        <!-- PHP: Form will submit to update_profile.php -->
                        <!-- <form action="update_profile.php" method="POST"> -->
                        
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Current City</label>
                                <input type="text" class="form-control cyber-input" id="currentCity" name="current_city">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Hometown</label>
                                <input type="text" class="form-control cyber-input" id="hometown" name="hometown">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Birthday</label>
                                <input type="date" class="form-control cyber-input" id="birthday" name="birthday">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Gender</label>
                                <select class="form-select cyber-input" id="gender" name="gender">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label">Bio</label>
                                <textarea class="form-control cyber-input" rows="3" id="bioInput" name="bio"></textarea>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">High School</label>
                                <input type="text" class="form-control cyber-input" id="highSchool" name="high_school">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">College</label>
                                <input type="text" class="form-control cyber-input" id="college" name="college">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">University</label>
                                <input type="text" class="form-control cyber-input" id="university" name="university">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Workplace</label>
                                <input type="text" class="form-control cyber-input" id="workplace" name="workplace">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Political Views</label>
                                <input type="text" class="form-control cyber-input" id="politicalViews" name="political_views">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Religion</label>
                                <input type="text" class="form-control cyber-input" id="religion" name="religion">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Country</label>
                                <input type="text" class="form-control cyber-input" id="country" name="country">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Website</label>
                                <input type="url" class="form-control cyber-input" id="website" name="website">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Language</label>
                                <input type="text" class="form-control cyber-input" id="language" name="language">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Professional</label>
                                <input type="text" class="form-control cyber-input" id="professional" name="professional">
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label">Favorite Quote</label>
                                <textarea class="form-control cyber-input" rows="2" id="quotes" name="quotes"></textarea>
                            </div>
                            <div class="col-12 mb-3">
                                <label class="form-label">Life Events</label>
                                <textarea class="form-control cyber-input" rows="3" id="lifeEvents" name="life_events"></textarea>
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

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Modular JavaScript Files -->
    <script src="<?=ROOT?>/assets/scripts/main.js"></script>
    <script src="<?=ROOT?>/assets/scripts/nav.js"></script>
    <script src="<?=ROOT?>/assets/scripts/profile.js"></script>
</body>
</html>
