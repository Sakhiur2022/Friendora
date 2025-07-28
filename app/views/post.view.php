<!-- Posts Section -->
<div class="posts-section">
    <!-- Create Post Card -->
    <?php if($data['is_own_profile']): // Only show on own profile ?>
    <div class="cyber-card create-post-card mb-4">
        <div class="card-body">
            <form id="createPostForm" enctype="multipart/form-data">
                <div class="d-flex align-items-start mb-3">
                    <?php
                    $userAvatar = $data['profile']->pfp ?? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face';
                    ?>
                    <img src="<?php echo $userAvatar; ?>" class="profile-pic-small me-3" alt="Your Profile">
                    <div class="flex-grow-1">
                        <textarea class="form-control cyber-input post-textarea" 
                                placeholder="What's on your mind, <?php echo $data['current_user']->fname; ?>?" 
                                id="postContent" 
                                name="content" 
                                rows="3"></textarea>
                        
                        <!-- Image Preview Container -->
                        <div id="imagePreviewContainer" class="mt-3" style="display: none;">
                            <div class="position-relative d-inline-block">
                                <img id="imagePreview" src="<?=ROOT?>/assests/images/placeholder.svg" alt="Preview" class="img-fluid rounded" style="max-height: 200px;">
                                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" onclick="removeImagePreview()">
                                    <i class="bi bi-x"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="post-actions d-flex justify-content-between align-items-center">
                    <div class="post-options">
                        <input type="file" id="postImageInput" name="post_image" accept="image/*" style="display: none;">
                        <button type="button" class="btn cyber-btn-ghost me-2" onclick="document.getElementById('postImageInput').click()">
                            <i class="bi bi-image me-2"></i>Photo
                        </button>
                        <button type="button" class="btn cyber-btn-ghost me-2">
                            <i class="bi bi-emoji-smile me-2"></i>Feeling
                        </button>
                        <button type="button" class="btn cyber-btn-ghost me-2">
                            <i class="bi bi-geo-alt me-2"></i>Location
                        </button>
                    </div>
                    <div class="post-submit">
                        <button type="button" class="btn cyber-btn-primary" id="sharePostBtn" onclick="createPost()">
                            <i class="bi bi-send me-2"></i>Share
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <?php endif; ?>

<!-- Posts Feed Container -->
    <div id="postsContainer">
        <!-- Posts will be loaded here dynamically -->
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading posts...</span>
            </div>
            <p class="mt-2 text-muted">Loading posts...</p>
        </div>
    </div>
</div>

<!-- Post Template (Hidden) -->
<template id="postTemplate">
    <div class="cyber-card post-card mb-4" data-post-id="">
        <div class="card-body">
            <div class="post-header d-flex align-items-center mb-3">
                <img src="/placeholder.svg" alt="Author" class="post-author-pic me-3">
                <div class="flex-grow-1">
                    <h6 class="mb-0 post-author-name">Author Name</h6>
                    <small class="post-time">Time ago</small>
                </div>
                <div class="post-menu-container">
                    <div class="dropdown">
                        <button class="btn cyber-btn-ghost post-menu-btn" type="button" data-bs-toggle="dropdown">
                            <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu cyber-dropdown">
                            <li><a class="dropdown-item edit-post-btn" href="#"><i class="bi bi-pencil me-2"></i>Edit Post</a></li>
                            <li><a class="dropdown-item text-danger delete-post-btn" href="#"><i class="bi bi-trash me-2"></i>Delete Post</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="post-content mb-3">
                <!-- Post content will be inserted here -->
            </div>
            
            <div class="post-media mb-3" style="display: none;">
                <!-- Post media will be inserted here -->
            </div>
            
            <div class="post-actions d-flex justify-content-between align-items-center py-2 border-top">
                <button class="btn cyber-btn-ghost like-btn">
                    <i class="bi bi-heart me-2"></i>Like
                </button>
                <button class="btn cyber-btn-ghost comment-btn">
                    <i class="bi bi-chat me-2"></i>Comment
                </button>
                <button class="btn cyber-btn-ghost share-btn">
                    <i class="bi bi-share me-2"></i>Share
                </button>
            </div>
            
            <!-- Comments Section -->
            <div class="comments-section mt-3" style="display: none;">
                <div class="comments-list mb-3">
                    <!-- Comments will be loaded here -->
                </div>
                
                <!-- Add Comment Form -->
                <div class="add-comment-form d-flex align-items-center">
                    <img src="<?php echo $profilePic ?? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'; ?>" 
                         class="comment-avatar me-2" alt="Your Profile">
                    <div class="flex-grow-1">
                        <input type="text" class="form-control cyber-input comment-input" placeholder="Write a comment...">
                    </div>
                    <button class="btn cyber-btn-ghost comment-submit-btn ms-2">
                        <i class="bi bi-send"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- Comment Template (Hidden) -->
<template id="commentTemplate">
    <div class="comment-item d-flex align-items-start mb-2" data-comment-id="">
        <img src="/placeholder.svg" class="comment-avatar me-2" alt="Commenter">
        <div class="comment-content flex-grow-1">
            <div class="comment-bubble">
                <strong class="comment-author">Author Name</strong>
                <p class="comment-text mb-1">Comment content</p>
            </div>
            <div class="comment-actions">
                <button class="btn-link comment-like-btn">Like</button>
                <button class="btn-link comment-reply-btn">Reply</button>
                <span class="comment-time ">Time ago</span>
            </div>
        </div>
    </div>
</template>

<!-- Edit Post Modal -->
<div class="modal fade" id="editPostModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content cyber-modal">
            <div class="modal-header">
                <h5 class="modal-title">Edit Post</h5>
                <button type="button" class="btn-close cyber-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="editPostForm">
                    <input type="hidden" id="editPostId" name="post_id">
                    <div class="mb-3">
                        <label class="form-label">Post Content</label>
                        <textarea class="form-control cyber-input" id="editPostContent" name="content" rows="4"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn cyber-btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn cyber-btn-primary" onclick="savePostEdit()">Save Changes</button>
            </div>
        </div>
    </div>
</div>
