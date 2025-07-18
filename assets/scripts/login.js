console.log("Login script loaded");
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm")
    const loginBtn = document.getElementById("loginBtn")
    const btnText = document.getElementById("btnText")
    const loginModal = document.getElementById("loginModal")
    const passwordToggle = document.getElementById("passwordToggle")
    const passwordInput = document.getElementById("password")
  
    // Typing animation for subtitle
    const typingText = document.querySelector(".typing-text")
    const cursor = document.querySelector(".cursor")
    const text = "Welcome back to the Digital Dreamscape"
    let i = 0
  
    function typeWriter() {
      if (i < text.length) {
        typingText.textContent += text.charAt(i)
        i++
        setTimeout(typeWriter, 100)
      } else {
        cursor.style.display = "none"
        setTimeout(() => {
          cursor.style.display = "inline-block"
          typingText.textContent = ""
          i = 0
          setTimeout(typeWriter, 2000)
        }, 3000)
      }
    }
  
    // Start typing animation after a delay
    setTimeout(typeWriter, 1000)
  
    // Password toggle functionality
    passwordToggle.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"
      passwordInput.setAttribute("type", type)
  
      const icon = passwordToggle.querySelector(".toggle-icon")
      icon.textContent = type === "password" ? "👁️" : "🙈"
    })
  
    // Form validation
    const validationRules = {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address.",
      },
      password: {
        required: true,
        minLength: 6,
        message: "Password must be at least 6 characters long.",
      },
    }
  
    function validateField(field) {
      const fieldName = field.name
      const value = field.value.trim()
      const rules = validationRules[fieldName]
  
      if (!rules) return true
  
      let isValid = true
      let errorMessage = ""
  
      if (rules.required && !value) {
        isValid = false
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`
      } else if (rules.minLength && value.length < rules.minLength) {
        isValid = false
        errorMessage = rules.message
      } else if (rules.pattern && !rules.pattern.test(value)) {
        isValid = false
        errorMessage = rules.message
      }
  
      // Update field appearance
      field.classList.remove("is-valid", "is-invalid")
      const feedback = field.parentNode.parentNode.querySelector(".invalid-feedback")
  
      if (value && !isValid) {
        field.classList.add("is-invalid")
        if (feedback) {
          feedback.textContent = errorMessage
          feedback.style.display = "block"
        }
      } else if (value && isValid) {
        field.classList.add("is-valid")
        if (feedback) {
          feedback.style.display = "none"
        }
      } else {
        if (feedback) {
          feedback.style.display = "none"
        }
      }
  
      return isValid
    }
  
    // Add event listeners for real-time validation
    const formFields = form.querySelectorAll("input[required]")
    formFields.forEach((field) => {
      field.addEventListener("blur", function () {
        validateField(this)
      })
  
      field.addEventListener("input", function () {
        if (this.classList.contains("is-invalid")) {
          this.classList.remove("is-invalid")
          const feedback = this.parentNode.parentNode.querySelector(".invalid-feedback")
          if (feedback) {
            feedback.style.display = "none"
          }
        }
      })
    })
  
    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault()
  
      // Validate all fields
      let isFormValid = true
      formFields.forEach((field) => {
        if (!validateField(field)) {
          isFormValid = false
        }
      })
  
      if (!isFormValid) {
        const firstInvalid = form.querySelector(".is-invalid")
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" })
          firstInvalid.focus()
        }
        return
      }
  
     form.submit()
    
    
    })
  
 
    // Enhanced input focus effects
    const inputs = document.querySelectorAll(".cyber-input")
    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentNode.style.transform = "scale(1.02)"
      })
  
      input.addEventListener("blur", function () {
        this.parentNode.style.transform = "scale(1)"
      })
    })
  
    // Social login buttons
    const socialButtons = document.querySelectorAll(".btn-social")
    socialButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const platform = this.textContent.trim()
        alert(`${platform} login integration would be implemented here!`)
      })
    })
  
    // Background Music Control (same as signup page)
    const backgroundMusic = document.getElementById("backgroundMusic")
    const musicToggle = document.getElementById("musicToggle")
    const musicIcon = musicToggle.querySelector(".music-icon")
  
    let isMusicPlaying = false
    let userInteracted = false
  
    backgroundMusic.volume = 0.25
  
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
  
    // Auto-play music after user interaction
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
          }, 1500)
        }
        document.removeEventListener("click", autoPlayMusic)
      },
      { once: true },
    )
  
    // Fade music during form submission
    form.addEventListener("submit", () => {
      if (isMusicPlaying) {
        let currentVolume = backgroundMusic.volume
        const fadeOut = setInterval(() => {
          if (currentVolume > 0.05) {
            currentVolume -= 0.02
            backgroundMusic.volume = Math.max(0.05, currentVolume)
          } else {
            clearInterval(fadeOut)
          }
        }, 50)
      }
    })
  
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !loginBtn.disabled) {
        form.dispatchEvent(new Event("submit"))
      }
    })
  
    // Add some interactive particle effects on mouse move
    document.addEventListener("mousemove", (e) => {
      const particles = document.querySelectorAll(".particle")
      const mouseX = e.clientX / window.innerWidth
      const mouseY = e.clientY / window.innerHeight
  
      particles.forEach((particle, index) => {
        const speed = (index + 1) * 0.5
        const x = mouseX * speed
        const y = mouseY * speed
  
        particle.style.transform = `translate(${x}px, ${y}px)`
      })
    })
  
    // Add glitch effect to title on hover
    const glitchText = document.querySelector(".glitch-text")
    let glitchInterval
  
    glitchText.addEventListener("mouseenter", () => {
      glitchInterval = setInterval(() => {
        glitchText.style.textShadow = `
          ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 var(--cyber-primary),
          ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 var(--cyber-secondary)
        `
      }, 100)
    })
  
    glitchText.addEventListener("mouseleave", () => {
      clearInterval(glitchInterval)
      glitchText.style.textShadow = "0 0 20px rgba(255, 255, 255, 0.3)"
    })
  })
  