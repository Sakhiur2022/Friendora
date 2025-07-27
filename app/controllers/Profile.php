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

        $user_profile->createTable();
        $websites->createTable();
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
            
            // Check if it's a photo upload
            if (isset($_FILES['cover_photo'])) {
                error_log("=== COVER PHOTO UPLOAD DETECTED ===");
            }
            if (isset($_FILES['profile_photo'])) {
                error_log("=== PROFILE PHOTO UPLOAD DETECTED ===");
            }
        }

        // Handle AJAX Profile Update (only allowed for own profile)
        if ($request->isPosted() && $request->isAjax() && $is_own_profile) {
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
        if ($request->isPosted() && isset($_FILES['cover_photo']) && $is_own_profile) {
            // Clean any previous output
            if (ob_get_level()) {
                ob_clean();
            }
            
            header("Content-Type: application/json");
            header("Cache-Control: no-cache, must-revalidate");
            
            try {
                $uploadResult = $this->handleImageUpload($_FILES['cover_photo'], 'cover');
                
                if ($uploadResult['success']) {
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
                        $user_profile->updateAll(['coverpic' => $uploadResult['url']], Utils::user('id'), 'user_id');
                    } else {
                        $user_profile->insert([
                            'user_id' => Utils::user('id'),
                            'coverpic' => $uploadResult['url']
                        ]);
                    }

                    // Add new cover photo to Photos table
                    $photos->insert([
                        'url' => $uploadResult['url'],
                        'caption' => 'Cover Photo',
                        'user_id' => Utils::user('id')
                    ]);
                    error_log("Added new cover photo to Photos table: " . $uploadResult['url']);
                }
                
                echo json_encode($uploadResult);
                exit();
                
            } catch (Exception $e) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Upload error: ' . $e->getMessage()
                ]);
                exit();
            }
        }

        // Handle Profile Photo Upload (only allowed for own profile)
        if ($request->isPosted() && isset($_FILES['profile_photo']) && $is_own_profile) {
            // Clean any previous output
            if (ob_get_level()) {
                ob_clean();
            }
            
            header("Content-Type: application/json");
            header("Cache-Control: no-cache, must-revalidate");
            
            try {
                $uploadResult = $this->handleImageUpload($_FILES['profile_photo'], 'profile');
                
                if ($uploadResult['success']) {
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
                        $user_profile->updateAll(['pfp' => $uploadResult['url']], Utils::user('id'), 'user_id');
                    } else {
                        $user_profile->insert([
                            'user_id' => Utils::user('id'),
                            'pfp' => $uploadResult['url']
                        ]);
                    }

                    // Add new profile photo to Photos table
                    $photos->insert([
                        'url' => $uploadResult['url'],
                        'caption' => 'Profile Picture',
                        'user_id' => Utils::user('id')
                    ]);
                    error_log("Added new profile photo to Photos table: " . $uploadResult['url']);
                }
                
                echo json_encode($uploadResult);
                exit();
                
            } catch (Exception $e) {
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
        
        // Get user posts from Posts table
        error_log("=== GETTING POSTS DATA ===");
        $userPosts = $posts->orderBy('created_at DESC', '*', ['creator_id' => $profile_user_id]);
        error_log("Posts query result: " . (is_array($userPosts) ? count($userPosts) . " posts found" : "No posts or error"));
        
        // Get media for posts
        if (is_array($userPosts) && !empty($userPosts)) {
            foreach ($userPosts as $key => $post) {
                $postMedia = $media->where(['post_id' => $post->id]);
                $userPosts[$key]->media = $postMedia ?: [];
                error_log("Post {$post->id} has " . count($userPosts[$key]->media) . " media items");
            }
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
        $image = new Image;

        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return [
                'success' => false,
                'message' => 'Upload error occurred'
            ];
        }

        // Check file type
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = mime_content_type($file['tmp_name']);

        if (!in_array($fileType, $allowedTypes)) {
            return [
                'success' => false,
                'message' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'
            ];
        }

        // Check file size (5MB max)
        if ($file['size'] > 5 * 1024 * 1024) {
            return [
                'success' => false,
                'message' => 'File size too large. Maximum 5MB allowed.'
            ];
        }

        // Create upload directory
        $uploadDir = 'uploads/' . $type . '_photos/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
            file_put_contents($uploadDir . 'index.php', '<?php // Silence is golden ?>');
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = $type . '_' . Utils::user('id') . '_' . time() . '.' . $extension;
        $filepath = $uploadDir . $filename;

        // Note: Old file deletion is now handled in the main upload sections above
        // to ensure both file and Photos table record are deleted together

        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            // Resize image based on type
            if ($type === 'cover') {
                $image->resize($filepath, 1200); // Cover photos: max width 1200px
            } else {
                $image->resize($filepath, 400); // Profile photos: max width 400px
            }

            return [
                'success' => true,
                'message' => ucfirst($type) . ' photo uploaded successfully',
                'url' => ROOT . '/' . $filepath
            ];
        } else {
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
