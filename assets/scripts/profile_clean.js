// Enhanced Friendora Profile Page JavaScript
// This file handles profile-specific functionality only
// Post-related functionality has been moved to post.js

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the page
  initializePage()
  setupEventListeners()
  loadDummyData()
  setupBackgroundMusic()
  createFloatingParticles()
  initializeProfileOwnership()
  
  // Load user posts using the new modular approach
  const userId = window.profileUserId || window.currentUserId || 1;
  if (typeof loadUserPosts === 'function') {
    loadUserPosts(userId); // This function is now in post.js
  } else {
    console.error('loadUserPosts function not available. Make sure post.js is loaded.');
  }
})

// Get data from PHP
const profileData = window.profileData || {}
const websiteData = window.websiteData || []
const photosData = window.photosData || []
const currentUserId = window.currentUserId || 1
const isOwnProfile = window.isOwnProfile || true

// Profile data
const profileUser = {
  name: `${profileData.fname || "Alexandra"} ${profileData.lname || "Neon"}`,
  title: profileData.professional || "Senior VR Artist & Dream Architect",
  bio: profileData.shortBio || "Creating immersive digital experiences in the cyberpunk realm. Passionate about VR art and exploring the boundaries between reality and dreams.",
  avatar: profileData.pfp || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop",
  location: profileData.city || "Neo Tokyo",
  followers: 2847,
  following: 458,
  posts: 142,
  badge: "VR Pioneer",
  birthday: profileData.birthday || "1995-03-15",
  email: profileData.email || "alexandra@dreamscape.cyber",
  phone: profileData.tel || "+81-90-1234-5678",
  joinDate: "2019-08-12",
  status: "Online",
  interests: ["VR Art", "Cyberpunk", "Digital Dreams", "Neon Aesthetics", "AI"],
  achievements: ["VR Pioneer", "Dream Architect", "Neon Master"],
  skills: ["Blender", "Unity", "C#", "JavaScript", "Digital Art"],
  hometown: profileData.hometown || "Shibuya",
  gender: profileData.gender || "Female",
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

// Helper function to create user profile links (kept for profile-specific usage)
function createUserLink(userId, userName, className = '') {
  const baseUrl = window.ROOT || '';
  const classAttr = className ? ` class="${className}"` : '';
  return `<a href="${baseUrl}/profile/${userId}"${classAttr}>${userName}</a>`;
}

// Helper function to generate notification messages with user links
function generateNotificationMessage(notification) {
  const userLink = createUserLink(notification.userId, notification.userName);
  return notification.message.replace(notification.userName, userLink);
}

// Helper functions for reactions (kept for compatibility with existing UI)
function getReactionIcon(reactionType) {
  const icons = {
    like: 'bi-heart-fill',
    haha: 'bi-emoji-laughing-fill', 
    wow: 'bi-emoji-surprise-fill',
    angry: 'bi-emoji-angry-fill'
  };
  return icons[reactionType] || 'bi-heart-fill';
}

function getReactionText(reactionType) {
  const texts = {
    'like': 'Like',
    'haha': 'Haha',
    'wow': 'Wow',
    'angry': 'Angry'
  };
  return texts[reactionType] || 'Like';
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
  // Upload areas
  setupUploadAreas()

  // Outside click handlers
  document.addEventListener("click", handleOutsideClick)

  // Scroll handlers
  window.addEventListener("scroll", handleNavbarScroll)

  // Hover effects
  addCardHoverEffects()

  // Profile navigation
  document.querySelectorAll(".profile-nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const target = item.getAttribute("data-target")
      showProfileSection(target)
    })
  })

  // About section
  const aboutSection = document.getElementById("aboutSection")
  if (aboutSection) {
    loadAboutSection(profileUser)
  }
}

function loadDummyData() {
  // Load notifications
  loadNotifications()

  // Load photos grid
  loadPhotosGrid()

  // Populate edit form if available
  populateEditForm()
}

function loadAboutSection(user) {
  const aboutSection = document.getElementById("aboutSection")
  if (!aboutSection) return;

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
      const text = await response.text()
      let data
      try {
        data = JSON.parse(text)
      } catch (e) {
        console.error("Invalid JSON response:", text)
        throw new Error("Invalid server response")
      }
      return data
    })
    .catch((error) => {
      console.error("Error:", error)
      showNotification("Error saving profile", "error")
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
    profileInfo.classList.add("updated")
    setTimeout(() => {
      profileInfo.classList.remove("updated")
    }, 2000)
  }
}

// Photo Upload Functions
function setupUploadAreas() {
  // Cover photo upload
  const coverUploadArea = document.getElementById("coverUploadArea")
  const coverPhotoInput = document.getElementById("coverPhotoInput")

  if (coverUploadArea && coverPhotoInput) {
    coverUploadArea.addEventListener("dragover", handleDragOver)
    coverUploadArea.addEventListener("drop", (e) => handleDrop(e, "cover"))
    coverPhotoInput.addEventListener("change", (e) => handleFileSelect(e, "cover"))
  }

  // Profile photo upload
  const profileUploadArea = document.getElementById("profileUploadArea")
  const profilePhotoInput = document.getElementById("profilePhotoInput")

  if (profileUploadArea && profilePhotoInput) {
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
    if (type === "cover") {
      const preview = document.getElementById("coverPreview")
      const placeholder = document.querySelector("#coverUploadArea .upload-placeholder")
      if (preview && placeholder) {
        preview.src = e.target.result
        preview.style.display = "block"
        placeholder.style.display = "none"
      }
    } else {
      const preview = document.getElementById("profilePreview")
      const placeholder = document.querySelector("#profileUploadArea .upload-placeholder")
      if (preview && placeholder) {
        preview.src = e.target.result
        preview.style.display = "block"
        placeholder.style.display = "none"
      }
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
      
      if (data.success) {
        showNotification("Cover photo uploaded successfully!", "success")
        removeCoverPreview()
        // Update the cover photo display
        const coverImg = document.querySelector(".profile-cover")
        if (coverImg && data.cover_url) {
          coverImg.style.backgroundImage = `url(${data.cover_url})`
        }
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
        showNotification("Profile photo updated successfully!", "success")
        removeProfilePreview()
        
        // Update all profile images on the page
        const profileImages = document.querySelectorAll(".profile-pic, .user-avatar")
        profileImages.forEach((img) => {
          if (data.profile_url) {
            img.src = data.profile_url
          }
        })
      } else {
        showNotification("Error uploading profile photo: " + data.message, "error")
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

  // Close reaction dropdowns when clicking outside (handled by post.js now)
  if (!e.target.closest(".reaction-selector")) {
    const reactionDropdowns = document.querySelectorAll(".reaction-dropdown.show")
    reactionDropdowns.forEach(dropdown => {
      dropdown.classList.remove("show")
    })
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
