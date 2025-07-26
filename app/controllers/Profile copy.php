<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../php_error.log');

class Profile {
    use Controller;

    public function index() {
        $data = [];
        $profileData = [];
        $ses = new Session;
        $request = new Request;
        $user = new User;
        $user_profile = new Profiles;
        $websites = new Websites;
        $image = new Image;

        $user_profile->createTable();
        $websites->createTable();

        if (!$ses->is_loggedIn()) {
            Utils::redirect("login");
        }

         // Handle AJAX Profile Update
        if ($request->isPosted() && $request->isAjax()) {
            header("Content-Type: application/json");

            $data = $request->post();
            $data['user_id'] = Utils::user('id');
            $gender = $data['gender'];
            $dob = $data['birthday'];
            $links = $data['website'] ?? [];
            $links = is_array($links) ? $links : [$links];

            // Update user table with gender and DOB
            $user->update(['gender' => $gender, 'DOB' => $dob], $data['user_id'], 'id');

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

            echo json_encode([
                'success'  => $result !== false,
                'message'  => $result !== false ? 'Profile updated successfully' : 'Failed to update profile',
                'user'     => $responseData
            ]);
            return;
        }

        // Handle Cover Photo Upload
        if ($request->isPosted() && isset($_FILES['cover_photo'])) {
            header("Content-Type: application/json");
            
            $uploadResult = $this->handleImageUpload($_FILES['cover_photo'], 'cover');
            
            if ($uploadResult['success']) {
                // Update profile with new cover photo
                $profileData = $user_profile->first(['user_id' => Utils::user('id')]);
                if ($profileData) {
                    $user_profile->updateAll(['coverpic' => $uploadResult['url']], Utils::user('id'), 'user_id');
                } else {
                    $user_profile->insert([
                        'user_id' => Utils::user('id'),
                        'coverpic' => $uploadResult['url']
                    ]);
                }
            }
            
            echo json_encode($uploadResult);
            return;
        }

        // Handle Profile Photo Upload
        if ($request->isPosted() && isset($_FILES['profile_photo'])) {
            header("Content-Type: application/json");
            
            $uploadResult = $this->handleImageUpload($_FILES['profile_photo'], 'profile');
            
            if ($uploadResult['success']) {
                // Update profile with new profile photo
                $profileData = $user_profile->first(['user_id' => Utils::user('id')]);
                if ($profileData) {
                    $user_profile->updateAll(['pfp' => $uploadResult['url']], Utils::user('id'), 'user_id');
                } else {
                    $user_profile->insert([
                        'user_id' => Utils::user('id'),
                        'pfp' => $uploadResult['url']
                    ]);
                }
            }
            
            echo json_encode($uploadResult);
            return;
        }

        // Get profile data for display
        $profileData = $user_profile->first(['user_id' => Utils::user('id')]);
        $websiteData = $websites->where(['profile_id' => $profileData->id ?? 0]);
        
        $data['profile'] = $profileData;
        $data['websites'] = $websiteData;
        
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

    // Get user photos
    public function getUserPhotos($userId, $limit = 6) {
        // This would typically query a photos table
        // For now, return placeholder data
        return [
            ROOT . '/uploads/photos/photo1.jpg',
            ROOT . '/uploads/photos/photo2.jpg',
            ROOT . '/uploads/photos/photo3.jpg',
            ROOT . '/uploads/photos/photo4.jpg',
            ROOT . '/uploads/photos/photo5.jpg',
            ROOT . '/uploads/photos/photo6.jpg'
        ];
    }

    // Get user posts
    public function getUserPosts($userId, $limit = 10) {
        // This would typically query a posts table
        // For now, return placeholder data
        return [];
    }
}
