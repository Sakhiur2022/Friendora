<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friendora - Welcome Back to the Dreamscape</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?=ROOT?>assets/styles/login.css">
</head>
<body>
    <!-- Animated Background -->
    <div class="bg-animation">
        <!-- Floating Particles -->
        <div class="particles-container">
            <div class="particle particle-1"></div>
            <div class="particle particle-2"></div>
            <div class="particle particle-3"></div>
            <div class="particle particle-4"></div>
            <div class="particle particle-5"></div>
            <div class="particle particle-6"></div>
            <div class="particle particle-7"></div>
            <div class="particle particle-8"></div>
        </div>
        
        <!-- Floating Orbs -->
        <div class="floating-orb orb-1"></div>
        <div class="floating-orb orb-2"></div>
        <div class="floating-orb orb-3"></div>
        <div class="floating-orb orb-4"></div>
        <div class="floating-orb orb-5"></div>
        
        <!-- Geometric Shapes -->
        <div class="geometric-ring ring-1"></div>
        <div class="geometric-ring ring-2"></div>
        <div class="geometric-ring ring-3"></div>
        
        <!-- Animated Lines -->
        <div class="animated-lines">
            <div class="line line-1"></div>
            <div class="line line-2"></div>
            <div class="line line-3"></div>
            <div class="line line-4"></div>
        </div>
        
        Holographic Grid
        <div class="holo-grid"></div>
    </div>

    <!-- Main Content -->
    <div class="main-container">
        <div class="login-card">
       
            <!-- Brand Header -->
            <div class="text-center mb-4">
                <div class="logo-container">
                    <div class="logo-glow"></div>
                    <h1 class="brand-title">FRIENDORA</h1>
                    <div class="logo-underline"></div>
                </div>
                <p class="brand-subtitle">
                    <span class="typing-text">Welcome back to the Digital Dreamscape</span>
                    <span class="cursor">|</span>
                </p>
            </div>

            <!-- Form Header -->
            <div class="mb-4 text-center">
                <h2 class="section-title">
                    <span class="glitch-text" data-text="Access Portal">Access Portal</span>
                </h2>
                <p class="section-subtitle">Enter your credentials to continue your journey</p>
            </div>

            <!-- Login Form -->
            <form id="loginForm" action = "<?=ROOT?>dashboard/" novalidate>
                <!-- Email Field -->
                <div class="mb-4">
                    <label for="email" class="form-label">
                        <span class="label-icon">📧</span>
                        Email Address
                    </label>
                    <div class="input-container">
                        <input type="email" class="form-control cyber-input" id="email" name="email" 
                               placeholder="Enter your email address" required>
                        <div class="input-glow"></div>
                        <div class="input-particles">
                            <span class="input-particle"></span>
                            <span class="input-particle"></span>
                            <span class="input-particle"></span>
                        </div>
                    </div>
                    <div class="invalid-feedback">Please enter a valid email address.</div>
                </div>

                <!-- Password Field -->
                <div class="mb-4">
                    <label for="password" class="form-label">
                        <span class="label-icon">🔐</span>
                        Password
                    </label>
                    <div class="input-container">
                        <input type="password" class="form-control cyber-input" id="password" name="password" 
                               placeholder="Enter your password" required>
                        <button type="button" class="password-toggle" id="passwordToggle">
                            <span class="toggle-icon">👁️</span>
                        </button>
                        <div class="input-glow"></div>
                        <div class="input-particles">
                            <span class="input-particle"></span>
                            <span class="input-particle"></span>
                            <span class="input-particle"></span>
                        </div>
                    </div>
                    <div class="invalid-feedback">Please enter your password.</div>
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div class="form-check">
                        <input class="form-check-input cyber-checkbox" type="checkbox" id="rememberMe" name="rememberMe">
                        <label class="form-check-label" for="rememberMe">
                            Remember me
                        </label>
                    </div>
                    <a href="#" class="forgot-password">Forgot Password?</a>
                </div>

                <!-- Login Button -->
                <button type="submit" class="btn btn-cyber-login" id="loginBtn">
                    <span class="btn-content">
                        <span class="btn-text" id="btnText">Enter Dreamscape</span>
                        <span class="btn-icon">→</span>
                    </span>
                    <div class="btn-particles">
                        <span class="btn-particle"></span>
                        <span class="btn-particle"></span>
                        <span class="btn-particle"></span>
                        <span class="btn-particle"></span>
                    </div>
                </button>

            
            </form>

            <!-- Signup Link -->
            <div class="signup-link">
                <p>New to Friendora? <a href="<?=ROOT?>signup">Create Account</a></p>
            </div>
        </div>

        <!-- Floating Status Indicators -->
        <div class="status-indicators">
            <div class="status-item">
                <div class="status-dot online"></div>
                <span>Network Online</span>
            </div>
            <div class="status-item">
                <div class="status-dot secure"></div>
                <span>Secure Connection</span>
            </div>
            <div class="status-item">
                <div class="status-dot active"></div>
                <span>Portal Active</span>
            </div>
        </div>
    </div>

    <!-- Success Modal -->
    <div class="modal-overlay" id="loginModal">
        <div class="login-success-modal">
            <div class="modal-glow"></div>
            <div class="success-content">
                <div class="success-icon">
                    <div class="portal-ring"></div>
                    <div class="portal-center">
                        <span class="portal-text">✓</span>
                    </div>
                </div>
                <h2 class="success-title">Access Granted!</h2>
                <p class="success-message">
                    <span class="welcome-text">Welcome back, <span id="welcomeUser">Dreamer</span>!</span><br>
                    Initializing your digital presence...<br>
                    <span class="loading-text">Loading dashboard...</span>
                </p>
                <div class="loading-bar">
                    <div class="loading-progress"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Background Music -->
    <audio id="backgroundMusic" loop preload="auto" crossorigin="anonymous">
      <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/If%20I%20Can%20Stop%20One%20Heart%20From%20Breaking-04DqdlDYlMvwaGCXysdGY7BjBEZkP1.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>

    <!-- Music Control Button -->
    <button id="musicToggle" class="music-control" title="Toggle Background Music">
      <span class="music-icon">🎵</span>
      <div class="music-visualizer">
        <div class="bar bar1"></div>
        <div class="bar bar2"></div>
        <div class="bar bar3"></div>
        <div class="bar bar4"></div>
      </div>
    </button>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JavaScript -->
    <script src="<?=ROOT?>assets/scripts/login.js"></script>
</body>
</html>
