<?=$this->loadview("header",["title"=>"Profile - Friendora"])?>;
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
                            $profilePicMain = $profile->pfp;
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
                                    <strong id="friendsCount">0</strong> 
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
                            <button class="btn cyber-btn-primary" id="friendshipBtn" onclick="handleFriendshipAction()" style="display: block;">
                                <i class="bi bi-person-plus me-2" id="friendshipIcon"></i>
                                <span id="friendshipBtnText">Add Friend</span>
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

                        <!-- Friends Card -->
                        <div class="cyber-card friends-card mt-3">
                            <div class="card-header">
                                <h5><i class="bi bi-people me-2"></i>Friends</h5>
                                <a href="#" class="text-decoration-none" onclick="openFriendsModal()">See All</a>
                            </div>
                            <div class="card-body">
                                <div class="friends-grid" id="friendsGrid">
                                    <!-- Friends will be populated by JavaScript -->
                                    <div class="loading-friends">
                                        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Loading friends...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column - Posts -->
                    <div class="col-lg-7">
                        <!-- Create Post Container - Will be populated by post.js if own profile -->
                        <?php $this->loadView("post"); ?>
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

    <!-- Friends Modal -->
    <div class="modal fade" id="friendsModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content cyber-modal">
                <div class="modal-header">
                    <h5 class="modal-title">Friends</h5>
                    <button type="button" class="btn-close cyber-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="friends-list-container">
                        <div class="friends-search mb-3">
                            <input type="text" class="form-control cyber-input" placeholder="Search friends..." id="friendsSearchInput">
                        </div>
                        <div class="friends-list" id="friendsModalList">
                            <!-- Friends will be populated here -->
                            <div class="loading-friends text-center">
                                <div class="spinner-border" role="status"></div>
                                <p class="mt-2">Loading friends...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

   <?php
$jsData = [
    'profileData' => $profile ?? new stdClass(),
    'profileUser' => $data['profile_user'] ?? new stdClass(),
    'currentUser' => $data['current_user'] ?? new stdClass(),
    'websiteData' => $websites ?? [],
    'photosData' => $photos ?? [],
    'postsData' => $posts ?? [],
    'currentUserId' => $data['current_user']->id ?? 0,
    'profileUserId' => $data['profile_user']->id ?? 0,
    'isOwnProfile' => $data['is_own_profile'] ?? false,
];

$scripts = ['post', 'profile'];

$this->loadView('footer',["jsData" => $jsData, "scripts" => $scripts]);
?>


