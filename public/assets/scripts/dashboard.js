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

  // Initialize dashboard functionality
  initializeNavigation()
  initializePosts()
  initializeMusic()
  initializeAnimations()
  initializeInfiniteScroll()

  // Navigation functionality
  function initializeNavigation() {
    const navLinks = document.querySelectorAll(".nav-link")
    const menuLinks = document.querySelectorAll(".menu-link")

    // Handle navbar navigation
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const section = link.dataset.section;
    
        // Only prevent default if section switching is used
        if (section) {
          e.preventDefault();
    
          // Update active states
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
    
          // Handle section switching
          handleSectionSwitch(section);
        }
      });
    });
    

    // Handle sidebar navigation
    menuLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const section = link.dataset.section

        // Update active states
        document.querySelectorAll(".menu-item").forEach((item) => item.classList.remove("active"))
        link.closest(".menu-item").classList.add("active")

        // Handle section switching
        handleSectionSwitch(section)
      })
    })
  }

  function handleSectionSwitch(section) {
    const newsFeed = document.getElementById("newsFeed")

    switch (section) {
      case "home":
      case "newsfeed":
        newsFeed.style.display = "flex"
        break
      case "friends":
        showFriendsSection()
        break
      case "messages":
        showMessagesSection()
        break
      case "requests":
        showFriendRequestsSection()
        break
      case "settings":
        showSettingsSection()
        break
      default:
        newsFeed.style.display = "flex"
    }
  }

  // Post functionality
  function initializePosts() {
    const postInput = document.querySelector(".post-input")
    const postSubmitBtn = document.querySelector(".btn-post-submit")
    const likeButtons = document.querySelectorAll(".like-btn")
    const commentButtons = document.querySelectorAll(".comment-btn")
    const shareButtons = document.querySelectorAll(".share-btn")

    // Post creation
    postSubmitBtn.addEventListener("click", () => {
      const content = postInput.value.trim()
      if (content) {
        createNewPost(content)
        postInput.value = ""
        showNotification("Post shared to the network!", "success")
      }
    })

    // Auto-resize textarea
    postInput.addEventListener("input", function () {
      this.style.height = "auto"
      this.style.height = this.scrollHeight + "px"
    })

    // Like functionality
    likeButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const isLiked = this.dataset.liked === "true"
        this.dataset.liked = !isLiked

        if (!isLiked) {
          this.classList.add("liked")
          this.querySelector(".btn-text").textContent = "Liked"
          createLikeParticles(this)
          showNotification("Post liked! ❤️", "success")
        } else {
          this.classList.remove("liked")
          this.querySelector(".btn-text").textContent = "Like"
        }

        // Update like count (simulate)
        updateLikeCount(this, !isLiked)
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
      })
    })
  }

  function createNewPost(content) {
    const newsFeed = document.getElementById("newsFeed")
    const postHTML = `
      <article class="post-card" style="opacity: 0; transform: translateY(20px);">
        <div class="post-header">
          <div class="user-info">
            <div class="user-avatar">
              <img src="/placeholder.svg?height=40&width=40" alt="CyberDreamer" class="avatar-img">
              <div class="status-ring online"></div>
            </div>
            <div class="user-details">
              <h4 class="username">CyberDreamer</h4>
              <span class="timestamp">Just now</span>
            </div>
          </div>
          <div class="post-menu">
            <button class="menu-btn">⋯</button>
          </div>
        </div>
        <div class="post-content">
          <p>${content}</p>
        </div>
        <div class="post-stats">
          <span class="stat">❤️ 0 likes</span>
          <span class="stat">💬 0 comments</span>
          <span class="stat">🔄 0 shares</span>
        </div>
        <div class="post-actions">
          <button class="action-btn like-btn" data-liked="false">
            <span class="btn-icon">❤️</span>
            <span class="btn-text">Like</span>
            <div class="btn-particles"></div>
          </button>
          <button class="action-btn comment-btn">
            <span class="btn-icon">💬</span>
            <span class="btn-text">Comment</span>
          </button>
          <button class="action-btn share-btn">
            <span class="btn-icon">🔄</span>
            <span class="btn-text">Share</span>
          </button>
        </div>
      </article>
    `

    newsFeed.insertAdjacentHTML("afterbegin", postHTML)
    const newPost = newsFeed.firstElementChild

    // Animate in
    setTimeout(() => {
      newPost.style.transition = "all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)"
      newPost.style.opacity = "1"
      newPost.style.transform = "translateY(0)"
    }, 100)

    // Add event listeners to new post
    const likeBtn = newPost.querySelector(".like-btn")
    const commentBtn = newPost.querySelector(".comment-btn")
    const shareBtn = newPost.querySelector(".share-btn")

    likeBtn.addEventListener("click", function () {
      const isLiked = this.dataset.liked === "true"
      this.dataset.liked = !isLiked

      if (!isLiked) {
        this.classList.add("liked")
        this.querySelector(".btn-text").textContent = "Liked"
        createLikeParticles(this)
        showNotification("Post liked! ❤️", "success")
      } else {
        this.classList.remove("liked")
        this.querySelector(".btn-text").textContent = "Like"
      }

      updateLikeCount(this, !isLiked)
    })

    commentBtn.addEventListener("click", () => {
      showNotification("Comment feature coming soon! 💬", "info")
    })

    shareBtn.addEventListener("click", function () {
      showNotification("Post shared! 🔄", "success")
      createShareEffect(this)
    })
  }

  function createLikeParticles(button) {
    const particles = button.querySelector(".btn-particles")
    particles.innerHTML = ""

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement("div")
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #ff006e;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: particle-burst 0.6s ease-out forwards;
        animation-delay: ${i * 0.1}s;
      `
      particles.appendChild(particle)
    }

    // Add particle burst animation
    const style = document.createElement("style")
    style.textContent = `
      @keyframes particle-burst {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) translate(${Math.random() * 60 - 30}px, ${
            Math.random() * 60 - 30
          }px) scale(1);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    setTimeout(() => {
      particles.innerHTML = ""
      document.head.removeChild(style)
    }, 1000)
  }

  function createShareEffect(button) {
    const effect = document.createElement("div")
    effect.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
      height: 100%;
      border: 2px solid #00ff88;
      border-radius: 10px;
      animation: share-pulse 0.6s ease-out;
      pointer-events: none;
    `

    const style = document.createElement("style")
    style.textContent = `
      @keyframes share-pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    button.style.position = "relative"
    button.appendChild(effect)

    setTimeout(() => {
      button.removeChild(effect)
      document.head.removeChild(style)
    }, 600)
  }

  function updateLikeCount(button, increment) {
    const postCard = button.closest(".post-card")
    const likeStat = postCard.querySelector(".stat")
    const currentCount = Number.parseInt(likeStat.textContent.match(/\d+/)[0])
    const newCount = increment ? currentCount + 1 : currentCount - 1
    likeStat.textContent = `❤️ ${newCount} likes`
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

    // Handle audio end
    backgroundMusic.addEventListener("ended", () => {
      musicToggle.classList.remove("playing")
      isMusicPlaying = false
    })
  }

  // Animation functionality
  function initializeAnimations() {
    // Parallax effect for particles
    document.addEventListener("mousemove", (e) => {
      const particles = document.querySelectorAll(".particle")
      const mouseX = e.clientX / window.innerWidth
      const mouseY = e.clientY / window.innerHeight

      particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.3
        const x = mouseX * speed * 10
        const y = mouseY * speed * 10

        particle.style.transform = `translate(${x}px, ${y}px)`
      })
    })

    // Intersection Observer for post animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const postObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "slideInUp 0.6s ease-out forwards"
        }
      })
    }, observerOptions)

    document.querySelectorAll(".post-card").forEach((post) => {
      postObserver.observe(post)
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
  }

  // Infinite scroll functionality
  function initializeInfiniteScroll() {
    const loadingIndicator = document.getElementById("loadingIndicator")
    let isLoading = false

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadMorePosts()
        }
      },
      { threshold: 0.1 },
    )

    scrollObserver.observe(loadingIndicator)

    function loadMorePosts() {
      if (isLoading) return

      isLoading = true
      loadingIndicator.classList.add("show")

      // Simulate API call
      setTimeout(() => {
        const newPosts = generateMorePosts()
        const newsFeed = document.getElementById("newsFeed")

        newPosts.forEach((postHTML) => {
          newsFeed.insertAdjacentHTML("beforeend", postHTML)
        })

        // Add event listeners to new posts
        addEventListenersToNewPosts()

        loadingIndicator.classList.remove("show")
        isLoading = false
      }, 1500)
    }

    function generateMorePosts() {
      const users = ["DigitalNomad", "CyberWizard", "NeonDreamer", "QuantumCoder", "VirtualArtist"]
      const contents = [
        "Exploring new dimensions in the digital realm! 🌌",
        "Just finished coding a new AI assistant. The future is here! 🤖",
        "Virtual reality is becoming more real every day. Mind blown! 🤯",
        "Creating digital art that transcends reality. Art meets technology! 🎨",
        "The metaverse is calling, and I must go! See you in cyberspace! 🚀",
      ]

      return Array.from({ length: 3 }, (_, i) => {
        const user = users[Math.floor(Math.random() * users.length)]
        const content = contents[Math.floor(Math.random() * contents.length)]
        const likes = Math.floor(Math.random() * 200) + 10
        const comments = Math.floor(Math.random() * 50) + 1
        const shares = Math.floor(Math.random() * 20) + 1

        return `
          <article class="post-card">
            <div class="post-header">
              <div class="user-info">
                <div class="user-avatar">
                  <img src="/placeholder.svg?height=40&width=40" alt="${user}" class="avatar-img">
                  <div class="status-ring ${Math.random() > 0.5 ? "online" : "away"}"></div>
                </div>
                <div class="user-details">
                  <h4 class="username">${user}</h4>
                  <span class="timestamp">${Math.floor(Math.random() * 12) + 1} hours ago</span>
                </div>
              </div>
              <div class="post-menu">
                <button class="menu-btn">⋯</button>
              </div>
            </div>
            <div class="post-content">
              <p>${content}</p>
            </div>
            <div class="post-stats">
              <span class="stat">❤️ ${likes} likes</span>
              <span class="stat">💬 ${comments} comments</span>
              <span class="stat">🔄 ${shares} shares</span>
            </div>
            <div class="post-actions">
              <button class="action-btn like-btn" data-liked="false">
                <span class="btn-icon">❤️</span>
                <span class="btn-text">Like</span>
                <div class="btn-particles"></div>
              </button>
              <button class="action-btn comment-btn">
                <span class="btn-icon">💬</span>
                <span class="btn-text">Comment</span>
              </button>
              <button class="action-btn share-btn">
                <span class="btn-icon">🔄</span>
                <span class="btn-text">Share</span>
              </button>
            </div>
          </article>
        `
      })
    }

    function addEventListenersToNewPosts() {
      const newLikeButtons = document.querySelectorAll(".like-btn:not([data-initialized])")
      const newCommentButtons = document.querySelectorAll(".comment-btn:not([data-initialized])")
      const newShareButtons = document.querySelectorAll(".share-btn:not([data-initialized])")

      newLikeButtons.forEach((btn) => {
        btn.dataset.initialized = "true"
        btn.addEventListener("click", function () {
          const isLiked = this.dataset.liked === "true"
          this.dataset.liked = !isLiked

          if (!isLiked) {
            this.classList.add("liked")
            this.querySelector(".btn-text").textContent = "Liked"
            createLikeParticles(this)
            showNotification("Post liked! ❤️", "success")
          } else {
            this.classList.remove("liked")
            this.querySelector(".btn-text").textContent = "Like"
          }

          updateLikeCount(this, !isLiked)
        })
      })

      newCommentButtons.forEach((btn) => {
        btn.dataset.initialized = "true"
        btn.addEventListener("click", () => {
          showNotification("Comment feature coming soon! 💬", "info")
        })
      })

      newShareButtons.forEach((btn) => {
        btn.dataset.initialized = "true"
        btn.addEventListener("click", function () {
          showNotification("Post shared! 🔄", "success")
          createShareEffect(this)
        })
      })
    }
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
        document.body.removeChild(notification)
      }, 300)
    }, 3000)
  }

  // Section switching functions
  function showFriendsSection() {
    const newsFeed = document.getElementById("newsFeed")
    newsFeed.innerHTML = `
      <div class="section-placeholder">
        <h2>Friends Section</h2>
        <p>Connect with fellow dreamers in the digital realm!</p>
        <div class="placeholder-animation">
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
        </div>
      </div>
    `
    addPlaceholderStyles()
  }

  function showMessagesSection() {
    const newsFeed = document.getElementById("newsFeed")
    newsFeed.innerHTML = `
      <div class="section-placeholder">
        <h2>Messages Section</h2>
        <p>Your digital conversations await!</p>
        <div class="placeholder-animation">
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
        </div>
      </div>
    `
    addPlaceholderStyles()
  }

  function showFriendRequestsSection() {
    const newsFeed = document.getElementById("newsFeed")
    newsFeed.innerHTML = `
      <div class="section-placeholder">
        <h2>Friend Requests</h2>
        <p>New connections are waiting to be made!</p>
        <div class="placeholder-animation">
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
        </div>
      </div>
    `
    addPlaceholderStyles()
  }

  function showSettingsSection() {
    const newsFeed = document.getElementById("newsFeed")
    newsFeed.innerHTML = `
      <div class="section-placeholder">
        <h2>Settings</h2>
        <p>Customize your digital experience!</p>
        <div class="placeholder-animation">
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
          <div class="pulse-ring"></div>
        </div>
      </div>
    `
    addPlaceholderStyles()
  }

  function addPlaceholderStyles() {
    if (document.getElementById("placeholder-styles")) return

    const style = document.createElement("style")
    style.id = "placeholder-styles"
    style.textContent = `
      .section-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(25px);
        border: 1px solid rgba(0, 212, 255, 0.3);
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }

      .section-placeholder h2 {
        font-family: "Orbitron", monospace;
        font-size: 2rem;
        font-weight: 700;
        color: var(--cyber-primary);
        margin-bottom: 1rem;
        text-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
      }

      .section-placeholder p {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.1rem;
        margin-bottom: 2rem;
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
      }

      .placeholder-animation {
        position: relative;
        width: 100px;
        height: 100px;
      }

      .pulse-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        border: 2px solid var(--cyber-primary);
        border-radius: 50%;
        animation: pulse-ring 2s ease-out infinite;
      }

      .pulse-ring:nth-child(2) {
        animation-delay: 0.7s;
        border-color: var(--cyber-secondary);
      }

      .pulse-ring:nth-child(3) {
        animation-delay: 1.4s;
        border-color: var(--cyber-tertiary);
      }

      @keyframes pulse-ring {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }

  // Add some interactive effects
  document.addEventListener("keydown", (e) => {
    // Easter egg: Konami code
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ]
    if (!window.konamiProgress) window.konamiProgress = 0

    if (e.code === konamiCode[window.konamiProgress]) {
      window.konamiProgress++
      if (window.konamiProgress === konamiCode.length) {
        showNotification("🎉 Konami Code Activated! Welcome to the Matrix!", "success")
        document.body.style.filter = "hue-rotate(180deg)"
        setTimeout(() => {
          document.body.style.filter = "none"
        }, 3000)
        window.konamiProgress = 0
      }
    } else {
      window.konamiProgress = 0
    }
  })

  // Search functionality
  const searchForm = document.querySelector('form[action="search.php"]')
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      const searchInput = this.querySelector('input[name="search"]')
      if (!searchInput.value.trim()) {
        e.preventDefault()
        searchInput.focus()
      }
    })
  }

  // Image upload preview
  const imageUpload = document.getElementById("imageUpload")
  if (imageUpload) {
    imageUpload.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          // Create preview element
          let preview = document.querySelector(".image-preview")
          if (!preview) {
            preview = document.createElement("div")
            preview.className = "image-preview mt-3"
            imageUpload.closest("form").querySelector("textarea").parentNode.appendChild(preview)
          }
          preview.innerHTML = `
                      <div class="position-relative d-inline-block">
                          <img src="${e.target.result}" class="img-fluid rounded-3" style="max-height: 200px;">
                          <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 remove-image">
                              <i class="bi bi-x"></i>
                          </button>
                      </div>
                  `
        }
        reader.readAsDataURL(file)
      }
    })

    // Remove image preview
    document.addEventListener("click", (e) => {
      if (e.target.closest(".remove-image")) {
        e.preventDefault()
        const preview = document.querySelector(".image-preview")
        if (preview) {
          preview.remove()
        }
        imageUpload.value = ""
      }
    })
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Infinite scroll for posts (placeholder)
  let loading = false
  window.addEventListener("scroll", () => {
    if (loading) return

    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
      loading = true
      // Simulate loading more posts
      setTimeout(() => {
        console.log("Loading more posts...")
        loading = false
      }, 1000)
    }
  })

  // Real-time notifications (placeholder)
  function checkNotifications() {
    // This would typically make an AJAX call to check for new notifications
    console.log("Checking for notifications...")
  }

  // Check for notifications every 30 seconds
  setInterval(checkNotifications, 30000)

  // Toast notifications
  function showToast(message, type = "info") {
    const toastContainer = document.querySelector(".toast-container") || createToastContainer()
    const toast = document.createElement("div")
    toast.className = `toast align-items-center text-white bg-${type} border-0`
    toast.setAttribute("role", "alert")
    toast.innerHTML = `
          <div class="d-flex">
              <div class="toast-body">${message}</div>
              <button type="button" class="btn btn-sm btn-close position-absolute top-0 end-0 m-1" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
              </button>
          </div>
      `
    toastContainer.appendChild(toast)

    // Assuming bootstrap is imported elsewhere
    const bsToast = window.bootstrap.Toast.getOrCreateInstance(toast)
    bsToast.show()

    toast.addEventListener("hidden.bs.toast", () => {
      toast.remove()
    })
  }

  function createToastContainer() {
    const container = document.createElement("div")
    container.className = "toast-container position-fixed bottom-0 end-0 p-3"
    container.style.zIndex = "1055"
    document.body.appendChild(container)
    return container
  }

  // Form validation
  document.querySelectorAll("form").forEach((form) => {
    form.addEventListener("submit", function (e) {
      const requiredFields = this.querySelectorAll("[required]")
      let isValid = true

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          field.classList.add("is-invalid")
          isValid = false
        } else {
          field.classList.remove("is-invalid")
        }
      })

      if (!isValid) {
        e.preventDefault()
        showToast("Please fill in all required fields", "danger")
      }
    })
  })
})
