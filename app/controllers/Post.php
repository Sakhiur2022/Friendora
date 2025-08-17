<?php

defined('ROOT_PATH') OR exit('Access denied you hacker!');

ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/../../debug_post.txt');


class Post {
    use Controller;
    
    public function index() {
        $data = [];
        $ses = new Session;
        $request = new Request;
        $posts = new Posts;
        $comment = new Comment;
        $media = new Media;
        $photos = new Photos;
        $user = new User;
        $profiles = new Profiles;
        $image = new Image;
        $reacts = new Reacts;
        $shares = new Shares;
        $postCounter = new Post_counter;
        $postCounter = new Post_counter;
        
        // Create tables
        $posts->createTable();
        $comment->createTable();
        $media->createTable();
        $photos->createTable();
        $reacts->createTable();
        $shares->createTable();
        $postCounter->createTable();
        
        if (!$ses->is_loggedIn()) {
            Utils::redirect("login");
        }
        
        // Handle AJAX requests
        if ($request->isAjax() && $request->isPosted()) {
            header("Content-Type: application/json");
            
            $action = $request->post('action');

            switch ($action) {
                case 'create_post':
                    echo json_encode($this->createPost($request, $posts, $media, $photos, $image, $reacts, $shares));
                    return;
                    
                case 'edit_post':
                    echo json_encode($this->editPost($request, $posts));
                    return;
                    
                case 'delete_post':
                    echo json_encode($this->deletePost($request, $posts, $media, $photos));
                    return;
                    
                case 'add_comment':
                    echo json_encode($this->addComment($request, $comment));
                    return;
                    
                case 'get_posts':
                    echo json_encode($this->getPosts($posts, $user, $profiles, $media, $reacts, $shares));
                    return;
                    
                case 'get_posts_by_users':
                    echo json_encode($this->handleGetPostsByUsers($request, $posts, $user, $profiles, $media, $reacts, $shares));
                    return;
                    
                case 'get_comments':
                    echo json_encode($this->getComments($request, $comment, $user, $profiles));
                    return;
                    
                case 'react_post':
                    echo json_encode($this->reactToPost($request, $reacts));
                    return;
                    
                case 'share_post':
                    echo json_encode($this->sharePost($request, $shares));
                    return;
                    
                case 'get_post_stats':
                    echo json_encode($this->getPostStats($request, $postCounter));
                    return;
                    
                default:
                    echo json_encode(['success' => false, 'message' => 'Invalid action']);
                    return;
            }
        }
        
        $this->loadView("post", $data);
    }
    
    public function getPostsByUsers() {
        $posts = new Posts;
        $user = new User;
        $profiles = new Profiles;
        $media = new Media;
        $reacts = new Reacts;
        $shares = new Shares;
        $request = new Request;
        
        header("Content-Type: application/json");
        echo json_encode($this->handleGetPostsByUsers($request, $posts, $user, $profiles, $media, $reacts, $shares));
    }
    
    private function createPost($request, $posts, $media, $photos, $image, $reacts, $shares) {
        $content = trim($request->post('content'));
        $userId = Utils::user('id');
        
        if (empty($content)) {
            return ['success' => false, 'message' => 'Post content cannot be empty'];
        }
        
        if (!$userId) {
            return ['success' => false, 'message' => 'User not logged in'];
        }

        // Insert post
        $postData = [
            'content' => $content,
            'creator_id' => $userId,
            'group_id' => null
        ];

        $result = $posts->insert($postData);
        if (!$result) {
            return ['success' => false, 'message' => 'Failed to create post - database error'];
        }

        $postId = $posts->getLastInsertId();
        if (!$postId) {
            return ['success' => false, 'message' => 'Failed to get post ID'];
        }

        // Handle image upload if present
        if (isset($_FILES['post_image']) && $_FILES['post_image']['error'] === UPLOAD_ERR_OK) {
            $uploadResult = $this->handlePostImageUpload($_FILES['post_image'], $postId, $userId, $media, $photos, $image);
            if (!$uploadResult['success']) {
                // Delete the post if image upload fails
                $posts->delete($postId);
                return $uploadResult;
            }
        }

        // Get the created post with user info
        $postInfo = $this->getPostById($postId, $posts, new User, new Profiles, $media, $reacts, $shares);

        return [
            'success' => true,
            'message' => 'Post created successfully',
            'post' => $postInfo
        ];
    }

    private function editPost($request, $posts) {
        $postId = $request->post('post_id');
        $content = trim($request->post('content'));
        $userId = Utils::user('id');
        
        if (empty($content)) {
            return ['success' => false, 'message' => 'Post content cannot be empty'];
        }
        
        // Check if user owns the post
        $post = $posts->first(['id' => $postId]);
        if (!$post || $post->creator_id != $userId) {
            return ['success' => false, 'message' => 'Unauthorized to edit this post'];
        }
        
        $result = $posts->update(['content' => $content], $postId);
        
        return [
            'success' => $result !== false,
            'message' => $result !== false ? 'Post updated successfully' : 'Failed to update post'
        ];
    }
    
    private function deletePost($request, $posts, $media, $photos) {
        $postId = $request->post('post_id');
        $userId = Utils::user('id');
        
        error_log("=== POST DELETE DEBUG START ===");
        error_log("Post ID: " . $postId);
        error_log("User ID: " . $userId);
        
        // Check if user owns the post
        $post = $posts->first(['id' => $postId]);
        if (!$post || $post->creator_id != $userId) {
            error_log("Authorization failed - Post not found or user doesn't own it");
            return ['success' => false, 'message' => 'Unauthorized to delete this post'];
        }
        
        error_log("Post found and authorized for deletion");
        
        // Delete associated media files and corresponding photos
        $postMedia = $media->where(['post_id' => $postId]);
        error_log("Found " . (is_array($postMedia) ? count($postMedia) : 0) . " media items for post");
        
        if ($postMedia) {
            foreach ($postMedia as $mediaItem) {
                error_log("Processing media item: " . $mediaItem->media_url);
                $filePath = str_replace(ROOT . '/', '', $mediaItem->media_url);
                
                // Delete physical file
                if (file_exists($filePath)) {
                    unlink($filePath);
                    error_log("Deleted physical file: " . $filePath);
                } else {
                    error_log("Physical file not found: " . $filePath);
                }
                
                // Delete from Photos table by matching URL
                // The photo URL might be stored with or without ROOT prefix
                $photoUrl1 = $mediaItem->media_url; // With ROOT prefix
                $photoUrl2 = str_replace(ROOT . '/', '', $mediaItem->media_url); // Without ROOT prefix
                
                error_log("Searching for photo with URL: " . $photoUrl1 . " or " . $photoUrl2);
                
                // Try to find and delete matching photo record
                $photoRecord = $photos->first(['url' => $photoUrl1]);
                if (!$photoRecord) {
                    $photoRecord = $photos->first(['url' => $photoUrl2]);
                }
                
                if ($photoRecord) {
                    $deleteResult = $photos->delete($photoRecord->id);
                    error_log("Deleted photo record with ID: " . $photoRecord->id . " and URL: " . $photoRecord->url . " (Result: " . ($deleteResult ? "success" : "failed") . ")");
                } else {
                    error_log("No matching photo record found for URL: " . $photoUrl1 . " or " . $photoUrl2);
                }
            }
            
            // Delete media records
            $mediaDeleteResult = $media->delete($postId, 'post_id');
            error_log("Media records deletion result: " . ($mediaDeleteResult ? "success" : "failed"));
        }
        
        // Delete the post
        $result = $posts->delete($postId);
        error_log("Post deletion result: " . ($result ? "success" : "failed"));
        error_log("=== POST DELETE DEBUG END ===");
        
        return [
            'success' => $result !== false,
            'message' => $result !== false ? 'Post deleted successfully' : 'Failed to delete post'
        ];
    }
    
    private function addComment($request, $comment) {
        $postId = $request->post('post_id');
        $content = trim($request->post('content'));
        $userId = Utils::user('id');
        
        if (empty($content)) {
            return ['success' => false, 'message' => 'Comment cannot be empty'];
        }
        
        $commentData = [
            'user_id' => $userId,
            'content' => $content,
            'post_id' => $postId
        ];
        
        $result = $comment->insert($commentData);
        $commentId = $comment->getLastInsertId();
        
        if ($result) {
            // Get comment with user info
            $user = new User;
            $profiles = new Profiles;
            $userInfo = $user->first(['id' => $userId]);
            $profileInfo = $profiles->first(['user_id' => $userId]);
            
            return [
                'success' => true,
                'message' => 'Comment added successfully',
                'comment' => [
                    'id' => $commentId,
                    'content' => $content,
                    'created_at' => date('Y-m-d H:i:s'),
                    'user_name' => $userInfo->fname . ' ' . $userInfo->lname,
                    'user_avatar' => $profileInfo->pfp ?? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
                ]
            ];
        }
        
        return ['success' => false, 'message' => 'Failed to add comment'];
    }
    
    private function getPosts($posts, $user, $profiles, $media, $reacts, $shares) {
        $userId = Utils::user('id');
        
        // Get posts by current user, ordered by creation date
        $userPosts = $posts->selectComplex([
            'conditions' => ['creator_id' => $userId],
            'orderBy' => 'created_at DESC',
            'limit' => 20
        ]);
        
        $postsWithDetails = [];
        
        if ($userPosts) {
            foreach ($userPosts as $post) {
                $postDetails = $this->getPostById($post->id, $posts, $user, $profiles, $media, $reacts, $shares);
                if ($postDetails) {
                    $postsWithDetails[] = $postDetails;
                }
            }
        }
        
        return [
            'success' => true,
            'posts' => $postsWithDetails
        ];
    }
    
    private function handleGetPostsByUsers($request, $posts, $user, $profiles, $media, $reacts, $shares) {
        $input = json_decode(file_get_contents('php://input'), true);
        $userIds = $input['user_ids'] ?? [];
        
        if (empty($userIds) || !is_array($userIds)) {
            return ['success' => false, 'message' => 'No user IDs provided'];
        }
        
        // Create placeholders for the IN clause
        $placeholders = str_repeat('?,', count($userIds) - 1) . '?';
        
        // Get posts by specified users, ordered by creation date
        $userPosts = $posts->query("SELECT * FROM post WHERE creator_id IN ($placeholders) ORDER BY created_at DESC LIMIT 50", $userIds);
        
        $postsWithDetails = [];
        
        if ($userPosts) {
            foreach ($userPosts as $post) {
                $postDetails = $this->getPostById($post->id, $posts, $user, $profiles, $media, $reacts, $shares);
                if ($postDetails) {
                    $postsWithDetails[] = $postDetails;
                }
            }
        }
        
        return [
            'success' => true,
            'posts' => $postsWithDetails
        ];
    }
    
    private function getComments($request, $comment, $user, $profiles) {
        $postId = $request->post('post_id');
        
        $comments = $comment->selectComplex([
            'conditions' => ['post_id' => $postId],
            'orderBy' => 'created_at ASC'
        ]);
        
        $commentsWithDetails = [];
        
        if ($comments) {
            foreach ($comments as $commentItem) {
                $userInfo = $user->first(['id' => $commentItem->user_id]);
                $profileInfo = $profiles->first(['user_id' => $commentItem->user_id]);
                
                $commentsWithDetails[] = [
                    'id' => $commentItem->id,
                    'content' => $commentItem->content,
                    'created_at' => $commentItem->created_at,
                    'user_id' => $commentItem->user_id,
                    'user_name' => $userInfo ? $userInfo->fname . ' ' . $userInfo->lname : 'Unknown User',
                    'user_avatar' => $profileInfo->pfp ?? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
                ];
            }
        }
        
        return [
            'success' => true,
            'comments' => $commentsWithDetails
        ];
    }
    
    private function getPostById($postId, $posts, $user, $profiles, $media, $reacts = null, $shares = null) {
        $post = $posts->first(['id' => $postId]);
        if (!$post) return null;
        
        $userInfo = $user->first(['id' => $post->creator_id]);
        $profileInfo = $profiles->first(['user_id' => $post->creator_id]);
        $postMedia = $media->where(['post_id' => $postId]);
        
        // Get reaction counts if reacts model is available
        $reactions = ['like' => 0, 'haha' => 0, 'angry' => 0, 'wow' => 0];
        $userReaction = null;
        $shareCount = 0;
        
        if ($reacts) {
            // Get all reactions for this post
            $postReacts = $reacts->where(['post_id' => $postId]);
            if ($postReacts) {
                foreach ($postReacts as $react) {
                    if (isset($reactions[$react->type])) {
                        $reactions[$react->type]++;
                    }
                    // Check if current user has reacted
                    if ($react->uid == Utils::user('id')) {
                        $userReaction = $react->type;
                    }
                }
            }
        }
        
        if ($shares) {
            $postShares = $shares->where(['post_id' => $postId]);
            $shareCount = $postShares ? count($postShares) : 0;
        }
        
        return [
            'id' => $post->id,
            'content' => $post->content,
            'created_at' => $post->created_at,
            'creator_id' => $post->creator_id,
            'author_name' => $userInfo ? $userInfo->fname . ' ' . $userInfo->lname : 'Unknown User',
            'author_avatar' => $profileInfo->pfp ?? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=45&h=45&fit=crop&crop=face',
            'media' => $postMedia ? array_map(function($m) { return ['url' => $m->media_url, 'type' => $m->media_type]; }, $postMedia) : [],
            'time_ago' => $this->timeAgo($post->created_at),
            'reactions' => $reactions,
            'user_reaction' => $userReaction,
            'share_count' => $shareCount
        ];
    }
    
    private function handlePostImageUpload($file, $postId, $userId, $media, $photos, $image) {
        // Validate file
        if ($file['error'] !== UPLOAD_ERR_OK) {
            return ['success' => false, 'message' => 'Upload error occurred'];
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $fileType = mime_content_type($file['tmp_name']);

        if (!in_array($fileType, $allowedTypes)) {
            return ['success' => false, 'message' => 'Invalid file type'];
        }

        if ($file['size'] > 10 * 1024 * 1024) { // 10MB max
            return ['success' => false, 'message' => 'File too large'];
        }

        // Create upload directory
        $uploadDir = 'uploads/posts/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
            file_put_contents($uploadDir . 'index.php', '<?php // Silence is golden ?>');
        }

        // Generate unique filename
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $filename = 'post_' . $postId . '_' . time() . '.' . $extension;
        $filepath = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            // Resize image
            try {
                $image->resize($filepath, 1200);
            } catch (Exception $e) {
                // Continue even if resize fails
            }

            $fullUrl = ROOT . '/' . $filepath;

            // Save to media table
            $mediaData = [
                'post_id' => $postId,
                'media_url' => $fullUrl,
                'media_type' => 'image',
               
            ];
            $media->insert($mediaData);

            // Also save to photos table for user gallery
            $photoData = [
                'url' => $fullUrl,
                'caption' => 'Post image',
                'user_id' => $userId
            ];
            $photos->insert($photoData);

            return ['success' => true, 'url' => $fullUrl];
        }

        return ['success' => false, 'message' => 'Failed to save file'];
    }
    
    private function reactToPost($request, $reacts) {
        $postId = $request->post('post_id');
        $reactionType = $request->post('reaction_type'); // like, haha, angry, wow
        $userId = Utils::user('id');
        
        if (!in_array($reactionType, ['like', 'haha', 'angry', 'wow'])) {
            return ['success' => false, 'message' => 'Invalid reaction type'];
        }
        
        // Check if user already reacted to this post
        $existingReaction = $reacts->first(['uid' => $userId, 'post_id' => $postId]);
        
        $result = false;
        $action = '';
        $message = '';
        
        if ($existingReaction) {
            if ($existingReaction->type === $reactionType) {
                // Remove reaction if same type
                $result = $reacts->delete($existingReaction->id);
                $action = 'removed';
                $message = $result !== false ? 'Reaction removed' : 'Failed to remove reaction';
            } else {
                // Update reaction type
                $result = $reacts->update(['type' => $reactionType], $existingReaction->id);
                $action = 'updated';
                $message = $result !== false ? 'Reaction updated' : 'Failed to update reaction';
            }
        } else {
            // Add new reaction
            $reactionData = [
                'uid' => $userId,
                'post_id' => $postId,
                'type' => $reactionType
            ];
            
            $result = $reacts->insert($reactionData);
            $action = 'added';
            $message = $result !== false ? 'Reaction added' : 'Failed to add reaction';
        }
        
        // Get updated counts from posts_counter view
        $counts = [];
        if ($result !== false) {
            $postCounter = new Post_counter();
            $counterData = $postCounter->first(['post_id' => $postId]);
            if ($counterData) {
                $counts = [
                    'like_count' => $counterData->like_count ?? 0,
                    'haha_count' => $counterData->haha_count ?? 0,
                    'wow_count' => $counterData->wow_count ?? 0,
                    'angry_count' => $counterData->angry_count ?? 0,
                    'share_count' => $counterData->share_count ?? 0,
                    'comment_count' => $counterData->comment_count ?? 0
                ];
            }
        }
        
        return [
            'success' => $result !== false,
            'message' => $message,
            'action' => $action,
            'reaction_type' => $reactionType,
            'counts' => $counts
        ];
    }
    
    private function sharePost($request, $shares) {
        $postId = $request->post('post_id');
        $userId = Utils::user('id');
        
        // Check if user already shared this post
        $existingShare = $shares->first(['uid' => $userId, 'post_id' => $postId]);
        
        if ($existingShare) {
            return ['success' => false, 'message' => 'Post already shared'];
        }
        
        $shareData = [
            'uid' => $userId,
            'post_id' => $postId
        ];
        
        $result = $shares->insert($shareData);
        
        // Get updated counts from posts_counter view
        $counts = [];
        if ($result !== false) {
            $postCounter = new Post_counter();
            $counterData = $postCounter->first(['post_id' => $postId]);
            if ($counterData) {
                $counts = [
                    'like_count' => $counterData->like_count ?? 0,
                    'haha_count' => $counterData->haha_count ?? 0,
                    'wow_count' => $counterData->wow_count ?? 0,
                    'angry_count' => $counterData->angry_count ?? 0,
                    'share_count' => $counterData->share_count ?? 0,
                    'comment_count' => $counterData->comment_count ?? 0
                ];
            }
        }
        
        return [
            'success' => $result !== false,
            'message' => $result !== false ? 'Post shared successfully' : 'Failed to share post',
            'counts' => $counts
        ];
    }
    
    private function getPostStats($request, $postCounter) {
        $postId = $request->post('post_id');
        
        // Get stats from the posts_counter view
        $stats = $postCounter->first(['post_id' => $postId]);
        
        if ($stats) {
            return [
                'success' => true,
                'stats' => [
                    'comment_count' => $stats->comment_count ?? 0,
                    'like_count' => $stats->like_count ?? 0,
                    'haha_count' => $stats->haha_count ?? 0,
                    'angry_count' => $stats->angry_count ?? 0,
                    'wow_count' => $stats->wow_count ?? 0,
                    'share_count' => $stats->share_count ?? 0
                ]
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Post not found'
        ];
    }

    // New method to handle getUserPosts AJAX requests
    public function getUserPosts($userId = null) {
        // Ensure this is an AJAX request
        if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) || 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest') {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Invalid request']);
            return;
        }

        if (!$userId) {
            echo json_encode(['success' => false, 'message' => 'User ID is required']);
            return;
        }

        try {
            // Initialize models
            $posts = new Posts;
            $user = new User;
            $profiles = new Profiles;
            $media = new Media;
            $reacts = new Reacts;
            $shares = new Shares;
            
            // Get posts for the specified user
            $userPosts = $posts->selectComplex([
                'conditions' => ['creator_id' => $userId],
                'orderBy' => 'created_at DESC',
                'limit' => 20
            ]);
            
            $postsWithDetails = [];
            
            if ($userPosts) {
                foreach ($userPosts as $post) {
                    $postDetails = $this->getPostById($post->id, $posts, $user, $profiles, $media, $reacts, $shares);
                    if ($postDetails) {
                        $postsWithDetails[] = $postDetails;
                    }
                }
            }
            
            header("Content-Type: application/json");
            echo json_encode([
                'success' => true,
                'posts' => $postsWithDetails,
                'message' => 'Posts loaded successfully'
            ]);
            
        } catch (Exception $e) {
            header("Content-Type: application/json");
            echo json_encode([
                'success' => false,
                'message' => 'Error loading posts: ' . $e->getMessage()
            ]);
        }
    }
    
   private function timeAgo($datetime) {
  

    $time = time() - strtotime($datetime);

    $minutes = floor($time / 60);
    $hours = floor($time / 3600);
    $days = floor($time / 86400);
    $months = floor($time / 2592000);
    $years = floor($time / 31536000);

   

    if ($time < 60) return 'just now';
    if ($minutes < 60) return $minutes . ' ' . ($minutes == 1 ? 'minute' : 'minutes') . ' ago';
    if ($hours < 24) return $hours . ' ' . ($hours == 1 ? 'hour' : 'hours') . ' ago';
    if ($days < 30) return $days . ' ' . ($days == 1 ? 'day' : 'days') . ' ago';
    if ($months < 12) return $months . ' ' . ($months == 1 ? 'month' : 'months') . ' ago';

    return $years . ' ' . ($years == 1 ? 'year' : 'years') . ' ago';
}


}
