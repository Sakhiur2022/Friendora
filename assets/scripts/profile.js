// Enhanced Friendora Profile Page JavaScript
// This file handles all the interactive functionality and dummy data

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the page
  initializePage()
  setupEventListeners()
  loadDummyData()
  setupBackgroundMusic()
  createFloatingParticles()
  initializeProfileOwnership()
})

// Enhanced dummy user data
const userData = {
  id: 1,
  name: "Alexandra Chen",
  bio: "Digital artist exploring the boundaries between reality and dreams ✨",
  currentCity: "Neo Tokyo",
  hometown: "Cyber City",
  birthday: "1995-03-15",
  gender: "Female",
  highSchool: "Digital Arts Academy",
  college: "Cyber Tech Institute",
  university: "Virtual Reality University",
  workplace: "DreamScape Studios",
  politicalViews: "Progressive Futurist",
  religion: "Digital Spiritualism",
  country: "Japan",
  website: "https://alexandra-dreams.cyber",
  language: "English, Japanese, Binary",
  professional: "Senior VR Artist & Dream Architect",
  quotes: "In the digital realm, we are all architects of our own reality.",
  lifeEvents: "Graduated VR University (2018), Joined DreamScape Studios (2019), Won Cyber Art Award (2023)",
  isOwnProfile: true, // This would be determined by PHP: $_SESSION['user_id'] == $profile_user_id
}

// Enhanced posts data with reactions and comments
const postsData = [
  {
    id: 1,
    author: "Alexandra Chen",
    authorId: 1,
    authorPic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=45&h=45&fit=crop&crop=face",
    time: "2 hours ago",
    content:
      "Just finished working on a new VR dreamscape project! The intersection of technology and imagination never ceases to amaze me. ✨🌟",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop",
    reactions: {
      like: 25,
      love: 12,
      haha: 3,
      wow: 7,
      sad: 0,
      angry: 0,
    },
    userReaction: "love",
    totalReactions: 47,
    comments: [
      {
        id: 1,
        userId: 2,
        userName: "Marcus Tech",
        userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
        content: "This looks absolutely incredible! Can't wait to experience it.",
        time: "1 hour ago",
        likes: 3,
      },
      {
        id: 2,
        userId: 3,
        userName: "Luna Digital",
        userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
        content: "Your work always pushes the boundaries of what's possible! 🚀",
        time: "45 minutes ago",
        likes: 5,
      },
    ],
    commentCount: 8,
    shares: 3,
  },
  {
    id: 2,
    author: "Alexandra Chen",
    authorId: 1,
    authorPic: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=45&h=45&fit=crop&crop=face",
    time: "1 day ago",
    content: "Exploring the neon-lit streets of Neo Tokyo tonight. The city's energy is incredible! 🌃⚡",
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=600&h=400&fit=crop",
    reactions: {
      like: 45,
      love: 23,
      haha: 2,
      wow: 15,
      sad: 0,
      angry: 0,
    },
    userReaction: "like",
    totalReactions: 85,
    comments: [
      {
        id: 3,
        userId: 4,
        userName: "Cyber Explorer",
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
        content: "Neo Tokyo at night is pure magic! Great shot! 📸",
        time: "20 hours ago",
        likes: 8,
      },
    ],
    commentCount: 12,
    shares: 5,
  },
]

// Dummy notifications data
const notificationsData = [
  {
    id: 1,
    userId: 2,
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    message: "Marcus Tech liked your post",
    time: "5 minutes ago",
    isRead: false,
    type: "like",
  },
  {
    id: 2,
    userId: 3,
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    message: "Luna Digital commented on your photo",
    time: "1 hour ago",
    isRead: false,
    type: "comment",
  },
  {
    id: 3,
    userId: 4,
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    message: "Cyber Explorer started following you",
    time: "2 hours ago",
    isRead: true,
    type: "follow",
  },
]

// Search suggestions data
const searchSuggestions = [
  {
    id: 1,
    name: "Marcus Tech",
    type: "Person",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=35&h=35&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Luna Digital",
    type: "Person",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=35&h=35&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "VR Artists Community",
    type: "Group",
    avatar: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=35&h=35&fit=crop",
  },
]

// Enhanced photos data for gallery
const allPhotosData = [
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0279c0fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0279c0fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0279c0fa?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
]

let currentPhotoIndex = 0
const currentUserId = 1 // This would come from PHP session

function initializePage() {
  // Add loading animation
  document.body.classList.add("loading")

  // Simulate loading time
  setTimeout(() => {
    document.body.classList.remove("loading")
    document.body.classList.add("loaded")
  }, 1000)

  // Add glitch effect to logo
  const logo = document.querySelector(".cyber-logo")
  if (logo) {
    logo.classList.add("glitch-effect")
  }
}

function initializeProfileOwnership() {
  // PHP Integration: This logic would be handled server-side
  // const isOwnProfile = <?php echo json_encode($_SESSION['user_id'] == $profile_user_id); ?>;

  const isOwnProfile = userData.isOwnProfile

  if (isOwnProfile) {
    // Show own profile actions
    document.getElementById("ownProfileActions").style.display = "block"
    document.getElementById("editProfileBtn").style.display = "block"
    // document.getElementById("followBtn").style.display = "none"
    // document.getElementById("messageBtn").style.display = "none"
  } else {
    // Show other profile actions
    document.getElementById("ownProfileActions").style.display = "none"
    document.getElementById("editProfileBtn").style.display = "none"
    document.getElementById("followBtn").style.display = "block"
    document.getElementById("messageBtn").style.display = "block"
  }
}

function setupEventListeners() {
  // Enhanced search functionality
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("input", handleSearchInput)
    searchInput.addEventListener("focus", showSearchSuggestions)
    searchInput.addEventListener("blur", hideSearchSuggestions)
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        performSearch(this.value)
      }
    })
  }

  // Edit profile button
  const editProfileBtn = document.getElementById("editProfileBtn")
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", openEditProfileModal)
  }

  // Save profile button
  const saveProfileBtn = document.getElementById("saveProfileBtn")
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", saveProfile)
  }

  // Post input
  const postInput = document.getElementById("postInput")
  if (postInput) {
    postInput.addEventListener("focus", expandPostInput)
  }

  // Share post button
  const sharePostBtn = document.getElementById("sharePostBtn")
  if (sharePostBtn) {
    sharePostBtn.addEventListener("click", sharePost)
  }

  // Music toggle
  const musicToggle = document.getElementById("musicToggle")
  if (musicToggle) {
    musicToggle.addEventListener("click", toggleBackgroundMusic)
  }

  // Setup upload areas
  setupUploadAreas()

  // Navbar scroll effect
  window.addEventListener("scroll", handleNavbarScroll)

  // Close dropdowns when clicking outside
  document.addEventListener("click", handleOutsideClick)

  // Add hover effects to cards
  addCardHoverEffects()
}

function loadDummyData() {
  // Load user info
  // document.getElementById("userName").textContent = userData.name
  document.getElementById("userBio").textContent = userData.bio

  // Load about section
  loadAboutSection()

  // Load photos
  loadPhotosGrid()

  // Load posts with enhanced features
  loadEnhancedPosts()

  // Load notifications
  loadNotifications()

  // Populate edit form
  populateEditForm()
}

function loadEnhancedPosts() {
  const postsContainer = document.getElementById("postsContainer")
  if (!postsContainer) return

  postsContainer.innerHTML = postsData
    .map(
      (post) => `
        <div class="cyber-card post-card" data-post-id="${post.id}">
            <div class="card-body">
                <div class="post-header">
                    <img src="${post.authorPic}" alt="${post.author}" class="post-author-pic">
                    <div class="post-author-info">
                        <h6>${post.author}</h6>
                        <div class="post-time">${post.time}</div>
                    </div>
                    <div class="post-menu-container ms-auto">
                        ${
                          post.authorId === currentUserId
                            ? `
                        <!-- PHP: Only show for post owner -->
                        <!-- <?php if($post['user_id'] == $_SESSION['user_id']): ?> -->
                        <div class="dropdown">
                            <button class="btn cyber-btn-ghost post-menu-btn" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-three-dots"></i>
                            </button>
                            <ul class="dropdown-menu cyber-dropdown">
                                <li><a class="dropdown-item" href="#" onclick="editPost(${post.id})"><i class="bi bi-pencil me-2"></i>Edit Post</a></li>
                                <li><a class="dropdown-item text-danger" href="#" onclick="deletePost(${post.id})"><i class="bi bi-trash me-2"></i>Delete Post</a></li>
                            </ul>
                        </div>
                        <!-- <?php endif; ?> -->
                        `
                            : ""
                        }
                    </div>
                </div>
                <div class="post-content">${post.content}</div>
                ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ""}
                
                <!-- Enhanced Reaction System -->
                <div class="post-actions">
                    <div class="reaction-container">
                        <button class="post-action-btn reaction-btn" onclick="showReactions(${post.id})" onmouseenter="showReactionPicker(${post.id})" onmouseleave="hideReactionPicker(${post.id})">
                            <i class="bi bi-${getReactionIcon(post.userReaction)}${post.userReaction ? "-fill" : ""}"></i>
                            <span class="reaction-count">${post.totalReactions}</span>
                        </button>
                        
                        <!-- Reaction Picker -->
                        <div class="reaction-picker" id="reactionPicker${post.id}">
                            <button class="reaction-option" onclick="addReaction(${post.id}, 'like')" title="Like">
                                <i class="bi bi-heart-fill text-danger"></i>
                            </button>
                            <button class="reaction-option" onclick="addReaction(${post.id}, 'love')" title="Love">
                                <i class="bi bi-suit-heart-fill text-danger"></i>
                            </button>
                            <button class="reaction-option" onclick="addReaction(${post.id}, 'haha')" title="Haha">
                                <i class="bi bi-emoji-laughing-fill text-warning"></i>
                            </button>
                            <button class="reaction-option" onclick="addReaction(${post.id}, 'wow')" title="Wow">
                                <i class="bi bi-emoji-surprise-fill text-primary"></i>
                            </button>
                            <button class="reaction-option" onclick="addReaction(${post.id}, 'sad')" title="Sad">
                                <i class="bi bi-emoji-frown-fill text-info"></i>
                            </button>
                            <button class="reaction-option" onclick="addReaction(${post.id}, 'angry')" title="Angry">
                                <i class="bi bi-emoji-angry-fill text-danger"></i>
                            </button>
                        </div>
                    </div>
                    <button class="post-action-btn" onclick="toggleComments(${post.id})">
                        <i class="bi bi-chat-fill"></i>
                        <span>${post.commentCount}</span>
                    </button>
                    <button class="post-action-btn" onclick="sharePost(${post.id})">
                        <i class="bi bi-share-fill"></i>
                        <span>${post.shares}</span>
                    </button>
                </div>
                
                <!-- Comments Section -->
                <div class="comments-section" id="commentsSection${post.id}" style="display: none;">
                    <div class="comments-list" id="commentsList${post.id}">
                        ${post.comments
                          .map(
                            (comment) => `
                            <div class="comment-item" data-comment-id="${comment.id}">
                                <img src="${comment.userAvatar}" class="comment-avatar" alt="${comment.userName}">
                                <div class="comment-content">
                                    <div class="comment-bubble">
                                        <strong>${comment.userName}</strong>
                                        <p>${comment.content}</p>
                                    </div>
                                    <div class="comment-actions">
                                        <button class="btn-link" onclick="likeComment(${comment.id})">Like</button>
                                        <button class="btn-link" onclick="replyToComment(${comment.id})">Reply</button>
                                        <span class="comment-time">${comment.time}</span>
                                    </div>
                                </div>
                            </div>
                        `,
                          )
                          .join("")}
                        <!-- PHP: Loop through comments -->
                        <!-- <?php 
                        $comments = getPostComments($post['id']);
                        foreach($comments as $comment): 
                        ?>
                        <div class="comment-item" data-comment-id="<?php echo $comment['id']; ?>">
                            <img src="<?php echo $comment['user_avatar']; ?>" class="comment-avatar">
                            <div class="comment-content">
                                <div class="comment-bubble">
                                    <strong><?php echo $comment['user_name']; ?></strong>
                                    <p><?php echo $comment['content']; ?></p>
                                </div>
                                <div class="comment-actions">
                                    <button class="btn-link" onclick="likeComment(<?php echo $comment['id']; ?>)">Like</button>
                                    <button class="btn-link" onclick="replyToComment(<?php echo $comment['id']; ?>)">Reply</button>
                                    <span class="comment-time"><?php echo timeAgo($comment['created_at']); ?></span>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?> -->
                    </div>
                    
                    <!-- Add Comment Form -->
                    <div class="add-comment-form">
                        <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face" class="comment-avatar" alt="Your Profile">
                        <div class="comment-input-container">
                            <input type="text" class="form-control cyber-input comment-input" placeholder="Write a comment..." onkeypress="handleCommentSubmit(event, ${post.id})" id="commentInput${post.id}">
                            <button class="btn cyber-btn-ghost comment-submit-btn" onclick="submitComment(${post.id})">
                                <i class="bi bi-send"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("")

  // Add stagger animation to posts
  const posts = postsContainer.querySelectorAll(".post-card")
  posts.forEach((post, index) => {
    post.style.animationDelay = `${index * 0.2}s`
    post.classList.add("slide-up")
  })
}

function loadNotifications() {
  const notificationsList = document.getElementById("notificationsList")
  const notificationCount = document.getElementById("notificationCount")

  if (!notificationsList) return

  // Update notification count
  const unreadCount = notificationsData.filter((n) => !n.isRead).length
  notificationCount.textContent = unreadCount
  notificationCount.style.display = unreadCount > 0 ? "flex" : "none"

  notificationsList.innerHTML = notificationsData
    .map(
      (notification) => `
        <li class="notification-item ${!notification.isRead ? "unread" : ""}" onclick="handleNotificationClick(${notification.id})">
            <img src="${notification.userAvatar}" class="notification-avatar" alt="User">
            <div class="notification-content">
                <p>${notification.message}</p>
                <small>${notification.time}</small>
            </div>
        </li>
    `,
    )
    .join("")

  // PHP Integration Comment:
  /*
    <?php foreach($notifications as $notification): ?>
    <li class="notification-item <?php echo $notification['is_read'] ? '' : 'unread'; ?>" onclick="handleNotificationClick(<?php echo $notification['id']; ?>)">
        <img src="<?php echo $notification['user_avatar']; ?>" class="notification-avatar">
        <div class="notification-content">
            <p><?php echo $notification['message']; ?></p>
            <small><?php echo timeAgo($notification['created_at']); ?></small>
        </div>
    </li>
    <?php endforeach; ?>
    */
}

// Enhanced Search Functions
function handleSearchInput(e) {
  const query = e.target.value.toLowerCase()

  if (query.length > 0) {
    showSearchSuggestions()
    filterSearchSuggestions(query)
    // PHP Integration: AJAX call to search endpoint
    /*
        fetch(`search_suggestions.php?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(suggestions => {
            displaySearchSuggestions(suggestions);
        });
        */
  } else {
    hideSearchSuggestions()
  }
}

function showSearchSuggestions() {
  const suggestions = document.getElementById("searchSuggestions")
  if (suggestions) {
    suggestions.style.display = "block"
    loadSearchSuggestions()
  }
}

function hideSearchSuggestions() {
  setTimeout(() => {
    const suggestions = document.getElementById("searchSuggestions")
    if (suggestions) {
      suggestions.style.display = "none"
    }
  }, 200)
}

function loadSearchSuggestions() {
  const suggestions = document.getElementById("searchSuggestions")
  if (!suggestions) return

  suggestions.innerHTML = searchSuggestions
    .map(
      (suggestion) => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.type}', '${suggestion.id}')">
            <img src="${suggestion.avatar}" class="suggestion-avatar" alt="${suggestion.name}">
            <div class="suggestion-info">
                <div class="suggestion-name">${suggestion.name}</div>
                <div class="suggestion-type">${suggestion.type}</div>
            </div>
        </div>
    `,
    )
    .join("")
}

function filterSearchSuggestions(query) {
  const filteredSuggestions = searchSuggestions.filter(
    (s) => s.name.toLowerCase().includes(query) || s.type.toLowerCase().includes(query),
  )

  const suggestions = document.getElementById("searchSuggestions")
  if (suggestions) {
    suggestions.innerHTML = filteredSuggestions
      .map(
        (suggestion) => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion.type}', '${suggestion.id}')">
                <img src="${suggestion.avatar}" class="suggestion-avatar" alt="${suggestion.name}">
                <div class="suggestion-info">
                    <div class="suggestion-name">${suggestion.name}</div>
                    <div class="suggestion-type">${suggestion.type}</div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function selectSuggestion(type, id) {
  // PHP Integration: Navigate to profile or group
  /*
    if (type === 'Person') {
        window.location.href = `profile.php?id=${id}`;
    } else if (type === 'Group') {
        window.location.href = `group.php?id=${id}`;
    }
    */

  showNotification(`Selected ${type}: ${id}`, "info")
  hideSearchSuggestions()
}

function openAdvancedSearch() {
  // PHP Integration: Navigate to advanced search page
  // window.location.href = 'navigator.php';

  showNotification("Advanced Search - Navigator page coming soon!", "info")
}

// Reaction System Functions
function getReactionIcon(reaction) {
  const icons = {
    like: "heart",
    love: "suit-heart",
    haha: "emoji-laughing",
    wow: "emoji-surprise",
    sad: "emoji-frown",
    angry: "emoji-angry",
  }
  return icons[reaction] || "heart"
}

function showReactionPicker(postId) {
  const picker = document.getElementById(`reactionPicker${postId}`)
  if (picker) {
    picker.classList.add("show")
  }
}

function hideReactionPicker(postId) {
  setTimeout(() => {
    const picker = document.getElementById(`reactionPicker${postId}`)
    if (picker && !picker.matches(":hover")) {
      picker.classList.remove("show")
    }
  }, 300)
}

function addReaction(postId, reactionType) {
  const post = postsData.find((p) => p.id === postId)
  if (!post) return

  // Remove previous reaction
  if (post.userReaction) {
    post.reactions[post.userReaction]--
    post.totalReactions--
  }

  // Add new reaction
  if (post.userReaction !== reactionType) {
    post.reactions[reactionType]++
    post.totalReactions++
    post.userReaction = reactionType
  } else {
    post.userReaction = null
  }

  // Update UI
  const reactionBtn = document.querySelector(`[data-post-id="${postId}"] .reaction-btn`)
  const icon = reactionBtn.querySelector("i")
  const count = reactionBtn.querySelector(".reaction-count")

  icon.className = `bi bi-${getReactionIcon(post.userReaction)}${post.userReaction ? "-fill" : ""}`
  count.textContent = post.totalReactions

  // Add animation
  reactionBtn.style.transform = "scale(1.2)"
  setTimeout(() => {
    reactionBtn.style.transform = "scale(1)"
  }, 200)

  // Hide picker
  hideReactionPicker(postId)

  // PHP Integration: Send reaction to server
  /*
    fetch('add_reaction.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            post_id: postId, 
            reaction_type: reactionType,
            action: post.userReaction ? 'add' : 'remove'
        })
    });
    */
}

// Comment System Functions
function toggleComments(postId) {
  const commentsSection = document.getElementById(`commentsSection${postId}`)
  if (commentsSection) {
    const isVisible = commentsSection.style.display !== "none"
    commentsSection.style.display = isVisible ? "none" : "block"

    if (!isVisible) {
      // Load comments from server
      loadPostComments(postId)
    }
  }
}

function loadPostComments(postId) {
  // PHP Integration: Load comments from server
  /*
    fetch(`get_comments.php?post_id=${postId}`)
    .then(response => response.json())
    .then(comments => {
        displayComments(postId, comments);
    });
    */

  // For demo, comments are already loaded in the post data
  console.log(`Loading comments for post ${postId}`)
}

function handleCommentSubmit(event, postId) {
  if (event.key === "Enter") {
    submitComment(postId)
  }
}

function submitComment(postId) {
  const input = document.getElementById(`commentInput${postId}`)
  const content = input.value.trim()

  if (!content) return

  // Create new comment object
  const newComment = {
    id: Date.now(),
    userId: currentUserId,
    userName: userData.name,
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
    content: content,
    time: "Just now",
    likes: 0,
  }

  // Add to post data
  const post = postsData.find((p) => p.id === postId)
  if (post) {
    post.comments.push(newComment)
    post.commentCount++
  }

  // Add to UI
  const commentsList = document.getElementById(`commentsList${postId}`)
  const commentHTML = `
        <div class="comment-item" data-comment-id="${newComment.id}">
            <img src="${newComment.userAvatar}" class="comment-avatar" alt="${newComment.userName}">
            <div class="comment-content">
                <div class="comment-bubble">
                    <strong>${newComment.userName}</strong>
                    <p>${newComment.content}</p>
                </div>
                <div class="comment-actions">
                    <button class="btn-link" onclick="likeComment(${newComment.id})">Like</button>
                    <button class="btn-link" onclick="replyToComment(${newComment.id})">Reply</button>
                    <span class="comment-time">${newComment.time}</span>
                </div>
            </div>
        </div>
    `

  commentsList.insertAdjacentHTML("beforeend", commentHTML)

  // Update comment count in UI
  const commentBtn = document.querySelector(`[data-post-id="${postId}"] .post-action-btn:nth-child(2) span`)
  if (commentBtn) {
    commentBtn.textContent = post.commentCount
  }

  // Clear input
  input.value = ""

  // Add animation to new comment
  const newCommentElement = commentsList.lastElementChild
  newCommentElement.style.opacity = "0"
  newCommentElement.style.transform = "translateX(-20px)"
  setTimeout(() => {
    newCommentElement.style.transition = "all 0.3s ease"
    newCommentElement.style.opacity = "1"
    newCommentElement.style.transform = "translateX(0)"
  }, 100)

  // PHP Integration: Send comment to server
  /*
    fetch('add_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            post_id: postId, 
            content: content 
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update comment with server-generated ID
            newComment.id = data.comment_id;
        }
    });
    */
}

function likeComment(commentId) {
  // PHP Integration: Like comment
  /*
    fetch('like_comment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment_id: commentId })
    });
    */

  showNotification("Comment liked!", "success")
}

function replyToComment(commentId) {
  // Focus on comment input and add @mention
  showNotification("Reply feature coming soon!", "info")
}

// Post Management Functions
function editPost(postId) {
  // PHP Integration: Check ownership and edit post
  /*
    if (post_owner_id !== current_user_id) {
        return false;
    }
    */

  const post = postsData.find((p) => p.id === postId)
  if (post && post.authorId === currentUserId) {
    const newContent = prompt("Edit your post:", post.content)
    if (newContent && newContent.trim()) {
      post.content = newContent.trim()

      // Update UI
      const postElement = document.querySelector(`[data-post-id="${postId}"] .post-content`)
      if (postElement) {
        postElement.textContent = newContent.trim()
      }

      showNotification("Post updated successfully!", "success")

      // PHP Integration: Update post on server
      /*
            fetch('update_post.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    post_id: postId, 
                    content: newContent.trim() 
                })
            });
            */
    }
  }
}

function deletePost(postId) {
  // PHP Integration: Check ownership and delete post
  /*
    if (post_owner_id !== current_user_id) {
        return false;
    }
    */

  const post = postsData.find((p) => p.id === postId)
  if (post && post.authorId === currentUserId) {
    if (confirm("Are you sure you want to delete this post?")) {
      // Remove from data
      const index = postsData.findIndex((p) => p.id === postId)
      if (index > -1) {
        postsData.splice(index, 1)
      }

      // Remove from UI with animation
      const postElement = document.querySelector(`[data-post-id="${postId}"]`)
      if (postElement) {
        postElement.style.transition = "all 0.3s ease"
        postElement.style.opacity = "0"
        postElement.style.transform = "translateX(-100%)"
        setTimeout(() => {
          postElement.remove()
        }, 300)
      }

      showNotification("Post deleted successfully!", "success")

      // PHP Integration: Delete post from server
      /*
            fetch('delete_post.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId })
            });
            */
    }
  }
}

// Profile Action Functions
function followUser() {
  const followBtn = document.getElementById("followBtn")
  const followBtnText = document.getElementById("followBtnText")

  const isFollowing = followBtnText.textContent === "Following"

  if (isFollowing) {
    followBtnText.textContent = "Follow"
    followBtn.classList.remove("following")
    showNotification("Unfollowed user", "info")
  } else {
    followBtnText.textContent = "Following"
    followBtn.classList.add("following")
    showNotification("Now following user!", "success")
  }

  // PHP Integration: Follow/unfollow user
  /*
    fetch('follow_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            user_id: profileUserId, 
            action: isFollowing ? 'unfollow' : 'follow' 
        })
    });
    */
}

function messageUser() {
  // PHP Integration: Navigate to messages
  // window.location.href = `messages.php?user_id=${profileUserId}`;

  showNotification("Opening message conversation...", "info")
}

// Photo Upload Functions
function openCoverPhotoModal() {
  const modal = new bootstrap.Modal(document.getElementById("coverPhotoModal"))
  modal.show()
}

function openProfilePhotoModal() {
  const modal = new bootstrap.Modal(document.getElementById("profilePhotoModal"))
  modal.show()
}

function setupUploadAreas() {
  // Cover photo upload
  const coverUploadArea = document.getElementById("coverUploadArea")
  const coverPhotoInput = document.getElementById("coverPhotoInput")

  if (coverUploadArea && coverPhotoInput) {
    coverUploadArea.addEventListener("click", () => coverPhotoInput.click())
    coverUploadArea.addEventListener("dragover", handleDragOver)
    coverUploadArea.addEventListener("drop", (e) => handleDrop(e, "cover"))
    coverPhotoInput.addEventListener("change", (e) => handleFileSelect(e, "cover"))
  }

  // Profile photo upload
  const profileUploadArea = document.getElementById("profileUploadArea")
  const profilePhotoInput = document.getElementById("profilePhotoInput")

  if (profileUploadArea && profilePhotoInput) {
    profileUploadArea.addEventListener("click", () => profilePhotoInput.click())
    profileUploadArea.addEventListener("dragover", handleDragOver)
    profileUploadArea.addEventListener("drop", (e) => handleDrop(e, "profile"))
    profilePhotoInput.addEventListener("change", (e) => handleFileSelect(e, "profile"))
  }
}

function handleDragOver(e) {
  e.preventDefault()
  e.currentTarget.style.borderColor = "var(--cyber-primary)"
  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
}

function handleDrop(e, type) {
  e.preventDefault()
  const files = e.dataTransfer.files
  if (files.length > 0) {
    previewImage(files[0], type)
  }
}

function handleFileSelect(e, type) {
  const files = e.target.files
  if (files.length > 0) {
    previewImage(files[0], type)
  }
}

function previewImage(file, type) {
  if (!file.type.startsWith("image/")) {
    showNotification("Please select an image file", "error")
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    const preview = document.getElementById(`${type}Preview`)
    const previewImg = document.getElementById(`${type}PreviewImg`)
    const placeholder = document.querySelector(`#${type}UploadArea .upload-placeholder`)

    if (preview && previewImg && placeholder) {
      previewImg.src = e.target.result
      placeholder.style.display = "none"
      preview.style.display = "block"
    }
  }
  reader.readAsDataURL(file)
}

function removeCoverPreview() {
  const preview = document.getElementById("coverPreview")
  const placeholder = document.querySelector("#coverUploadArea .upload-placeholder")
  const input = document.getElementById("coverPhotoInput")

  if (preview && placeholder && input) {
    preview.style.display = "none"
    placeholder.style.display = "block"
    input.value = ""
  }
}

function removeProfilePreview() {
  const preview = document.getElementById("profilePreview")
  const placeholder = document.querySelector("#profileUploadArea .upload-placeholder")
  const input = document.getElementById("profilePhotoInput")

  if (preview && placeholder && input) {
    preview.style.display = "none"
    placeholder.style.display = "block"
    input.value = ""
  }
}

function uploadCoverPhoto() {
  const input = document.getElementById("coverPhotoInput")
  const file = input.files[0]

  if (!file) {
    showNotification("Please select a file first", "error")
    return
  }

  // PHP Integration: Upload cover photo
  /*
    const formData = new FormData();
    formData.append('cover_photo', file);
    
    fetch('upload_cover.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('coverPhoto').src = data.url;
            showNotification('Cover photo updated successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('coverPhotoModal')).hide();
        } else {
            showNotification('Error uploading cover photo: ' + data.message, 'error');
        }
    });
    */

  // Demo implementation
  const previewImg = document.getElementById("coverPreviewImg")
  if (previewImg) {
    document.getElementById("coverPhoto").src = previewImg.src
    showNotification("Cover photo updated successfully!", "success")
    bootstrap.Modal.getInstance(document.getElementById("coverPhotoModal")).hide()
  }
}

function uploadProfilePhoto() {
  const input = document.getElementById("profilePhotoInput")
  const file = input.files[0]

  if (!file) {
    showNotification("Please select a file first", "error")
    return
  }

  // PHP Integration: Upload profile photo
  /*
    const formData = new FormData();
    formData.append('profile_photo', file);
    
    fetch('upload_profile.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('profilePic').src = data.url;
            showNotification('Profile picture updated successfully!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('profilePhotoModal')).hide();
        } else {
            showNotification('Error uploading profile picture: ' + data.message, 'error');
        }
    });
    */

  // Demo implementation
  const previewImg = document.getElementById("profilePreviewImg")
  if (previewImg) {
    document.getElementById("profilePic").src = previewImg.src
    showNotification("Profile picture updated successfully!", "success")
    bootstrap.Modal.getInstance(document.getElementById("profilePhotoModal")).hide()
  }
}

// Photo Gallery Functions
function openPhotoGallery() {
  const modal = new bootstrap.Modal(document.getElementById("photoGalleryModal"))
  loadPhotoGallery()
  modal.show()
}

function loadPhotoGallery() {
  const mainImg = document.getElementById("galleryMainImage")
  const thumbnails = document.getElementById("galleryThumbnails")
  const counter = document.getElementById("photoCounter")

  if (mainImg && thumbnails && counter) {
    // Load main image
    mainImg.src = allPhotosData[currentPhotoIndex]

    // Load thumbnails
    thumbnails.innerHTML = allPhotosData
      .map(
        (photo, index) => `
            <img src="${photo}" 
                 class="gallery-thumbnail ${index === currentPhotoIndex ? "active" : ""}" 
                 onclick="selectPhoto(${index})"
                 alt="Photo ${index + 1}">
        `,
      )
      .join("")

    // Update counter
    counter.textContent = `${currentPhotoIndex + 1} of ${allPhotosData.length}`
  }
}

function selectPhoto(index) {
  currentPhotoIndex = index
  loadPhotoGallery()
}

function previousPhoto() {
  currentPhotoIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : allPhotosData.length - 1
  loadPhotoGallery()
}

function nextPhoto() {
  currentPhotoIndex = currentPhotoIndex < allPhotosData.length - 1 ? currentPhotoIndex + 1 : 0
  loadPhotoGallery()
}

// Notification Functions
function handleNotificationClick(notificationId) {
  const notification = notificationsData.find((n) => n.id === notificationId)
  if (notification && !notification.isRead) {
    notification.isRead = true

    // Update UI
    const notificationElement = document.querySelector(`[onclick="handleNotificationClick(${notificationId})"]`)
    if (notificationElement) {
      notificationElement.classList.remove("unread")
    }

    // Update count
    const unreadCount = notificationsData.filter((n) => !n.isRead).length
    const countElement = document.getElementById("notificationCount")
    if (countElement) {
      countElement.textContent = unreadCount
      countElement.style.display = unreadCount > 0 ? "flex" : "none"
    }

    // PHP Integration: Mark notification as read
    /*
        fetch('mark_notification_read.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notification_id: notificationId })
        });
        */
  }

  showNotification("Notification clicked!", "info")
}

function markAllAsRead() {
  notificationsData.forEach((notification) => {
    notification.isRead = true
  })

  // Update UI
  const notificationItems = document.querySelectorAll(".notification-item")
  notificationItems.forEach((item) => {
    item.classList.remove("unread")
  })

  // Update count
  const countElement = document.getElementById("notificationCount")
  if (countElement) {
    countElement.style.display = "none"
  }

  showNotification("All notifications marked as read", "success")

  // PHP Integration: Mark all notifications as read
  /*
    fetch('mark_all_notifications_read.php', {
        method: 'POST'
    });
    */
}

// Utility Functions
function handleOutsideClick(e) {
  // Close search suggestions
  if (!e.target.closest(".search-container")) {
    hideSearchSuggestions()
  }

  // Close reaction pickers
  const reactionPickers = document.querySelectorAll(".reaction-picker.show")
  reactionPickers.forEach((picker) => {
    if (!picker.contains(e.target) && !e.target.closest(".reaction-btn")) {
      picker.classList.remove("show")
    }
  })
}

// Keep all existing functions from the original file
function loadAboutSection(user) {
  const aboutSection = document.getElementById("aboutSection")
  if (!aboutSection) return
  if (!user) {
    user = userData // Use global userData if no user is passed
  }
  const aboutItems = [
    { icon: "bi-geo-alt-fill", label: "Lives in", value: user.city },
    { icon: "bi-house-fill", label: "From", value: user.hometown },
    { icon: "bi-calendar-fill", label: "Born", value: new Date(user.birthday).toLocaleDateString() },
    { icon: "bi-gender-ambiguous", label: "Gender", value: user.gender },
    { icon: "bi-mortarboard-fill", label: "Studied at", value: user.university },
    { icon: "bi-briefcase-fill", label: "Works at", value: user.work },
    { icon: "bi-globe", label: "Website", value: user.website },
    { icon: "bi-translate", label: "Languages", value: user.lang },
    { icon: "bi-quote", label: "Favorite Quote", value: user.socialQuote },
  ]

  aboutSection.innerHTML = aboutItems
    .map(
      (item) => `
        <div class="about-item">
            <i class="bi ${item.icon}"></i>
            <span class="about-label">${item.label}:</span>
            <span class="about-value">${item.value}</span>
        </div>
    `,
    )
    .join("")

  // Add animation delay to each item
  const items = aboutSection.querySelectorAll(".about-item")
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`
    item.classList.add("fade-in")
  })
}

function loadPhotosGrid() {
  const photosGrid = document.getElementById("photosGrid")
  if (!photosGrid) return

  const displayPhotos = allPhotosData.slice(0, 6) // Show first 6 photos
  photosGrid.innerHTML = displayPhotos
    .map(
      (photo, index) => `
        <img src="${photo}" alt="Photo" class="photo-item" onclick="openPhotoModal('${photo}', ${index})">
    `,
    )
    .join("")
}

function openPhotoModal(photoUrl, index) {
  currentPhotoIndex = index
  openPhotoGallery()
}

function populateEditForm() {
  // Populate form fields with user data
  const fields = {
    currentCity: userData.currentCity,
    hometown: userData.hometown,
    birthday: userData.birthday,
    gender: userData.gender,
    bioInput: userData.bio,
    highSchool: userData.highSchool,
    college: userData.college,
    university: userData.university,
    workplace: userData.workplace,
    politicalViews: userData.politicalViews,
    religion: userData.religion,
    country: userData.country,
    website: userData.website,
    language: userData.language,
    professional: userData.professional,
    quotes: userData.quotes,
    lifeEvents: userData.lifeEvents,
  }

  Object.keys(fields).forEach((fieldId) => {
    const field = document.getElementById(fieldId)
    if (field) {
      field.value = fields[fieldId]
    }
  })
}

function openEditProfileModal() {
  const modal = new bootstrap.Modal(document.getElementById("editProfileModal"))
  modal.show()
}

function saveProfile() {
  const formData = new FormData(document.getElementById("editProfileForm"));

  fetch('', {
    method: 'POST',
    body: formData,
    headers: {
      'X-Requested-With': 'XMLHttpRequest' // 👈 tells PHP this is AJAX
    }
  })
  .then(async response => {
    const text = await response.text(); // Debug log
    try {
      const data = JSON.parse(text); // Try parsing JSON
      if (data.success) {
        showNotification('Profile updated successfully!', 'success');
        console.log("Profile update response:", data.user);
        updateProfileDisplay(data.user);// Update display with current user data
      } else {
        showNotification('Error updating profile: ' + data.message, 'error');
      }
    } catch (err) {
      console.error("JSON Parse Error:", err);
      console.warn("Raw response text:", text);
      showNotification('Server returned invalid response', 'error');
    }
  });

    if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  // Close modal  
  bootstrap.Modal.getInstance(document.getElementById("editProfileModal")).hide();
 
}


function updateProfileDisplay(user) {
  // Update name and bio
  
  document.getElementById("userBio").textContent = user.Bio

  // Reload about section
  loadAboutSection(user)

  // Add update animation
  const profileInfo = document.querySelector(".profile-info")
  profileInfo.style.animation = "pulse 0.5s ease"
}

function sharePost(postId) {
  // PHP Integration Comment:
  /*
    fetch('share_post.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post_id: postId })
    });
    */

  showNotification("Post shared!", "success")
}

function expandPostInput() {
  const postInput = document.getElementById("postInput")
  postInput.style.height = "80px"
  postInput.style.borderRadius = "15px"
}

function handleNavbarScroll() {
  const navbar = document.querySelector(".cyber-nav")
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(10, 10, 10, 0.95)"
    navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)"
  } else {
    navbar.style.background = "rgba(10, 10, 10, 0.9)"
    navbar.style.boxShadow = "var(--cyber-shadow)"
  }
}

function addCardHoverEffects() {
  const cards = document.querySelectorAll(".cyber-card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })
}

function setupBackgroundMusic() {
  const bgMusic = document.getElementById("bgMusic")
  const musicToggle = document.getElementById("musicToggle")

  if (bgMusic && musicToggle) {
    let isPlaying = false

    musicToggle.addEventListener("click", function () {
      if (isPlaying) {
        bgMusic.pause()
        this.classList.remove("playing")
        this.innerHTML = '<i class="bi bi-music-note-beamed"></i>'
      } else {
        bgMusic.play().catch((e) => {
          showNotification("Unable to play background music", "info")
        })
        this.classList.add("playing")
        this.innerHTML = '<i class="bi bi-pause-fill"></i>'
      }
      isPlaying = !isPlaying
    })
  }
}

function toggleBackgroundMusic() {
  // This function is called by the existing event listener
  const bgMusic = document.getElementById("bgMusic")
  const musicToggle = document.getElementById("musicToggle")

  if (bgMusic.paused) {
    bgMusic.play().catch((e) => {
      showNotification("Unable to play background music", "info")
    })
    musicToggle.classList.add("playing")
    musicToggle.innerHTML = '<i class="bi bi-pause-fill"></i>'
  } else {
    bgMusic.pause()
    musicToggle.classList.remove("playing")
    musicToggle.innerHTML = '<i class="bi bi-music-note-beamed"></i>'
  }
}

function createFloatingParticles() {
  // Create floating particles for enhanced cyberpunk effect
  const particleContainer = document.createElement("div")
  particleContainer.className = "floating-particles"
  document.body.appendChild(particleContainer)

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div")
    particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--cyber-primary);
            border-radius: 50%;
            opacity: 0.3;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
        `
    particle.style.left = `${Math.random() * 100}vw`
    particle.style.top = `${Math.random() * 100}vh`
    particle.style.animationDelay = `${Math.random() * 2}s`
    particleContainer.appendChild(particle)
  }
}

// Mobile Menu Functions
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  const hamburger = document.querySelector(".cyber-hamburger")

  if (mobileMenu && hamburger) {
    const isOpen = mobileMenu.classList.contains("show")

    if (isOpen) {
      mobileMenu.classList.remove("show")
      hamburger.classList.remove("active")
      document.body.style.overflow = ""
    } else {
      mobileMenu.classList.add("show")
      hamburger.classList.add("active")
      document.body.style.overflow = "hidden"

      // Setup mobile search
      setupMobileSearch()
    }
  }
}

function setupMobileSearch() {
  const mobileSearchInput = document.getElementById("mobileSearchInput")
  const mobileSuggestions = document.getElementById("mobileSearchSuggestions")

  if (mobileSearchInput && mobileSuggestions) {
    mobileSearchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase()
      if (query.length > 0) {
        showMobileSearchSuggestions(query)
      } else {
        mobileSuggestions.style.display = "none"
      }
    })
  }
}

function showMobileSearchSuggestions(query) {
  const mobileSuggestions = document.getElementById("mobileSearchSuggestions")
  if (!mobileSuggestions) return

  const filteredSuggestions = searchSuggestions.filter(
    (s) => s.name.toLowerCase().includes(query) || s.type.toLowerCase().includes(query),
  )

  mobileSuggestions.innerHTML = filteredSuggestions
    .map(
      (suggestion) => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.type}', '${suggestion.id}')">
            <img src="${suggestion.avatar}" class="suggestion-avatar" alt="${suggestion.name}">
            <div class="suggestion-info">
                <div class="suggestion-name">${suggestion.name}</div>
                <div class="suggestion-type">${suggestion.type}</div>
            </div>
        </div>
    `,
    )
    .join("")

  mobileSuggestions.style.display = "block"
}

function toggleMobileNotifications() {
  const notificationsSection = document.getElementById("mobileNotificationsSection")
  const notificationsList = document.getElementById("mobileNotificationsList")

  if (notificationsSection) {
    const isVisible = notificationsSection.style.display !== "none"
    notificationsSection.style.display = isVisible ? "none" : "block"

    if (!isVisible) {
      // Load mobile notifications
      loadMobileNotifications()
    }
  }
}

function loadMobileNotifications() {
  const mobileNotificationsList = document.getElementById("mobileNotificationsList")
  const mobileNotificationCount = document.getElementById("mobileNotificationCount")

  if (!mobileNotificationsList) return

  // Update mobile notification count
  const unreadCount = notificationsData.filter((n) => !n.isRead).length
  mobileNotificationCount.textContent = unreadCount
  mobileNotificationCount.style.display = unreadCount > 0 ? "flex" : "none"

  mobileNotificationsList.innerHTML = notificationsData
    .map(
      (notification) => `
        <div class="notification-item ${!notification.isRead ? "unread" : ""}" onclick="handleNotificationClick(${notification.id})">
            <img src="${notification.userAvatar}" class="notification-avatar" alt="User">
            <div class="notification-content">
                <p>${notification.message}</p>
                <small>${notification.time}</small>
            </div>
        </div>
    `,
    )
    .join("")
}

// Enhanced Notification Dropdown Functions
function toggleNotificationDropdown() {
  const container = document.getElementById("notificationDropdownContainer")
  if (container) {
    const isVisible = container.classList.contains("show")

    // Close other dropdowns
    closeAllDropdowns()

    if (!isVisible) {
      container.classList.add("show")
      loadNotifications()
    }
  }
}

// User Dropdown Functions
function toggleUserDropdown() {
  const container = document.getElementById("userDropdownContainer")
  const mobileContainer = document.getElementById("mobileUserDropdownContainer")

  // Close other dropdowns
  closeAllDropdowns()

  if (window.innerWidth < 992) {
    // Mobile dropdown
    if (mobileContainer) {
      const isVisible = mobileContainer.classList.contains("show")
      mobileContainer.classList.toggle("show", !isVisible)
    }
  } else {
    // Desktop dropdown
    if (container) {
      const isVisible = container.classList.contains("show")
      container.classList.toggle("show", !isVisible)
    }
  }
}

function closeAllDropdowns() {
  const dropdowns = ["notificationDropdownContainer", "userDropdownContainer", "mobileUserDropdownContainer"]

  dropdowns.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.classList.remove("show")
    }
  })
}

function handleLogout() {
  if (confirm("Are you sure you want to log out?")) {
    showNotification("Logging out...", "info", "Goodbye!")

    // PHP Integration: Logout
    /*
        fetch('logout.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.href = 'login.php';
            }
        });
        */

    setTimeout(() => {
      // window.location.href = 'login.php';
      showNotification("Logout successful!", "success", "Redirecting...")
    }, 2000)
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

  // Add cyberpunk sound effect (optional)
  playNotificationSound(type)
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

function playNotificationSound(type) {
  // Optional: Add cyberpunk notification sounds
  // This would require audio files
  /*
    const audio = new Audio(`sounds/notification_${type}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed'));
    */
}

// Update existing handleOutsideClick function
function handleOutsideClick(e) {
  // Close search suggestions
  if (!e.target.closest(".search-container")) {
    hideSearchSuggestions()
  }

  // Close mobile search suggestions
  if (!e.target.closest(".mobile-search-section")) {
    const mobileSuggestions = document.getElementById("mobileSearchSuggestions")
    if (mobileSuggestions) {
      mobileSuggestions.style.display = "none"
    }
  }

  // Close dropdowns
  if (!e.target.closest(".dropdown") && !e.target.closest(".user-dropdown-toggle")) {
    closeAllDropdowns()
  }

  // Close mobile menu
  if (!e.target.closest(".mobile-menu") && !e.target.closest(".cyber-hamburger")) {
    const mobileMenu = document.getElementById("mobileMenu")
    const hamburger = document.querySelector(".cyber-hamburger")
    if (mobileMenu && mobileMenu.classList.contains("show")) {
      mobileMenu.classList.remove("show")
      hamburger.classList.remove("active")
      document.body.style.overflow = ""
    }
  }

  // Close reaction pickers
  const reactionPickers = document.querySelectorAll(".reaction-picker.show")
  reactionPickers.forEach((picker) => {
    if (!picker.contains(e.target) && !e.target.closest(".reaction-btn")) {
      picker.classList.remove("show")
    }
  })
}

// Update window resize handler
window.addEventListener("resize", () => {
  if (window.innerWidth >= 992) {
    // Close mobile menu on desktop
    const mobileMenu = document.getElementById("mobileMenu")
    const hamburger = document.querySelector(".cyber-hamburger")
    if (mobileMenu && mobileMenu.classList.contains("show")) {
      mobileMenu.classList.remove("show")
      hamburger.classList.remove("active")
      document.body.style.overflow = ""
    }

    // Close mobile user dropdown
    const mobileContainer = document.getElementById("mobileUserDropdownContainer")
    if (mobileContainer) {
      mobileContainer.classList.remove("show")
    }
  }
})

// Add keyboard shortcuts for mobile
document.addEventListener("keydown", (e) => {
  // Existing shortcuts...

  // Escape to close mobile menu and dropdowns
  if (e.key === "Escape") {
    const mobileMenu = document.getElementById("mobileMenu")
    const hamburger = document.querySelector(".cyber-hamburger")
    if (mobileMenu && mobileMenu.classList.contains("show")) {
      mobileMenu.classList.remove("show")
      hamburger.classList.remove("active")
      document.body.style.overflow = ""
    }

    closeAllDropdowns()

    const photoModal = document.querySelector(".photo-modal")
    if (photoModal) {
      closePhotoModal()
    }
  }
})

const performSearch = (query) => {
  showNotification(`Searching for ${query}...`, "info")
}

// const bootstrap = {
//   Modal: {
//     getInstance: (element) => {
//       return {
//         hide: () => {
//           console.log("Hiding modal", element)
//         },
//       }
//     },
//   },
// }

const closePhotoModal = () => {
  showNotification("Closing photo modal", "info")
}
