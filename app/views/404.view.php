<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" type="image/svg+xml" href="<?=ROOT?>/assets/images/favicon.svg">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404 - Page Not Found | Friendora</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/nav_404.css">
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/404.css">
  
</head>
<body class="error-404">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top cyber-nav">
        <div class="container-fluid">
            <a class="navbar-brand cyber-logo" href="<?=ROOT?>/">
                <i class="bi bi-shield-shaded me-2"></i>
                <span class="logo-text">Friendora</span>
            </a>
            
            <div class="navbar-nav ms-auto">
                <a class="nav-link cyber-nav-icon" href="<?=ROOT?>/" title="Home">
                    <i class="bi bi-house-door"></i>
                </a>
            </div>
        </div>
    </nav>

    <!-- 404 Error Container -->
    <div class="error-container">
        <div class="error-code">404</div>
        
        <h1 class="error-title">Sorry, page not found</h1>
        
        <p class="error-subtitle">
            The page you're looking for seems to have vanished into the digital void. 
            Let's get you back to exploring the Friendora universe.
        </p>
        
        <div class="error-actions">
            <a href="<?=ROOT?>/" class="cyber-btn primary">
                <i class="bi bi-house-door me-2"></i>
                Go Home
            </a>
            <a href="javascript:history.back()" class="cyber-btn">
                <i class="bi bi-arrow-left me-2"></i>
                Go Back
            </a>
            <a href="<?=ROOT?>/dashboard" class="cyber-btn">
                <i class="bi bi-speedometer2 me-2"></i>
                Dashboard
            </a>
        </div>
    </div>

    <!-- Background Music -->
    <audio id="bgMusic" loop preload="auto" style="display: none;">
        <source src="<?=ROOT?>/assets/audio/cyberpunk-ambient.mp3" type="audio/mpeg">
        <source src="<?=ROOT?>/assets/audio/cyberpunk-ambient.ogg" type="audio/ogg">
        Your browser does not support the audio element.
    </audio>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Navigation JavaScript -->
    <script src="<?=ROOT?>/assets/scripts/nav_error_404.js"></script>
    
    <!-- Main JavaScript -->
    <script src="<?=ROOT?>/assets/scripts/error_404.js"></script>
</body>
</html>