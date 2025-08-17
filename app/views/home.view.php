<?=$this->loadView('header',['title'=>'home'])?>
  
    <div class="main-content">
        <div class="container">
            <?php if ( Utils::user()!== null): ?>
                <!-- Welcome Section -->
                <div class="cyber-card mb-4">
                    <div class="card-header">
                        <h5><i class="bi bi-house-door"></i> Dashboard</h5>
                    </div>
                    <div class="card-body">
                        <h1 class="profile-name">Welcome, <?= htmlspecialchars(Utils::user('fname')) ?>!</h1>
                        
                        <div class="about-grid">
                            <div class="about-item">
                                <i class="bi bi-envelope"></i>
                                <div>
                                    <span class="about-label">Email:</span>
                                    <span class="about-value"><?= htmlspecialchars(Utils::user('email')) ?></span>
                                </div>
                            </div>
                            
                            <div class="about-item">
                                <i class="bi bi-person"></i>
                                <div>
                                    <span class="about-label">Full Name:</span>
                                    <span class="about-value"><?= Utils::escape(Utils::User('fname')." ".Utils::User('minit')." ".Utils::User('lname')) ?></span>
                                </div>
                            </div>
                            
                            <?php if (!empty(Utils::user('DOB'))): ?>
                                <?php
                                $dob = new DateTime(Utils::user('DOB'));
                                $now = new DateTime();
                                $age = $now->diff($dob)->y;
                                ?>
                                <div class="about-item">
                                    <i class="bi bi-cake2"></i>
                                    <div>
                                        <span class="about-label">Age:</span>
                                        <span class="about-value"><?= htmlspecialchars($age) ?> years</span>
                                    </div>
                                </div>
                            <?php endif; ?>
                            
                            <div class="about-item">
                                <i class="bi bi-calendar-day"></i>
                                <div>
                                    <span class="about-label">Current Date:</span>
                                    <span class="about-value"><?= htmlspecialchars($date) ?></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                  <!-- Action Buttons -->
                <div class="profile-actions d-flex justify-content-end gap-3 mb-4">
                    <form action="<?=ROOT?>/profile" method="post" class="d-inline">
                        <button type="submit" class="cyber-btn-secondary">
                            <i class="bi bi-person"></i> Go to Profile
                        </button>
                    </form>
                    <form action="<?=ROOT?>/logout" method="post" class="d-inline">
                        <button type="submit" class="cyber-btn-ghost">
                            <i class="bi bi-box-arrow-right"></i> Logout
                        </button>
                    </form>
                </div>

                <!-- Posts Section -->
                <div class="cyber-card mb-4">
                    <div class="card-header">
                        <h5><i class="bi bi-collection"></i> Your Friend's Posts</h5>
                    </div>
                    
                </div>
            </div>
        </div>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8 col-xl-6">
                    <div id="post-container" class="posts-list">
                    </div>
                </div>
            </div>
        </div>
      
            <?php else: ?>
                <!-- User Not Found -->
                <div class="cyber-card">
                    <div class="card-body text-center">
                        <i class="bi bi-exclamation-triangle fa-3x text-warning mb-3"></i>
                        <h3>User not found</h3>
                        <p class="cyber-text-muted">Please login to access your dashboard.</p>
                        <a href="<?=ROOT?>/login" class="cyber-btn-primary mt-3">
                            <i class="bi bi-box-arrow-in-right"></i> Login
                        </a>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </div>
<?=$this->loadView('footer',[
    'jsData' => [   
    ],
    'scripts' => [
       'home','post'
    ]
])?>