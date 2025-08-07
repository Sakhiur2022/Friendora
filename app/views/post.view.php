<div id="create-post-container"></div>

<!-- Posts Container - This is where posts will be loaded via AJAX -->
<div id="post-container" data-userid="<?= $data['profile_user']->id ?? 0 ?>">
    <!-- Posts will be loaded here by post.js -->
    <div class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading posts...</span>
        </div>
        <div class="mt-2 text-muted">Loading posts...</div>
    </div>
</div>