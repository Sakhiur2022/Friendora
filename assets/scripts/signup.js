// Form validation and interactivity
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("signupForm")
    const submitBtn = document.getElementById("submitBtn")
    const submitText = document.getElementById("submitText")
    const acceptTerms = document.getElementById("acceptTerms")
    
  
    // Form validation patterns
    const validationRules = {
      firstName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: "First name must contain only letters and be at least 2 characters long.",
      },
      lastName: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: "Last name must contain only letters and be at least 2 characters long.",
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address.",
      },
      password: {
        required: true,
        minLength: 8,
        pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
        message: "Password must be at least 8 characters long and contain both letters and numbers.",
      },
      dateOfBirth: {
        required: true,
        validate: (value) => {
          const today = new Date()
          const birthDate = new Date(value)
          let age = today.getFullYear() - birthDate.getFullYear()
          const monthDiff = today.getMonth() - birthDate.getMonth()
  
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
          }
  
          return age >= 13
        },
        message: "You must be at least 13 years old to join Friendora.",
      },
      gender: {
        required: true,
        message: "Please select your gender.",
      },
    }
  
    // Enable/disable submit button based on terms acceptance and form validity
    function updateSubmitButton() {
      const isFormValid = form.checkValidity()
      const isTermsAccepted = acceptTerms.checked
      submitBtn.disabled = !(isFormValid && isTermsAccepted)
    }
  
    // Real-time validation function
    function validateField(field) {
      const fieldName = field.name
      const value = field.value.trim()
      const rules = validationRules[fieldName]
  
      if (!rules) return true
  
      let isValid = true
      let errorMessage = ""
  
      // Check if required field is empty
      if (rules.required && !value) {
        isValid = false
        errorMessage = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required.`
      }
      // Check minimum length
      else if (rules.minLength && value.length < rules.minLength) {
        isValid = false
        errorMessage = rules.message || `${fieldName} must be at least ${rules.minLength} characters long.`
      }
      // Check pattern
      else if (rules.pattern && !rules.pattern.test(value)) {
        isValid = false
        errorMessage = rules.message || `${fieldName} format is invalid.`
      }
      // Custom validation
      else if (rules.validate && !rules.validate(value)) {
        isValid = false
        errorMessage = rules.message || `${fieldName} is invalid.`
      }
  
      // Update field appearance
      field.classList.remove("is-valid", "is-invalid")
      const feedback = field.parentNode.querySelector(".invalid-feedback")
  
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
    const formFields = form.querySelectorAll("input[required], select[required]")
    formFields.forEach((field) => {
      field.addEventListener("blur", function () {
        validateField(this)
        updateSubmitButton()
      })
  
      field.addEventListener("input", function () {
        // Clear invalid state on input
        if (this.classList.contains("is-invalid")) {
          this.classList.remove("is-invalid")
          const feedback = this.parentNode.querySelector(".invalid-feedback")
          if (feedback) {
            feedback.style.display = "none"
          }
        }
        updateSubmitButton()
      })
    })
  
    // Terms checkbox event listener
    acceptTerms.addEventListener("change", function () {
      this.classList.remove("is-invalid")
      const feedback = this.parentNode.querySelector(".invalid-feedback")
      if (feedback) {
        feedback.style.display = "none"
      }
      updateSubmitButton()
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
  
      // Check terms acceptance
      if (!acceptTerms.checked) {
        acceptTerms.classList.add("is-invalid")
        const feedback = acceptTerms.parentNode.querySelector(".invalid-feedback")
        if (feedback) {
          feedback.style.display = "block"
        }
        isFormValid = false
      }
  
      if (!isFormValid) {
        // Scroll to first invalid field
        const firstInvalid = form.querySelector(".is-invalid")
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" })
          firstInvalid.focus()
        }
        return
      }
  
      // Get form data
      const formData = new FormData(form)
  
      // Show loading state
      submitText.textContent = "Entering Dreamscape..."
      submitBtn.disabled = true
      submitBtn.style.background = "linear-gradient(45deg, #666, #999)"
    })
  
    // Add enhanced glow effect to focused inputs
    const inputs = document.querySelectorAll(".form-control, .form-select")
    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.style.boxShadow = "0 0 25px rgba(0, 212, 255, 0.4)"
        this.style.borderColor = "rgba(255, 0, 110, 0.6)"
      })
  
      input.addEventListener("blur", function () {
        if (!this.classList.contains("is-invalid") && !this.classList.contains("is-valid")) {
          this.style.boxShadow = "none"
          this.style.borderColor = "rgba(0, 212, 255, 0.4)"
        }
      })
    })
  
    // Add typing effect for placeholder text
    function addTypingEffect() {
      const emailInput = document.getElementById("email")
      const originalPlaceholder = emailInput.placeholder
      let currentText = ""
      let isDeleting = false
      let charIndex = 0
  
      function typeEffect() {
        if (!isDeleting && charIndex < originalPlaceholder.length) {
          currentText += originalPlaceholder.charAt(charIndex)
          charIndex++
        } else if (isDeleting && charIndex > 0) {
          currentText = currentText.slice(0, -1)
          charIndex--
        } else {
          isDeleting = !isDeleting
          if (!isDeleting) {
            setTimeout(typeEffect, 2000)
            return
          }
        }
  
        emailInput.placeholder = currentText + (isDeleting ? "" : "|")
        setTimeout(typeEffect, isDeleting ? 50 : 100)
      }
  
      // Only start typing effect if email field is not focused
      if (document.activeElement !== emailInput) {
        setTimeout(typeEffect, 3000)
      }
    }
  
    // Initialize typing effect
    addTypingEffect()
  
 
  
    // Background Music Control
    const backgroundMusic = document.getElementById("backgroundMusic")
    const musicToggle = document.getElementById("musicToggle")
    const musicIcon = musicToggle.querySelector(".music-icon")
    const musicInfo = document.getElementById("musicInfo")
  
    let isMusicPlaying = false
    let userInteracted = false
  
    // Set initial volume
    backgroundMusic.volume = 0.25
  
    // Music control function
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
        musicInfo.classList.remove("show")
        isMusicPlaying = false
      } else {
        backgroundMusic
          .play()
          .then(() => {
            musicToggle.classList.add("playing")
            musicToggle.classList.remove("muted")
            musicIcon.textContent = "🎵"
            musicToggle.title = "Pause Background Music"
            musicInfo.classList.add("show")
            isMusicPlaying = true
  
            // Hide music info after 4 seconds
            setTimeout(() => {
              if (isMusicPlaying) {
                musicInfo.classList.remove("show")
              }
            }, 4000)
          })
          .catch((error) => {
            console.log("Audio play failed:", error)
          })
      }
    }
  
    // Music toggle event listener
    musicToggle.addEventListener("click", toggleMusic)
  
    // Show music info on hover
    musicToggle.addEventListener("mouseenter", () => {
      if (isMusicPlaying) {
        musicInfo.classList.add("show")
      }
    })
  
    musicToggle.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (!musicInfo.matches(":hover")) {
          musicInfo.classList.remove("show")
        }
      }, 500)
    })
  
    // Auto-play music after user interaction (respects browser policies)
    document.addEventListener(
      "click",
      function autoPlayMusic() {
        if (!userInteracted && !isMusicPlaying) {
          userInteracted = true
          // Small delay to make it feel natural
          setTimeout(() => {
            backgroundMusic
              .play()
              .then(() => {
                musicToggle.classList.add("playing")
                musicIcon.textContent = "🎵"
                musicInfo.classList.add("show")
                isMusicPlaying = true
  
                // Show music info for 5 seconds on auto-play
                setTimeout(() => {
                  if (isMusicPlaying) {
                    musicInfo.classList.remove("show")
                  }
                }, 5000)
              })
              .catch(() => {
                // If autoplay fails, user can still manually start it
                console.log("Autoplay prevented by browser")
              })
          }, 1500)
        }
        // Remove this listener after first interaction
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
  

  
    // Music ended event (for non-looping scenarios)
    backgroundMusic.addEventListener("ended", () => {
      musicToggle.classList.remove("playing")
      musicIcon.textContent = "🔄"
      musicToggle.title = "Replay Background Music"
      musicInfo.classList.remove("show")
      isMusicPlaying = false
    })
  
    // Music loading and error handling
    backgroundMusic.addEventListener("loadstart", () => {
      console.log("Loading beautiful music...")
    })
  
    backgroundMusic.addEventListener("canplaythrough", () => {
      console.log("Music ready to play!")
    })
  
      backgroundMusic.addEventListener("error", (e) => {
        console.log("Music loading error:", e)
        musicToggle.style.display = "none"
      })
  })
  