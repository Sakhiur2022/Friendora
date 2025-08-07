// Post-related JavaScript functions for Friendora
// Handles all post operations: loading, displaying, reactions, comments, etc.

let allPosts = []

// Function to generate Create Post HTML
function generateCreatePostHTML(userAvatar, userName) {
  return `
    <div class="cyber-card create-post-card mb-4">
      <div class="card-body">
        <form id="createPostForm" enctype="multipart/form-data">
          <div class="d-flex align-items-start mb-3">
            <img src="${userAvatar}" class="profile-pic-small me-3" alt="Your Profile">
            <div class="flex-grow-1">
              <textarea class="form-control cyber-input post-textarea" 
                      placeholder="What's on your mind, ${userName}?" 
                      id="postContent" 
                      name="content" 
                      rows="3"></textarea>
              
              <!-- Image Preview Container -->
              <div id="imagePreviewContainer" class="mt-3" style="display: none;">
                <div class="position-relative d-inline-block">
                  <img id="imagePreview" src="${window.ROOT || ''}/assets/images/placeholder.svg" alt="Preview" class="img-fluid rounded" style="max-height: 200px;">
                  <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" onclick="removeImagePreview()">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="post-actions d-flex justify-content-between align-items-center">
            <div class="post-options">
              <input type="file" id="postImageInput" name="post_image" accept="image/*" style="display: none;" onchange="handlePostImageSelect(event)">
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
  `;
}

// Function to generate Edit Post Modal HTML
function generateEditPostModalHTML() {
  return `
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
  `;
}

// Function to initialize create post form (if user is on their own profile)
function initializeCreatePostForm(isOwnProfile, userAvatar, userName) {
  if (!isOwnProfile) return;
  
  const createPostContainer = document.getElementById('create-post-container');
  if (createPostContainer) {
    createPostContainer.innerHTML = generateCreatePostHTML(userAvatar, userName);
  }
}

// Function to initialize edit post modal
function initializeEditPostModal() {
  // Check if modal already exists
  if (document.getElementById('editPostModal')) return;
  
  // Add modal to document body
  document.body.insertAdjacentHTML('beforeend', generateEditPostModalHTML());
}

// Main initialization function for post functionality
function initializePostFunctionality(isOwnProfile, userAvatar, userName, userId) {
  console.log("Initializing post functionality for userId:", userId);
  
  // Initialize create post form if this is the user's own profile
  initializeCreatePostForm(isOwnProfile, userAvatar, userName);
  
  // Initialize edit post modal
  initializeEditPostModal();
  
  // Load posts for the profile
  if (userId) {
    loadUserPosts(userId);
  }
}



// Helper function to reload posts for current profile
function reloadCurrentUserPosts() {
  const userId = window.profileUserId || window.currentUserId;
  if (userId && typeof loadUserPosts === 'function') {
    loadUserPosts(userId);
  }
}
function loadUserPosts(userId) {
  console.log("loadUserPosts() called for userId:", userId);
  const postsContainer = document.getElementById("post-container");
  if (!postsContainer) {
    console.log("post-container not found");
    return;
  }
  
  // Add loading indicator
  postsContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading posts...</span></div></div>';
  
  const postUrl = window.ROOT ? `${window.ROOT}/post/getUserPosts/${userId}` : `./post/getUserPosts/${userId}`;
  
  fetch(postUrl, {
    method: "GET",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      
      if (data.success) {
        console.log("Posts loaded successfully:", data.posts);
        allPosts = data.posts || [];
        displayPosts(allPosts);
      } else {
        console.error("Error loading posts:", data.message);
        postsContainer.innerHTML = '<p class="text-center text-danger">Error loading posts</p>';
      }
    })
    .catch((error) => {
      console.error('Error loading posts:', error);
      postsContainer.innerHTML = '<p class="text-center text-danger">Failed to load posts</p>';
    });
}

// Transform raw posts data from PHP to match expected format
function transformPostsData(rawPosts) {
  if (!rawPosts || !Array.isArray(rawPosts)) {
    console.log("No posts data available");
    return [];
  }
  
  console.log("Transforming posts data:", rawPosts.length, "posts");
  console.log("Profile user:", window.profileUser);
  console.log("Current user:", window.currentUser);
  
  return rawPosts.map(post => {
    // Calculate time ago
    const postDate = new Date(post.created_at);
    const now = new Date();
    const diffInMs = now - postDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    let timeAgo;
    if (diffInDays > 0) {
      timeAgo = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      timeAgo = `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      timeAgo = "Just now";
    }
    
    // Get author info - use profile user data
    const authorName = `${window.profileUser.fname} ${window.profileUser.lname}`;
    const authorAvatar = window.profileData.pfp || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face';
    
    // Transform media data
    const media = post.media ? post.media.map(mediaItem => ({
      url: mediaItem.media_url,
      type: mediaItem.media_type
    })) : [];
    
    return {
      id: post.id,
      content: post.content,
      creator_id: post.creator_id,
      author_name: authorName,
      author_avatar: authorAvatar,
      time_ago: timeAgo,
      media: media,
      created_at: post.created_at,
      like_count: parseInt(post.like_count) || 0,
      haha_count: parseInt(post.haha_count) || 0,
      wow_count: parseInt(post.wow_count) || 0,
      angry_count: parseInt(post.angry_count) || 0,
      share_count: parseInt(post.share_count) || 0,
      comment_count: parseInt(post.comment_count) || 0
    };
  });
}

// Post Functions
function loadPosts() {
  console.log("loadPosts() called");
  const postsContainer = document.getElementById("postsContainer") || document.getElementById("post-container");
  if (!postsContainer) {
    console.log("postsContainer not found");
    return;
  }
  
  console.log("Posts data available:", window.postsData);
  
  // Use posts data from PHP instead of fetching
  if (window.postsData && Array.isArray(window.postsData)) {
    console.log("Loading posts from PHP data:", window.postsData);
    // Transform the raw posts data to match the expected format
    const transformedPosts = transformPostsData(window.postsData);
    console.log("Transformed posts:", transformedPosts);
    displayPosts(transformedPosts);
    return;
  }
  
  console.log("No PHP posts data, fetching from server");
  // Add loading indicator
  postsContainer.innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div></div>';
  
  const postUrl = window.ROOT ? `${window.ROOT}/post` : './post';
  
  fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: `action=get_posts&user_id=${window.profileUserId}`,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      
      if (data.success) {
        allPosts = data.posts || [];
        displayPosts(allPosts);
      } else {
        console.error("Error loading posts:", data.message);
        postsContainer.innerHTML = '<p class="text-center text-danger">Error loading posts</p>';
      }
    })
    .catch((error) => {
      console.error('Error loading posts:', error);
      postsContainer.innerHTML = '<p class="text-center text-danger">Error loading posts</p>';
    });
}

function displayPosts(posts) {
  console.log("displayPosts() called with:", posts);
  const postsContainer = document.getElementById("postsContainer") || document.getElementById("post-container");
  if (!postsContainer) {
    console.log("postsContainer element not found");
    return;
  }

  if (!posts || posts.length === 0) {
    console.log("No posts to display");
    
    // Check if this is the current user's own profile
    const isOwnProfile = window.currentUserId == window.profileUserId;
    
    if (isOwnProfile) {
      // Message for own profile
      postsContainer.innerHTML = `
        <div class="cyber-card text-center py-5">
          <div class="cyber-glow-container">
            <i class="bi bi-stars cyber-icon display-1 mb-3"></i>
            <h4 class="cyber-text-glow mb-3">✨ No Dreams Shared Yet ✨</h4>
            <p class="text-muted cyber-text-fade">The digital dreamscape awaits your first creation...</p>
            <div class="cyber-pulse-ring mx-auto mt-4"></div>
          </div>
        </div>
      `
    } else {
      // Message for other user's profile
      const profileUserName = window.profileUser?.fname || 'This user';
      postsContainer.innerHTML = `
        <div class="cyber-card text-center py-5">
          <div class="cyber-glow-container">
            <i class="bi bi-moon-stars cyber-icon display-1 mb-3"></i>
            <h4 class="cyber-text-glow mb-3">🌙 ${profileUserName} hasn't shared any dreams yet 🌙</h4>
            <p class="text-muted cyber-text-fade">Their journey in the digital realm is just beginning...</p>
            <div class="cyber-pulse-ring mx-auto mt-4"></div>
          </div>
        </div>
      `
    }
    return
  }

  // Process posts to ensure proper reaction count structure
  posts.forEach(post => {
    // Ensure reactions structure exists with proper counts from PHP
    if (!post.reactions) {
      post.reactions = {
        like: parseInt(post.like_count) || 0,
        haha: parseInt(post.haha_count) || 0,
        wow: parseInt(post.wow_count) || 0,
        angry: parseInt(post.angry_count) || 0
      };
    }
    
    // Ensure share_count is properly set
    post.share_count = parseInt(post.share_count) || 0;
    
    console.log(`Post ${post.id} reaction counts:`, post.reactions, `shares: ${post.share_count}`);
  });

  console.log("Creating HTML for", posts.length, "posts");
  postsContainer.innerHTML = posts.map((post) => createPostHTML(post)).join("")

  // Add event listeners to post elements
  posts.forEach((post) => {
    const postElement = document.querySelector(`[data-post-id="${post.id}"]`)
    if (postElement) {
      // Edit post button
      const editBtn = postElement.querySelector(".edit-post-btn")
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.preventDefault()
          editPost(post.id)
        })
      }

      // Delete post button
      const deleteBtn = postElement.querySelector(".delete-post-btn")
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.preventDefault()
          deletePost(post.id)
        })
      }

      // Comment submit (the comment button now uses onclick in HTML)
      const commentSubmitBtn = postElement.querySelector(".comment-submit-btn")
      const commentInput = postElement.querySelector(".comment-input")
      if (commentSubmitBtn && commentInput) {
        commentSubmitBtn.addEventListener("click", () => {
          submitComment(post.id)
        })

        commentInput.addEventListener("keypress", (e) => {
          if (e.key === "Enter") {
            submitComment(post.id)
          }
        })
      }
    }
  })
}

function createPostHTML(post) {
  const isOwnPost = post.creator_id == window.currentUserId
  const mediaHTML =
    post.media && post.media.length > 0
      ? `<div class="post-media mb-3">
      ${post.media.map((media) => `<img src="${media.url}" alt="Post media" class="post-image">`).join("")}
    </div>`
      : ""

  return `
    <div class="cyber-card post-card mb-4" data-post-id="${post.id}">
      <div class="card-body">
        <div class="post-header d-flex align-items-center mb-3">
          <img src="${post.author_avatar}" alt="${post.author_name}" class="post-author-pic me-3">
          <div class="flex-grow-1">
            <h6 class="mb-0 post-author-name">${createUserLink(post.creator_id, post.author_name)}</h6>
            <small class=" post-time">${post.time_ago}</small>
          </div>
          ${
            isOwnPost
              ? `
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
          `
              : ""
          }
        </div>
        
        <div class="post-content mb-3">${post.content}</div>
        
        ${mediaHTML}
        
        <!-- Cyberpunk Reaction System -->
        <div class="post-reactions-container mb-3">
          <div class="reaction-counts d-flex align-items-center gap-3">
            <span class="reaction-count ${(post.reactions?.like || 0) > 0 ? 'has-reactions' : ''}" data-type="like">
              <i class="bi bi-heart-fill cyber-heart"></i>
              <span class="count-number">${post.reactions?.like || 0}</span>
            </span>
            <span class="reaction-count ${(post.reactions?.haha || 0) > 0 ? 'has-reactions' : ''}" data-type="haha">
              <i class="bi bi-emoji-laughing-fill cyber-laugh"></i>
              <span class="count-number">${post.reactions?.haha || 0}</span>
            </span>
            <span class="reaction-count ${(post.reactions?.wow || 0) > 0 ? 'has-reactions' : ''}" data-type="wow">
              <i class="bi bi-emoji-surprise-fill cyber-wow"></i>
              <span class="count-number">${post.reactions?.wow || 0}</span>
            </span>
            <span class="reaction-count ${(post.reactions?.angry || 0) > 0 ? 'has-reactions' : ''}" data-type="angry">
              <i class="bi bi-emoji-angry-fill cyber-angry"></i>
              <span class="count-number">${post.reactions?.angry || 0}</span>
            </span>
            ${(post.share_count || 0) > 0 ? `
              <span class="reaction-count has-reactions">
                <i class="bi bi-share-fill cyber-share"></i>
                <span class="count-number">${post.share_count || 0}</span>
              </span>
            ` : ''}
          </div>
        </div>
        
        <!-- Dreamy Action Buttons -->
        <div class="post-actions cyber-actions-grid">
          <div class="reaction-selector">
            <button class="btn cyber-btn-ghost main-reaction-btn ${post.user_reaction ? 'reacted' : ''}" 
                    data-reaction="${post.user_reaction || 'like'}" onclick="toggleReactionSelector(${post.id})">
              <i class="bi ${getReactionIcon(post.user_reaction || 'like')} me-2 reaction-icon"></i>
              <span class="reaction-text">${getReactionText(post.user_reaction || 'like')}</span>
            </button>
            <div class="reaction-dropdown cyber-dropdown" id="reactionDropdown${post.id}">
              <button class="reaction-option" onclick="reactToPost(${post.id}, 'like')">
                <i class="bi bi-heart-fill cyber-heart"></i>
                <span>Like</span>
              </button>
              <button class="reaction-option" onclick="reactToPost(${post.id}, 'haha')">
                <i class="bi bi-emoji-laughing-fill cyber-laugh"></i>
                <span>Haha</span>
              </button>
              <button class="reaction-option" onclick="reactToPost(${post.id}, 'wow')">
                <i class="bi bi-emoji-surprise-fill cyber-wow"></i>
                <span>Wow</span>
              </button>
              <button class="reaction-option" onclick="reactToPost(${post.id}, 'angry')">
                <i class="bi bi-emoji-angry-fill cyber-angry"></i>
                <span>Angry</span>
              </button>
            </div>
          </div>
          
          <button class="btn cyber-btn-ghost comment-btn" onclick="toggleComments(${post.id})">
            <i class="bi bi-chat-dots-fill me-2 cyber-comment"></i>
            <span>Comment</span>
          </button>
          
          <button class="btn cyber-btn-ghost share-btn" onclick="sharePost(${post.id})">
            <i class="bi bi-share-fill me-2 cyber-share"></i>
            <span>Share</span>
          </button>
        </div>
        
        <div class="comments-section mt-3" style="display: none;">
          <div class="comments-list mb-3" id="commentsList${post.id}">
            <!-- Comments will be loaded here -->
          </div>
          
          <div class="add-comment-form d-flex align-items-center">
            <img src="${window.currentUserProfilePic}" 
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
  `
}

function handlePostImageSelect(e) {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.startsWith("image/")) {
    showNotification("Please select an image file", "error")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const preview = document.getElementById("imagePreview")
    const container = document.getElementById("imagePreviewContainer")

    if (preview && container) {
      preview.src = e.target.result
      container.style.display = "block"
    }
  }
  reader.readAsDataURL(file)
}

function removeImagePreview() {
  const container = document.getElementById("imagePreviewContainer")
  const input = document.getElementById("postImageInput")

  if (container && input) {
    container.style.display = "none"
    input.value = ""
  }
}

function createPost() {
  const content = document.getElementById("postContent").value.trim()
  const imageInput = document.getElementById("postImageInput")

  if (!content) {
    showNotification("Please write something to share", "error")
    return
  }

  const formData = new FormData()
  formData.append("action", "create_post")
  formData.append("content", content)

  if (imageInput && imageInput.files[0]) {
    formData.append("post_image", imageInput.files[0])
  }

  const postUrl = window.ROOT ? `${window.ROOT}/post` : './post';

  fetch(postUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      if (!text || text.trim() === '') {
        throw new Error("Empty response from server");
      }
      
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      console.log("Create post response:", data)
      if (data.success) {
        showNotification("Post created successfully!", "success")

        // Clear form
        document.getElementById("postContent").value = ""
        removeImagePreview()

        // Reload posts
        reloadCurrentUserPosts()
      } else {
        showNotification("Error creating post: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Network error occurred", "error")
    })
}

function editPost(postId) {
  const post = allPosts.find((p) => p.id == postId)
  if (!post) return

  document.getElementById("editPostId").value = postId
  document.getElementById("editPostContent").value = post.content

  const modal = new window.bootstrap.Modal(document.getElementById("editPostModal"))
  modal.show()
}

function savePostEdit() {
  const postId = document.getElementById("editPostId").value
  const content = document.getElementById("editPostContent").value.trim()

  if (!content) {
    showNotification("Post content cannot be empty", "error")
    return
  }

  const formData = new FormData()
  formData.append("action", "edit_post")
  formData.append("post_id", postId)
  formData.append("content", content)

  const postUrl = window.ROOT ? `${window.ROOT}/post` : './post';

  fetch(postUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      
      if (data.success) {
        showNotification("Post updated successfully!", "success")

        // Close modal
        const modal = window.bootstrap.Modal.getInstance(document.getElementById("editPostModal"))
        if (modal) {
          modal.hide()
        }

        // Reload posts
        reloadCurrentUserPosts()
      } else {
        showNotification("Error updating post: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Network error occurred", "error")
    })
}

function deletePost(postId) {
  if (!confirm("Are you sure you want to delete this post?")) {
    return
  }

  const formData = new FormData()
  formData.append("action", "delete_post")
  formData.append("post_id", postId)

  const postUrl = window.ROOT ? `${window.ROOT}/post` : './post';

  fetch(postUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      
      if (data.success) {
        showNotification("Post deleted successfully!", "success")

        // Remove post from DOM with animation
        const postElement = document.querySelector(`[data-post-id="${postId}"]`)
        if (postElement) {
          postElement.style.transition = "all 0.3s ease"
          postElement.style.opacity = "0"
          postElement.style.transform = "translateX(-100%)"
          setTimeout(() => {
            postElement.remove()
          }, 300)
        }
      } else {
        showNotification("Error deleting post: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Network error occurred", "error")
    })
}

function toggleComments(postId) {
  const commentsSection = document.querySelector(`[data-post-id="${postId}"] .comments-section`)
  if (!commentsSection) return

  const isVisible = commentsSection.style.display !== "none"
  commentsSection.style.display = isVisible ? "none" : "block"

  if (!isVisible) {
    loadComments(postId)
  }
}

function loadComments(postId) {
  const formData = new FormData()
  formData.append("action", "get_comments")
  formData.append("post_id", postId)

  const postUrl = window.ROOT ? `${window.ROOT}/post` : './post';

  fetch(postUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      
      if (data.success) {
        displayComments(postId, data.comments)
      }
    })
    .catch((error) => {
      console.error("Error loading comments:", error)
    })
}

function displayComments(postId, comments) {
  const commentsList = document.getElementById(`commentsList${postId}`)
  if (!commentsList) return

  console.log("Displaying comments:", comments); // Debug log

  commentsList.innerHTML = comments
    .map(
      (comment) => `
    <div class="comment-item d-flex align-items-start mb-2" data-comment-id="${comment.id}">
      <img src="${comment.user_avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'}" class="comment-avatar me-2" alt="${comment.user_name || 'User'}">
      <div class="comment-content flex-grow-1">
        <div class="comment-bubble">
          <strong class="comment-author">${createUserLink(comment.user_id || comment.id, comment.user_name || 'Unknown User')}</strong>
          <p class="comment-text mb-1">${comment.content}</p>
        </div>
        <div class="comment-actions">
          <button class="btn-link comment-like-btn">Like</button>
          <button class="btn-link comment-reply-btn">Reply</button>
          <span class="comment-time">${comment.created_at}</span>
        </div>
      </div>
    </div>
  `,
    )
    .join("")
}

function submitComment(postId) {
  const commentInput = document.querySelector(`[data-post-id="${postId}"] .comment-input`)
  if (!commentInput) return

  const content = commentInput.value.trim()
  if (!content) return

  const formData = new FormData()
  formData.append("action", "add_comment")
  formData.append("post_id", postId)
  formData.append("content", content)

  const postUrl = window.ROOT ? `${window.ROOT}/post` : './post';

  fetch(postUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      
      if (data.success) {
        commentInput.value = ""
        loadComments(postId) // Reload comments
        showNotification("Comment added!", "success")
      } else {
        showNotification("Error adding comment: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Network error occurred", "error")
    })
}

function sharePost(postId) {
  const formData = new FormData()
  formData.append("action", "share_post")
  formData.append("post_id", postId)

  const postUrl = window.ROOT ? `${window.ROOT}/post` : './post';

  fetch(postUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      
      if (data.success) {
        showNotification("✨ Post shared in the digital dreamscape! ✨", "success")
        // Add dreamy share animation
        const shareBtn = document.querySelector(`[data-post-id="${postId}"] .share-btn`);
        if (shareBtn) {
          shareBtn.classList.add('cyber-pulse');
          setTimeout(() => shareBtn.classList.remove('cyber-pulse'), 1000);
        }
        // Update share counts if provided
        if (data.counts) {
          updatePostReactionCounts(postId, data.counts);
        } else {
          reloadCurrentUserPosts();
        }
      } else {
        showNotification("Unable to share in the dreamscape: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Network interference in the dream realm", "error")
    })
}

// Dreamy Reaction Functions
function toggleReactionSelector(postId) {
  const dropdown = document.getElementById(`reactionDropdown${postId}`);
  const allDropdowns = document.querySelectorAll('.reaction-dropdown');
  
  // Close all other dropdowns
  allDropdowns.forEach(dd => {
    if (dd.id !== `reactionDropdown${postId}`) {
      dd.classList.remove('show');
    }
  });
  
  // Toggle current dropdown with dreamy animation
  dropdown.classList.toggle('show');
  
  // Add cyberpunk glow effect
  if (dropdown.classList.contains('show')) {
    dropdown.style.animation = 'cyber-glow-in 0.3s ease-out';
  }
}

function reactToPost(postId, reactionType) {
  const formData = new FormData()
  formData.append("action", "react_post")
  formData.append("post_id", postId)
  formData.append("reaction_type", reactionType)

  const postUrl = window.ROOT ? `${window.ROOT}/post` : './post';

  fetch(postUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      const data = JSON.parse(cleanedText);
      
      if (data.success) {
        // Close reaction dropdown
        const dropdown = document.getElementById(`reactionDropdown${postId}`);
        if (dropdown) dropdown.classList.remove('show');
        
        // Update reaction button with dreamy feedback
        const reactionBtn = document.querySelector(`[data-post-id="${postId}"] .main-reaction-btn`);
        if (reactionBtn) {
          if (data.action === 'removed') {
            reactionBtn.classList.remove('reacted');
            reactionBtn.setAttribute('data-reaction', 'like');
            reactionBtn.innerHTML = `<i class="bi ${getReactionIcon('like')} me-2 reaction-icon"></i><span class="reaction-text">${getReactionText('like')}</span>`;
            showNotification("🌙 Reaction dissolved into the dream...", "info");
          } else {
            reactionBtn.classList.add('reacted');
            reactionBtn.setAttribute('data-reaction', reactionType);
            reactionBtn.innerHTML = `<i class="bi ${getReactionIcon(reactionType)} me-2 reaction-icon"></i><span class="reaction-text">${getReactionText(reactionType)}</span>`;
            
            // Add dreamy reaction feedback
            const reactionEmojis = {
              'like': '💖',
              'haha': '😂',
              'wow': '😮',
              'angry': '😠'
            };
            showNotification(`${reactionEmojis[reactionType]} Emotion resonates through the dreamscape!`, "success");
            
            // Add cyber pulse effect
            reactionBtn.classList.add('cyber-pulse');
            setTimeout(() => reactionBtn.classList.remove('cyber-pulse'), 800);
          }
        }
        
        // Reload posts to show updated counts
        if (data.counts) {
          updatePostReactionCounts(postId, data.counts);
        } else {
          reloadCurrentUserPosts();
        }
      } else {
        showNotification("Unable to sync emotions: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Emotional interference detected", "error")
    })
}

function updatePostReactionCounts(postId, counts) {
  console.log(`Updating reaction counts for post ${postId}:`, counts);
  
  // Update individual reaction counts
  const reactionTypes = ['like', 'haha', 'wow', 'angry'];
  reactionTypes.forEach(type => {
    const countElement = document.querySelector(`[data-post-id="${postId}"] .reaction-count[data-type="${type}"] .count-number`);
    if (countElement && counts[type + '_count'] !== undefined) {
      countElement.textContent = counts[type + '_count'] || 0;
      
      // Add/remove has-reactions class based on count
      const reactionCountElement = countElement.closest('.reaction-count');
      if (reactionCountElement) {
        if (counts[type + '_count'] > 0) {
          reactionCountElement.classList.add('has-reactions');
        } else {
          reactionCountElement.classList.remove('has-reactions');
        }
      }
    }
  });
  
  // Update share count if provided
  if (counts.share_count !== undefined) {
    const shareCountElement = document.querySelector(`[data-post-id="${postId}"] .share-count .count-number`);
    if (shareCountElement) {
      shareCountElement.textContent = counts.share_count || 0;
      
      const shareCountContainer = shareCountElement.closest('.share-count');
      if (shareCountContainer) {
        if (counts.share_count > 0) {
          shareCountContainer.classList.add('has-reactions');
        } else {
          shareCountContainer.classList.remove('has-reactions');
        }
      }
    }
  }
}

// Enhanced Notification System
function showNotification(message, type = "info", title = null) {
  const notificationSystem = document.getElementById("notificationSystem")
  if (!notificationSystem) return

  const notificationId = "notification_" + Date.now()
  const titles = {
    success: title || "Success!",
    error: title || "Error!",
    warning: title || "Warning!",
    info: title || "Info",
  }

  const icons = {
    success: "bi-check-circle-fill",
    error: "bi-exclamation-triangle-fill",
    warning: "bi-exclamation-circle-fill",
    info: "bi-info-circle-fill",
  }

  const notification = document.createElement("div")
  notification.className = `system-notification ${type}`
  notification.id = notificationId
  notification.innerHTML = `
        <div class="notification-content-wrapper">
            <i class="bi ${icons[type]} notification-icon"></i>
            <div class="notification-text">
                <div class="notification-title">${titles[type]}</div>
                <div class="notification-message">${message}</div>
            </div>
        </div>
        <button class="notification-close" onclick="closeNotification('${notificationId}')">
            <i class="bi bi-x"></i>
        </button>
        <div class="notification-progress"></div>
    `

  notificationSystem.appendChild(notification)

  // Show animation
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    closeNotification(notificationId)
  }, 5000)
}

function closeNotification(notificationId) {
  const notification = document.getElementById(notificationId)
  if (notification) {
    notification.classList.remove("show")
    setTimeout(() => {
      notification.remove()
    }, 400)
  }
}

console.log("🎮 Post.js loaded - Ready for post operations! 🎮")
