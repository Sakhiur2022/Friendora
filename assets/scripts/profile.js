// Enhanced Friendora Profile Page JavaScript
// This file handles all the interactive functionality and backend integration

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the page
  initializePage()
  setupEventListeners()
  loadDummyData()
  setupBackgroundMusic()
  createFloatingParticles()
  initializeProfileOwnership()
  loadPosts() // Load posts on page load
})

// Get data from PHP
const profileData = window.profileData || {}
const websiteData = window.websiteData || []
const photosData = window.photosData || []
const currentUserId = window.currentUserId || 1
const isOwnProfile = window.isOwnProfile || true

// Debug data (keeping for verification)
console.log("Profile Data Loaded:", profileData)
console.log("Photos Data Loaded:", photosData.length, "photos")
console.log("Current User ID:", currentUserId)
console.log("Website Data:", websiteData)

// Check what specific properties the profile data has
if (profileData && typeof profileData === 'object') {
  console.log("Profile data keys:", Object.keys(profileData))
  console.log("Profile pfp:", profileData.pfp)
}

// Check photos data structure
if (photosData && Array.isArray(photosData) && photosData.length > 0) {
  console.log("First photo object:", photosData[0])
  console.log("Photo object keys:", Object.keys(photosData[0]))
}

// Enhanced dummy user data (fallback if no PHP data)
const userData = {
  id: currentUserId,
  name: "Alexandra Chen",
  shortBio: profileData.shortBio || "VR Artist & Dream Architect",
  city: profileData.city || "Neo Tokyo",
  hometown: profileData.hometown || "Cyber City",
  birthday: "1995-03-15",
  gender: "Female",
  highSchool: profileData.highschool || "Digital Arts Academy",
  college: profileData.college || "Cyber Tech Institute",
  university: profileData.university || "Virtual Reality University",
  workplace: profileData.work || "DreamScape Studios",
  politicalViews: profileData.polViews || "Progressive Futurist",
  religion: profileData.religion || "Digital Spiritualism",
  country: profileData.country || "Japan",
  website: websiteData.length > 0 ? websiteData[0].url : "https://alexandra-dreams.cyber",
  language: profileData.lang || "English, Japanese, Binary",
  professional: profileData.professional || "Senior VR Artist & Dream Architect",
  quotes: profileData.socialQuote || "In the digital realm, we are all architects of our own reality.",
  lifeEvents:
    profileData.lifeEvent ||
    "Graduated VR University (2018), Joined DreamScape Studios (2019), Won Cyber Art Award (2023)",
  isOwnProfile: isOwnProfile,
}

// Dummy notifications data
const notificationsData = [
  {
    id: 1,
    userId: 2,
    userName: "Marcus Tech",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    message: "Marcus Tech liked your post",
    time: "5 minutes ago",
    isRead: false,
    type: "like",
  },
  {
    id: 2,
    userId: 3,
    userName: "Luna Digital",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    message: "Luna Digital commented on your photo",
    time: "1 hour ago",
    isRead: false,
    type: "comment",
  },
  {
    id: 3,
    userId: 4,
    userName: "Cyber Explorer",
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

let currentPhotoIndex = 0
let allPosts = []

// Helper function to create user profile links
function createUserLink(userId, userName, className = '') {
  const baseUrl = window.ROOT || '';
  const classAttr = className ? ` class="${className}"` : '';
  return `<a href="${baseUrl}/profile/${userId}"${classAttr}>${userName}</a>`;
}

// Helper function to generate notification messages with user links
function generateNotificationMessage(notification) {
  const userLink = createUserLink(notification.userId, notification.userName);
  
  switch(notification.type) {
    case 'like':
      return `${userLink} liked your post`;
    case 'comment':
      return `${userLink} commented on your photo`;
    case 'follow':
      return `${userLink} started following you`;
    default:
      return notification.message;
  }
}

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

  // Post image input
  const postImageInput = document.getElementById("postImageInput")
  if (postImageInput) {
    postImageInput.addEventListener("change", handlePostImageSelect)
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
  const userBio = document.getElementById("userBio")
  if (userBio) {
    userBio.textContent = userData.shortBio || "No bio available"
  }

  // Load about section
  loadAboutSection()

  // Load photos from PHP data
  loadPhotosGrid()

  // Load notifications
  loadNotifications()

  // Populate edit form
  populateEditForm()
}

function loadAboutSection(user) {
  const aboutSection = document.getElementById("aboutSection")
  if (!aboutSection) return

  // If PHP has already populated the about section, don't override it
  if (aboutSection.children.length > 0) return

  if (!user) {
    user = userData // Use global userData if no user is passed
  }

  const aboutItems = [
    { icon: "bi-geo-alt-fill", label: "Lives in", value: user.city },
    { icon: "bi-house-fill", label: "From", value: user.hometown },
    { icon: "bi-calendar-fill", label: "Born", value: new Date(user.birthday).toLocaleDateString() },
    { icon: "bi-gender-ambiguous", label: "Gender", value: user.gender },
    { icon: "bi-mortarboard-fill", label: "Studied at", value: user.university },
    { icon: "bi-briefcase-fill", label: "Works at", value: user.workplace },
    { icon: "bi-globe", label: "Website", value: user.website },
    { icon: "bi-translate", label: "Languages", value: user.language },
    { icon: "bi-quote", label: "Favorite Quote", value: user.quotes },
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

function saveProfile() {
  const formData = new FormData(document.getElementById("editProfileForm"))

  fetch("", {
    method: "POST",
    body: formData,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text()
      
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      try {
        const data = JSON.parse(cleanedText)
        if (data.success) {
          showNotification("Profile updated successfully!", "success")
          updateProfileDisplay(data.user)

          // Close modal using Bootstrap's method
          const modal = window.bootstrap.Modal.getInstance(document.getElementById("editProfileModal"))
          if (modal) {
            modal.hide()
          }
        } else {
          showNotification("Error updating profile: " + data.message, "error")
        }
      } catch (err) {
        console.error("JSON Parse Error:", err)
        console.warn("Raw response text:", text)
        console.warn("Cleaned text:", cleanedText)
        showNotification("Server returned invalid response", "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Network error occurred", "error")
    })
}

function updateProfileDisplay(user) {
  // Update bio
  const userBio = document.getElementById("userBio")
  if (userBio && user.shortBio) {
    userBio.textContent = user.shortBio
  }

  // Reload about section with updated data
  loadAboutSection(user)

  // Add update animation
  const profileInfo = document.querySelector(".profile-info")
  if (profileInfo) {
    profileInfo.style.animation = "pulse 0.5s ease"
  }
}

// Photo Upload Functions
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

  const formData = new FormData()
  formData.append("cover_photo", file)

  fetch("", {
    method: "POST",
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
        document.getElementById("coverPhoto").src = data.url
        showNotification("Cover photo updated successfully!", "success")

        // Close modal
        const modal = window.bootstrap.Modal.getInstance(document.getElementById("coverPhotoModal"))
        if (modal) {
          modal.hide()
        }

        // Refresh photos grid
        setTimeout(() => {
          location.reload()
        }, 1000)
      } else {
        showNotification("Error uploading cover photo: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Upload failed", "error")
    })
}

function uploadProfilePhoto() {
  const input = document.getElementById("profilePhotoInput")
  const file = input.files[0]

  if (!file) {
    showNotification("Please select a file first", "error")
    return
  }

  const formData = new FormData()
  formData.append("profile_photo", file)

  fetch("", {
    method: "POST",
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
        document.getElementById("profilePic").src = data.url
        // Update all profile pictures on the page
        const profilePics = document.querySelectorAll(".profile-pic-nav, .user-dropdown-avatar")
        profilePics.forEach((pic) => {
          pic.src = data.url
        })

        showNotification("Profile picture updated successfully!", "success")

        // Close modal
        const modal = window.bootstrap.Modal.getInstance(document.getElementById("profilePhotoModal"))
        if (modal) {
          modal.hide()
        }

        // Refresh photos grid
        setTimeout(() => {
          location.reload()
        }, 1000)
      } else {
        showNotification("Error uploading profile picture: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Upload failed", "error")
    })
}

function openCoverPhotoModal() {
  const modal = new window.bootstrap.Modal(document.getElementById("coverPhotoModal"))
  modal.show()
}

function openProfilePhotoModal() {
  const modal = new window.bootstrap.Modal(document.getElementById("profilePhotoModal"))
  modal.show()
}

function openEditProfileModal() {
  const modal = new window.bootstrap.Modal(document.getElementById("editProfileModal"))
  modal.show()
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
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      timeAgo = diffInMinutes > 0 ? `${diffInMinutes} min ago` : 'Just now';
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
      created_at: post.created_at
    };
  });
}

// Post Functions
function loadPosts() {
  console.log("loadPosts() called");
  const postsContainer = document.getElementById("postsContainer");
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
        allPosts = data.posts;
        console.log("Posts loaded successfully:", allPosts);
        displayPosts(data.posts);
      } else {
        postsContainer.innerHTML = '<p class="text-center text-muted">No posts yet</p>';
      }
    })
    .catch((error) => {
      console.error('Error loading posts:', error);
      postsContainer.innerHTML = '<p class="text-center text-danger">Error loading posts</p>';
    });
}

function displayPosts(posts) {
  console.log("displayPosts() called with:", posts);
  const postsContainer = document.getElementById("postsContainer")
  if (!postsContainer) {
    console.log("postsContainer element not found");
    return;
  }

  if (!posts || posts.length === 0) {
    console.log("No posts to display");
    postsContainer.innerHTML = '<p class="text-center text-muted">No posts yet</p>'
    return
  }

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

      // Comment button
      const commentBtn = postElement.querySelector(".comment-btn")
      if (commentBtn) {
        commentBtn.addEventListener("click", () => toggleComments(post.id))
      }

      // Comment submit
      const commentSubmitBtn = postElement.querySelector(".comment-submit-btn")
      const commentInput = postElement.querySelector(".comment-input")
      if (commentSubmitBtn && commentInput) {
        commentSubmitBtn.addEventListener("click", () => submitComment(post.id))
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
        loadPosts()
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
        loadPosts()
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

function loadNotifications() {
  const notificationsList = document.getElementById("notificationsList")
  const notificationCount = document.getElementById("notificationCount")

  if (!notificationsList) return

  // Update notification count
  const unreadCount = notificationsData.filter((n) => !n.isRead).length
  if (notificationCount) {
    notificationCount.textContent = unreadCount
    notificationCount.style.display = unreadCount > 0 ? "flex" : "none"
  }

  notificationsList.innerHTML = notificationsData
    .map(
      (notification) => `
        <li class="notification-item ${!notification.isRead ? "unread" : ""}" onclick="handleNotificationClick(${notification.id})">
            <img src="${notification.userAvatar}" class="notification-avatar" alt="User">
            <div class="notification-content">
                <p>${generateNotificationMessage(notification)}</p>
                <small>${notification.time}</small>
            </div>
        </li>
    `,
    )
    .join("")
}

function loadPhotosGrid() {
  const photosGrid = document.getElementById("photosGrid")
  if (!photosGrid) return

  console.log("Loading photos grid. Photos data:", photosData); // Debug log

  // Use PHP photos data if available
  if (photosData && photosData.length > 0) {
    const displayPhotos = photosData.slice(0, 6)
    photosGrid.innerHTML = displayPhotos
      .map(
        (photo, index) => {
          // Handle different possible URL field names
          const photoUrl = photo.url || photo.photo_url || photo.image_url || 'https://via.placeholder.com/150';
          console.log("Photo object:", photo, "Using URL:", photoUrl); // Debug log
          return `
          <img src="${photoUrl}" alt="Photo" class="photo-item" onclick="openPhotoModal('${photoUrl}', ${index})">
          `;
        }
      )
      .join("")
  } else {
    photosGrid.innerHTML = '<p class="text-muted">No photos yet</p>'
  }
}

function populateEditForm() {
  // Form fields are already populated by PHP in the view
  // This function can be used for additional JavaScript-based population if needed
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
                <div class="suggestion-name">${suggestion.type === 'Person' ? createUserLink(suggestion.id, suggestion.name) : suggestion.name}</div>
                <div class="suggestion-type">${suggestion.type}</div>
            </div>
        </div>
    `,
    )
    .join("")

  mobileSuggestions.style.display = "block"
}

// User Dropdown Functions
function toggleUserDropdown() {
  const container = document.getElementById("userDropdownContainer")
  const mobileContainer = document.getElementById("mobileUserDropdownContainer")

  closeAllDropdowns()

  if (window.innerWidth < 992) {
    if (mobileContainer) {
      const isVisible = mobileContainer.classList.contains("show")
      mobileContainer.classList.toggle("show", !isVisible)
    }
  } else {
    if (container) {
      const isVisible = container.classList.contains("show")
      container.classList.toggle("show", !isVisible)
    }
  }
}

function toggleNotificationDropdown() {
  const container = document.getElementById("notificationDropdownContainer")
  if (container) {
    const isVisible = container.classList.contains("show")
    closeAllDropdowns()
    if (!isVisible) {
      container.classList.add("show")
      loadNotifications()
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
    setTimeout(() => {
      window.location.href = "/logout"
    }, 2000)
  }
}

// Search Functions
function handleSearchInput(e) {
  const query = e.target.value.toLowerCase()
  if (query.length > 0) {
    showSearchSuggestions()
    filterSearchSuggestions(query)
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
                <div class="suggestion-name">${suggestion.type === 'Person' ? createUserLink(suggestion.id, suggestion.name) : suggestion.name}</div>
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
                    <div class="suggestion-name">${suggestion.type === 'Person' ? createUserLink(suggestion.id, suggestion.name) : suggestion.name}</div>
                    <div class="suggestion-type">${suggestion.type}</div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}

function selectSuggestion(type, id) {
  showNotification(`Selected ${type}: ${id}`, "info")
  hideSearchSuggestions()
}

function openAdvancedSearch() {
  showNotification("Advanced Search - Navigator page coming soon!", "info")
}

function performSearch(query) {
  showNotification(`Searching for ${query}...`, "info")
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
}

function messageUser() {
  showNotification("Opening message conversation...", "info")
}

// Photo Gallery Functions
function openPhotoGallery() {
  const modal = new window.bootstrap.Modal(document.getElementById("photoGalleryModal"))
  loadPhotoGallery()
  modal.show()
}

function loadPhotoGallery() {
  const mainImg = document.getElementById("galleryMainImage")
  const thumbnails = document.getElementById("galleryThumbnails")
  const counter = document.getElementById("photoCounter")

  console.log("Loading photo gallery. Current index:", currentPhotoIndex, "Photos:", photosData); // Debug log

  if (mainImg && thumbnails && counter) {
    const photos = photosData.length > 0 ? photosData : []

    if (photos.length > 0) {
      const currentPhoto = photos[currentPhotoIndex] || photos[0];
      const photoUrl = currentPhoto.url || currentPhoto.photo_url || currentPhoto.image_url || 'https://via.placeholder.com/800';
      
      mainImg.src = photoUrl
      currentPhotoIndex = Math.min(currentPhotoIndex, photos.length - 1)

      thumbnails.innerHTML = photos
        .map(
          (photo, index) => {
            const thumbUrl = photo.url || photo.photo_url || photo.image_url || 'https://via.placeholder.com/150';
            return `
              <img src="${thumbUrl}" 
                   class="gallery-thumbnail ${index === currentPhotoIndex ? "active" : ""}" 
                   onclick="selectPhoto(${index})"
                   alt="Photo ${index + 1}">
            `;
          }
        )
        .join("")

      counter.textContent = `${currentPhotoIndex + 1} of ${photos.length}`
    } else {
      mainImg.src = "https://via.placeholder.com/800x600?text=No+Photos"
      thumbnails.innerHTML = '<p class="text-muted">No photos available</p>'
      counter.textContent = "0 of 0"
    }
  }
}

function selectPhoto(index) {
  currentPhotoIndex = index
  loadPhotoGallery()
}

function previousPhoto() {
  const photos = photosData.length > 0 ? photosData : []
  if (photos.length > 0) {
    currentPhotoIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : photos.length - 1
    loadPhotoGallery()
  }
}

function nextPhoto() {
  const photos = photosData.length > 0 ? photosData : []
  if (photos.length > 0) {
    currentPhotoIndex = currentPhotoIndex < photos.length - 1 ? currentPhotoIndex + 1 : 0
    loadPhotoGallery()
  }
}

function openPhotoModal(photoUrl, index) {
  currentPhotoIndex = index
  openPhotoGallery()
}

// Notification Functions
function handleNotificationClick(notificationId) {
  const notification = notificationsData.find((n) => n.id === notificationId)
  if (notification && !notification.isRead) {
    notification.isRead = true

    const notificationElement = document.querySelector(`[onclick="handleNotificationClick(${notificationId})"]`)
    if (notificationElement) {
      notificationElement.classList.remove("unread")
    }

    const unreadCount = notificationsData.filter((n) => !n.isRead).length
    const countElement = document.getElementById("notificationCount")
    if (countElement) {
      countElement.textContent = unreadCount
      countElement.style.display = unreadCount > 0 ? "flex" : "none"
    }
  }

  showNotification("Notification clicked!", "info")
}

function markAllAsRead() {
  notificationsData.forEach((notification) => {
    notification.isRead = true
  })

  const notificationItems = document.querySelectorAll(".notification-item")
  notificationItems.forEach((item) => {
    item.classList.remove("unread")
  })

  const countElement = document.getElementById("notificationCount")
  if (countElement) {
    countElement.style.display = "none"
  }

  showNotification("All notifications marked as read", "success")
}

function toggleMobileNotifications() {
  const notificationsSection = document.getElementById("mobileNotificationsSection")

  if (notificationsSection) {
    const isVisible = notificationsSection.style.display !== "none"
    notificationsSection.style.display = isVisible ? "none" : "block"

    if (!isVisible) {
      loadMobileNotifications()
    }
  }
}

function loadMobileNotifications() {
  const mobileNotificationsList = document.getElementById("mobileNotificationsList")
  const mobileNotificationCount = document.getElementById("mobileNotificationCount")

  if (!mobileNotificationsList) return

  const unreadCount = notificationsData.filter((n) => !n.isRead).length
  if (mobileNotificationCount) {
    mobileNotificationCount.textContent = unreadCount
    mobileNotificationCount.style.display = unreadCount > 0 ? "flex" : "none"
  }

  mobileNotificationsList.innerHTML = notificationsData
    .map(
      (notification) => `
        <div class="notification-item ${!notification.isRead ? "unread" : ""}" onclick="handleNotificationClick(${notification.id})">
            <img src="${notification.userAvatar}" class="notification-avatar" alt="User">
            <div class="notification-content">
                <p>${generateNotificationMessage(notification)}</p>
                <small>${notification.time}</small>
            </div>
        </div>
    `,
    )
    .join("")
}

// Utility Functions
function handleOutsideClick(e) {
  if (!e.target.closest(".search-container")) {
    hideSearchSuggestions()
  }

  if (!e.target.closest(".mobile-search-section")) {
    const mobileSuggestions = document.getElementById("mobileSearchSuggestions")
    if (mobileSuggestions) {
      mobileSuggestions.style.display = "none"
    }
  }

  if (!e.target.closest(".dropdown") && !e.target.closest(".user-dropdown-toggle")) {
    closeAllDropdowns()
  }

  if (!e.target.closest(".mobile-menu") && !e.target.closest(".cyber-hamburger")) {
    const mobileMenu = document.getElementById("mobileMenu")
    const hamburger = document.querySelector(".cyber-hamburger")
    if (mobileMenu && mobileMenu.classList.contains("show")) {
      mobileMenu.classList.remove("show")
      hamburger.classList.remove("active")
      document.body.style.overflow = ""
    }
  }
}

function sharePost(postId) {
  showNotification("Post shared!", "success")
}

function handleNavbarScroll() {
  const navbar = document.querySelector(".cyber-nav")
  if (navbar) {
    if (window.scrollY > 50) {
      navbar.style.background = "rgba(10, 10, 10, 0.95)"
      navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.3)"
    } else {
      navbar.style.background = "rgba(10, 10, 10, 0.9)"
      navbar.style.boxShadow = "var(--cyber-shadow)"
    }
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
  const bgMusic = document.getElementById("bgMusic")
  const musicToggle = document.getElementById("musicToggle")

  if (bgMusic && musicToggle) {
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
}

function createFloatingParticles() {
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

// Window resize handler
window.addEventListener("resize", () => {
  if (window.innerWidth >= 992) {
    const mobileMenu = document.getElementById("mobileMenu")
    const hamburger = document.querySelector(".cyber-hamburger")
    if (mobileMenu && mobileMenu.classList.contains("show")) {
      mobileMenu.classList.remove("show")
      hamburger.classList.remove("active")
      document.body.style.overflow = ""
    }

    const mobileContainer = document.getElementById("mobileUserDropdownContainer")
    if (mobileContainer) {
      mobileContainer.classList.remove("show")
    }
  }
})

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault()
    const searchInput = document.getElementById("searchInput")
    if (searchInput) {
      searchInput.focus()
    }
  }

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

function closePhotoModal() {
  const modal = document.querySelector(".photo-modal")
  if (modal) {
    modal.style.opacity = "0"
    setTimeout(() => {
      modal.remove()
    }, 300)
  }
}

console.log("🌟 Friendora Profile Page Loaded - Welcome to the Digital Dreamscape! 🌟")
