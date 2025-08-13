// Enhanced Friendora Profile Page JavaScript
// This file handles profile-specific functionality only
// Post-related functionality has been moved to post.js

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the page
  initializePage()
  setupProfileEventListeners()
  loadDummyData()
  initializeProfileOwnership()
  checkFriendshipStatus()
  loadFriendsGrid()
  
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
const isOwnProfile = window.isOwnProfile || false
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
let currentPhotoIndex = 0

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

function setupProfileEventListeners() {
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
}

function loadAboutSection(user) {
  const aboutSection = document.getElementById("aboutSection")
  if (!aboutSection) {
    return;
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
  })
}

function saveProfile() {
  
  const form = document.getElementById("editProfileForm");
  if (!form) {
    showNotification("Edit profile form not found", "error");
    return;
  }
  
  const formData = new FormData(form);
  formData.append("action", "update_profile");

  const profileUrl = window.ROOT ? `${window.ROOT}/profile` : './profile';

  fetch(profileUrl, {
    method: "POST",
    body: formData,
    headers: {
      "X-Requested-With": "XMLHttpRequest",
    },
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
        showNotification("Error updating profile: " + data.message, "error")
      }
    })
    .catch((error) => {
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

  
  const input = document.getElementById("coverPhotoInput")
  const file = input.files[0]

  if (!file) {
    showNotification("Please select a file first", "error")
    return
  }


  const formData = new FormData()
  formData.append("cover_photo", file)
  formData.append("action", "upload_cover")

  
 
  const profileUrl = window.ROOT ? `${window.ROOT}/profile` : './profile';
  

  fetch(profileUrl, {
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
        
        showNotification("Cover photo uploaded successfully!", "success")
        removeCoverPreview()
        // Update the cover photo display
        const coverImg = document.getElementById("coverPhoto")
        if (coverImg && data.cover_url) {
          coverImg.src = data.cover_url
        } 
        
        // Close modal
        const modal = window.bootstrap.Modal.getInstance(document.getElementById("coverPhotoModal"))
        if (modal) {
          modal.hide()
        }
      } else {
        showNotification("Error uploading cover photo: " + data.message, "error")
      }
    })
    .catch((error) => {
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
  formData.append("action", "upload_profile") 

  const profileUrl = window.ROOT ? `${window.ROOT}/profile` : './profile'; 

  fetch(profileUrl, {
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
    
        showNotification("Profile photo updated successfully!", "success")
        removeProfilePreview()
        
        // Update all profile images on the page
        const profileImages = document.querySelectorAll("#profilePic, .profile-pic-nav, .user-dropdown-avatar")
      
        profileImages.forEach((img, index) => {
          if (data.profile_url) {
            img.src = data.profile_url
          }
        })
        
        // Close modal
        const modal = window.bootstrap.Modal.getInstance(document.getElementById("profilePhotoModal"))
        if (modal) {
          modal.hide()
        }
      } else {
        showNotification("Error uploading profile photo: " + data.message, "error")
      }
    })
    .catch((error) => {
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

function loadPhotosGrid() {
  const photosGrid = document.getElementById("photosGrid")
  if (!photosGrid) return

  // Use PHP photos data if available
  if (photosData && photosData.length > 0) {
    const displayPhotos = photosData.slice(0, 6)
    photosGrid.innerHTML = displayPhotos
      .map(
        (photo, index) => {
          // Handle different possible URL field names
          const photoUrl = photo.url || photo.photo_url || photo.image_url || 'https://via.placeholder.com/150';
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
// Updated Search Functions to handle both desktop and mobile
// now the code is in search.js

// Profile Action Functions
async function checkFriendshipStatus() {
  if (isOwnProfile) return;
  
  const profileUserId = window.profileUserId;
  if (!profileUserId) return;
  
  try {
    const response = await fetch(`${window.location.origin}/Friendora/friendship/get_friendship_status/${profileUserId}`);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Expected JSON but got:", text);
      throw new Error("Server returned non-JSON response");
    }
    
    const result = await response.json();
    updateFriendshipButton(result.status);
  } catch (error) {
    console.error("Failed to check friendship status:", error);
  }
}

function updateFriendshipButton(status) {
  const friendshipBtn = document.getElementById("friendshipBtn");
  const friendshipBtnText = document.getElementById("friendshipBtnText");
  const friendshipIcon = document.getElementById("friendshipIcon");
  
  if (!friendshipBtn || !friendshipBtnText || !friendshipIcon) return;
  
  switch (status) {
    case 'friends':
      friendshipBtnText.textContent = "Friends";
      friendshipIcon.className = "bi bi-person-check-fill me-2";
      friendshipBtn.className = "btn cyber-btn-primary";
      break;
    case 'pending_sent':
      friendshipBtnText.textContent = "Pending";
      friendshipIcon.className = "bi bi-clock me-2";
      friendshipBtn.className = "btn cyber-btn-secondary";
      friendshipBtn.disabled = true;
      break;
    case 'pending_received':
      friendshipBtnText.textContent = "Accept Request";
      friendshipIcon.className = "bi bi-person-plus-fill me-2";
      friendshipBtn.className = "btn cyber-btn-primary";
      break;
    case 'not_friends':
    default:
      friendshipBtnText.textContent = "Add Friend";
      friendshipIcon.className = "bi bi-person-plus me-2";
      friendshipBtn.className = "btn cyber-btn-primary";
      friendshipBtn.disabled = false;
      break;
  }
}

async function handleFriendshipAction() {
  const friendshipBtn = document.getElementById("friendshipBtn");
  const friendshipBtnText = document.getElementById("friendshipBtnText");
  const profileUserId = window.profileUserId;
  
  if (!profileUserId) return;
  
  const currentStatus = friendshipBtnText.textContent;
  
  try {
    let response;
    let message;
    
    switch (currentStatus) {
      case 'Add Friend':
        response = await fetch(`${window.location.origin}/Friendora/friendship/send_request/${profileUserId}`, {
          method: 'POST'
        });
        message = "Friend request sent!";
        break;
        
      case 'Accept Request':
        response = await fetch(`${window.location.origin}/Friendora/friendship/accept_request/${profileUserId}`, {
          method: 'POST'
        });
        message = "Friend request accepted!";
        break;
        
      case 'Friends':
        if (confirm('Are you sure you want to unfriend this user?')) {
          response = await fetch(`${window.location.origin}/Friendora/friendship/unfriend/${profileUserId}`, {
            method: 'POST'
          });
          message = "User unfriended";
        } else {
          return;
        }
        break;
        
      default:
        return;
    }
    
    const result = await response.json();
    
    if (result.status === 'success') {
      showNotification(message, "success");
      // Refresh friendship status
      setTimeout(() => checkFriendshipStatus(), 500);
    } else {
      showNotification(result.message || "Action failed", "error");
    }
  } catch (error) {
    console.error("Error handling friendship action:", error);
    showNotification("Failed to perform action", "error");
  }
}

async function loadFriendsGrid() {
  const friendsGrid = document.getElementById("friendsGrid");
  if (!friendsGrid) return;
  
  const profileUserId = window.profileUserId || window.currentUserId;
  if (!profileUserId) return;
  
  try {
    const response = await fetch(`${window.location.origin}/Friendora/friendship/get_friends/${profileUserId}`);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Expected JSON but got:", text);
      throw new Error("Server returned non-JSON response");
    }
    
    const data = await response.json();
    
    console.log("Received friends data:", data);
    
    if (!data.friends || data.friends.length === 0) {
      friendsGrid.innerHTML = '<p class="text-muted">No friends yet</p>';
    } else {
      // Show first 6 friends
      const friends = data.friends;
      
      // Ensure friends is an array
      const friendsArray = Array.isArray(friends) ? friends : (friends ? [friends] : []);
      const displayFriends = friendsArray.slice(0, 6);
      friendsGrid.innerHTML = displayFriends.map(friend => `
        <div class="friend-item" onclick="window.location.href='${window.location.origin}/Friendora/profile/${friend.friend_id}'">
          <img src="${friend.profile_pic || '/Friendora/assets/images/default_pfp.png'}" class="friend-avatar" alt="${friend.friend_name}">
          <span class="friend-name">${friend.friend_name}</span>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error("Failed to load friends:", error);
    friendsGrid.innerHTML = '<p class="text-muted">Failed to load friends</p>';
  }
}

function openFriendsModal() {
  const modal = new window.bootstrap.Modal(document.getElementById("friendsModal"));
  loadFriendsModal();
  setupFriendsSearch();
  modal.show();
}

function setupFriendsSearch() {
  const searchInput = document.getElementById("friendsSearchInput");
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const friendItems = document.querySelectorAll('.friends-modal-item');
      
      friendItems.forEach(item => {
        const friendName = item.querySelector('.friends-modal-name').textContent.toLowerCase();
        if (friendName.includes(searchTerm)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

async function loadFriendsModal() {
  const friendsModalList = document.getElementById("friendsModalList");
  if (!friendsModalList) return;
  
  const profileUserId = window.profileUserId || window.currentUserId;
  if (!profileUserId) return;
  
  try {
    const response = await fetch(`${window.location.origin}/Friendora/friendship/get_friends/${profileUserId}`);
    
    // Check if response is ok
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Check if response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Expected JSON but got:", text);
      throw new Error("Server returned non-JSON response");
    }
    
    const data = await response.json();
    
    console.log("Received friends modal data:", data);
    
    if (!data.friends || data.friends.length === 0) {
      friendsModalList.innerHTML = '<div class="text-center text-muted">No friends yet</div>';
    } else {
      const friends = data.friends;
      // Ensure friends is an array
      const friendsArray = Array.isArray(friends) ? friends : (friends ? [friends] : []);
      friendsModalList.innerHTML = friendsArray.map(friend => `
        <div class="friends-modal-item" onclick="window.location.href='${window.location.origin}/Friendora/profile/${friend.friend_id}'">
          <img src="${friend.profile_pic || '/Friendora/assets/images/default_pfp.png'}" class="friends-modal-avatar" alt="${friend.friend_name}">
          <div class="friends-modal-info">
            <h6 class="friends-modal-name">${friend.friend_name}</h6>
            <p class="friends-modal-meta">${friend.mutual_friends || 0} mutual friends</p>
          </div>
        </div>
      `).join('');
    }
  } catch (error) {
    console.error("Failed to load friends:", error);
    friendsModalList.innerHTML = '<div class="text-center text-muted">Failed to load friends</div>';
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


// Utility Functions
// they are in utils.js


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
