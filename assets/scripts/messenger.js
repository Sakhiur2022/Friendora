class MessengerSystem {
  constructor() {
    this.currentContactId = null
    this.lastPollTime = new Date().toISOString()
    this.pollInterval = null
    this.typingTimeout = null
    this.isTyping = false
    this.loadedMessages = new Set() // Track loaded message IDs to prevent duplicates
    this.Utils = window.Utils || { user: () => 1 } // Declare Utils variable
    this.showNotification =
      window.showNotification || ((message, type) => console.log(`Notification (${type}): ${message}`)) // Declare showNotification variable

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.startPolling()
    // Load inbox status to show correct read/unread badges on initial load
    this.loadInbox()
    this.createFloatingParticles()
  }

  setupEventListeners() {
    // Message input events
    const messageInput = document.getElementById("messageInput")
    if (messageInput) {
      messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          this.sendMessage()
        }
      })

      messageInput.addEventListener("input", () => {
        this.handleTyping()
        this.autoResize(messageInput)
      })
    }

    // Contact search
    const contactSearch = document.getElementById("contactSearch")
    if (contactSearch) {
      contactSearch.addEventListener("input", (e) => {
        this.filterContacts(e.target.value)
      })
    }

    // Window focus events for read status
    window.addEventListener("focus", () => {
      if (this.currentContactId) {
        this.markAsRead(this.currentContactId)
      }
    })
  }

  async sendMessage() {
    if (!this.currentContactId) {
      this.showNotification("Please select a contact first", "warning")
      return
    }

    const messageInput = document.getElementById("messageInput")
    const message = messageInput.value.trim()

    if (!message) {
      this.showNotification("Please enter a message", "warning")
      return
    }

    // Show sending state
    const sendBtn = document.getElementById("sendBtn")
    const originalContent = sendBtn.innerHTML
    sendBtn.innerHTML = '<i class="bi bi-hourglass-split"></i>'
    sendBtn.disabled = true

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
      })

      const result = await response.json()

      if (result.status === "success") {
        messageInput.value = ""
        this.autoResize(messageInput)

        // Add message to UI immediately with correct field names
        this.addMessageToUI({
          content: message,
          sender_id: window.currentUserId || this.Utils.user("id"),
          sent_at: new Date().toISOString(),
          status: 'sent', // Set initial status
          is_own: true,
        })

        // Scroll to bottom
        this.scrollToBottom()

        this.showNotification("Message sent!", "success")
      } else {
        this.showNotification(result.message || "Failed to send message", "error")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      this.showNotification("Failed to send message", "error")
    } finally {
      sendBtn.innerHTML = originalContent
      sendBtn.disabled = false
    }
  }

  async openConversation(contactId) {
    this.currentContactId = contactId

    // Update UI
    const contactItem = document.querySelector(`[data-contact-id="${contactId}"]`)
    if (contactItem) {
      // Remove active class from all contacts
      document.querySelectorAll(".contact-item").forEach((item) => {
        item.classList.remove("active")
      })

      // Add active class to current contact
      contactItem.classList.add("active")

      // Update chat header
      const avatar = contactItem.querySelector(".contact-avatar").src
      const name = contactItem.querySelector(".contact-name").textContent
      const statusEl = contactItem.querySelector(".contact-time")
      const status = statusEl ? statusEl.textContent : "Online"

      document.getElementById("chatContactAvatar").src = avatar
      document.getElementById("chatContactName").textContent = name
      document.getElementById("chatContactStatus").textContent = status
    }

    // Show chat container
    document.getElementById("chatWelcome").style.display = "none"
    document.getElementById("chatContainer").style.display = "flex"

    // Load conversation
    await this.loadConversation(contactId)

    // Mark messages as read
    await this.markAsRead(contactId)

    // Focus message input
    document.getElementById("messageInput").focus()
  }

  async loadConversation(contactId) {
    try {
      const response = await fetch(`${window.ROOT}/messenger/get_conversation/${contactId}`)
      const result = await response.json()

      if (result.status === "success") {
        this.displayMessages(result.messages)
      } else {
        console.error("Failed to load conversation:", result.message)
      }
    } catch (error) {
      console.error("Error loading conversation:", error)
    }
  }

  displayMessages(messages) {
    const messagesList = document.getElementById("messagesList")
    messagesList.innerHTML = ""
    
    // Clear loaded messages tracking for new conversation
    this.loadedMessages.clear()

    messages.forEach((message) => {
      this.addMessageToUI(message)
    })

    this.scrollToBottom()
  }

  addMessageToUI(message) {
    const messagesList = document.getElementById("messagesList")
    const currentUserId = window.currentUserId || (this.Utils ? this.Utils.user("id") : 1)
    
    // Create unique message identifier
    const messageId = message.message_id || `${message.sender_id}_${message.content}_${message.sent_at}`
    
    // Check if message is already loaded
    if (this.loadedMessages.has(messageId)) {
      console.log('Duplicate message prevented:', messageId)
      return
    }
    
    // Add to loaded messages set
    this.loadedMessages.add(messageId)
    
    const isOwn = message.sender_id == currentUserId

    const messageElement = document.createElement("div")
    messageElement.className = `message ${isOwn ? "own" : "other"}`
    messageElement.dataset.messageId = messageId // Add data attribute for tracking

    // Use sent_at field from Messages table
    const time = new Date(message.sent_at || message.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })

    // Use content field from Messages table
    messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message.content || message.message)}</div>
                <div class="message-time">${time}</div>
                ${isOwn ? this.getMessageStatusIcon(message.status) : ""}
            </div>
        `

    messagesList.appendChild(messageElement)

    // Add animation
    setTimeout(() => {
      messageElement.classList.add("show")
    }, 10)
  }

  getMessageStatusIcon(status) {
    switch (status) {
      case 'sent':
        return '<div class="message-status"><i class="bi bi-check" title="Sent"></i></div>'
      case 'delivered':
        return '<div class="message-status"><i class="bi bi-check2" title="Delivered"></i></div>'
      case 'read':
        return '<div class="message-status"><i class="bi bi-check2-all text-primary" title="Read"></i></div>'
      default:
        return '<div class="message-status"><i class="bi bi-clock" title="Sending..."></i></div>'
    }
  }

  async markAsRead(senderId) {
    try {
      const response = await fetch(`${window.ROOT}/messenger/mark_as_read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_id: senderId,
        }),
      })

      const result = await response.json()
      if (result.status === 'success') {
        // Update UI to remove unread badge for this contact
        this.updateContactReadStatus(senderId)
      }
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  updateContactReadStatus(contactId) {
    const contactItem = document.querySelector(`[data-contact-id="${contactId}"]`)
    if (contactItem) {
      const unreadBadge = contactItem.querySelector(".unread-badge")
      if (unreadBadge) {
        unreadBadge.style.display = "none"
        unreadBadge.textContent = "0"
      }
    }
    
    // Also reload inbox to get updated message statuses
    this.loadInbox()
  }

  async loadInbox() {
    try {
      const response = await fetch(`${window.ROOT}/messenger/get_inbox`)
      const result = await response.json()

      if (result.status === "success") {
        this.updateContactsWithMessages(result.messages)
      }
    } catch (error) {
      console.error("Error loading inbox:", error)
    }
  }

  updateContactsWithMessages(messages) {
    // Group messages by contact
    const contactMessages = {}
    messages.forEach((message) => {
      const contactId = message.sender_id
      if (!contactMessages[contactId] || new Date(message.sent_at) > new Date(contactMessages[contactId].sent_at)) {
        contactMessages[contactId] = message
      }
    })

    // Update contact items
    Object.keys(contactMessages).forEach((contactId) => {
      const contactItem = document.querySelector(`[data-contact-id="${contactId}"]`)
      if (contactItem) {
        const lastMessageEl = contactItem.querySelector(".contact-last-message")
        const timeEl = contactItem.querySelector(".contact-time")
        const unreadBadge = contactItem.querySelector(".unread-badge")

        const message = contactMessages[contactId]
        if (lastMessageEl) {
          lastMessageEl.textContent = message.content.substring(0, 30) + (message.content.length > 30 ? "..." : "")
        }
        if (timeEl) {
          timeEl.textContent = this.formatTime(message.sent_at)
        }

        if (message.status !== "read" && unreadBadge) {
          unreadBadge.style.display = "block"
          unreadBadge.textContent = "1" // Simplified - could count actual unread messages
        } else if (unreadBadge) {
          // Hide unread badge if message is read
          unreadBadge.style.display = "none"
          unreadBadge.textContent = "0"
        }
      }
    })
  }

  startPolling() {
    this.pollInterval = setInterval(() => {
      this.pollNewMessages()
    }, 3000) // Poll every 3 seconds
  }

  async pollNewMessages() {
    try {
      const response = await fetch(
        `${window.ROOT}/messenger/poll_new_messages?last_poll_time=${encodeURIComponent(this.lastPollTime)}`,
      )
      const result = await response.json()

      if (result.status === "success" && result.new_messages.length > 0) {
        this.handleNewMessages(result.new_messages)
        this.lastPollTime = result.poll_time
      }
    } catch (error) {
      console.error("Error polling new messages:", error)
    }
  }

  handleNewMessages(newMessages) {
    newMessages.forEach((message) => {
      // Update contact list
      this.updateContactWithNewMessage(message)

      // If conversation is open with sender, add message to chat
      // Remember: polling returns messages where current user is receiver
      // So message.sender_id is the person who sent us the message
      if (this.currentContactId == message.sender_id) {
        this.addMessageToUI(message)
        this.scrollToBottom()
        // Immediately mark as read since the conversation is open
        this.markAsRead(message.sender_id)
      } else {
        // Show notification for new message
        this.showNotification(`New message from ${message.fname} ${message.lname}`, "info")
      }
    })
  }

  updateContactWithNewMessage(message) {
    const contactItem = document.querySelector(`[data-contact-id="${message.sender_id}"]`)
    if (contactItem) {
      const lastMessageEl = contactItem.querySelector(".contact-last-message")
      const timeEl = contactItem.querySelector(".contact-time")
      const unreadBadge = contactItem.querySelector(".unread-badge")

      if (lastMessageEl) {
        lastMessageEl.textContent = message.content.substring(0, 30) + (message.content.length > 30 ? "..." : "")
      }
      if (timeEl) {
        timeEl.textContent = this.formatTime(message.sent_at)
      }

      // Only show unread badge if this conversation is not currently open
      if (unreadBadge && this.currentContactId != message.sender_id) {
        unreadBadge.style.display = "block"
        const currentCount = Number.parseInt(unreadBadge.textContent) || 0
        unreadBadge.textContent = currentCount + 1
      }

      // Move contact to top
      const contactsList = document.getElementById("contactsList")
      if (contactsList) {
        contactsList.insertBefore(contactItem, contactsList.firstChild)
      }
    }
  }

  filterContacts(searchTerm) {
    const contacts = document.querySelectorAll(".contact-item")
    contacts.forEach((contact) => {
      const name = contact.querySelector(".contact-name").textContent.toLowerCase()
      if (name.includes(searchTerm.toLowerCase())) {
        contact.style.display = "flex"
      } else {
        contact.style.display = "none"
      }
    })
  }

  handleTyping() {
    if (!this.isTyping) {
      this.isTyping = true
      // Could send typing indicator to server here
    }

    clearTimeout(this.typingTimeout)
    this.typingTimeout = setTimeout(() => {
      this.isTyping = false
      // Could send stop typing indicator to server here
    }, 1000)
  }

  autoResize(textarea) {
    textarea.style.height = "auto"
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"
  }

  scrollToBottom() {
    const messagesContainer = document.getElementById("messagesContainer")
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  formatTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  escapeHtml(text) {
    const div = document.createElement("div")
    div.textContent = text
    return div.innerHTML
  }

  createFloatingParticles() {
    const welcomeArea = document.querySelector(".chat-welcome")
    if (!welcomeArea) return

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div")
      particle.className = "floating-particle"
      particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: var(--cyber-primary);
                border-radius: 50%;
                opacity: 0.4;
                animation: floatWelcome ${4 + Math.random() * 6}s ease-in-out infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 3}s;
            `
      welcomeArea.appendChild(particle)
    }
  }

  destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout)
    }
  }
}

// Global functions for onclick events
function openConversation(contactId) {
  if (window.messengerSystem) {
    window.messengerSystem.openConversation(contactId)
  }
}

function sendMessage() {
  if (window.messengerSystem) {
    window.messengerSystem.sendMessage()
  }
}

// Initialize messenger system when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.messengerSystem = new MessengerSystem()
})

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (window.messengerSystem) {
    window.messengerSystem.destroy()
  }
})
