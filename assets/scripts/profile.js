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
  
  // Initialize post functionality using the new modular approach
  if (typeof initializePostFunctionality === 'function') {
    const userId = window.profileUserId || window.currentUserId || 1;
    const userAvatar = window.currentUserProfilePic || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face';
    const userName = window.currentUser?.fname || 'User';
    const isOwn = window.isOwnProfile || false;
    
    initializePostFunctionality(isOwn, userAvatar, userName, userId);
  } else {
    console.error('initializePostFunctionality function not available. Make sure post.js is loaded.');
  }


  
})

// Get data from PHP
const profileData = window.profileData || {}
const websiteData = window.websiteData || []
const photosData = window.photosData || []
const currentUserId = window.currentUserId || 1
const isOwnProfile = window.isOwnProfile || true

// 🔍 DEBUG: Log received data from PHP


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
  birthday: profileData.DOB || "1995-03-15",
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
  city: profileData.city || "Neo Tokyo", // Add city field for about section
}

console.log("🔍 DEBUG: Profile User Data:", profileUser);


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

  // Setup search functionality for both desktop and mobile
  setupSearchFunctionality()

  // Profile navigation
  document.querySelectorAll(".profile-nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const target = item.getAttribute("data-target")
      showProfileSection(target)
    })
  })

  // Save profile button
  const saveProfileBtn = document.getElementById("saveProfileBtn")
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener("click", saveProfile)
  }

  // Edit profile button  
  const editProfileBtn = document.getElementById("editProfileBtn")
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", openEditProfileModal)
  }

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
  console.log("🔍 DEBUG: loadAboutSection() called with user:", user);
  
  const aboutSection = document.getElementById("aboutSection")
  if (!aboutSection) {
    console.log("🔍 DEBUG: aboutSection element not found");
    return;
  }
  
  console.log("🔍 DEBUG: aboutSection element found:", aboutSection);

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

  console.log("🔍 DEBUG: Generated about items:", aboutItems);

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

  console.log("🔍 DEBUG: aboutSection HTML updated");

  // Add animation delay to each item
  const items = aboutSection.querySelectorAll(".about-item")
  console.log("🔍 DEBUG: Found", items.length, "about items for animation");
  items.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`
  })
}

function saveProfile() {
  console.log("🔍 DEBUG: saveProfile() function called");
  
  const form = document.getElementById("editProfileForm");
  if (!form) {
    console.log("🔍 DEBUG: Edit profile form not found");
    showNotification("Edit profile form not found", "error");
    return;
  }
  
  const formData = new FormData(form);
  formData.append("action", "update_profile");

  console.log("🔍 DEBUG: FormData created for profile save");
  console.log("🔍 DEBUG: FormData entries:");
  for (let pair of formData.entries()) {
    console.log("🔍 DEBUG: -", pair[0], ":", pair[1]);
  }

  const profileUrl = window.ROOT ? `${window.ROOT}/profile` : './profile';
  console.log("🔍 DEBUG: Profile URL for save:", profileUrl);

  fetch(profileUrl, {
    method: "POST",
    body: formData,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => {
      console.log("🔍 DEBUG: Profile save response status:", response.status);
      console.log("🔍 DEBUG: Profile save response headers:", response.headers);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      console.log("🔍 DEBUG: Raw profile save response text:", text);
      
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      console.log("🔍 DEBUG: Cleaned profile save response text:", cleanedText);
      const data = JSON.parse(cleanedText);
      console.log("🔍 DEBUG: Parsed profile save response data:", data);
      
      if (data.success) {
        console.log("🔍 DEBUG: Profile save successful");
        updateProfileDisplay(data.user)
        showNotification("Profile updated successfully!", "success")
        // Close modal
        const modal = window.bootstrap.Modal.getInstance(document.getElementById("editProfileModal"))
        if (modal) {
          modal.hide()
        }
        
        // Reload page to show updated data
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        console.log("🔍 DEBUG: Profile save failed:", data.message);
        showNotification("Error updating profile: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("🔍 DEBUG: Profile save error:", error);
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
    coverUploadArea.addEventListener("click", () => coverPhotoInput.click())
    coverPhotoInput.addEventListener("change", (e) => handleFileSelect(e, "cover"))
  }

  // Profile photo upload
  const profileUploadArea = document.getElementById("profileUploadArea")
  const profilePhotoInput = document.getElementById("profilePhotoInput")

  if (profileUploadArea && profilePhotoInput) {
    profileUploadArea.addEventListener("dragover", handleDragOver)
    profileUploadArea.addEventListener("drop", (e) => handleDrop(e, "profile"))
    profileUploadArea.addEventListener("click", () => profilePhotoInput.click())
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
      const previewImg = document.getElementById("coverPreviewImg")
      const placeholder = document.querySelector("#coverUploadArea .upload-placeholder")
      if (preview && previewImg && placeholder) {
        previewImg.src = e.target.result
        preview.style.display = "block"
        placeholder.style.display = "none"
      }
    } else {
      const preview = document.getElementById("profilePreview")
      const previewImg = document.getElementById("profilePreviewImg")
      const placeholder = document.querySelector("#profileUploadArea .upload-placeholder")
      if (preview && previewImg && placeholder) {
        previewImg.src = e.target.result
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
  console.log("🔍 DEBUG: uploadCoverPhoto() function called");
  
  const input = document.getElementById("coverPhotoInput")
  const file = input.files[0]

  if (!file) {
    console.log("🔍 DEBUG: No file selected for cover photo upload");
    showNotification("Please select a file first", "error")
    return
  }

  console.log("🔍 DEBUG: Selected cover photo file:", file);
  console.log("🔍 DEBUG: File name:", file.name);
  console.log("🔍 DEBUG: File size:", file.size);
  console.log("🔍 DEBUG: File type:", file.type);

  const formData = new FormData()
  formData.append("cover_photo", file)
  formData.append("action", "upload_cover")

  console.log("🔍 DEBUG: FormData created for cover photo");
  console.log("🔍 DEBUG: FormData entries:");
  for (let pair of formData.entries()) {
    console.log("🔍 DEBUG: -", pair[0], ":", pair[1]);
  }

  const profileUrl = window.ROOT ? `${window.ROOT}/profile` : './profile';
  console.log("🔍 DEBUG: Profile URL for cover upload:", profileUrl);

  fetch(profileUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      console.log("🔍 DEBUG: Cover upload response status:", response.status);
      console.log("🔍 DEBUG: Cover upload response headers:", response.headers);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      console.log("🔍 DEBUG: Raw cover upload response text:", text);

      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }

      console.log("🔍 DEBUG: Cleaned cover upload response text:", cleanedText);
      const data = JSON.parse(cleanedText);
      console.log("🔍 DEBUG: Parsed cover upload response data:", data);

      if (data.success) {
        console.log("🔍 DEBUG: Cover photo upload successful");
        showNotification("Cover photo uploaded successfully!", "success")
        removeCoverPreview()
        // Update the cover photo display
        const coverImg = document.getElementById("coverPhoto")
        if (coverImg && data.cover_url) {
          console.log("🔍 DEBUG: Updating cover photo URL to:", data.cover_url);
          coverImg.src = data.cover_url
        } else if (!coverImg) {
          console.log("🔍 DEBUG: Cover photo element not found");
        } else if (!data.cover_url) {
          console.log("🔍 DEBUG: No cover_url in response data");
        }
        
        // Close modal
        const modal = window.bootstrap.Modal.getInstance(document.getElementById("coverPhotoModal"))
        if (modal) {
          console.log("🔍 DEBUG: Closing cover photo modal");
          modal.hide()
        }
      } else {
        console.log("🔍 DEBUG: Cover photo upload failed:", data.message);
        showNotification("Error uploading cover photo: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("🔍 DEBUG: Cover photo upload error:", error);
      showNotification("Upload failed", "error")
    })
}

function uploadProfilePhoto() {
  console.log("🔍 DEBUG: uploadProfilePhoto() function called");
  
  const input = document.getElementById("profilePhotoInput")
  const file = input.files[0]

  if (!file) {
    console.log("🔍 DEBUG: No file selected for profile photo upload");
    showNotification("Please select a file first", "error")
    return
  }

  console.log("🔍 DEBUG: Selected profile photo file:", file);
  console.log("🔍 DEBUG: File name:", file.name);
  console.log("🔍 DEBUG: File size:", file.size);
  console.log("🔍 DEBUG: File type:", file.type);

  const formData = new FormData()
  formData.append("profile_photo", file)
  formData.append("action", "upload_profile")

  console.log("🔍 DEBUG: FormData created for profile photo");
  console.log("🔍 DEBUG: FormData entries:");
  for (let pair of formData.entries()) {
    console.log("🔍 DEBUG: -", pair[0], ":", pair[1]);
  }

  const profileUrl = window.ROOT ? `${window.ROOT}/profile` : './profile';
  console.log("🔍 DEBUG: Profile URL for profile upload:", profileUrl);

  fetch(profileUrl, {
    method: "POST",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => {
      console.log("🔍 DEBUG: Profile upload response status:", response.status);
      console.log("🔍 DEBUG: Profile upload response headers:", response.headers);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      console.log("🔍 DEBUG: Raw profile upload response text:", text);
      
      // Clean backticks from response if present
      let cleanedText = text;
      if (text.startsWith('`')) {
        cleanedText = text.slice(1);
        if (cleanedText.endsWith('`')) {
          cleanedText = cleanedText.slice(0, -1);
        }
      }
      
      console.log("🔍 DEBUG: Cleaned profile upload response text:", cleanedText);
      const data = JSON.parse(cleanedText);
      console.log("🔍 DEBUG: Parsed profile upload response data:", data);
      
      if (data.success) {
        console.log("🔍 DEBUG: Profile photo upload successful");
        showNotification("Profile photo updated successfully!", "success")
        removeProfilePreview()
        
        // Update all profile images on the page
        const profileImages = document.querySelectorAll("#profilePic, .profile-pic-nav, .user-dropdown-avatar")
        console.log("🔍 DEBUG: Found", profileImages.length, "profile images to update");
        profileImages.forEach((img, index) => {
          if (data.profile_url) {
            console.log(`🔍 DEBUG: Updating profile image ${index + 1} URL to:`, data.profile_url);
            img.src = data.profile_url
          }
        })
        
        // Close modal
        const modal = window.bootstrap.Modal.getInstance(document.getElementById("profilePhotoModal"))
        if (modal) {
          modal.hide()
        }
      } else {
        console.log("🔍 DEBUG: Profile photo upload failed:", data.message);
        showNotification("Error uploading profile photo: " + data.message, "error")
      }
    })
    .catch((error) => {
      console.error("🔍 DEBUG: Profile photo upload error:", error);
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
      // Setup mobile search when menu opens
      setupMobileSearchEvents()
    }
  }
}

// Setup comprehensive search functionality
function setupSearchFunctionality() {
  // Setup desktop search
  const desktopSearchInput = document.getElementById("searchInput")
  const desktopSuggestions = document.getElementById("searchSuggestions")
  
  if (desktopSearchInput && desktopSuggestions) {
    desktopSearchInput.addEventListener("input", (e) => handleSearchInput(e, 'desktop'))
    desktopSearchInput.addEventListener("keydown", (e) => handleSearchKeydown(e, 'desktop'))
    desktopSearchInput.addEventListener("focus", () => showSearchSuggestions('desktop'))
    desktopSearchInput.addEventListener("blur", () => hideSearchSuggestions('desktop'))
  }
  
  // Setup mobile search (will be called when mobile menu opens)
  setupMobileSearchEvents()
}

function setupMobileSearchEvents() {
  const mobileSearchInput = document.getElementById("mobileSearchInput")
  const mobileSuggestions = document.getElementById("mobileSearchSuggestions")
  
  if (mobileSearchInput && mobileSuggestions) {
    // Remove existing listeners to prevent duplicates
    mobileSearchInput.removeEventListener("input", handleMobileInput)
    mobileSearchInput.removeEventListener("keydown", handleMobileKeydown)
    mobileSearchInput.removeEventListener("focus", handleMobileFocus)
    mobileSearchInput.removeEventListener("blur", handleMobileBlur)
    
    // Add new listeners
    mobileSearchInput.addEventListener("input", handleMobileInput)
    mobileSearchInput.addEventListener("keydown", handleMobileKeydown)
    mobileSearchInput.addEventListener("focus", handleMobileFocus)
    mobileSearchInput.addEventListener("blur", handleMobileBlur)
  }
}

// Mobile search event handlers
function handleMobileInput(e) {
  const query = e.target.value.toLowerCase()
  if (query.length > 0) {
    showSearchSuggestions('mobile')
    filterSearchSuggestions(query, 'mobile')
  } else {
    hideSearchSuggestions('mobile')
  }
}

function handleMobileKeydown(e) {
  if (e.key === "Enter") {
    const query = e.target.value.toLowerCase()
    performSearch(query)
    hideSearchSuggestions('mobile')
  }
}

function handleMobileFocus() {
  const query = document.getElementById("mobileSearchInput").value.toLowerCase()
  if (query.length > 0) {
    showSearchSuggestions('mobile')
    filterSearchSuggestions(query, 'mobile')
  }
}

function handleMobileBlur() {
  hideSearchSuggestions('mobile')
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

// Updated Search Functions to handle both desktop and mobile
function handleSearchInput(e, type = 'desktop') {
  const query = e.target.value.toLowerCase()
  if (query.length > 0) {
    showSearchSuggestions(type)
    filterSearchSuggestions(query, type)
  } else {
    hideSearchSuggestions(type)
  }
}

function handleSearchKeydown(e, type = 'desktop') {
  if (e.key === "Enter") {
    const query = e.target.value.toLowerCase()
    performSearch(query)
    hideSearchSuggestions(type)
  }
}

function showSearchSuggestions(type = 'desktop') {
  const suggestionsId = type === 'mobile' ? 'mobileSearchSuggestions' : 'searchSuggestions'
  const suggestions = document.getElementById(suggestionsId)
  if (suggestions) {
    suggestions.style.display = "block"
    loadSearchSuggestions(type)
  }
}

function hideSearchSuggestions(type = 'desktop') {
  setTimeout(() => {
    const suggestionsId = type === 'mobile' ? 'mobileSearchSuggestions' : 'searchSuggestions'
    const suggestions = document.getElementById(suggestionsId)
    if (suggestions) {
      suggestions.style.display = "none"
    }
  }, 200)
}

function loadSearchSuggestions(type = 'desktop') {
  const suggestionsId = type === 'mobile' ? 'mobileSearchSuggestions' : 'searchSuggestions'
  const suggestions = document.getElementById(suggestionsId)
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

function filterSearchSuggestions(query, type = 'desktop') {
  const filteredSuggestions = searchSuggestions.filter(
    (s) => s.name.toLowerCase().includes(query) || s.type.toLowerCase().includes(query),
  )

  const suggestionsId = type === 'mobile' ? 'mobileSearchSuggestions' : 'searchSuggestions'
  const suggestions = document.getElementById(suggestionsId)
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
// they are in utils.js

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
