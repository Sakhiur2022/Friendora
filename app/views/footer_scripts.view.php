
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<script>
    
    window.currentUserProfilePic = "<?= Utils::getProfilePicture() ?>";
    window.currentUserId = "<?= Utils::user('id') ?>";
    window.ROOT = "<?= ROOT ?>";
    // Pass PHP data to JS only if defined
    <?php if (!empty($jsData)): ?>
        <?php foreach ($jsData as $key => $val): ?>
            window.<?= $key ?> = <?= json_encode($val) ?>;
        <?php endforeach; ?>
    <?php endif; ?>
</script>

<script src="<?= ROOT ?>/assets/scripts/utils.js"></script>
<script src="<?= ROOT ?>/assets/scripts/search.js"></script>
<script src="<?= ROOT ?>/assets/scripts/navbar.js"></script>
<?php if (!empty($scripts)) foreach ($scripts as $script): ?>
    <script src="<?= ROOT ?>/assets/scripts/<?= $script ?>.js"></script>
<?php endforeach; ?>
