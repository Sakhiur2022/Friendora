<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../debug_profile.txt');

class Profile {
    use Controller;

    public function index($user_id = null) {
        $data = [];
        $profileData = [];
        $ses = new Session;
        $request = new Request;
        $user = new User;
        $user_profile = new Profiles;
        $websites = new Websites;
        $photos = new Photos;
        $posts = new Posts;
        $media = new Media;
        $image = new Image;
        $post_counter = new Post_counter;

        $user_profile->createTable();
        $websites->createTable();
        $post_counter->createTable();
        $photos->createTable();
        $posts->createTable();
        $media->createTable();

        if (!$ses->is_loggedIn()) {
            Utils::redirect("login");
        }

        // Determine which user's profile to show
        $current_user_id = Utils::user('id');
        $profile_user_id = $user_id ? intval($user_id) : $current_user_id;
        $is_own_profile = ($profile_user_id === $current_user_id);

        // Debug current user
        error_log("=== PROFILE DEBUG START ===");
        error_log("Current User ID: " . $current_user_id);
        error_log("Profile User ID: " . $profile_user_id);
        error_log("Is Own Profile: " . ($is_own_profile ? 'yes' : 'no'));
        error_log("Current User Email: " . Utils::user('email'));
        error_log("Session data: " . print_r($_SESSION, true));

        // Debug AJAX requests
        if ($request->isPosted()) {
            error_log("POST request detected. AJAX: " . ($request->isAjax() ? 'yes' : 'no'));
            error_log("POST data: " . print_r($_POST, true));
            error_log("FILES data: " . print_r($_FILES, true));
            error_log("Action parameter: " . ($_POST['action'] ?? 'not set'));
            
            // Check if it's a photo upload
            if (isset($_FILES['cover_photo'])) {
                error_log("=== COVER PHOTO UPLOAD DETECTED ===");
            }
            if (isset($_FILES['profile_photo'])) {
                error_log("=== PROFILE PHOTO UPLOAD DETECTED ===");
            }
            
            // Log which condition will be matched
            if ($request->isAjax() && $is_own_profile && 
                !isset($_FILES['cover_photo']) && !isset($_FILES['profile_photo']) && 
                isset($_POST['action']) && $_POST['action'] === 'update_profile') {
                error_log("=== WILL PROCESS AS PROFILE UPDATE ===");
            } else if (isset($_FILES['cover_photo']) && $is_own_profile && 
                       isset($_POST['action']) && $_POST['action'] === 'upload_cover') {
                error_log("=== WILL PROCESS AS COVER PHOTO UPLOAD ===");
            } else if (isset($_FILES['profile_photo']) && $is_own_profile && 
                       isset($_POST['action']) && $_POST['action'] === 'upload_profile') {
                error_log("=== WILL PROCESS AS PROFILE PHOTO UPLOAD ===");
            } else {
                error_log("=== NO MATCHING CONDITION FOUND ===");
                error_log("Request conditions: AJAX=" . ($request->isAjax() ? 'true' : 'false') . 
                         ", is_own_profile=" . ($is_own_profile ? 'true' : 'false') . 
                         ", has_cover_photo=" . (isset($_FILES['cover_photo']) ? 'true' : 'false') . 
                         ", has_profile_photo=" . (isset($_FILES['profile_photo']) ? 'true' : 'false') . 
                         ", action=" . ($_POST['action'] ?? 'not set'));
            }
        }

        // Handle AJAX Profile Update (only allowed for own profile and not file uploads)
        if ($request->isPosted() && $request->isAjax() && $is_own_profile && 
            !isset($_FILES['cover_photo']) && !isset($_FILES['profile_photo']) && 
            isset($_POST['action']) && $_POST['action'] === 'update_profile') {
            // Clean any previous output
            if (ob_get_level()) {
                ob_clean();
            }
            
            header("Content-Type: application/json");
            header("Cache-Control: no-cache, must-revalidate");

            error_log("=== PROFILE UPDATE REQUEST ===");
            error_log("Raw POST data: " . print_r($_POST, true));

            try {
                $data = $request->post();
                $data['user_id'] = Utils::user('id');
                $gender = $data['gender'];
                $dob = $data['DOB']; // Fixed: was $data['DOB'] but should match form field name
                $links = $data['website'] ?? [];
                $links = is_array($links) ? $links : [$links];

                error_log("Form data received - Gender: " . $gender . ", DOB: " . $dob);

                // Update user table with gender and DOB
                $updateResult = $user->update(['gender' => $gender, 'DOB' => $dob], $data['user_id'], 'id');
                error_log("User table update result: " . ($updateResult ? "success" : "failed"));
                
                // Update session with new user data after successful database update
                if ($updateResult) {
                    $updatedUserData = $user->first(['id' => $data['user_id']]);
                    if ($updatedUserData) {
                        $_SESSION['USER'] = $updatedUserData;
                        error_log("Session updated with new user data - Gender: " . $updatedUserData->gender . ", DOB: " . $updatedUserData->DOB);
                    }
                }

                // Insert or update profile data
                if (!$user_profile->exists($data['user_id'], 'user_id')) {
                    $user_profile->insert($data);
                } else {
                    $user_profile->updateAll($data, $data['user_id'], 'user_id');
                }

                $result = $user_profile->first(['user_id' => $data['user_id']]);
                $data['profile_id'] = $result->id;

                // Handle website links
                if (!empty($links)) {
                    // Clear existing websites
                    $websites->deleteWhere(['profile_id' => $data['profile_id']]);
                    
                    // Insert new websites
                    foreach ($links as $websiteUrl) {
                        $websiteUrl = trim($websiteUrl);
                        if ($websiteUrl !== '') {
                            $websites->insert([
                                'profile_id' => $data['profile_id'],
                                'url' => $websiteUrl
                            ]);
                        }
                    }
                }

                // Get updated user data with profile info
                $userData = $user->first(['id' => $data['user_id']]);
                $profileInfo = $user_profile->first(['user_id' => $data['user_id']]);
                
                // Merge user and profile data
                $responseData = (object) array_merge((array)$userData, (array)$profileInfo);

                $response = [
                    'success'  => $result !== false,
                    'message'  => $result !== false ? 'Profile updated successfully' : 'Failed to update profile',
                    'user'     => $responseData
                ];
                
                echo json_encode($response);
                exit();
                
            } catch (Exception $e) {
                echo json_encode([
                    'success' => false,
                    'message' => 'An error occurred: ' . $e->getMessage()
                ]);
                exit();
            }
        }

        // Handle Cover Photo Upload (only allowed for own profile)
        if ($request->isPosted() && isset($_FILES['cover_photo']) && $is_own_profile && 
            isset($_POST['action']) && $_POST['action'] === 'upload_cover') {
            error_log("=== COVER PHOTO UPLOAD REQUEST ===");
            error_log("POST action parameter: " . ($_POST['action'] ?? 'not set'));
            error_log("Cover photo file details: " . print_r($_FILES['cover_photo'], true));
            
            // Check if action parameter matches expected value
            if (isset($_POST['action']) && $_POST['action'] !== 'upload_cover') {
                error_log("Action mismatch. Expected 'upload_cover', got: " . $_POST['action']);
            }
            
            // Clean any previous output
            if (ob_get_level()) {
                ob_clean();
            }
            
            header("Content-Type: application/json");
            header("Cache-Control: no-cache, must-revalidate");
            
            try {
                error_log("Calling handleImageUpload for cover photo");
                $uploadResult = $this->handleImageUpload($_FILES['cover_photo'], 'cover');
                error_log("Cover photo upload result: " . print_r($uploadResult, true));
                
                if ($uploadResult['success']) {
                    error_log("Cover photo upload successful, updating database");
                    // Delete old cover photo if exists (both file and Photos table record)
                    $profileData = $user_profile->first(['user_id' => Utils::user('id')]);
                    if ($profileData && $profileData->coverpic) {
                        $oldPath = str_replace(ROOT . '/', '', $profileData->coverpic);
                        if (file_exists($oldPath)) {
                            unlink($oldPath);
                            error_log("Deleted old cover photo file: " . $oldPath);
                        }
                        
                        // Delete old cover photo from Photos table
                        $oldPhotoUrl1 = $profileData->coverpic; // With ROOT prefix
                        $oldPhotoUrl2 = str_replace(ROOT . '/', '', $profileData->coverpic); // Without ROOT prefix
                        
                        $oldPhotoRecord = $photos->first(['url' => $oldPhotoUrl1]);
                        if (!$oldPhotoRecord) {
                            $oldPhotoRecord = $photos->first(['url' => $oldPhotoUrl2]);
                        }
                        
                        if ($oldPhotoRecord) {
                            $photos->delete($oldPhotoRecord->id);
                            error_log("Deleted old cover photo record with ID: " . $oldPhotoRecord->id);
                        } else {
                            error_log("No old cover photo record found for URL: " . $oldPhotoUrl1 . " or " . $oldPhotoUrl2);
                        }
                    }

                    // Update profile with new cover photo
                    if ($profileData) {
                        $updateResult = $user_profile->updateAll(['coverpic' => $uploadResult['url']], Utils::user('id'), 'user_id');
                        error_log("Profile cover photo update result: " . ($updateResult ? "success" : "failed"));
                    } else {
                        $insertResult = $user_profile->insert([
                            'user_id' => Utils::user('id'),
                            'coverpic' => $uploadResult['url']
                        ]);
                        error_log("Profile cover photo insert result: " . ($insertResult ? "success" : "failed"));
                    }

                    // Add new cover photo to Photos table
                    $photoInsertResult = $photos->insert([
                        'url' => $uploadResult['url'],
                        'caption' => 'Cover Photo',
                        'user_id' => Utils::user('id')
                    ]);
                    error_log("Cover photo added to Photos table. Result: " . ($photoInsertResult ? "success" : "failed"));
                    
                    // Add cover_url to response for frontend
                    $uploadResult['cover_url'] = $uploadResult['url'];
                }
                
                error_log("Final cover photo response: " . json_encode($uploadResult));
                echo json_encode($uploadResult);
                exit();
                
            } catch (Exception $e) {
                error_log("Cover photo upload exception: " . $e->getMessage());
                echo json_encode([
                    'success' => false,
                    'message' => 'Upload error: ' . $e->getMessage()
                ]);
                exit();
            }
        }

        // Handle Profile Photo Upload (only allowed for own profile)
        if ($request->isPosted() && isset($_FILES['profile_photo']) && $is_own_profile && 
            isset($_POST['action']) && $_POST['action'] === 'upload_profile') {
            error_log("=== PROFILE PHOTO UPLOAD REQUEST ===");
            error_log("POST action parameter: " . ($_POST['action'] ?? 'not set'));
            error_log("Profile photo file details: " . print_r($_FILES['profile_photo'], true));
            
            // Check if action parameter matches expected value
            if (isset($_POST['action']) && $_POST['action'] !== 'upload_profile') {
                error_log("Action mismatch. Expected 'upload_profile', got: " . $_POST['action']);
            }
            
            // Clean any previous output
            if (ob_get_level()) {
                ob_clean();
            }
            
            header("Content-Type: application/json");
            header("Cache-Control: no-cache, must-revalidate");
            
            try {
                error_log("Calling handleImageUpload for profile photo");
                $uploadResult = $this->handleImageUpload($_FILES['profile_photo'], 'profile');
                error_log("Profile photo upload result: " . print_r($uploadResult, true));
                
                if ($uploadResult['success']) {
                    error_log("Profile photo upload successful, updating database");
                    // Delete old profile photo if exists (both file and Photos table record)
                    $profileData = $user_profile->first(['user_id' => Utils::user('id')]);
                    if ($profileData && $profileData->pfp) {
                        $oldPath = str_replace(ROOT . '/', '', $profileData->pfp);
                        if (file_exists($oldPath)) {
                            unlink($oldPath);
                            error_log("Deleted old profile photo file: " . $oldPath);
                        }
                        
                        // Delete old profile photo from Photos table
                        $oldPhotoUrl1 = $profileData->pfp; // With ROOT prefix
                        $oldPhotoUrl2 = str_replace(ROOT . '/', '', $profileData->pfp); // Without ROOT prefix
                        
                        $oldPhotoRecord = $photos->first(['url' => $oldPhotoUrl1]);
                        if (!$oldPhotoRecord) {
                            $oldPhotoRecord = $photos->first(['url' => $oldPhotoUrl2]);
                        }
                        
                        if ($oldPhotoRecord) {
                            $photos->delete($oldPhotoRecord->id);
                            error_log("Deleted old profile photo record with ID: " . $oldPhotoRecord->id);
                        } else {
                            error_log("No old profile photo record found for URL: " . $oldPhotoUrl1 . " or " . $oldPhotoUrl2);
                        }
                    }

                    // Update profile with new profile photo
                    if ($profileData) {
                        $updateResult = $user_profile->updateAll(['pfp' => $uploadResult['url']], Utils::user('id'), 'user_id');
                        error_log("Profile photo update result: " . ($updateResult ? "success" : "failed"));
                    } else {
                        $insertResult = $user_profile->insert([
                            'user_id' => Utils::user('id'),
                            'pfp' => $uploadResult['url']
                        ]);
                        error_log("Profile photo insert result: " . ($insertResult ? "success" : "failed"));
                    }

                    // Add new profile photo to Photos table
                    $photoInsertResult = $photos->insert([
                        'url' => $uploadResult['url'],
                        'caption' => 'Profile Picture',
                        'user_id' => Utils::user('id')
                    ]);
                    error_log("Profile photo added to Photos table. Result: " . ($photoInsertResult ? "success" : "failed"));
                    
                    // Add profile_url to response for frontend
                    $uploadResult['profile_url'] = $uploadResult['url'];
                }
                
                error_log("Final profile photo response: " . json_encode($uploadResult));
                echo json_encode($uploadResult);
                exit();
                
            } catch (Exception $e) {
                error_log("Profile photo upload exception: " . $e->getMessage());
                echo json_encode([
                    'success' => false,
                    'message' => 'Upload error: ' . $e->getMessage()
                ]);
                exit();
            }
        }

        // Get profile data for display
        error_log("=== GETTING PROFILE DATA ===");
        $profileData = $user_profile->first(['user_id' => $profile_user_id]);
        error_log("Profile query result: " . ($profileData ? "Found profile" : "No profile found"));
        
        // Get the user data for the profile being viewed
        $profileUser = $user->first(['id' => $profile_user_id]);
        if (!$profileUser) {
            Utils::redirect("404");
            exit();
        }
        
        if ($profileData) {
            error_log("Profile ID: " . $profileData->id);
            $websiteData = $websites->where(['profile_id' => $profileData->id]);
        } else {
            error_log("No profile found, skipping website data");
            $websiteData = [];
        }
        
        // Get user photos from Photos table
        error_log("=== GETTING PHOTOS DATA ===");
        $userPhotos = $photos->where(['user_id' => $profile_user_id]);
        error_log("Photos query result: " . (is_array($userPhotos) ? count($userPhotos) . " photos found" : "No photos or error"));
        
        // Get user posts from Posts table with reaction counts
        error_log("=== GETTING POSTS DATA ===");
        $userPosts = $posts->orderBy('created_at DESC', '*', ['creator_id' => $profile_user_id]);
        error_log("Posts query result: " . (is_array($userPosts) ? count($userPosts) . " posts found" : "No posts or error"));
        
        // Get media and reaction counts for posts
        if (is_array($userPosts) && !empty($userPosts)) {
            $post_counter = new Post_counter();
            foreach ($userPosts as $key => $post) {
                $postMedia = $media->where(['post_id' => $post->id]);
                $userPosts[$key]->media = $postMedia ?: [];
                
                // Get reaction counts from posts_counter view
                $counters = $post_counter->first(['post_id' => $post->id]);
                if ($counters) {
                    $userPosts[$key]->like_count = $counters->like_count ?? 0;
                    $userPosts[$key]->haha_count = $counters->haha_count ?? 0;
                    $userPosts[$key]->wow_count = $counters->wow_count ?? 0;
                    $userPosts[$key]->angry_count = $counters->angry_count ?? 0;
                    $userPosts[$key]->share_count = $counters->share_count ?? 0;
                    $userPosts[$key]->comment_count = $counters->comment_count ?? 0;
                } else {
                    // Set default counts if no data found
                    $userPosts[$key]->like_count = 0;
                    $userPosts[$key]->haha_count = 0;
                    $userPosts[$key]->wow_count = 0;
                    $userPosts[$key]->angry_count = 0;
                    $userPosts[$key]->share_count = 0;
                    $userPosts[$key]->comment_count = 0;
                }
                
                error_log("Post {$post->id} has " . count($userPosts[$key]->media) . " media items and reaction counts: like={$userPosts[$key]->like_count}, haha={$userPosts[$key]->haha_count}, wow={$userPosts[$key]->wow_count}, angry={$userPosts[$key]->angry_count}");
            }
        }

        // Handle profile data based on whose profile we're viewing
        if ($profileData) {
            // Only set DOB and gender from current user if viewing own profile
            if ($is_own_profile) {
                $profileData->DOB = Utils::user('DOB') ?? '';
                $profileData->gender = Utils::user('gender') ?? '';
            } else {
                // For other users, get their DOB and gender from the profileUser data
                $profileData->DOB = $profileUser->DOB ?? '';
                $profileData->gender = $profileUser->gender ?? '';
            }
            
            // Ensure pfp is always set to a valid image
            if (empty($profileData->pfp)) {
                $profileData->pfp = ROOT . '/assets/images/default_pfp.png';
            }
        } else {
            // If no profile data, create a default object
            $profileData = (object)[
                'pfp' => ROOT . '/assets/images/default_pfp.svg',
                'DOB' => $is_own_profile ? (Utils::user('DOB') ?? '') : ($profileUser->DOB ?? ''),
                'gender' => $is_own_profile ? (Utils::user('gender') ?? '') : ($profileUser->gender ?? '')
            ];
        }

        // Debug logging
        error_log("=== FINAL DATA ===");
        error_log("Profile Data: " . print_r($profileData, true));
        error_log("Photos Data: " . print_r($userPhotos, true));
        error_log("Websites Data: " . print_r($websiteData, true));
        error_log("=== PROFILE DEBUG END ===");
        
        $data['profile'] = $profileData;
        $data['profile_user'] = $profileUser;
        $data['current_user'] = $_SESSION['USER'];
        $data['is_own_profile'] = $is_own_profile;
        $data['websites'] = $websiteData;
        $data['photos'] = $userPhotos;
        $data['posts'] = $userPosts;

        $this->loadView("profile", $data);
    }

    private function handleImageUpload($file, $type) {
        error_log("=== HANDLE IMAGE UPLOAD START ===");
        error_log("Upload type: " . $type);
        error_log("File details: " . print_r($file, true));
        
        $image = new Image;

        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            error_log("File upload error: " . $file['error']);
            return [
                'success' => false,
                'message' => 'Upload error occurred: ' . $file['error']
            ];
        }
        
        error_log("File validation passed - no upload errors");

        // Check file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = mime_content_type($file['tmp_name']);
        error_log("Detected file type: " . $fileType);

        if (!in_array($fileType, $allowedTypes)) {
            error_log("Invalid file type rejected: " . $fileType);
            return [
                'success' => false,
                'message' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
            ];
        }
        
        error_log("File type validation passed");

        // Check file size (5MB max)
        $fileSizeMB = $file['size'] / (1024 * 1024);
        error_log("File size: " . round($fileSizeMB, 2) . " MB");
        
        if ($file['size'] > 5 * 1024 * 1024) {
            error_log("File size too large: " . round($fileSizeMB, 2) . " MB");
            return [
                'success' => false,
                'message' => 'File size too large. Maximum 5MB allowed.'
            ];
        }
        
        error_log("File size validation passed");

        // Create upload directory
        $uploadDir = 'uploads/' . $type . '_photos/';
        error_log("Upload directory: " . $uploadDir);
        
        if (!file_exists($uploadDir)) {
            error_log("Creating upload directory: " . $uploadDir);
            mkdir($uploadDir, 0777, true);
            file_put_contents($uploadDir . 'index.php', '<?php // Silence is golden ?>');
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $type . '_' . Utils::user('id') . '_' . time() . '.' . $extension;
        $filepath = $uploadDir . $filename;
        error_log("Generated filename: " . $filename);
        error_log("Full filepath: " . $filepath);

        // Note: Old file deletion is now handled in the main upload sections above
        // to ensure both file and Photos table record are deleted together

        // Move uploaded file
        error_log("Attempting to move uploaded file from: " . $file['tmp_name'] . " to: " . $filepath);
        
        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            error_log("File move successful");
            
            // Resize image based on type
            if ($type === 'cover') {
                error_log("Resizing cover photo to max width 1200px");
                $image->resize($filepath, 1200); // Cover photos: max width 1200px
            } else {
                error_log("Resizing profile photo to max width 400px");
                $image->resize($filepath, 400); // Profile photos: max width 400px
            }

            $finalUrl = ROOT . '/' . $filepath;
            error_log("Upload successful. Final URL: " . $finalUrl);
            
            return [
                'success' => true,
                'message' => ucfirst($type) . ' photo uploaded successfully',
                'url' => $finalUrl
            ];
        } else {
            error_log("Failed to move uploaded file");
            return [
                'success' => false,
                'message' => 'Failed to save uploaded file'
            ];
        }
    }

    // Get user profile data for about section
    public function getProfileData($userId) {
        $user = new User;
        $user_profile = new Profiles;
        $websites = new Websites;

        $userData = $user->first(['id' => $userId]);
        $profileData = $user_profile->first(['user_id' => $userId]);
        $websiteData = $websites->where(['profile_id' => $profileData->id ?? 0]);

        return [
            'user' => $userData,
            'profile' => $profileData,
            'websites' => $websiteData
        ];
    }

    // Get user photos from Photos table
    public function getUserPhotos($userId, $limit = 6) {
        $photos = new Photos;
        $userPhotos = $photos->selectComplex([
            'conditions' => ['user_id' => $userId],
            'orderBy' => 'id DESC',
            'limit' => $limit
        ]);
        
        return $userPhotos ?: [];
    }

    // Get user posts
    public function getUserPosts($userId, $limit = 10) {
        // This will be handled by Post.php controller
        return [];
    }
}
