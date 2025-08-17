<?php $this->loadView('header', ['title' => 'Messenger - Friendora']); ?>

<div class="messenger-container">
    <!-- Contacts Sidebar -->
    <div class="messenger-sidebar">
        <div class="messenger-header">
            <h4 class="cyber-text-primary">
                <i class="bi bi-chat-dots-fill me-2"></i>
                Messages
            </h4>
            <div class="messenger-search">
                <div class="input-group">
                    <span class="input-group-text cyber-search-icon">
                        <i class="bi bi-search"></i>
                    </span>
                    <input type="text" class="form-control cyber-search" placeholder="Search conversations..." id="contactSearch">
                </div>
            </div>
        </div>
        
        <div class="contacts-list" id="contactsList">
            <?php if (!empty($friends)): ?>
                <?php foreach ($friends as $friend): ?>
                    <div class="contact-item" data-contact-id="<?= $friend['friend_id'] ?>" onclick="openConversation(<?= $friend['friend_id'] ?>)">
                        <div class="contact-avatar-wrapper">
                            <img src="<?= $friend['profile_pic'] ?: ROOT . '/assets/images/default_pfp.png' ?>" class="contact-avatar" alt="<?= $friend['friend_name'] ?>">
                            <div class="online-status <?= 'online' ?>"></div>
                        </div>
                        <div class="contact-info">
                            <div class="contact-name"><?= $friend['friend_name'] ?></div>
                            <div class="contact-last-message">Click to start conversation</div>
                        </div>
                        <div class="unread-badge text-center" style="display: none;">0</div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="no-contacts">
                    <i class="bi bi-person-plus-fill"></i>
                    <p>No friends to chat with yet</p>
                    <a href="<?= ROOT ?>/friends" class="btn cyber-btn-primary btn-sm">Find Friends</a>
                </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Chat Area -->
    <div class="messenger-chat">
        <div class="chat-welcome" id="chatWelcome">
            <button class="btn cyber-btn-ghost mobile-sidebar-toggle d-md-none" onclick="toggleSidebar()" title="Show Contacts">
                <i class="bi bi-people-fill"></i>
                <span>Show Contacts</span>
            </button>
            <div class="welcome-content">
                <div class="cyber-logo-large">
                    <i class="bi bi-hexagon-fill"></i>
                </div>
                <h3 class="cyber-text-primary">Welcome to Friendora Messenger</h3>
                <p class="cyber-text-secondary">Select a conversation to start chatting</p>
                <div class="floating-particles-welcome"></div>
            </div>
        </div>

        <div class="chat-container" id="chatContainer" style="display: none;">
            <!-- Chat Header -->
            <div class="chat-header" id="chatHeader">
                <button class="btn cyber-btn-ghost mobile-sidebar-toggle d-md-none" onclick="toggleSidebar()" title="Toggle Contacts">
                    <i class="bi bi-list"></i>
                </button>
                <div class="chat-contact-info">
                    <img src="<?=ROOT?>/assets/images/default_pfp.png" class="chat-contact-avatar" id="chatContactAvatar" alt="">
                    <div class="chat-contact-details">
                        <div class="chat-contact-name" id="chatContactName"></div>
                        <div class="chat-contact-status" id="chatContactStatus"></div>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="btn cyber-btn-ghost" title="Video Call">
                        <i class="bi bi-camera-video-fill"></i>
                    </button>
                    <button class="btn cyber-btn-ghost" title="Voice Call">
                        <i class="bi bi-telephone-fill"></i>
                    </button>
                    <button class="btn cyber-btn-ghost" title="More Options">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                </div>
            </div>

            <!-- Messages Area -->
            <div class="messages-container" id="messagesContainer">
                <div class="messages-list" id="messagesList">
                    <!-- Messages will be loaded here -->
                </div>
            </div>

            <!-- Message Input -->
            <div class="message-input-container">
                <div class="message-input-wrapper">
                    <button class="btn cyber-btn-ghost attachment-btn" title="Attach File">
                        <i class="bi bi-paperclip"></i>
                    </button>
                    <div class="message-input-field">
                        <textarea class="form-control cyber-input" id="messageInput" placeholder="Type a message..." rows="1"></textarea>
                    </div>
                    <button class="btn cyber-btn-primary send-btn" id="sendBtn" onclick="sendMessage()">
                        <i class="bi bi-send-fill"></i>
                    </button>
                </div>
                <div class="typing-indicator" id="typingIndicator" style="display: none;">
                    <span class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                    <span class="typing-text">Someone is typing...</span>
                </div>
            </div>
        </div>
    </div>
</div>

<?php 
$jsData = [];
$scripts = ['messenger'];
$this->loadView('footer', ["scripts" => $scripts, "jsData" => $jsData]); 
?>

<script>
// Mobile sidebar toggle functionality
function toggleSidebar() {
  const sidebar = document.querySelector('.messenger-sidebar');
  sidebar.classList.toggle('show');
}

// Close sidebar when clicking on a contact (mobile)
function openConversation(contactId) {
  if (window.messengerSystem) {
    window.messengerSystem.openConversation(contactId);
    
    // Close sidebar on mobile after selecting a contact
    if (window.innerWidth <= 768) {
      const sidebar = document.querySelector('.messenger-sidebar');
      sidebar.classList.remove('show');
    }
  }
}

// Close sidebar when clicking outside (mobile)
document.addEventListener('click', function(e) {
  if (window.innerWidth <= 768) {
    const sidebar = document.querySelector('.messenger-sidebar');
    const toggleBtn = e.target.closest('.mobile-sidebar-toggle');
    
    if (!sidebar.contains(e.target) && !toggleBtn && sidebar.classList.contains('show')) {
      sidebar.classList.remove('show');
    }
  }
});
</script>
