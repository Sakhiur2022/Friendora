document.addEventListener("DOMContentLoaded", () => {
   // Fix navbar functionality
   function initializeNavbar() {
    // Ensure Bootstrap collapse is working
    const navbarToggler = document.querySelector(".navbar-toggler")
    const navbarCollapse = document.querySelector(".navbar-collapse")

    if (navbarToggler && navbarCollapse) {
      navbarToggler.addEventListener("click", function () {
        const isExpanded = this.getAttribute("aria-expanded") === "true"
        this.setAttribute("aria-expanded", !isExpanded)

        if (!isExpanded) {
          navbarCollapse.classList.add("show")
        } else {
          navbarCollapse.classList.remove("show")
        }
      })

      // Close navbar when clicking outside
      document.addEventListener("click", (e) => {
        if (!navbarToggler.contains(e.target) && !navbarCollapse.contains(e.target)) {
          navbarCollapse.classList.remove("show")
          navbarToggler.setAttribute("aria-expanded", "false")
        }
      })
    }
  }

  // Call the navbar initialization
  initializeNavbar()
    // Initialize profile functionality
    initializeTabs()
    initializeInteractions()
    initializeMusic()
    initializeAnimations()
    initializeProfileActions()
  
    // Tab functionality
    function initializeTabs() {
      const tabButtons = document.querySelectorAll(".tab-btn")
      const tabContents = document.querySelectorAll(".tab-content")
  
      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          const targetTab = button.dataset.tab
  
          // Remove active class from all tabs and contents
          tabButtons.forEach((btn) => btn.classList.remove("active"))
          tabContents.forEach((content) => content.classList.remove("active"))
  
          // Add active class to clicked tab and corresponding content
          button.classList.add("active")
          document.getElementById(`${targetTab}-tab`).classList.add("active")
  
          // Add tab switch animation
          const activeContent = document.getElementById(`${targetTab}-tab`)
          activeContent.style.animation = "none"
          setTimeout(() => {
            activeContent.style.animation = "fadeInUp 0.5s ease-out"
          }, 10)
        })
      })
    }
  
    // Post interactions
    function initializeInteractions() {
      const likeButtons = document.querySelectorAll(".like-btn")
      const commentButtons = document.querySelectorAll(".comment-btn")
      const shareButtons = document.querySelectorAll(".share-btn")
  
      // Like functionality
      likeButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          const isLiked = this.classList.contains("liked")
          const countElement = this.querySelector(".btn-count")
          let currentCount = Number.parseInt(countElement.textContent)
  
          if (!isLiked) {
            this.classList.add("liked")
            currentCount++
            createLikeParticles(this)
            showNotification("Post liked! ❤️", "success")
          } else {
            this.classList.remove("liked")
            currentCount--
          }
  
          countElement.textContent = currentCount
          animateCount(countElement)
        })
      })
  
      // Comment functionality
      commentButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          showNotification("Comment feature coming soon! 💬", "info")
        })
      })
  
      // Share functionality
      shareButtons.forEach((btn) => {
        btn.addEventListener("click", function () {
          showNotification("Post shared! 🔄", "success")
          createShareEffect(this)
  
          const countElement = this.querySelector(".btn-count")
          let currentCount = Number.parseInt(countElement.textContent)
          currentCount++
          countElement.textContent = currentCount
          animateCount(countElement)
        })
      })
    }
  
    function createLikeParticles(button) {
      const rect = button.getBoundingClientRect()
      const particles = []
  
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement("div")
        particle.style.cssText = `
          position: fixed;
          width: 6px;
          height: 6px;
          background: #ff006e;
          border-radius: 50%;
          top: ${rect.top + rect.height / 2}px;
          left: ${rect.left + rect.width / 2}px;
          pointer-events: none;
          z-index: 1000;
          animation: heart-burst 1s ease-out forwards;
          animation-delay: ${i * 0.1}s;
        `
        document.body.appendChild(particle)
        particles.push(particle)
      }
  
      // Add heart burst animation
      const style = document.createElement("style")
      style.textContent = `
        @keyframes heart-burst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1);
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
  
      setTimeout(() => {
        particles.forEach((particle) => document.body.removeChild(particle))
        document.head.removeChild(style)
      }, 1500)
    }
  
    function createShareEffect(button) {
      const ripple = document.createElement("div")
      ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(0, 255, 136, 0.3);
        animation: share-ripple 0.6s ease-out;
        pointer-events: none;
      `
  
      const style = document.createElement("style")
      style.textContent = `
        @keyframes share-ripple {
          0% {
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            width: 100px;
            height: 100px;
            opacity: 0;
          }
        }
      `
      document.head.appendChild(style)
  
      button.style.position = "relative"
      button.appendChild(ripple)
  
      setTimeout(() => {
        button.removeChild(ripple)
        document.head.removeChild(style)
      }, 600)
    }
  
    function animateCount(element) {
      element.style.transform = "scale(1.2)"
      element.style.color = "var(--cyber-tertiary)"
  
      setTimeout(() => {
        element.style.transform = "scale(1)"
        element.style.color = ""
      }, 200)
    }
  
    // Profile actions
    function initializeProfileActions() {
      const editProfileBtn = document.querySelector(".btn-edit-profile")
      const shareProfileBtn = document.querySelector(".btn-share-profile")
      const moreOptionsBtn = document.querySelector(".btn-more-options")
      const changeCoverBtn = document.querySelector(".btn-change-cover")
      const changeAvatarBtn = document.querySelector(".btn-change-avatar")
      const messageFriendBtns = document.querySelectorAll(".btn-message-friend")
  
      editProfileBtn.addEventListener("click", () => {
        showNotification("Edit Profile feature coming soon! ✏️", "info")
      })
  
      shareProfileBtn.addEventListener("click", () => {
        // Simulate copying profile link
        navigator.clipboard
          .writeText(window.location.href)
          .then(() => {
            showNotification("Profile link copied to clipboard! 🔗", "success")
          })
          .catch(() => {
            showNotification("Profile link ready to share! 🔗", "success")
          })
      })
  
      moreOptionsBtn.addEventListener("click", () => {
        showNotification("More options coming soon! ⋯", "info")
      })
  
      changeCoverBtn.addEventListener("click", () => {
        showNotification("Cover photo upload coming soon! 📷", "info")
      })
  
      changeAvatarBtn.addEventListener("click", () => {
        showNotification("Avatar upload coming soon! 📷", "info")
      })
  
      messageFriendBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const friendName = this.closest(".friend-card").querySelector(".friend-name").textContent
          showNotification(`Opening chat with ${friendName}... 💬`, "info")
        })
      })
    }
  
    // Music functionality
    function initializeMusic() {
      const backgroundMusic = document.getElementById("backgroundMusic")
      const musicToggle = document.getElementById("musicToggle")
      const musicIcon = musicToggle.querySelector(".music-icon")
  
      let isMusicPlaying = false
      let userInteracted = false
  
      backgroundMusic.volume = 0.2
  
      function toggleMusic() {
        if (!userInteracted) {
          userInteracted = true
        }
  
        if (isMusicPlaying) {
          backgroundMusic.pause()
          musicToggle.classList.remove("playing")
          musicToggle.classList.add("muted")
          musicIcon.textContent = "🔇"
          musicToggle.title = "Play Background Music"
          isMusicPlaying = false
        } else {
          backgroundMusic
            .play()
            .then(() => {
              musicToggle.classList.add("playing")
              musicToggle.classList.remove("muted")
              musicIcon.textContent = "🎵"
              musicToggle.title = "Pause Background Music"
              isMusicPlaying = true
            })
            .catch((error) => {
              console.log("Audio play failed:", error)
            })
        }
      }
  
      musicToggle.addEventListener("click", toggleMusic)
  
      // Auto-play after user interaction
      document.addEventListener(
        "click",
        function autoPlayMusic() {
          if (!userInteracted && !isMusicPlaying) {
            userInteracted = true
            setTimeout(() => {
              backgroundMusic
                .play()
                .then(() => {
                  musicToggle.classList.add("playing")
                  musicIcon.textContent = "🎵"
                  isMusicPlaying = true
                })
                .catch(() => {
                  console.log("Autoplay prevented by browser")
                })
            }, 1000)
          }
          document.removeEventListener("click", autoPlayMusic)
        },
        { once: true },
      )
    }
  
    // Animation functionality
    function initializeAnimations() {
      // Parallax effect for particles
      document.addEventListener("mousemove", (e) => {
        const particles = document.querySelectorAll(".particle")
        const mouseX = e.clientX / window.innerWidth
        const mouseY = e.clientY / window.innerHeight
  
        particles.forEach((particle, index) => {
          const speed = (index + 1) * 0.2
          const x = mouseX * speed * 15
          const y = mouseY * speed * 15
  
          particle.style.transform = `translate(${x}px, ${y}px)`
        })
      })
  
      // Profile picture hover effect
      const profilePicture = document.querySelector(".profile-picture")
      profilePicture.addEventListener("mouseenter", () => {
        profilePicture.style.transform = "scale(1.05) rotate(5deg)"
      })
      profilePicture.addEventListener("mouseleave", () => {
        profilePicture.style.transform = "scale(1) rotate(0deg)"
      })
  
      // Intersection Observer for animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
  
      const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "slideInUp 0.6s ease-out forwards"
          }
        })
      }, observerOptions)
  
      // Observe profile elements
      document.querySelectorAll(".profile-post, .friend-card, .about-section").forEach((element) => {
        elementObserver.observe(element)
      })
  
      // Add slide-in animation
      const style = document.createElement("style")
      style.textContent = `
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `
      document.head.appendChild(style)
  
      // Stats counter animation
      animateStats()
    }
  
    function animateStats() {
      const statNumbers = document.querySelectorAll(".stat-number")
  
      statNumbers.forEach((stat) => {
        const finalValue = stat.textContent
        if (finalValue === "∞") return // Skip infinity symbol
  
        const numericValue = Number.parseFloat(finalValue.replace(/[^\d.]/g, ""))
        if (isNaN(numericValue)) return
  
        let currentValue = 0
        const increment = numericValue / 50
        const suffix = finalValue.replace(/[\d.]/g, "")
  
        const counter = setInterval(() => {
          currentValue += increment
          if (currentValue >= numericValue) {
            stat.textContent = finalValue
            clearInterval(counter)
          } else {
            const displayValue = Math.floor(currentValue)
            stat.textContent = displayValue + suffix
          }
        }, 30)
      })
    }
  
    // Notification system
    function showNotification(message, type = "info") {
      const notification = document.createElement("div")
      notification.className = `notification notification-${type}`
      notification.textContent = message
  
      notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${
          type === "success"
            ? "rgba(0, 255, 136, 0.1)"
            : type === "error"
              ? "rgba(255, 71, 87, 0.1)"
              : "rgba(0, 212, 255, 0.1)"
        };
        border: 1px solid ${
          type === "success" ? "var(--cyber-tertiary)" : type === "error" ? "#ff4757" : "var(--cyber-primary)"
        };
        color: ${type === "success" ? "var(--cyber-tertiary)" : type === "error" ? "#ff4757" : "var(--cyber-primary)"};
        padding: 1rem 1.5rem;
        border-radius: 15px;
        backdrop-filter: blur(20px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        transform: translateX(100%);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        font-weight: 500;
        text-shadow: 0 0 10px currentColor;
        max-width: 300px;
      `
  
      document.body.appendChild(notification)
  
      // Animate in
      setTimeout(() => {
        notification.style.transform = "translateX(0)"
      }, 100)
  
      // Animate out and remove
      setTimeout(() => {
        notification.style.transform = "translateX(100%)"
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification)
          }
        }, 300)
      }, 3000)
    }
  
    // Media gallery functionality
    const mediaItems = document.querySelectorAll(".media-item")
    mediaItems.forEach((item) => {
      item.addEventListener("click", () => {
        showNotification("Media viewer coming soon! 🖼️", "info")
      })
    })
  
    // Achievement badges hover effect
    const achievementBadges = document.querySelectorAll(".achievement-badge")
    achievementBadges.forEach((badge) => {
      badge.addEventListener("mouseenter", function () {
        const icon = this.querySelector(".badge-icon")
        icon.style.transform = "scale(1.2) rotate(10deg)"
        icon.style.filter = "drop-shadow(0 0 15px rgba(0, 212, 255, 0.7))"
      })
  
      badge.addEventListener("mouseleave", function () {
        const icon = this.querySelector(".badge-icon")
        icon.style.transform = "scale(1) rotate(0deg)"
        icon.style.filter = "drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))"
      })
    })
  
    // Profile stats hover effect
    const statItems = document.querySelectorAll(".stat-item")
    statItems.forEach((item) => {
      item.addEventListener("mouseenter", function () {
        const number = this.querySelector(".stat-number")
        number.style.transform = "scale(1.1)"
        number.style.textShadow = "0 0 25px rgba(0, 212, 255, 0.8)"
      })
  
      item.addEventListener("mouseleave", function () {
        const number = this.querySelector(".stat-number")
        number.style.transform = "scale(1)"
        number.style.textShadow = "0 0 15px rgba(0, 212, 255, 0.5)"
      })
    })
  
    // Easter egg: Profile picture click
    let clickCount = 0
    const profileImg = document.querySelector(".profile-img")
    profileImg.addEventListener("click", () => {
      clickCount++
      if (clickCount === 5) {
        showNotification("🎉 You found the secret! Welcome to the inner circle!", "success")
        document.body.style.filter = "hue-rotate(180deg)"
        setTimeout(() => {
          document.body.style.filter = "none"
          clickCount = 0
        }, 3000)
      }
    })
  
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      // Tab navigation with number keys
      if (e.key >= "1" && e.key <= "4") {
        const tabIndex = Number.parseInt(e.key) - 1
        const tabButtons = document.querySelectorAll(".tab-btn")
        if (tabButtons[tabIndex]) {
          tabButtons[tabIndex].click()
        }
      }
    })
  })
  