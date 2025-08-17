class MessengerSystem {
  constructor() {
    this.currentContactId = window.currentUserId;
    this.lastPollTime = new Date().toISOString();
    this.pollInterval = null;
    this.typingTimeout = null;
    this.isTyping = false;
    this.loadedMessages = new Set();
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.startPolling();
    // Load inbox status to show correct read/unread badges on initial load
    this.loadInbox();
    this.createFloatingParticles();
  }

  setupEventListeners() {
    // Message input events
    const messageInput = document.getElementById("messageInput");
    if (messageInput) {
      messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });

      messageInput.addEventListener("input", () => {
        this.handleTyping();
        this.autoResize(messageInput);
      });
    }

    // Contact search
    const contactSearch = document.getElementById("contactSearch");
    if (contactSearch) {
      contactSearch.addEventListener("input", (e) => {
        this.filterContacts(e.target.value);
      });
    }

    // Window focus events for read status
    window.addEventListener("focus", () => {
      if (this.currentContactId) {
        this.markReceivedMessagesAsRead(this.currentContactId);
      }
    });

    // Close sidebar when clicking outside (mobile)
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector(".messenger-sidebar");
        const toggleBtn = e.target.closest(".mobile-sidebar-toggle");

        if (
          !sidebar.contains(e.target) &&
          !toggleBtn &&
          sidebar.classList.contains("show")
        ) {
          sidebar.classList.remove("show");
        }
      }
    });
  }

  async sendMessage() {
    if (!this.currentContactId) {
      this.showNotification("Please select a contact first", "warning");
      return;
    }

    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value.trim();

    if (!message) {
      this.showNotification("Please enter a message", "warning");
      return;
    }

    // Show sending state
    const sendBtn = document.getElementById("sendBtn");
    const originalContent = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>';
    sendBtn.disabled = true;

    try {
      const response = await fetch(`${window.ROOT}/messenger/send_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver_id: this.currentContactId,
          message: message,
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        messageInput.value = "";
        this.autoResize(messageInput);

        // Add message to UI immediately with correct field names
        this.addMessageToUI({
          content: message,
          sender_id: window.currentUserId,
          receiver_id: this.currentContactId, // Add receiver_id for consistent duplicate detection
          sent_at: new Date().toISOString(),
          status: "sent", // Set initial status
          is_own: true,
        });

        // Scroll to bottom
        this.scrollToBottom();

        // Update your own sidebar to show the sent message
        this.updateYourSidebarWithSentMessage({
          content: message,
          receiver_id: this.currentContactId,
          sent_at: new Date().toISOString(),
          status: "sent",
        });

        this.showNotification("Message sent!", "success");
      } else {
        this.showNotification(
          result.message || "Failed to send message",
          "error"
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      this.showNotification("Failed to send message", "error");
    } finally {
      sendBtn.innerHTML = originalContent;
      sendBtn.disabled = false;
    }
  }

  async openConversation(contactId) {
    this.currentContactId = contactId;

    // Update UI
    const contactItem = document.querySelector(
      `[data-contact-id="${contactId}"]`
    );
    if (contactItem) {
      // Remove active class from all contacts
      document.querySelectorAll(".contact-item").forEach((item) => {
        item.classList.remove("active");
      });

      // Add active class to current contact
      contactItem.classList.add("active");

      // Update chat header
      const avatar = contactItem.querySelector(".contact-avatar").src;
      const name = contactItem.querySelector(".contact-name").textContent;
      const statusEl = contactItem.querySelector(".contact-time");
      const status = statusEl ? statusEl.textContent : "Online";

      document.getElementById("chatContactAvatar").src = avatar;
      document.getElementById("chatContactName").textContent = name;
      document.getElementById("chatContactStatus").textContent = status;
    }

    // Show chat container
    document.getElementById("chatWelcome").style.display = "none";
    document.getElementById("chatContainer").style.display = "flex";

    // Load conversation
    await this.loadConversation(contactId);

    // Mark messages as read ONLY if there are messages FROM this contact TO you
    await this.markReceivedMessagesAsRead(contactId);

    // Focus message input
    document.getElementById("messageInput").focus();
  }

  async loadConversation(contactId) {
    try {
      const response = await fetch(
        `${window.ROOT}/messenger/get_conversation/${contactId}`
      );
      const result = await response.json();

      if (result.status === "success") {
        this.displayMessages(result.messages);
      } else {
        console.error("Failed to load conversation:", result.message);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  }

  displayMessages(messages) {
    const messagesList = document.getElementById("messagesList");
    messagesList.innerHTML = "";

    // Clear loaded messages tracking for new conversation
    this.loadedMessages.clear();

    messages.forEach((message) => {
      this.addMessageToUI(message);
    });

    this.scrollToBottom();
  }

  addMessageToUI(message) {
    const messagesList = document.getElementById("messagesList");
    const currentUserId = window.currentUserId;

    // Create multiple possible message identifiers to catch duplicates
    const messageId1 =
      message.message_id ||
      `${message.sender_id}_${message.receiver_id || this.currentContactId}_${
        message.content
      }_${message.sent_at}`;
    const messageId2 = `${message.sender_id}_${message.content}_${message.sent_at}`;
    const messageId3 = `${message.content}_${message.sent_at}_${message.sender_id}`;

    // Check if any variant is already loaded
    if (
      this.loadedMessages.has(messageId1) ||
      this.loadedMessages.has(messageId2) ||
      this.loadedMessages.has(messageId3)
    ) {
      console.log("Duplicate message prevented:", messageId1);
      return;
    }

    // Add all variants to loaded messages set
    this.loadedMessages.add(messageId1);
    this.loadedMessages.add(messageId2);
    this.loadedMessages.add(messageId3);

    const isOwn = message.sender_id == currentUserId;

    const messageElement = document.createElement("div");
    messageElement.className = `message ${isOwn ? "own" : "other"}`;
    messageElement.dataset.messageId = messageId1; // Add data attribute for tracking

    // Use sent_at field from Messages table
    const time = new Date(
      message.sent_at || message.created_at
    ).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Use content field from Messages table
    messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(
                  message.content || message.message
                )}</div>
                <div class="message-footer" style="display: flex; align-items: center; justify-content: flex-end; margin-top: 4px; font-size: 12px; color: #8696a0;">
                    <span class="message-time text-white">${time}</span>
                    ${isOwn ? this.getMessageStatusIcon(message.status) : ""}
                </div>
            </div>
        `;

    messagesList.appendChild(messageElement);

    // Add animation
    setTimeout(() => {
      messageElement.classList.add("show");
    }, 10);
  }

  getMessageStatusIcon(status) {
    switch (status) {
      case "sent":
        return '<div class="message-status" style="margin-left: 8px;"><i class="bi bi-check" style="color: #8696a0; font-size: 14px;" title="Sent"></i></div>';
      case "delivered":
        return '<div class="message-status" style="margin-left: 8px;"><i class="bi bi-check-all" style="color: #8696a0; font-size: 14px;" title="Delivered"></i></div>';
      case "read":
        return '<div class="message-status" style="margin-left: 8px;"><i class="bi bi-check-all" style="color: #00d4ff; font-size: 14px;" title="Read"></i></div>';
      default:
        return '<div class="message-status" style="margin-left: 8px;"><i class="bi bi-clock" style="color: #8696a0; font-size: 12px;" title="Sending..."></i></div>';
    }
  }

  async markAsRead(contactId) {
    // This marks messages FROM contactId TO you as read
    try {
      const response = await fetch(`${window.ROOT}/messenger/mark_as_read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: contactId,
        }),
      });

      const result = await response.json();
      if (result.status === "success") {
        // Update UI to remove unread badge for this contact
        this.updateContactReadStatus(contactId);
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  }

  async markReceivedMessagesAsRead(contactId) {
    // Only mark messages as read if they were sent TO you FROM contactId
    const hasUnreadMessages = document.querySelector(
      `[data-contact-id="${contactId}"] .unread-badge[style*="block"]`
    );

    if (hasUnreadMessages) {
      await this.markAsRead(contactId);
    }
  }

  updateContactReadStatus(contactId) {
    const contactItem = document.querySelector(
      `[data-contact-id="${contactId}"]`
    );
    if (contactItem) {
      const unreadBadge = contactItem.querySelector(".unread-badge");
      if (unreadBadge) {
        unreadBadge.style.display = "none";
        unreadBadge.textContent = "0";
      }
    }

    // Don't reload inbox here - it causes sent messages to show in friend's sidebar immediately
    // this.loadInbox();
  }

  updateYourSidebarWithSentMessage(message) {
    // Only update YOUR sidebar when YOU send a message
    const contactItem = document.querySelector(
      `[data-contact-id="${message.receiver_id}"]`
    );
    if (contactItem) {
      const lastMessageEl = contactItem.querySelector(".contact-last-message");
      const timeEl = contactItem.querySelector(".contact-time");

      if (lastMessageEl) {
        lastMessageEl.textContent =
          message.content.substring(0, 30) +
          (message.content.length > 30 ? "..." : "");
      }
      if (timeEl) {
        timeEl.textContent = this.formatTime(message.sent_at);
      }

      // Move contact to top of YOUR list
      const contactsList = document.getElementById("contactsList");
      if (contactsList) {
        contactsList.insertBefore(contactItem, contactsList.firstChild);
      }
    }
  }

  async loadInbox() {
    try {
      const response = await fetch(`${window.ROOT}/messenger/get_inbox`);

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Return raw HTML if not JSON
        const html = await response.text();
        console.log("Received HTML response:", html);
        return html;
      }

      const result = await response.json();

      if (result.status === "success") {
        this.updateContactsWithMessages(result.messages);
      }
    } catch (error) {
      console.error("Error loading inbox:", error);
      // If JSON parsing fails, try to get raw response
      try {
        const response = await fetch(`${window.ROOT}/messenger/get_inbox`);
        const html = await response.text();
        console.log("Fallback - received HTML response:", html);
        return html;
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    }
  }

  updateContactsWithMessages(messages) {
    // Group messages by contact (the other person in the conversation)
    const contactMessages = {};
    const currentUserId = window.currentUserId;

    messages.forEach((message) => {
      // Determine the contact ID (the other person in the conversation)
      const contactId =
        message.sender_id == currentUserId
          ? message.receiver_id
          : message.sender_id;

      if (
        !contactMessages[contactId] ||
        new Date(message.sent_at) > new Date(contactMessages[contactId].sent_at)
      ) {
        contactMessages[contactId] = message;
      }
    });

    // Update contact items
    Object.keys(contactMessages).forEach((contactId) => {
      const contactItem = document.querySelector(
        `[data-contact-id="${contactId}"]`
      );
      if (contactItem) {
        const lastMessageEl = contactItem.querySelector(
          ".contact-last-message"
        );
        const timeEl = contactItem.querySelector(".contact-time");
        const unreadBadge = contactItem.querySelector(".unread-badge");

        const message = contactMessages[contactId];
        if (lastMessageEl) {
          lastMessageEl.textContent =
            message.content.substring(0, 30) +
            (message.content.length > 30 ? "..." : "");
        }
        if (timeEl) {
          timeEl.textContent = this.formatTime(message.sent_at);
        }

        if (message.status !== "read" && unreadBadge) {
          unreadBadge.style.display = "block";
          unreadBadge.textContent = "1"; // Simplified - could count actual unread messages
        } else if (unreadBadge) {
          // Hide unread badge if message is read
          unreadBadge.style.display = "none";
          unreadBadge.textContent = "0";
        }
      }
    });
  }

  startPolling() {
    this.pollInterval = setInterval(() => {
      this.pollNewMessages();
      this.pollMessageStatusUpdates(); // Also check for status updates
    }, 10000); // Poll every 10 seconds - less aggressive due to trigger-based logging
  }

  async pollNewMessages() {
    try {
      const response = await fetch(
        `${
          window.ROOT
        }/messenger/poll_new_messages?last_poll_time=${encodeURIComponent(
          this.lastPollTime
        )}`
      );
      const result = await response.json();

      if (result.status === "success" && result.new_messages.length > 0) {
        this.handleNewMessages(result.new_messages);
        this.lastPollTime = result.poll_time;
      }
    } catch (error) {
      console.error("Error polling new messages:", error);
    }
  }

  async pollMessageStatusUpdates() {
    // Only check status updates if we have an open conversation
    if (!this.currentContactId) return;

    try {
      const response = await fetch(
        `${window.ROOT}/messenger/get_conversation_status/${this.currentContactId}`
      );
      const result = await response.json();

      if (result.status === "success") {
        this.updateMessageStatuses(result.messages);
      }
    } catch (error) {
      console.error("Error polling message status updates:", error);
    }
  }

  updateMessageStatuses(messages) {
    const currentUserId = window.currentUserId;

    // Update the status icons of existing messages sent by current user
    messages.forEach((message) => {
      if (message.sender_id == currentUserId) {
        // Find messages by content and approximate time
        const messageElements = document.querySelectorAll(".message.own");
        messageElements.forEach((messageEl) => {
          const messageText =
            messageEl.querySelector(".message-text")?.textContent;
          if (messageText === message.content) {
            const messageFooter = messageEl.querySelector(".message-footer");
            if (messageFooter) {
              const iconHtml = this.getMessageStatusIcon(message.status);
              const iconMatch = iconHtml.match(
                /<div class="message-status"[^>]*>.*?<\/div>/
              );
              if (iconMatch) {
                // Remove existing status icon if any
                const existingStatus =
                  messageFooter.querySelector(".message-status");
                if (existingStatus) {
                  existingStatus.remove();
                }
                // Add new status icon
                messageFooter.insertAdjacentHTML("beforeend", iconMatch[0]);
              }
            }
          }
        });
      }
    });
  }

  handleNewMessages(newMessages) {
    const currentUserId = window.currentUserId;

    newMessages.forEach((message) => {
      // Skip if this is our own message (shouldn't happen with fixed polling, but safety check)
      if (message.sender_id == currentUserId) {
        console.log("Skipping own message from polling:", message);
        return;
      }

      // Update contact list
      this.updateContactWithNewMessage(message);

      // If conversation is open with sender, add message to chat
      // Remember: polling returns messages where current user is receiver
      // So message.sender_id is the person who sent us the message
      if (this.currentContactId == message.sender_id) {
        this.addMessageToUI(message);
        this.scrollToBottom();
        // Immediately mark as read since the conversation is open
        this.markAsRead(message.sender_id);
      } else {
        // Only show notification for unread messages
        if (message.status !== "read") {
          showNotification(
            `New message from ${message.fname} ${message.lname}`,
            "info"
          );
        }
      }
    });
  }

  updateContactWithNewMessage(message) {
    const contactItem = document.querySelector(
      `[data-contact-id="${message.sender_id}"]`
    );
    if (contactItem) {
      const lastMessageEl = contactItem.querySelector(".contact-last-message");
      const timeEl = contactItem.querySelector(".contact-time");
      const unreadBadge = contactItem.querySelector(".unread-badge");

      if (lastMessageEl) {
        lastMessageEl.textContent =
          message.content.substring(0, 30) +
          (message.content.length > 30 ? "..." : "");
      }
      if (timeEl) {
        timeEl.textContent = this.formatTime(message.sent_at);
      }

      // Only show unread badge if this conversation is not currently open
      if (unreadBadge && this.currentContactId != message.sender_id) {
        unreadBadge.style.display = "block";
        const currentCount = Number.parseInt(unreadBadge.textContent) || 0;
        unreadBadge.textContent = currentCount + 1;
      }

      // Move contact to top
      const contactsList = document.getElementById("contactsList");
      if (contactsList) {
        contactsList.insertBefore(contactItem, contactsList.firstChild);
      }
    }
  }

  filterContacts(searchTerm) {
    const contacts = document.querySelectorAll(".contact-item");
    contacts.forEach((contact) => {
      const name = contact
        .querySelector(".contact-name")
        .textContent.toLowerCase();
      if (name.includes(searchTerm.toLowerCase())) {
        contact.style.display = "flex";
      } else {
        contact.style.display = "none";
      }
    });
  }

  handleTyping() {
    if (!this.isTyping) {
      this.isTyping = true;
      // Could send typing indicator to server here
    }

    clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false;
      // Could send stop typing indicator to server here
    }, 1000);
  }

  autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById("messagesContainer");
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  createFloatingParticles() {
    const welcomeArea = document.querySelector(".chat-welcome");
    if (!welcomeArea) return;

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.className = "floating-particle";
      particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: var(--cyber-primary);
                border-radius: 50%;
                opacity: 0.4;
                animation: floatWelcome ${
                  4 + Math.random() * 6
                }s ease-in-out infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 3}s;
            `;
      welcomeArea.appendChild(particle);
    }
  }

  destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
  }

  // Mobile sidebar toggle functionality
  toggleSidebar() {
    const sidebar = document.querySelector(".messenger-sidebar");
    sidebar.classList.toggle("show");
  }
}

// Global functions for onclick events
function openConversation(contactId) {
  if (window.messengerSystem) {
    window.messengerSystem.openConversation(contactId);

    // Close sidebar on mobile after selecting a contact
    if (window.innerWidth <= 768) {
      const sidebar = document.querySelector(".messenger-sidebar");
      sidebar.classList.remove("show");
    }
  }
}

function sendMessage() {
  if (window.messengerSystem) {
    window.messengerSystem.sendMessage();
  }
}

function toggleSidebar() {
  if (window.messengerSystem) {
    window.messengerSystem.toggleSidebar();
  }
}

// Initialize messenger system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.messengerSystem = new MessengerSystem();
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (window.messengerSystem) {
    window.messengerSystem.destroy();
  }
});
