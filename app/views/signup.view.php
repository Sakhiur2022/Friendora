<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friendora - Join the Digital Dreamscape</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/signup.css">


</head>
<body>
    <!-- Animated Background -->
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
        <div class="signup-card">
            <!-- Brand Header -->
            <div class="text-center mb-4">
                <h1 class="brand-title">FRIENDORA</h1>
                <p class="brand-subtitle">Enter the Digital Dreamscape</p>
            </div>

            <!-- Form Header -->
            <div class="mb-4">
                <h2 class="section-title">Join the Network</h2>
                <p class="section-subtitle">Create your digital identity</p>
            </div>

            <?php if ( !empty($errors)): ?>
                <div class="alert alert-danger text-center"><?=implode("<br>", $errors)?></div>
            <?php endif;?>

            <!-- Signup Form -->
            <form id="signupForm" action="<?=ROOT?>/signup" method="post" novalidate>
                <!-- Name Fields -->
                
                <div class="row mb-3">
                    <div class="col-5">
                        <label for="firstName" class="form-label">First Name</label>
                        <input type="text" class="form-control" id="firstName" name="fname" placeholder="Enter first name" required>
                        <div class="invalid-feedback">Please enter your first name.</div>
                    </div>
                    <div class="col-2">
                        <label for="middleInitial" class="form-label">M.I.</label>
                        <input type="text" class="form-control text-center" id="middleInitial" name="minit" placeholder="M" maxlength="1">
                    </div>
                    <div class="col-5">
                        <label for="lastName" class="form-label">Last Name</label>
                        <input type="text" class="form-control" id="lastName" name="lname" placeholder="Enter last name" required>
                        <div class="invalid-feedback">Please enter your last name.</div>
                    </div>
                </div>

                <!-- Email -->
                <div class="mb-3">
                    <label for="email" class="form-label">Email Address</label>
                    <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email address" required>
                    <div class="invalid-feedback">Please enter a valid email address.</div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" id="password" name="pwd" placeholder="Create a secure password" required minlength="8">
                    <div class="invalid-feedback">Password must be at least 8 characters long.</div>
                    <div class="form-text">Password must contain at least 8 characters with letters and numbers.</div>
                </div>

                <!-- Date of Birth -->
                <div class="mb-3">
                    <label for="dateOfBirth" class="form-label">Date of Birth</label>
                    <input type="date" class="form-control" id="dateOfBirth" name="dob" required>
                    <div class="invalid-feedback">Please enter your date of birth.</div>
                </div>

                <!-- Gender -->
                <div class="mb-3">
                    <label for="gender" class="form-label">Gender</label>
                    <select class="form-select" id="gender" name="gender" required>
                        <option value="">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="non-binary">Non-binary</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                    <div class="invalid-feedback">Please select your gender.</div>
                </div>

                <!-- Terms and Conditions -->
                <div class="mb-3">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" id="acceptTerms" name="acceptTerms" required>
                        <label class="form-check-label" for="acceptTerms">
                            I accept the <a href="#" target="_blank">Terms and Conditions</a> and <a href="#" target="_blank">Privacy Policy</a>
                        </label>
                        <div class="invalid-feedback">You must accept the terms and conditions.</div>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="btn btn-cyber" id="submitBtn" disabled>
                    <span id="submitText">Enter Friendora</span>
                    <span style="margin-left: 10px;">→</span>
                </button>
        
            </form>

            <!-- Login Link -->
            <div class="login-link">
                <p>Already have an account? <a href="<?=ROOT?>/login">Sign In</a></p>
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

    <!-- Music Info Display -->
    <div id="musicInfo" class="music-info">
      <div class="music-title">♪ If I Can Stop One Heart From Breaking</div>
      <div class="music-subtitle">Honkai Star Rail OST</div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JavaScript -->
    <script src="<?=ROOT?>/assets/scripts/signup.js"></script>

</body>
</html>
