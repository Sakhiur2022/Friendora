<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friendora - CyberDreamer Profile</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?=ROOT?>assets/styles/profile.css">
</head>
<body>
    <!-- Animated Background -->
    <div class="bg-animation">
        <div class="floating-particles">
            <div class="particle particle-1"></div>
            <div class="particle particle-2"></div>
            <div class="particle particle-3"></div>
            <div class="particle particle-4"></div>
            <div class="particle particle-5"></div>
            <div class="particle particle-6"></div>
            <div class="particle particle-7"></div>
            <div class="particle particle-8"></div>
        </div>
        <div class="energy-waves">
            <div class="wave wave-1"></div>
            <div class="wave wave-2"></div>
            <div class="wave wave-3"></div>
        </div>
        <div class="digital-grid"></div>
    </div>

    <!-- Top Navbar -->
    <nav class="navbar navbar-expand-lg cyber-navbar">
        <div class="container-fluid">
            <!-- Logo -->
            <a class="navbar-brand" href="<?=ROOT?>dashboard">
                <div class="logo-container">
                    <span class="logo-text">FRIENDORA</span>
                    <div class="logo-glow"></div>
                </div>
            </a>

            <!-- Mobile Toggle -->
            <button class="navbar-toggler cyber-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navigation Links -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="<?=ROOT?>dashboard">
                            <span class="nav-icon">🏠</span>
                            <span class="nav-text">Home</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-section="friends">
                            <span class="nav-icon">👥</span>
                            <span class="nav-text">Friends</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-section="messages">
                            <span class="nav-icon">💬</span>
                            <span class="nav-text">Messages</span>
                            <span class="notification-badge">3</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="<?=ROOT?>profile">
                            <span class="nav-icon">👤</span>
                            <span class="nav-text">Profile</span>
                        </a>
                    </li>
                </ul>

                <!-- User Profile Dropdown -->
                <div class="navbar-nav">
                    <div class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle user-profile" href="#" role="button" data-bs-toggle="dropdown">
                            <div class="profile-avatar">
                                <img src="/placeholder.svg?height=32&width=32" alt="Profile" class="avatar-img">
                                <div class="status-indicator online"></div>
                            </div>
                            <span class="username">CyberDreamer</span>
                        </a>
                        <ul class="dropdown-menu cyber-dropdown">
                            <li><a class="dropdown-item" href="<?=ROOT?>profile">View Profile</a></li>
                            <li><a class="dropdown-item" href="#">Settings</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="login.html">Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="main-container">
        <!-- Profile Header -->
        <div class="profile-header">
            <!-- Cover Photo -->
            <div class="cover-photo">
                <img src="/placeholder.svg?height=300&width=1200" alt="Cover Photo" class="cover-img">
                <div class="cover-overlay">
                    <div class="cover-effects">
                        <div class="effect-particle"></div>
                        <div class="effect-particle"></div>
                        <div class="effect-particle"></div>
                        <div class="effect-particle"></div>
                    </div>
                </div>
                <button class="btn-change-cover" title="Change Cover Photo">
                    <span class="cover-icon">📷</span>
                </button>
            </div>

            <!-- Profile Info -->
            <div class="profile-info">
                <div class="profile-main">
                    <!-- Profile Picture -->
                    <div class="profile-picture-container">
                        <div class="profile-picture">
                            <img src="/placeholder.svg?height=150&width=150" alt="Profile Picture" class="profile-img">
                            <div class="profile-ring"></div>
                            <div class="status-indicator online"></div>
                            <button class="btn-change-avatar" title="Change Profile Picture">
                                <span class="avatar-icon">📷</span>
                            </button>
                        </div>
                        <div class="profile-glow"></div>
                    </div>

                    <!-- User Details -->
                    <div class="user-details">
                        <h1 class="profile-name">
                            <span class="name-text">CyberDreamer</span>
                            <span class="verified-badge" title="Verified User">✓</span>
                        </h1>
                        <p class="profile-username">@cyberdreamer_2077</p>
                        <p class="profile-bio">
                            Digital architect crafting dreams in the cyber realm 🌌<br>
                            Exploring the intersection of reality and virtuality ⚡<br>
                            <span class="bio-highlight">"In the matrix of possibilities, I choose to create."</span>
                        </p>
                        
                        <!-- Profile Stats -->
                        <div class="profile-stats">
                            <div class="stat-item">
                                <span class="stat-number">1,337</span>
                                <span class="stat-label">Posts</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">42.7K</span>
                                <span class="stat-label">Friends</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">∞</span>
                                <span class="stat-label">Dreams</span>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="profile-actions">
                            <button class="btn-edit-profile">
                                <span class="btn-icon">✏️</span>
                                <span class="btn-text">Edit Profile</span>
                                <div class="btn-glow"></div>
                            </button>
                            <button class="btn-share-profile">
                                <span class="btn-icon">🔗</span>
                                <span class="btn-text">Share</span>
                            </button>
                            <button class="btn-more-options">
                                <span class="btn-icon">⋯</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Profile Navigation Tabs -->
        <div class="profile-tabs">
            <div class="tabs-container">
                <button class="tab-btn active" data-tab="posts">
                    <span class="tab-icon">📝</span>
                    <span class="tab-text">Posts</span>
                    <div class="tab-indicator"></div>
                </button>
                <button class="tab-btn" data-tab="friends">
                    <span class="tab-icon">👥</span>
                    <span class="tab-text">Friends</span>
                    <div class="tab-indicator"></div>
                </button>
                <button class="tab-btn" data-tab="about">
                    <span class="tab-icon">ℹ️</span>
                    <span class="tab-text">About</span>
                    <div class="tab-indicator"></div>
                </button>
                <button class="tab-btn" data-tab="media">
                    <span class="tab-icon">🖼️</span>
                    <span class="tab-text">Media</span>
                    <div class="tab-indicator"></div>
                </button>
            </div>
        </div>

        <!-- Profile Content -->
        <div class="profile-content">
            <!-- Posts Tab -->
            <div class="tab-content active" id="posts-tab">
                <div class="posts-grid">
                    <!-- Post 1 -->
                    <article class="profile-post">
                        <div class="post-header">
                            <div class="post-timestamp">2 hours ago</div>
                            <button class="post-menu">⋯</button>
                        </div>
                        <div class="post-content">
                            <p>Just finished creating a new digital landscape! The neon reflections in the virtual water are absolutely mesmerizing 🌊✨</p>
                            <div class="post-image">
                                <img src="/placeholder.svg?height=250&width=400" alt="Digital Landscape" class="post-img">
                                <div class="image-overlay">
                                    <span class="overlay-text">Digital Serenity v2.0</span>
                                </div>
                            </div>
                        </div>
                        <div class="post-interactions">
                            <button class="interaction-btn like-btn">
                                <span class="btn-icon">❤️</span>
                                <span class="btn-count">127</span>
                            </button>
                            <button class="interaction-btn comment-btn">
                                <span class="btn-icon">💬</span>
                                <span class="btn-count">23</span>
                            </button>
                            <button class="interaction-btn share-btn">
                                <span class="btn-icon">🔄</span>
                                <span class="btn-count">8</span>
                            </button>
                        </div>
                    </article>

                    <!-- Post 2 -->
                    <article class="profile-post">
                        <div class="post-header">
                            <div class="post-timestamp">1 day ago</div>
                            <button class="post-menu">⋯</button>
                        </div>
                        <div class="post-content">
                            <p>Experimenting with quantum algorithms today. The possibilities are truly infinite when you think in multiple dimensions! 🧠⚡</p>
                            <div class="post-tags">
                                <span class="tag">#QuantumComputing</span>
                                <span class="tag">#AI</span>
                                <span class="tag">#Innovation</span>
                            </div>
                        </div>
                        <div class="post-interactions">
                            <button class="interaction-btn like-btn liked">
                                <span class="btn-icon">❤️</span>
                                <span class="btn-count">89</span>
                            </button>
                            <button class="interaction-btn comment-btn">
                                <span class="btn-icon">💬</span>
                                <span class="btn-count">15</span>
                            </button>
                            <button class="interaction-btn share-btn">
                                <span class="btn-icon">🔄</span>
                                <span class="btn-count">12</span>
                            </button>
                        </div>
                    </article>

                    <!-- Post 3 -->
                    <article class="profile-post">
                        <div class="post-header">
                            <div class="post-timestamp">3 days ago</div>
                            <button class="post-menu">⋯</button>
                        </div>
                        <div class="post-content">
                            <p>Virtual reality meetup was incredible! Met so many amazing creators from around the digital world. The future of social interaction is here! 🥽🌐</p>
                        </div>
                        <div class="post-interactions">
                            <button class="interaction-btn like-btn">
                                <span class="btn-icon">❤️</span>
                                <span class="btn-count">156</span>
                            </button>
                            <button class="interaction-btn comment-btn">
                                <span class="btn-icon">💬</span>
                                <span class="btn-count">34</span>
                            </button>
                            <button class="interaction-btn share-btn">
                                <span class="btn-icon">🔄</span>
                                <span class="btn-count">19</span>
                            </button>
                        </div>
                    </article>
                </div>
            </div>

            <!-- Friends Tab -->
            <div class="tab-content" id="friends-tab">
                <div class="friends-grid">
                    <div class="friend-card">
                        <img src="/placeholder.svg?height=80&width=80" alt="NeonRunner" class="friend-avatar">
                        <h4 class="friend-name">NeonRunner_2077</h4>
                        <p class="friend-status">Digital Explorer</p>
                        <button class="btn-message-friend">Message</button>
                    </div>
                    <div class="friend-card">
                        <img src="/placeholder.svg?height=80&width=80" alt="CyberMage" class="friend-avatar">
                        <h4 class="friend-name">CyberMage_X</h4>
                        <p class="friend-status">Virtual Artist</p>
                        <button class="btn-message-friend">Message</button>
                    </div>
                    <div class="friend-card">
                        <img src="/placeholder.svg?height=80&width=80" alt="QuantumHacker" class="friend-avatar">
                        <h4 class="friend-name">QuantumHacker</h4>
                        <p class="friend-status">Code Architect</p>
                        <button class="btn-message-friend">Message</button>
                    </div>
                    <div class="friend-card">
                        <img src="/placeholder.svg?height=80&width=80" alt="DataMiner" class="friend-avatar">
                        <h4 class="friend-name">DataMiner_99</h4>
                        <p class="friend-status">Information Seeker</p>
                        <button class="btn-message-friend">Message</button>
                    </div>
                </div>
            </div>

            <!-- About Tab -->
            <div class="tab-content" id="about-tab">
                <div class="about-sections">
                    <div class="about-section">
                        <h3 class="section-title">Digital Identity</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <span class="info-label">Joined</span>
                                <span class="info-value">January 2077</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Location</span>
                                <span class="info-value">Neo-Tokyo, Cyberspace</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Occupation</span>
                                <span class="info-value">Digital Architect</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Interests</span>
                                <span class="info-value">VR, AI, Quantum Computing</span>
                            </div>
                        </div>
                    </div>

                    <div class="about-section">
                        <h3 class="section-title">Achievements</h3>
                        <div class="achievements-grid">
                            <div class="achievement-badge">
                                <span class="badge-icon">🏆</span>
                                <span class="badge-text">Digital Pioneer</span>
                            </div>
                            <div class="achievement-badge">
                                <span class="badge-icon">⚡</span>
                                <span class="badge-text">Code Master</span>
                            </div>
                            <div class="achievement-badge">
                                <span class="badge-icon">🌟</span>
                                <span class="badge-text">Community Leader</span>
                            </div>
                            <div class="achievement-badge">
                                <span class="badge-icon">🚀</span>
                                <span class="badge-text">Innovation Expert</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Media Tab -->
            <div class="tab-content" id="media-tab">
                <div class="media-grid">
                    <div class="media-item">
                        <img src="/placeholder.svg?height=200&width=200" alt="Media 1" class="media-img">
                        <div class="media-overlay">
                            <button class="media-play-btn">▶️</button>
                        </div>
                    </div>
                    <div class="media-item">
                        <img src="/placeholder.svg?height=200&width=200" alt="Media 2" class="media-img">
                        <div class="media-overlay">
                            <button class="media-play-btn">🖼️</button>
                        </div>
                    </div>
                    <div class="media-item">
                        <img src="/placeholder.svg?height=200&width=200" alt="Media 3" class="media-img">
                        <div class="media-overlay">
                            <button class="media-play-btn">▶️</button>
                        </div>
                    </div>
                    <div class="media-item">
                        <img src="/placeholder.svg?height=200&width=200" alt="Media 4" class="media-img">
                        <div class="media-overlay">
                            <button class="media-play-btn">🖼️</button>
                        </div>
                    </div>
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
    <script src="<?=ROOT?>assets/scripts/profile.js"></script>
</body>
</html>
