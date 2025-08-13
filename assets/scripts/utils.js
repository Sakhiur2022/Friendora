addEventListener("DOMContentLoaded", () => {
    initializePage();
    setupEventListeners();
    setupBackgroundMusic();
    createFloatingParticles();
});

function setupEventListeners() {
  // Upload areas
  // setupUploadAreas()

  // Outside click handlers
  document.addEventListener("click", handleOutsideClick)

  // Scroll handlers
  window.addEventListener("scroll", handleNavbarScroll)

  // Hover effects
  addCardHoverEffects()
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

// Helper function to create user profile links (kept for profile-specific usage)
function createUserLink(userId, userName, className = '') {
  const baseUrl = window.ROOT || '';
  return `<a href="${baseUrl}/profile/${userId}" class="user-link ${className}">${userName}</a>`;
}

// Helper function to generate notification messages with user links
function generateNotificationMessage(notification) {
  const userLink = createUserLink(notification.userId, notification.userName);
  return notification.message.replace(notification.userName, userLink);
}

// Helper functions for reactions (kept for compatibility with existing UI)
// Helper functions for reactions
function getReactionIcon(reactionType) {
  const icons = {
    like: 'bi-heart-fill',
    haha: 'bi-emoji-laughing-fill',
    wow: 'bi-emoji-surprise-fill',
    angry: 'bi-emoji-angry-fill'
  }
  return icons[reactionType] || 'bi-heart-fill'
}

function getReactionText(reactionType) {
  const texts = {
    like: 'Like',
    haha: 'Haha',
    wow: 'Wow',
    angry: 'Angry'
  }
  return texts[reactionType] || 'Like'
}





