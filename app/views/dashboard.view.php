<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" type="image/svg+xml" href="<?=ROOT?>/assets/images/favicon.svg">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Friendora - Dashboard</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/nav.css">
    <link rel="stylesheet" href="<?=ROOT?>/assets/styles/dashboard.css">
</head>
<body>
    <!-- Fixed Top Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top glass-navbar">
        <div class="container-fluid">
            <!-- Logo -->
            <a class="navbar-brand fw-bold text-primary" href="#">
                <span class="logo-text">FRIENDORA</span>
            </a>

            <!-- Mobile Toggle -->
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navigation Links -->
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link active" href="<?=ROOT?>dashboard">
                            <i class="bi bi-house-fill me-2"></i>Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#friends">
                            <i class="bi bi-people-fill me-2"></i>Friends
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link position-relative" href="#messages">
                            <i class="bi bi-chat-dots-fill me-2"></i>Messages
                            <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                3
                            </span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#groups">
                            <i class="bi bi-collection-fill me-2"></i>Groups
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="<?=ROOT?>profile">
                            <i class="bi bi-person-fill me-2"></i>Profile
                        </a>
                    </li>
                </ul>

                <!-- User Profile Dropdown -->
                <div class="dropdown">
                    <a class="btn glass-btn dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown">
                        <img src="/placeholder.svg?height=32&width=32" alt="Profile" class="rounded-circle me-2" width="32" height="32">
                        <span class="d-none d-md-inline">CyberDreamer</span>
                    </a>
                    <ul class="dropdown-menu glass-dropdown">
                        <li><a class="dropdown-item" href="<?=ROOT?>profile"><i class="bi bi-person me-2"></i>View Profile</a></li>
                        <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Settings</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="<?=ROOT?>home"><i class="bi bi-box-arrow-right me-2"></i>Logout</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="container-fluid mt-5 pt-3">
        <div class="row">
            <!-- Left Sidebar -->
            <div class="col-lg-3 col-md-4 d-none d-md-block">
                <div class="glass-card sticky-top" style="top: 80px;">
                    <div class="card-body">
                        <h5 class="card-title text-primary mb-4">
                            <i class="bi bi-compass me-2"></i>Navigation
                        </h5>
                        <div class="list-group list-group-flush">
                            <a href="#newsfeed" class="list-group-item list-group-item-action glass-list-item active">
                                <i class="bi bi-newspaper me-3"></i>News Feed
                            </a>
                            <a href="#search" class="list-group-item list-group-item-action glass-list-item">
                                <i class="bi bi-search me-3"></i>Search Users
                            </a>
                            <a href="#requests" class="list-group-item list-group-item-action glass-list-item">
                                <i class="bi bi-person-plus me-3"></i>Friend Requests
                                <span class="badge bg-danger rounded-pill float-end">5</span>
                            </a>
                            <a href="#mygroups" class="list-group-item list-group-item-action glass-list-item">
                                <i class="bi bi-collection me-3"></i>My Groups
                            </a>
                            <a href="#settings" class="list-group-item list-group-item-action glass-list-item">
                                <i class="bi bi-gear me-3"></i>Settings
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Feed Area -->
            <div class="col-lg-6 col-md-8"> 
                <!-- Search Bar -->
                <div class="glass-card mb-4">
                    <div class="card-body">
                        <form method="GET" action="search.php">
                            <div class="input-group">
                                <span class="input-group-text glass-input-group">
                                    <i class="bi bi-search"></i>
                                </span>
                                <input type="text" class="form-control glass-input" name="search" placeholder="Search users, groups, or posts..." value="<?= htmlspecialchars($_GET['search'] ?? '') ?>">
                                <button class="btn btn-primary" type="submit">Search</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Create Post Form -->
                <div class="glass-card mb-4">
                    <div class="card-body">
                        <h5 class="card-title text-primary mb-3">
                            <i class="bi bi-pencil-square me-2"></i>Create Post
                        </h5>
                        <form method="POST" action="create_post.php" enctype="multipart/form-data">
                            <div class="d-flex mb-3">
                                <img src="/placeholder.svg?height=40&width=40" alt="Your Avatar" class="rounded-circle me-3" width="40" height="40">
                                <div class="flex-grow-1">
                                    <textarea class="form-control glass-input" name="post_content" rows="3" placeholder="What's happening in the digital realm?" required><?= htmlspecialchars($_POST['post_content'] ?? '') ?></textarea>
                                </div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group" role="group">
                                    <input type="file" class="d-none" id="imageUpload" name="post_image" accept="image/*">
                                    <label for="imageUpload" class="btn glass-btn btn-sm">
                                        <i class="bi bi-image"></i>
                                    </label>
                                    <button type="button" class="btn glass-btn btn-sm">
                                        <i class="bi bi-camera-video"></i>
                                    </button>
                                    <button type="button" class="btn glass-btn btn-sm">
                                        <i class="bi bi-geo-alt"></i>
                                    </button>
                                    <button type="button" class="btn glass-btn btn-sm">
                                        <i class="bi bi-emoji-smile"></i>
                                    </button>
                                </div>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-send me-2"></i>Share to Network
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Posts Feed -->
                <div id="posts-feed">
                    <!-- PHP Loop for Posts -->
                    <?php foreach ($posts as $post): ?>
                    <div class="glass-card mb-4">
                        <div class="card-body">
                            <!-- Post Header -->
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="d-flex">
                                    <img src="<?= htmlspecialchars($post['avatar'] ?? '/placeholder.svg?height=40&width=40') ?>" alt="<?= htmlspecialchars($post['username']) ?>" class="rounded-circle me-3" width="40" height="40">
                                    <div>
                                        <h6 class="mb-0 text-primary"><?= htmlspecialchars($post['username']) ?></h6>
                                        <small class="text-muted"><?= date('M j, Y \a\t g:i A', strtotime($post['created_at'])) ?></small>
                                    </div>
                                </div>
                                <div class="dropdown">
                                    <button class="btn glass-btn btn-sm" data-bs-toggle="dropdown">
                                        <i class="bi bi-three-dots"></i>
                                    </button>
                                    <ul class="dropdown-menu glass-dropdown">
                                        <li><a class="dropdown-item" href="#"><i class="bi bi-bookmark me-2"></i>Save Post</a></li>
                                        <li><a class="dropdown-item" href="#"><i class="bi bi-flag me-2"></i>Report</a></li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Post Content -->
                            <div class="mb-3">
                                <p class="mb-2"><?= nl2br(htmlspecialchars($post['content'])) ?></p>
                                <?php if (!empty($post['image'])): ?>
                                <div class="post-image mb-3">
                                    <img src="<?= htmlspecialchars($post['image']) ?>" alt="Post Image" class="img-fluid rounded-3">
                                </div>
                                <?php endif; ?>
                            </div>

                            <!-- Post Stats -->
                            <div class="d-flex justify-content-between align-items-center mb-3 text-muted small">
                                <span><?= $post['likes_count'] ?> likes</span>
                                <span><?= $post['comments_count'] ?> comments</span>
                                <span><?= $post['shares_count'] ?> shares</span>
                            </div>

                            <!-- Post Actions -->
                            <div class="d-flex justify-content-around border-top pt-3">
                                <button class="btn glass-btn flex-fill me-2 <?= $post['user_liked'] ? 'text-danger' : '' ?>">
                                    <i class="bi bi-heart<?= $post['user_liked'] ? '-fill' : '' ?> me-2"></i>Like
                                </button>
                                <button class="btn glass-btn flex-fill me-2">
                                    <i class="bi bi-chat me-2"></i>Comment
                                </button>
                                <button class="btn glass-btn flex-fill">
                                    <i class="bi bi-share me-2"></i>Share
                                </button>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <!-- Right Sidebar -->
            <div class="col-lg-3 d-none d-lg-block">
                <!-- Messages Preview -->
                <div class="glass-card mb-4">
                    <div class="card-body">
                        <h5 class="card-title text-primary mb-3">
                            <i class="bi bi-chat-dots me-2"></i>Recent Messages
                        </h5>
                        <?php foreach (array_slice($messages, 0, 3) as $message): ?>
                        <div class="d-flex align-items-center mb-3">
                            <div class="position-relative">
                                <img src="<?= htmlspecialchars($message['avatar'] ?? '/placeholder.svg?height=32&width=32') ?>" alt="<?= htmlspecialchars($message['username']) ?>" class="rounded-circle me-3" width="32" height="32">
                                <span class="position-absolute bottom-0 end-0 bg-<?= $message['status'] === 'online' ? 'success' : 'secondary' ?> rounded-circle" style="width: 10px; height: 10px;"></span>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-0 small"><?= htmlspecialchars($message['username']) ?></h6>
                                <p class="mb-0 text-muted small text-truncate"><?= htmlspecialchars($message['last_message']) ?></p>
                            </div>
                            <small class="text-muted"><?= date('g:i A', strtotime($message['timestamp'])) ?></small>
                        </div>
                        <?php endforeach; ?>
                        <a href="#messages" class="btn glass-btn btn-sm w-100">View All Messages</a>
                    </div>
                </div>

                <!-- Friends Section -->
                <div class="glass-card mb-4">
                    <div class="card-body">
                        <h5 class="card-title text-primary mb-3">
                            <i class="bi bi-people me-2"></i>Friends Online
                        </h5>
                        <?php foreach ($online_friends as $friend): ?>
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <div class="d-flex align-items-center">
                                <div class="position-relative">
                                    <img src="<?= htmlspecialchars($friend['avatar'] ?? '/placeholder.svg?height=32&width=32') ?>" alt="<?= htmlspecialchars($friend['username']) ?>" class="rounded-circle me-3" width="32" height="32">
                                    <span class="position-absolute bottom-0 end-0 bg-success rounded-circle" style="width: 10px; height: 10px;"></span>
                                </div>
                                <div>
                                    <h6 class="mb-0 small"><?= htmlspecialchars($friend['username']) ?></h6>
                                    <small class="text-muted"><?= htmlspecialchars($friend['status_text'] ?? 'Online') ?></small>
                                </div>
                            </div>
                            <button class="btn glass-btn btn-sm">
                                <i class="bi bi-chat"></i>
                            </button>
                        </div>
                        <?php endforeach; ?>
                        <a href="#friends" class="btn glass-btn btn-sm w-100">View All Friends</a>
                    </div>
                </div>

                <!-- Groups Section -->
                <div class="glass-card mb-4">
                    <div class="card-body">
                        <h5 class="card-title text-primary mb-3">
                            <i class="bi bi-collection me-2"></i>My Groups
                        </h5>
                        <?php foreach ($user_groups as $group): ?>
                        <div class="d-flex align-items-center justify-content-between mb-3">
                            <div class="d-flex align-items-center">
                                <img src="<?= htmlspecialchars($group['avatar'] ?? '/placeholder.svg?height=32&width=32') ?>" alt="<?= htmlspecialchars($group['name']) ?>" class="rounded-circle me-3" width="32" height="32">
                                <div>
                                    <h6 class="mb-0 small"><?= htmlspecialchars($group['name']) ?></h6>
                                    <small class="text-muted"><?= $group['member_count'] ?> members</small>
                                </div>
                            </div>
                            <span class="badge bg-primary rounded-pill"><?= $group['unread_count'] ?? 0 ?></span>
                        </div>
                        <?php endforeach; ?>
                        <a href="#groups" class="btn glass-btn btn-sm w-100">View All Groups</a>
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
    
    <!-- Navigation JavaScript -->
    <script src="<?=ROOT?>/assets/scripts/nav.js"></script>
    
    <!-- Custom JavaScript -->
    <script src="<?=ROOT?>/assets/scripts/dashboard.js"></script>
</body>
</html>
