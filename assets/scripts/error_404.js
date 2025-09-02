class Error404Page {
  constructor() {
    this.particles = [];
    this.backgroundMusic = null;
    this.isMusicPlaying = false;
    if (document.body.classList.contains("error-404")) {
      this.init();
    }
  }

  init() {
    this.createParticles();
    this.setupMusicControl();
    this.addInteractiveEffects();
    this.startAnimations();
    this.setupPage();
  }

  setupPage() {
    this.createFloatingElements();
    this.createCyberGrid();
    this.addGlitchEffects();
    this.setupKeyboardShortcuts();
  }

  createParticles() {
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createParticle();
      }, i * 100);
    }
  }

  createParticle() {
    const particle = document.createElement("div");
    particle.className = "particle";

    particle.style.left = Math.random() * window.innerWidth + "px";
    particle.style.top = Math.random() * window.innerHeight + "px";
    particle.style.animationDuration = Math.random() * 5 + 3 + "s";
    particle.style.animationDelay = Math.random() * 2 + "s";

    document.body.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
        this.createParticle();
      }
    }, 8000);
  }

  createFloatingElements() {
    const shapes = [
      { type: "circle", class: "floating-element circle" },
      { type: "triangle", class: "floating-element triangle" },
      { type: "square", class: "floating-element square" },
    ];

    shapes.forEach((shape, index) => {
      const element = document.createElement("div");
      element.className = shape.class;
      element.style.animationDelay = index * 2 + "s";
      document.body.appendChild(element);
    });
  }

  createCyberGrid() {
    const grid = document.createElement("div");
    grid.className = "cyber-grid";
    document.body.appendChild(grid);
  }

  setupMusicControl() {
    const musicControl = document.createElement("div");
    musicControl.className = "music-control";
    musicControl.innerHTML = `
            <button class="music-toggle" id="musicToggle" title="Toggle Background Music">
                <i class="bi bi-music-note"></i>
            </button>
        `;
    document.body.appendChild(musicControl);

    const audio = document.createElement("audio");
    audio.id = "bgMusic";
    audio.loop = true;
    audio.volume = 0.3;
    audio.preload = "auto";

    const sources = [
      {
        src: "/friendora/assets/musics/cyberpunk-ambient.mp3",
        type: "audio/mpeg",
      },
      {
        src: "/friendora/assets/musics/cyberpunk-ambient.ogg",
        type: "audio/ogg",
      },
    ];

    sources.forEach((source) => {
      const sourceElement = document.createElement("source");
      sourceElement.src = source.src;
      sourceElement.type = source.type;
      audio.appendChild(sourceElement);
    });

    document.body.appendChild(audio);
    this.backgroundMusic = audio;

    const musicToggle = document.getElementById("musicToggle");
    if (musicToggle) {
      musicToggle.addEventListener("click", () => this.toggleBackgroundMusic());
    }
  }

  toggleBackgroundMusic() {
    const musicToggle = document.getElementById("musicToggle");
    const musicIcon = musicToggle.querySelector("i");

    if (this.isMusicPlaying) {
      this.backgroundMusic.pause();
      musicIcon.className = "bi bi-music-note";
      this.isMusicPlaying = false;
    } else {
      const playPromise = this.backgroundMusic.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            musicIcon.className = "bi bi-music-note-beamed";
            this.isMusicPlaying = true;
          })
          .catch(() => {
            console.log("Music can't be played");
          });
      }
    }
  }

  addInteractiveEffects() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("cyber-btn")) {
        this.createClickRipple(e);
      }
    });

    document.addEventListener("mousemove", (e) => {
      this.createCursorTrail(e);
    });

    const errorCode = document.querySelector(".error-code");
    if (errorCode) {
      errorCode.addEventListener("mouseenter", () => {
        this.intensifyGlitch();
      });

      errorCode.addEventListener("mouseleave", () => {
        this.normalizeGlitch();
      });
    }
  }

  createClickRipple(e) {
    const ripple = document.createElement("div");
    ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(0, 212, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            left: ${e.clientX - 10}px;
            top: ${e.clientY - 10}px;
            pointer-events: none;
            z-index: 9999;
        `;

    document.body.appendChild(ripple);

    ripple.animate(
      [
        { transform: "scale(0)", opacity: 1 },
        { transform: "scale(4)", opacity: 0 },
      ],
      {
        duration: 600,
        easing: "ease-out",
      }
    ).onfinish = () => {
      ripple.remove();
    };
  }

  createCursorTrail(e) {
    const trail = document.createElement("div");
    trail.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--cyber-primary);
            border-radius: 50%;
            left: ${e.clientX - 3}px;
            top: ${e.clientY - 3}px;
            pointer-events: none;
            z-index: 9998;
            box-shadow: 0 0 10px var(--cyber-primary);
            opacity: 0.8;
        `;

    document.body.appendChild(trail);

    setTimeout(() => {
      trail.style.transition = "opacity 0.5s ease-out";
      trail.style.opacity = "0";
      setTimeout(() => trail.remove(), 500);
    }, 50);
  }

  intensifyGlitch() {
    const errorCode = document.querySelector(".error-code");
    if (errorCode) {
      errorCode.style.animationDuration = "0.5s";
    }
  }

  normalizeGlitch() {
    const errorCode = document.querySelector(".error-code");
    if (errorCode) {
      errorCode.style.animationDuration = "3s";
    }
  }

  addGlitchEffects() {
    setInterval(() => {
      this.randomTextGlitch();
    }, 5000);
  }

  randomTextGlitch() {
    const glitchElements = document.querySelectorAll(
      ".error-title, .error-subtitle"
    );
    const randomElement =
      glitchElements[Math.floor(Math.random() * glitchElements.length)];

    if (randomElement) {
      const originalText = randomElement.textContent;
      const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
      let glitchedText = "";

      for (let i = 0; i < originalText.length; i++) {
        if (Math.random() < 0.1) {
          glitchedText +=
            glitchChars[Math.floor(Math.random() * glitchChars.length)];
        } else {
          glitchedText += originalText[i];
        }
      }

      randomElement.textContent = glitchedText;

      setTimeout(() => {
        randomElement.textContent = originalText;
      }, 100);
    }
  }

  setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
      switch (e.key.toLowerCase()) {
        case "m":
          this.toggleBackgroundMusic();
          break;
        case "escape":
          window.history.back();
          break;
        case "h":
          window.location.href = "<?=ROOT?>/";
          break;
      }
    });
  }

  startAnimations() {
    this.pulseBackground();

    setInterval(() => {
      if (document.querySelectorAll(".particle").length < 30) {
        this.createParticle();
      }
    }, 200);
  }

  pulseBackground() {
    let hue = 0;
    setInterval(() => {
      hue = (hue + 1) % 360;
      document.documentElement.style.setProperty(
        "--cyber-primary-hsl",
        `hsl(${hue}, 100%, 50%)`
      );
    }, 100);
  }
}

// Initialize 404 page if on error page
let error404Page;
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    error404Page = new Error404Page();
  });
} else {
  error404Page = new Error404Page();
}
