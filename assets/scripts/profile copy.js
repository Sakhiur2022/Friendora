// Enhanced Friendora Profile Page JavaScript
// This file handles all the interactive functionality and dummy data

const FriendoraCore = require("./main")

let Friendora = new FriendoraCore();

document.addEventListener("DOMContentLoaded", () => {
    // Initialize the page
    initializePage()
    setupEventListeners()
    loadDummyData()
    setupBackgroundMusic()
    createFloatingParticles()
    initializeProfileOwnership()
    
    // Test the functions after a delay
    setTimeout(() => {
        // Test if postsContainer exists
        const postsContainer = document.getElementById("postsContainer")
        
        // Test if posts are loaded
        const postCards = document.querySelectorAll(".post-card")
        
        // Test reaction buttons
        const reactionBtns = document.querySelectorAll(".reaction-btn")
        
        // Test comment buttons
        const commentBtns = document.querySelectorAll(".comment-btn")
        
        // Test comment sections
        const commentSections = document.querySelectorAll("[id^='commentsSection']")
        
        // Test first comment button click
        if (commentBtns.length > 0) {
          setTimeout(() => {
            commentBtns[0].click()
          }, 500)
        }
        
        // Test notification and message counts
        const desktopNotifCount = document.getElementById("notificationCount")
        const mobileNotifCount = document.getElementById("mobileNotificationCount") 
        const mobileMessageCount = document.getElementById("mobileMessageCount")
        
    }, 2000)
    
    // Show welcome message after a short delay
    setTimeout(() => {
        Friendora.showNotification('Welcome to Friendora! 🎵 Posts and reactions are ready to use', 'success');
    }, 1000);
  })
  
  // Enhanced dummy user data
  const userData = {
    id: 1,
    // name: "Alexandra Chen",
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
    website: "alexandra-dreams.cyber",
    language: "English, Japanese, Binary",
    professional: "Senior VR Artist & Dream Architect",
    quotes: "In the digital realm, we are all architects of our own reality",
    lifeEvents: "Graduated VR University (2018), Joined DreamScape Studios (2019), Won Cyber Art Award (2023)",
    isOwnProfile: true, // This would be determined by PHP: $_SESSION['user_id'] == $profile_user_id
  }
  
  // Enhanced posts data with reactions and comments
  const postsData = [
    {
      id: 1,
      author: "Alexandra Chen",
      authorId: 1,
      authorPic: "https://via.placeholder.com/45x45/6f42c1/ffffff?text=AC",
      time: "2 hours ago",
      content:
        "Just finished working on a new VR dreamscape project! The intersection of technology and imagination never ceases to amaze me. ✨🌟",
      image: "https://via.placeholder.com/600x400/6f42c1/ffffff?text=VR+Project",
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
          userAvatar: "https://via.placeholder.com/32x32/007bff/ffffff?text=MT",
          content: "This looks absolutely incredible! Can't wait to experience it.",
          time: "1 hour ago",
          likes: 3,
        },
        {
          id: 2,
          userId: 3,
          userName: "Luna Digital",
          userAvatar: "https://via.placeholder.com/32x32/28a745/ffffff?text=LD",
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
      authorPic: "https://via.placeholder.com/45x45/6f42c1/ffffff?text=AC",
      time: "1 day ago",
      content: "Exploring the neon-lit streets of Neo Tokyo tonight. The city's energy is incredible! 🌃⚡",
      image: "https://via.placeholder.com/600x400/dc3545/ffffff?text=Neo+Tokyo",
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
          userAvatar: "https://via.placeholder.com/32x32/ffc107/000000?text=CE",
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
      userAvatar: "https://via.placeholder.com/40x40/007bff/ffffff?text=MT",
      message: "Marcus Tech liked your post",
      time: "5 minutes ago",
      isRead: false,
      type: "like",
    },
    {
      id: 2,
      userId: 3,
      userAvatar: "https://via.placeholder.com/40x40/28a745/ffffff?text=LD",
      message: "Luna Digital commented on your photo",
      time: "1 hour ago",
      isRead: false,
      type: "comment",
    },
    {
      id: 3,
      userId: 4,
      userAvatar: "https://via.placeholder.com/40x40/ffc107/000000?text=CE",
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
      avatar: "https://via.placeholder.com/35x35/007bff/ffffff?text=MT",
    },
    {
      id: 2,
      name: "Luna Digital",
      type: "Person",
      avatar: "https://via.placeholder.com/35x35/28a745/ffffff?text=LD",
    },
    {
      id: 3,
      name: "VR Artists Community",
      type: "Group",
      avatar: "https://via.placeholder.com/35x35/6f42c1/ffffff?text=VR",
    },
  ]
  
  // Enhanced photos data for gallery
  const allPhotosData = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80", // cyberpunk city
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80", // neon street
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80", // futuristic alley
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80", // cyberpunk portrait
    "https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=300&q=80", // neon lights
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=300&q=80", // cityscape
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=300&q=80", // neon street 2
    "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=300&q=80", // futuristic alley 2
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80", // cyberpunk portrait 2
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80", // cyberpunk city 2
    "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=300&q=80", // cityscape 2
    "https://images.unsplash.com/photo-1465101178521-c1a4c8a0a8b7?auto=format&fit=crop&w=300&q=80"  // neon lights 2
  ]
  
  // Friends data for preview
  const friendsData = [
    {
      id: 1,
      name: "Marcus Tech",
      avatar: "https://via.placeholder.com/60x60/007bff/ffffff?text=MT",
      mutualFriends: 15
    },
    {
      id: 2,
      name: "Luna Digital",
      avatar: "https://via.placeholder.com/60x60/28a745/ffffff?text=LD",
      mutualFriends: 23
    },
    {
      id: 3,
      name: "Cyber Explorer",
      avatar: "https://via.placeholder.com/60x60/ffc107/000000?text=CE",
      mutualFriends: 8
    },
    {
      id: 4,
      name: "Nova Artist",
      avatar: "https://via.placeholder.com/60x60/dc3545/ffffff?text=NA",
      mutualFriends: 12
    },
    {
      id: 5,
      name: "Echo Dreamer",
      avatar: "https://via.placeholder.com/60x60/17a2b8/ffffff?text=ED",
      mutualFriends: 7
    },
    {
      id: 6,
      name: "Pixel Sage",
      avatar: "https://via.placeholder.com/60x60/6f42c1/ffffff?text=PS",
      mutualFriends: 19
    }
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
      const ownProfileActions = document.getElementById("ownProfileActions")
      const editProfileBtn = document.getElementById("editProfileBtn")
      const followBtn = document.getElementById("followBtn")
      const messageBtn = document.getElementById("messageBtn")
      
      if (ownProfileActions) ownProfileActions.style.display = "block"
      if (editProfileBtn) editProfileBtn.style.display = "block"
      if (followBtn) followBtn.style.display = "none"
      if (messageBtn) messageBtn.style.display = "none"
    } else {
      // Show other profile actions
      const ownProfileActions = document.getElementById("ownProfileActions")
      const editProfileBtn = document.getElementById("editProfileBtn")
      const followBtn = document.getElementById("followBtn")
      const messageBtn = document.getElementById("messageBtn")
      
      if (ownProfileActions) ownProfileActions.style.display = "none"
      if (editProfileBtn) editProfileBtn.style.display = "none"
      if (followBtn) followBtn.style.display = "block"
      if (messageBtn) messageBtn.style.display = "block"
    }
  }
  
  function setupEventListeners() {
    // Enhanced search functionality - Desktop
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

    // Enhanced search functionality - Mobile
    const mobileSearchInput = document.getElementById("mobileSearchInput")
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener("input", handleMobileSearchInput)
      mobileSearchInput.addEventListener("focus", showMobileSearchSuggestions)
      mobileSearchInput.addEventListener("blur", hideMobileSearchSuggestions)
      mobileSearchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          performSearch(this.value)
        }
      })
    }
    
    // Mobile profile section click
    const mobileProfileSection = document.querySelector(".user-profile-mobile")
    if (mobileProfileSection) {
      mobileProfileSection.addEventListener("click", function(event) {
        // Only handle clicks on the main profile area, not on dropdown toggles
        if (!event.target.closest('[data-bs-toggle="collapse"]') && !event.target.closest('.collapse')) {
          // Close the offcanvas
          const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileNav'))
          if (offcanvas) offcanvas.hide()
          
          // Scroll to profile section
          setTimeout(() => {
            const profileHeader = document.querySelector(".profile-header")
            if (profileHeader) {
              profileHeader.scrollIntoView({ behavior: 'smooth' })
            }
          }, 300)
        }
      })
    }
    
    // Prevent mobile user options dropdown from closing the offcanvas
    const mobileUserToggle = document.querySelector('[data-bs-target="#mobileUserOptions"]')
    if (mobileUserToggle) {
      mobileUserToggle.addEventListener('click', function(event) {
        event.stopPropagation() // Prevent bubbling to parent elements
      })
    }
    
    // Handle clicks inside user options dropdown
    const mobileUserOptions = document.getElementById('mobileUserOptions')
    if (mobileUserOptions) {
      mobileUserOptions.addEventListener('click', function(event) {
        // Only close offcanvas for logout or profile view actions
        if (event.target.closest('[href*="logout"]') || event.target.closest('[onclick*="openEditProfileModal"]')) {
          setTimeout(() => {
            const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('mobileNav'))
            if (offcanvas) offcanvas.hide()
          }, 100)
        }
      })
    }
    
    // Enhanced mobile notifications toggle
    const mobileNotificationsToggle = document.querySelector('[data-bs-target="#mobileNotifications"]')
    const mobileNotificationsCollapse = document.getElementById('mobileNotifications')
    
    if (mobileNotificationsToggle && mobileNotificationsCollapse) {
      // Prevent the toggle from auto-closing when clicking inside
      mobileNotificationsToggle.addEventListener('click', function(event) {
        event.preventDefault()
        event.stopPropagation()
        
        // Manual toggle logic
        const isCurrentlyOpen = mobileNotificationsCollapse.classList.contains('show')
        
        if (isCurrentlyOpen) {
          mobileNotificationsCollapse.classList.remove('show')
          this.setAttribute('aria-expanded', 'false')
        } else {
          mobileNotificationsCollapse.classList.add('show')
          this.setAttribute('aria-expanded', 'true')
        }
        
        // Toggle the collapse indicator
        const indicator = this.querySelector('.collapse-indicator')
        if (indicator) {
          const isExpanded = this.getAttribute('aria-expanded') === 'true'
          indicator.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
        }
      })
      
      // Prevent collapse when clicking inside the notifications
      mobileNotificationsCollapse.addEventListener('click', function(event) {
        event.stopPropagation()
      })
      
      // Prevent global click handlers from closing the dropdown
      document.addEventListener('click', function(event) {
        if (!mobileNotificationsToggle.contains(event.target) && 
            !mobileNotificationsCollapse.contains(event.target)) {
          // Only close if clicking outside
          if (mobileNotificationsCollapse.classList.contains('show')) {
            mobileNotificationsCollapse.classList.remove('show')
            mobileNotificationsToggle.setAttribute('aria-expanded', 'false')
            const indicator = mobileNotificationsToggle.querySelector('.collapse-indicator')
            if (indicator) {
              indicator.style.transform = 'rotate(0deg)'
            }
          }
        }
      })
    }
    
    // Ensure mobile notifications are accessible and scrollable
    const mobileNotificationsList = document.getElementById('mobileNotificationsList')
    if (mobileNotificationsList) {
      // Add smooth scrolling to notification items
      mobileNotificationsList.addEventListener('click', function(event) {
        const notificationItem = event.target.closest('.mobile-notification-item')
        if (notificationItem) {
          // Mark as read
          notificationItem.classList.remove('unread')
          notificationItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
          
          // Don't close the dropdown when clicking on notifications
          event.stopPropagation()
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
      saveProfileBtn.addEventListener("click", function() {
        console.log("saveProfileBtn clicked");
      });
      console.log("saveProfile function attached to saveProfileBtn");
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
  
    // Close dropdowns when clicking outside
    document.addEventListener("click", handleOutsideClick)
  
    // Add hover effects to cards
    addCardHoverEffects()
  }
  
  function loadDummyData() {
    // Load user info
    const userName = document.getElementById("userName")
    const userBio = document.getElementById("userBio")
    
    if (userName) userName.textContent = userData.name
    if (userBio) userBio.textContent = userData.bio
  
    // Load about section
    loadAboutSection()
  
    // Load photos
    loadPhotosGrid()
  
    // Load friends preview
    loadFriendsPreview()
  
    // Load posts with enhanced features - with retry mechanism
    loadEnhancedPosts()
    
    // Retry loading posts if container not found
    setTimeout(() => {
      const postsContainer = document.getElementById("postsContainer")
      if (!postsContainer || postsContainer.children.length === 0) {
        loadEnhancedPosts()
      }
    }, 1000)
  
    // Load notifications
    loadNotifications()
    
    // Update message count
    updateMessageCount()
  
    // Populate edit form
    populateEditForm()
  }
  
  function loadEnhancedPosts() {
    
    // Wait for DOM to be fully ready
    if (document.readyState !== 'complete') {
      setTimeout(loadEnhancedPosts, 100)
      return
    }
    
    const postsContainer = document.getElementById("postsContainer")
    
    if (!postsContainer) {
      
      // Try alternative ways to find the container
      const altContainer = document.querySelector("#postsContainer")
      
      if (!altContainer) {
        
        // Try to find any element that might be the container
        const allDivs = document.querySelectorAll('div')
        
        // Show notification to user
        setTimeout(() => {
          Friendora.showNotification('Error: Posts container not found! Please refresh the page.', 'error')
        }, 1000)
        return
      }
    }
    
  
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
                  
                  <!-- Enhanced Facebook-Style Reaction System -->
                  <div class="post-actions">
                      <div class="reaction-container">
                          <button class="post-action-btn reaction-btn ${post.userReaction ? 'reacted' : ''}" 
                                  onclick="quickReaction(${post.id})" 
                                  onmouseenter="showReactionPicker(${post.id})" 
                                  onmouseleave="hideReactionPicker(${post.id})"
                                  data-post-id="${post.id}">
                              <span class="reaction-emoji" style="color: ${post.userReaction ? getReactionColor(post.userReaction) : '#65676b'}">
                                  ${post.userReaction ? getReactionIcon(post.userReaction) : '👍'}
                              </span>
                             
                              <span class="reaction-count">${post.totalReactions > 0 ? post.totalReactions : ''}</span>
                          </button>
                          
                          <!-- Enhanced Reaction Picker with Animations -->
                          <div class="reaction-picker" id="reactionPicker${post.id}">
                              <button class="reaction-option" onclick="addReaction(${post.id}, 'like')" title="Like" data-reaction="like">
                                  <span class="reaction-emoji-large">👍</span>
                                 
                              </button>
                              <button class="reaction-option" onclick="addReaction(${post.id}, 'love')" title="Love" data-reaction="love">
                                  <span class="reaction-emoji-large">❤️</span>
                                  
                              </button>
                              <button class="reaction-option" onclick="addReaction(${post.id}, 'haha')" title="Haha" data-reaction="haha">
                                  <span class="reaction-emoji-large">😂</span>
                                  
                              </button>
                              <button class="reaction-option" onclick="addReaction(${post.id}, 'wow')" title="Wow" data-reaction="wow">
                                  <span class="reaction-emoji-large">😮</span>
                                
                              </button>
                              <button class="reaction-option" onclick="addReaction(${post.id}, 'sad')" title="Sad" data-reaction="sad">
                                  <span class="reaction-emoji-large">😢</span>
                                 
                              </button>
                              <button class="reaction-option" onclick="addReaction(${post.id}, 'angry')" title="Angry" data-reaction="angry">
                                  <span class="reaction-emoji-large">😡</span>
                                  
                              </button>
                          </div>
                          
                 
                      </div>
                      <button class="post-action-btn comment-btn" onclick="toggleComments(${post.id})">
                          <i class="bi bi-chat-fill"></i>
                          
                          <span class="action-count">${post.commentCount > 0 ? post.commentCount : ''}</span>
                      </button>
                      <button class="post-action-btn share-btn" onclick="sharePost(${post.id})">
                          <i class="bi bi-share-fill"></i>
                        
                          <span class="action-count">${post.shares > 0 ? post.shares : ''}</span>
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
                          <img src="https://via.placeholder.com/32x32/6f42c1/ffffff?text=AC" class="comment-avatar" alt="Your Profile">
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
    
    // Verify reaction buttons are created
    const reactionBtns = postsContainer.querySelectorAll(".reaction-btn")
    
    // Verify comment buttons are created
    const commentBtns = postsContainer.querySelectorAll(".comment-btn")
    
    // Verify comment sections are created
    const commentSections = postsContainer.querySelectorAll("[id^='commentsSection']")
    
    // Verify reaction emojis are present
    const reactionEmojis = postsContainer.querySelectorAll(".reaction-emoji")
    
    // Log first emoji content for debugging
    if (reactionEmojis.length > 0) {
    }
    
    
    // Show success notification
    setTimeout(() => {
      Friendora.showNotification(`Successfully loaded ${posts.length} posts with reactions and comments!`, 'success')
    }, 500)
  }
  
  function loadNotifications() {
    
    const notificationsList = document.getElementById("notificationsList")
    const notificationCount = document.getElementById("notificationCount")
    const mobileNotificationCount = document.getElementById("mobileNotificationCount")
    const mobileNotificationsList = document.getElementById("mobileNotificationsList")

  
    if (!notificationsList) return
  
    // Update notification count
    const unreadCount = notificationsData.filter((n) => !n.isRead).length
    
    // Update desktop notification count
    if (notificationCount) {
      notificationCount.textContent = unreadCount
      notificationCount.style.display = "flex" // Always show for testing
      notificationCount.style.visibility = "visible"
    }
    
    // Update mobile notification count
    if (mobileNotificationCount) {
      mobileNotificationCount.textContent = unreadCount
      mobileNotificationCount.style.display = "flex" // Always show for testing
      mobileNotificationCount.style.visibility = "visible"
    }
  
    const notificationHTML = notificationsData
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
      
    // Update desktop notifications
    notificationsList.innerHTML = notificationHTML
    
    // Update mobile notifications
    if (mobileNotificationsList) {
      mobileNotificationsList.innerHTML = notificationHTML.replace(/li class/g, 'div class')
    }
  
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
  
  function updateMessageCount() {
    
    // Dummy message count - this would come from PHP/database
    const messageCount = 3
    
    // Update desktop message count
    const messagesIcon = document.querySelector('#messagesIcon .notification-badge')
    if (messagesIcon) {
      messagesIcon.textContent = messageCount
      messagesIcon.style.display = "flex" // Always show for testing
      messagesIcon.style.visibility = "visible"
    }
    
    // Update mobile message count
    const mobileMessageCount = document.getElementById("mobileMessageCount")
    if (mobileMessageCount) {
      mobileMessageCount.textContent = messageCount
      mobileMessageCount.style.display = "flex" // Always show for testing
      mobileMessageCount.style.visibility = "visible"
    }
  }
  
  function confirmLogout(event) {
    event.preventDefault()
    
    if (confirm("Are you sure you want to logout?")) {
      Friendora.showNotification("Logging out...", "info")
      // Add loading animation
      setTimeout(() => {
        window.location.href = event.target.href || event.target.closest('a').href
      }, 1000)
    }
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

    Friendora.showNotification(`Selected ${type}: ${id}`, "info")
    hideSearchSuggestions()
  }
  
  function openAdvancedSearch() {
    // PHP Integration: Navigate to advanced search page
    // window.location.href = 'navigator.php';

    Friendora.showNotification("Advanced Search - Navigator page coming soon!", "info")
  }
  
  // Reaction System Functions
  function getReactionIcon(reaction) {
    const icons = {
      like: "👍",
      love: "❤️",
      haha: "😂",
      wow: "😮",
      sad: "😢",
      angry: "😡",
    }
    return icons[reaction] || "👍"
  }
  
  function getReactionColor(reaction) {
    const colors = {
      like: "#1877f2",
      love: "#e41e3f",
      haha: "#f7b928",
      wow: "#f7b928",
      sad: "#f7b928",
      angry: "#e9710f",
    }
    return colors[reaction] || "#65676b"
  }
  
  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  // Quick reaction function (single click like Facebook)
  function quickReaction(postId) {
    
    const post = postsData.find((p) => p.id === postId)
    if (!post) return
    
    // If no reaction, add like. If already reacted, remove reaction
    if (!post.userReaction) {
      addReaction(postId, 'like')
    } else {
      addReaction(postId, post.userReaction) // This will remove the reaction
    }
  }
  
  function showReactionDetails(postId) {
    const post = postsData.find((p) => p.id === postId)
    if (!post) return
    
    // Create detailed reaction breakdown
    const reactionBreakdown = Object.entries(post.reactions)
      .filter(([type, count]) => count > 0)
      .map(([type, count]) => `${getReactionIcon(type)} ${capitalizeFirst(type)}: ${count}`)
      .join('\n')

    Friendora.showNotification(`Reaction Details:\n${reactionBreakdown}`, 'info')
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
  
  function showReactions(postId) {
    const post = postsData.find((p) => p.id === postId)
    if (!post) return
    
    // For now, just show a simple alert with reaction count
    // This can be enhanced to show a modal with all reactions
    const totalReactions = Object.values(post.reactions).reduce((sum, count) => sum + count, 0)
    Friendora.showNotification(`This post has ${totalReactions} reaction${totalReactions !== 1 ? 's' : ''}`, 'info')
  }
  
  function addReaction(postId, reactionType) {
    
    const post = postsData.find((p) => p.id === postId)
    if (!post) {
      return
    }

    
    const wasReacted = post.userReaction === reactionType
  
    // Remove previous reaction
    if (post.userReaction) {
      post.reactions[post.userReaction]--
      post.totalReactions--
    }
  
    // Add new reaction or remove if same
    if (!wasReacted) {
      post.reactions[reactionType]++
      post.totalReactions++
      post.userReaction = reactionType
    } else {
      post.userReaction = null
    }

  
    // Update UI with Facebook-style animations
    updateReactionUI(postId, post)
  
    // Hide picker
    hideReactionPicker(postId)
    
    // Show success notification with animation
    const actionText = post.userReaction ? 'Added' : 'Removed'
    const emoji = post.userReaction ? getReactionIcon(post.userReaction) : '👍'
    Friendora.showNotification(`${actionText} ${emoji} ${reactionType} reaction!`, 'success')

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
  
  function updateReactionUI(postId, post) {
    const reactionBtn = document.querySelector(`[data-post-id="${postId}"]`)
    
    if (!reactionBtn) {
      return
    }
    
    const emoji = reactionBtn.querySelector(".reaction-emoji")
    const count = reactionBtn.querySelector(".reaction-count")
    

    if (emoji && count) {
      const newEmoji = post.userReaction ? getReactionIcon(post.userReaction) : "👍"
      const newColor = post.userReaction ? getReactionColor(post.userReaction) : "#65676b"
      
      
      // Animate the changes Facebook-style
      reactionBtn.style.transform = "scale(1.1)"
      reactionBtn.classList.toggle('reacted', !!post.userReaction)
      
      emoji.textContent = newEmoji
      emoji.style.color = newColor
      count.textContent = post.totalReactions > 0 ? post.totalReactions : ''
      
      setTimeout(() => {
        reactionBtn.style.transform = "scale(1)"
      }, 150)
      
      // Update reaction summary
      updateReactionSummary(postId, post)
      
    } else {
    }
  }
  
  function updateReactionSummary(postId, post) {
    const container = document.querySelector(`[data-post-id="${postId}"]`).parentElement
    let summary = container.querySelector('.reaction-summary')
    
    if (post.totalReactions > 0) {
      const summaryHTML = `
        <div class="reaction-summary" onclick="showReactionDetails(${postId})">
            <div class="reaction-icons">
                ${Object.entries(post.reactions).filter(([type, count]) => count > 0).slice(0, 3).map(([type]) => 
                    `<span class="reaction-icon-small" style="color: ${getReactionColor(type)}">${getReactionIcon(type)}</span>`
                ).join('')}
            </div>
            <span class="reaction-total">${post.totalReactions}</span>
        </div>
      `
      
      if (summary) {
        summary.outerHTML = summaryHTML
      } else {
        container.insertAdjacentHTML('beforeend', summaryHTML)
      }
    } else {
      if (summary) {
        summary.remove()
      }
    }
  }
  
  // Comment System Functions
  function toggleComments(postId) {
    
    // First check if posts are loaded
    const postCard = document.querySelector(`[data-post-id="${postId}"]`)
    
    if (!postCard) {
      loadEnhancedPosts()
      
      // Retry after a short delay
      setTimeout(() => {
        const retryPostCard = document.querySelector(`[data-post-id="${postId}"]`)
        if (retryPostCard) {
          toggleComments(postId)
        } else {
          Friendora.showNotification('Error: Post not found. Please refresh the page.', 'error')
        }
      }, 1000)
      return
    }
    
    const commentsSection = document.getElementById(`commentsSection${postId}`)
    if (!commentsSection) {
      // Try to find it within the post card
      const altCommentsSection = postCard.querySelector('.comments-section')
      
      if (!altCommentsSection) {
        Friendora.showNotification('Error: Comments section not found. Please refresh the page.', 'error')
        return
      } else {
        // Use the alternative comments section
        const isVisible = altCommentsSection.style.display !== "none"
        
        if (isVisible) {
          altCommentsSection.style.display = "none"
        } else {
          altCommentsSection.style.display = "block"
        }

        Friendora.showNotification(`Comments ${isVisible ? 'hidden' : 'shown'}`, 'info')
        return
      }
    }
    
    
    const isVisible = commentsSection.style.display !== "none"
      
    if (isVisible) {
      // Hide comments with animation
      commentsSection.style.animation = "slideUp 0.3s ease-out"
      setTimeout(() => {
        commentsSection.style.display = "none"
        commentsSection.style.animation = ""
      }, 300)
    } else {
      // Show comments with animation
      commentsSection.style.display = "block"
      commentsSection.style.animation = "slideDown 0.3s ease-out"
      
      // Load comments from server
      loadPostComments(postId)
      
      // Focus on comment input after a short delay
      setTimeout(() => {
        const commentInput = document.getElementById(`commentInput${postId}`)
        if (commentInput) {
          commentInput.focus()
        } else {
        }
      }, 350)
    }
    
    // Update button appearance
    const commentBtn = postCard.querySelector('.comment-btn')
    if (commentBtn) {
      if (isVisible) {
        commentBtn.classList.remove("active")
      } else {
        commentBtn.classList.add("active")
      }
    } else {
    }
    
    // Show notification
    showNotification(`Comments ${isVisible ? 'hidden' : 'shown'}`, 'info')
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
      userAvatar: "https://via.placeholder.com/32x32/6f42c1/ffffff?text=AC",
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
    const commentBtn = document.querySelector(`[data-post-id="${postId}"]`).parentElement.querySelector('.comment-btn .action-count')
    if (commentBtn) {
      commentBtn.textContent = post.commentCount > 0 ? post.commentCount : ''
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
              const coverPhoto = document.getElementById('coverPhoto');
              if (coverPhoto) coverPhoto.src = data.url;
              showNotification('Cover photo updated successfully!', 'success');
              const coverModal = document.getElementById('coverPhotoModal');
              if (coverModal) bootstrap.Modal.getInstance(coverModal).hide();
          } else {
              showNotification('Error uploading cover photo: ' + data.message, 'error');
          }
      });
      */
  
    // Demo implementation
    const previewImg = document.getElementById("coverPreviewImg")
    const coverPhoto = document.getElementById("coverPhoto")
    const coverModal = document.getElementById("coverPhotoModal")
    
    if (previewImg && coverPhoto) {
      coverPhoto.src = previewImg.src
      showNotification("Cover photo updated successfully!", "success")
      if (coverModal) bootstrap.Modal.getInstance(coverModal).hide()
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
              const profilePic = document.getElementById('profilePic');
              if (profilePic) profilePic.src = data.url;
              showNotification('Profile picture updated successfully!', 'success');
              const profileModal = document.getElementById('profilePhotoModal');
              if (profileModal) bootstrap.Modal.getInstance(profileModal).hide();
          } else {
              showNotification('Error uploading profile picture: ' + data.message, 'error');
          }
      });
      */
  
    // Demo implementation
    const previewImg = document.getElementById("profilePreviewImg")
    const profilePic = document.getElementById("profilePic")
    const profileModal = document.getElementById("profilePhotoModal")
    
    if (previewImg && profilePic) {
      profilePic.src = previewImg.src
      showNotification("Profile picture updated successfully!", "success")
      if (profileModal) bootstrap.Modal.getInstance(profileModal).hide()
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
      
      // Update desktop count
      const countElement = document.getElementById("notificationCount")
      if (countElement) {
        countElement.textContent = unreadCount
        countElement.style.display = unreadCount > 0 ? "flex" : "none"
      }
      
      // Update mobile count
      const mobileCountElement = document.getElementById("mobileNotificationCount")
      if (mobileCountElement) {
        mobileCountElement.textContent = unreadCount
        mobileCountElement.style.display = unreadCount > 0 ? "flex" : "none"
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
  
    // Update desktop count
    const countElement = document.getElementById("notificationCount")
    if (countElement) {
      countElement.style.display = "none"
    }
    
    // Update mobile count
    const mobileCountElement = document.getElementById("mobileNotificationCount")
    if (mobileCountElement) {
      mobileCountElement.style.display = "none"
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
  function loadAboutSection() {
    const aboutSection = document.getElementById("aboutSection")
    if (!aboutSection) return
  
    const aboutItems = [
      { icon: "bi-geo-alt-fill", label: "Lives in", value: userData.currentCity },
      { icon: "bi-house-fill", label: "From", value: userData.hometown },
      { icon: "bi-calendar-fill", label: "Born", value: new Date(userData.birthday).toLocaleDateString() },
      { icon: "bi-gender-ambiguous", label: "Gender", value: userData.gender },
      { icon: "bi-mortarboard-fill", label: "Studied at", value: userData.university },
      { icon: "bi-briefcase-fill", label: "Works at", value: userData.workplace },
      { icon: "bi-globe", label: "Website", value: userData.website },
      { icon: "bi-translate", label: "Languages", value: userData.language },
      { icon: "bi-quote", label: "Favorite quote", value: userData.quotes },
    ]
  
    aboutSection.innerHTML = aboutItems
      .map(
        (item) => `
          <div class="about-item">
              <i class="bi ${item.icon}"></i>
              <div class="about-text">
                  <div class="about-label">${item.label}</div>
                  <div class="about-value">${item.value}</div>
              </div>
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

    const displayPhotos = allPhotosData.slice(0, 6) // Show first 6 photos only
    photosGrid.innerHTML = displayPhotos
      .map(
        (photo, index) => `
          <div class="photo-item" onclick="openPhotoModal('${photo}', ${index})">
            <img src="${photo}" alt="Photo ${index + 1}" loading="lazy">
            <div class="photo-overlay">
              <i class="bi bi-zoom-in"></i>
            </div>
          </div>
      `,
      )
      .join("")
  }

  function loadFriendsPreview() {
    const friendsPreview = document.getElementById("friendsPreview")
    if (!friendsPreview) return

    const displayFriends = friendsData.slice(0, 6) // Show first 6 friends
    friendsPreview.innerHTML = displayFriends
      .map(friend => `
        <div class="friend-preview-item" onclick="openFriendProfile(${friend.id})">
          <img src="${friend.avatar}" alt="${friend.name}" class="friend-avatar-small">
          <p class="friend-name-small">${friend.name}</p>
        </div>
      `)
      .join("")
  }  function openPhotoModal(photoUrl, index) {
    currentPhotoIndex = index
    openPhotoGallery()
  }

  function openFriendsModal() {
    const modal = new bootstrap.Modal(document.getElementById("friendsModal"))
    if (modal) {
      modal.show()
    } else {
      // If modal doesn't exist, show notification
      showNotification("Friends list coming soon!", "info")
    }
  }

  function openFriendProfile(friendId) {
    // PHP Integration: Navigate to friend's profile
    // window.location.href = `profile.php?id=${friendId}`;
    
    showNotification(`Opening friend profile: ${friendId}`, "info")
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
    console.log("Saving profile...")
    // Collect form data
    const formData = new FormData(document.getElementById("editProfileForm"))
  
    // PHP Integration Comment:
    console.log("Submitting profile update via POST:", Object.fromEntries(formData.entries()));
      fetch('', {
          method: 'POST',
          body: formData
      })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              showNotification('Profile updated successfully!', 'success');
              updateProfileDisplay(data.user);
          } else {
              showNotification('Error updating profile: ' + data.message, 'error');
          }
      });
      
  
    // // Dummy implementation
    // const updatedData = Object.fromEntries(formData)
    // Object.assign(userData, updatedData)
  
    // Update display
    updateProfileDisplay()
  
    // Close modal
    const editModal = document.getElementById("editProfileModal")
    if (editModal) bootstrap.Modal.getInstance(editModal).hide()
  
    // showNotification("Profile updated successfully!", "success")
  }
  
  function updateProfileDisplay() {
    // Update name and bio
    const userName = document.getElementById("userName")
    const userBio = document.getElementById("userBio")
    
    if (userName) userName.textContent = userData.name
    if (userBio) userBio.textContent = userData.bio
  
    // Reload about section
    loadAboutSection()
  
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
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: var(--cyber-primary);
            border-radius: 50%;
            opacity: 0.3;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            z-index: 1;
        `;
        particleContainer.appendChild(particle);
    }

    // Add keyframes for floating animation if not already present
    if (!document.getElementById('floating-particles-style')) {
        const style = document.createElement('style');
        style.id = 'floating-particles-style';
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0) scale(1); opacity: 0.3; }
                50% { transform: translateY(-30px) scale(1.2); opacity: 0.6; }
                100% { transform: translateY(0) scale(1); opacity: 0.3; }
            }
            .floating-particles {
                pointer-events: none;
                position: fixed;
                left: 0; top: 0; width: 100vw; height: 100vh;
                z-index: 1;
            }
        `;
        document.head.appendChild(style);
    }
}

// Missing Essential Functions Implementation



// function sharePost(postId) {
//     if (navigator.share) {
//         navigator.share({
//             title: 'Check out this post!',
//             text: 'Found this interesting post on Friendora',
//             url: window.location.href
//         });
//     } else {
//         navigator.clipboard.writeText(window.location.href);
//         showNotification('Link copied to clipboard!', 'info');
//     }
// }

// function expandPostInput() {
//     const postInput = document.getElementById("postInput");
//     if (postInput) {
//         postInput.style.height = "120px";
//         const postActions = document.querySelector('.post-actions');
//         if (postActions) {
//             postActions.style.display = 'flex';
//         }
//     }
// }

function addCardHoverEffects() {
    const cards = document.querySelectorAll('.cyber-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 12px 40px rgba(0, 212, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 32px rgba(0, 212, 255, 0.3)';
        });
    });
}

function setupBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.loop = true;
        
        // Add event listeners for audio events
        bgMusic.addEventListener('canplaythrough', () => {
            // Try to auto-play when audio is ready
            attemptAutoPlay();
        });
        
        bgMusic.addEventListener('error', (e) => {
            showNotification('Audio could not be loaded', 'warning');
        });
        
        bgMusic.addEventListener('play', () => {
            if (musicToggle) {
                musicToggle.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
                musicToggle.classList.add('playing');
                musicToggle.title = 'Stop Background Music';
            }
        });
        
        bgMusic.addEventListener('pause', () => {
            if (musicToggle) {
                musicToggle.innerHTML = '<i class="bi bi-music-note"></i>';
                musicToggle.classList.remove('playing');
                musicToggle.title = 'Play Background Music';
            }
        });
        
        // Try to load the audio
        bgMusic.load();
        
        // Attempt auto-play after a short delay
        setTimeout(attemptAutoPlay, 500);
    }
    
    function attemptAutoPlay() {
        if (bgMusic && bgMusic.readyState >= 2) { // HAVE_CURRENT_DATA or higher
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Auto-play successful
                    showNotification('Welcome! Background music is playing ♪', 'success');
                }).catch(error => {
                    // Auto-play was prevented
                    showNotification('Click the music button to enable background music', 'info');
                    
                    // Try again on first user interaction
                    document.addEventListener('click', function firstClickHandler() {
                        const playPromise = bgMusic.play();
                        if (playPromise !== undefined) {
                            playPromise.then(() => {
                                showNotification('Background music started ♪', 'success');
                                document.removeEventListener('click', firstClickHandler);
                            }).catch(() => {
                                // Still failed, user needs to manually click music button
                            });
                        }
                    }, { once: true });
                });
            }
        }
    }
}

function toggleBackgroundMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    
    if (bgMusic && musicToggle) {
        if (bgMusic.paused) {
            // Try to play the audio
            const playPromise = bgMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Audio started playing successfully
                    musicToggle.innerHTML = '<i class="bi bi-music-note-beamed"></i>';
                    musicToggle.classList.add('playing');
                    musicToggle.title = 'Stop Background Music';
                    showNotification('Background music started playing', 'success');
                }).catch(error => {
                    // Auto-play was prevented
                    showNotification('Click to enable background music', 'info');
                });
            }
        } else {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="bi bi-music-note"></i>';
            musicToggle.classList.remove('playing');
            musicToggle.title = 'Play Background Music';
            showNotification('Background music stopped', 'info');
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = `
        top: 20px; right: 20px; z-index: 9999; min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function handleSearchInput(e) {
    const query = e.target.value;
    if (query.length > 0) {
        showSearchSuggestions();
    } else {
        hideSearchSuggestions();
    }
}

function showSearchSuggestions() {
    const suggestions = document.getElementById('searchSuggestions');
    if (suggestions) {
        suggestions.style.display = 'block';
        loadSearchSuggestions();
    }
}

function hideSearchSuggestions() {
    setTimeout(() => {
        const suggestions = document.getElementById('searchSuggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }, 200);
}

function loadSearchSuggestions() {
    const suggestionsContainer = document.getElementById('searchSuggestions');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = searchSuggestions.map(suggestion => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.type}', ${suggestion.id})">
            <img src="${suggestion.avatar}" class="suggestion-avatar" alt="${suggestion.name}">
            <div class="suggestion-info">
                <div class="suggestion-name">${suggestion.name}</div>
                <div class="suggestion-type">${suggestion.type}</div>
            </div>
        </div>
    `).join('');
}

function selectSuggestion(type, id) {
    hideSearchSuggestions();
    hideMobileSearchSuggestions();
}

// Mobile search functions
function handleMobileSearchInput(e) {
    const query = e.target.value;
    if (query.length > 0) {
        showMobileSearchSuggestions();
    } else {
        hideMobileSearchSuggestions();
    }
}

function showMobileSearchSuggestions() {
    const suggestions = document.getElementById('mobileSearchSuggestions');
    if (suggestions) {
        suggestions.style.display = 'block';
        loadMobileSearchSuggestions();
    }
}

function hideMobileSearchSuggestions() {
    setTimeout(() => {
        const suggestions = document.getElementById('mobileSearchSuggestions');
        if (suggestions) {
            suggestions.style.display = 'none';
        }
    }, 200);
}

function loadMobileSearchSuggestions() {
    const suggestionsContainer = document.getElementById('mobileSearchSuggestions');
    if (!suggestionsContainer) return;
    
    suggestionsContainer.innerHTML = searchSuggestions.map(suggestion => `
        <div class="suggestion-item" onclick="selectSuggestion('${suggestion.type}', ${suggestion.id})">
            <img src="${suggestion.avatar}" class="suggestion-avatar" alt="${suggestion.name}">
            <div class="suggestion-info">
                <div class="suggestion-name">${suggestion.name}</div>
                <div class="suggestion-type">${suggestion.type}</div>
            </div>
        </div>
    `).join('');
}

function handleOutsideClick(e) {
    if (!e.target.closest('.search-container') && !e.target.closest('.mobile-search-container')) {
        hideSearchSuggestions();
        hideMobileSearchSuggestions();
    }
}

function setupUploadAreas() {
    const coverUploadArea = document.getElementById('coverUploadArea');
    if (coverUploadArea) {
        coverUploadArea.addEventListener('dragover', handleDragOver);
        coverUploadArea.addEventListener('drop', (e) => handleDrop(e, 'cover'));
        coverUploadArea.addEventListener('click', () => {
            const input = document.getElementById('coverPhotoInput');
            if (input) input.click();
        });
    }
    
    const coverPhotoInput = document.getElementById('coverPhotoInput');
    if (coverPhotoInput) {
        coverPhotoInput.addEventListener('change', (e) => handleFileSelect(e, 'cover'));
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDrop(e, type) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        previewImage(files[0], type);
    }
}

function handleFileSelect(e, type) {
    const files = e.target.files;
    if (files.length > 0) {
        previewImage(files[0], type);
    }
}

function previewImage(file, type) {
    const reader = new FileReader();
    reader.onload = function(e) {
        if (type === 'cover') {
            const preview = document.getElementById('coverPreview');
            const previewImg = document.getElementById('coverPreviewImg');
            if (preview && previewImg) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
                const placeholder = document.querySelector('.upload-placeholder');
                if (placeholder) placeholder.style.display = 'none';
            }
        }
    };
    reader.readAsDataURL(file);
}

function openCoverPhotoModal() {
    const modal = new bootstrap.Modal(document.getElementById('coverPhotoModal'));
    modal.show();
}

function openProfilePhotoModal() {
    const modal = new bootstrap.Modal(document.getElementById('profilePhotoModal'));
    modal.show();
}



function openAdvancedSearch() {
    showNotification('Advanced search feature coming soon!', 'info');
}

function markAllAsRead() {
    notificationsData.forEach(notification => {
        notification.isRead = true;
    });
    loadNotifications();
    showNotification('All notifications marked as read', 'success');
}
    
