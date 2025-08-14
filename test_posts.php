<?php
require_once 'app/core/ini.php';

$db = new Database;
$posts = new Posts;

echo "Testing posts...\n";

// Check if posts table exists and has data
try {
    $result = $db->query("SELECT COUNT(*) as count FROM post");
    echo "Posts in database: " . $result[0]['count'] . "\n";
    
    // Get first few posts
    $allPosts = $db->query("SELECT * FROM post ORDER BY created_at DESC LIMIT 5");
    echo "First 5 posts:\n";
    foreach($allPosts as $post) {
        echo "- ID: {$post['id']}, Content: " . substr($post['content'], 0, 50) . "..., Created: {$post['created_at']}\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
