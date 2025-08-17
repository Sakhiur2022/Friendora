<?=$this->loadView("header",["title"=>"Settings"])?>
<div class="main-content">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <!-- Settings Header -->
                <div class="cyber-card mb-4">
                    <div class="card-header">
                        <h2 class="neon-glow mb-0">
                            <i class="fas fa-cog me-2"></i>Account Settings
                        </h2>
                        <small class="cyber-text">Customize your digital identity</small>
                    </div>
                </div>

                <!-- Personal Information Section -->
                <div class="cyber-card mb-4">
                    <div class="card-header">
                        <h5><i class="fas fa-user me-2"></i>Personal Information</h5>
                    </div>
                    <div class="card-body">
                        <form id="settingsForm">
                            <!-- First Name -->
                            <div class="mb-4">
                                <label for="fname" class="form-label">
                                    <i class="fas fa-id-card me-2 text-primary"></i>First Name
                                </label>
                                <div class="input-group">
                                    <input type="text" class="cyber-input" id="fname" name="fname" required placeholder="Enter your first name">
                                    <button class="cyber-btn-secondary ms-2" type="button" onclick="window.settings.updateFname()">
                                        <i class="fas fa-save me-1"></i>Update
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Middle Initial -->
                            <div class="mb-4">
                                <label for="minit" class="form-label">
                                    <i class="fas fa-font me-2 text-primary"></i>Middle Initial
                                </label>
                                <div class="input-group">
                                    <input type="text" class="cyber-input" id="minit" name="minit" maxlength="1" placeholder="M">
                                    <button class="cyber-btn-secondary ms-2" type="button" onclick="window.settings.updateMinit()">
                                        <i class="fas fa-save me-1"></i>Update
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Last Name -->
                            <div class="mb-4">
                                <label for="lname" class="form-label">
                                    <i class="fas fa-signature me-2 text-primary"></i>Last Name
                                </label>
                                <div class="input-group">
                                    <input type="text" class="cyber-input" id="lname" name="lname" required placeholder="Enter your last name">
                                    <button class="cyber-btn-secondary ms-2" type="button" onclick="window.settings.updateLname()">
                                        <i class="fas fa-save me-1"></i>Update
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Security Section -->
                <div class="cyber-card mb-4">
                    <div class="card-header">
                        <h5><i class="fas fa-shield-alt me-2"></i>Security & Access</h5>
                    </div>
                    <div class="card-body">
                        <!-- Email -->
                        <div class="mb-4">
                            <label for="email" class="form-label">
                                <i class="fas fa-envelope me-2 text-primary"></i>Email Address
                            </label>
                            <div class="input-group">
                                <input type="email" class="cyber-input" id="email" name="email" required placeholder="your.email@example.com">
                                <button class="cyber-btn-secondary ms-2 " type="button" onclick="window.settings.updateEmail()">
                                    <i class="fas fa-save me-1"></i>Update
                                </button>
                            </div>
                        </div>
                        
                        <!-- Password -->
                        <div class="mb-4">
                            <label for="pwd" class="form-label">
                                <i class="fas fa-key me-2 text-primary"></i>Password
                            </label>
                            <div class="input-group">
                                <input type="password" class="cyber-input" id="pwd" name="pwd" required placeholder="••••••••">
                                <button class="cyber-btn-secondary ms-2" type="button" onclick="window.settings.updatePassword()">
                                    <i class="fas fa-save me-1"></i>Update
                                </button>
                            </div>
                            <small class="cyber-text mt-1">
                                <i class="fas fa-info-circle me-1"></i>
                                Use a strong password with at least 6 characters
                            </small>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="cyber-card">
                    <div class="card-header">
                        <h5><i class="fas fa-bolt me-2"></i>Quick Actions</h5>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <button class="cyber-btn-ghost w-100" onclick="location.href='<?=ROOT?>/profile'">
                                    <i class="fas fa-user-circle mb-2"></i><br>
                                    View Profile
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button class="cyber-btn-ghost w-100" onclick="location.href='<?=ROOT?>/dashboard'">
                                    <i class="fas fa-home mb-2"></i><br>
                                    Dashboard
                                </button>
                            </div>
                            <div class="col-md-4">
                                <button class="cyber-btn-ghost w-100" onclick="location.href='<?=ROOT?>/logout'">
                                    <i class="fas fa-sign-out-alt mb-2"></i><br>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<?=$this->loadView("footer",["scripts"=>["settings"]])?>