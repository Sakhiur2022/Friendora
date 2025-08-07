const notificationsData = [
  {
    id: 1,
    userId: 2,
    userName: "Marcus Tech",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    message: "Marcus Tech liked your post",
    time: "5 minutes ago",
    isRead: false,
    type: "like",
  },
  {
    id: 2,
    userId: 3,
    userName: "Luna Digital",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
    message: "Luna Digital commented on your photo",
    time: "1 hour ago",
    isRead: false,
    type: "comment",
  },
  {
    id: 3,
    userId: 4,
    userName: "Cyber Explorer",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    message: "Cyber Explorer started following you",
    time: "2 hours ago",
    isRead: true,
    type: "follow",
  },
]



// Mobile Menu Functions
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobileMenu")
  const hamburger = document.querySelector(".cyber-hamburger")

  if (mobileMenu && hamburger) {
    const isOpen = mobileMenu.classList.contains("show")

    if (isOpen) {
      mobileMenu.classList.remove("show")
      hamburger.classList.remove("active")
      document.body.style.overflow = ""
    } else {
      mobileMenu.classList.add("show")
      hamburger.classList.add("active")
      document.body.style.overflow = "hidden"
      // Setup mobile search when menu opens
      setupMobileSearchEvents()
    }
  }
}

// User Dropdown Functions
function toggleUserDropdown() {
  const container = document.getElementById("userDropdownContainer")
  const mobileContainer = document.getElementById("mobileUserDropdownContainer")

  closeAllDropdowns()

  if (window.innerWidth < 992) {
    if (mobileContainer) {
      const isVisible = mobileContainer.classList.contains("show")
      mobileContainer.classList.toggle("show", !isVisible)
    }
  } else {
    if (container) {
      const isVisible = container.classList.contains("show")
      container.classList.toggle("show", !isVisible)
    }
  }
}

function toggleNotificationDropdown() {
  const container = document.getElementById("notificationDropdownContainer")
  if (container) {
    const isVisible = container.classList.contains("show")
    closeAllDropdowns()
    if (!isVisible) {
      container.classList.add("show")
      loadNotifications()
    }
  }
}

function closeAllDropdowns() {
  const dropdowns = ["notificationDropdownContainer", "userDropdownContainer", "mobileUserDropdownContainer"]
  dropdowns.forEach((id) => {
    const element = document.getElementById(id)
    if (element) {
      element.classList.remove("show")
    }
  })
}

function handleLogout() {
  if (confirm("Are you sure you want to log out?")) {
    showNotification("Logging out...", "info", "Goodbye!")
    setTimeout(() => {
      window.location.href = "/logout"
    }, 2000)
  }
}

function handleNotificationClick(notificationId) {
  const notification = notificationsData.find((n) => n.id === notificationId)
  if (notification && !notification.isRead) {
    notification.isRead = true

    const notificationElement = document.querySelector(`[onclick="handleNotificationClick(${notificationId})"]`)
    if (notificationElement) {
      notificationElement.classList.remove("unread")
    }

    const unreadCount = notificationsData.filter((n) => !n.isRead).length
    const countElement = document.getElementById("notificationCount")
    if (countElement) {
      countElement.textContent = unreadCount
      countElement.style.display = unreadCount > 0 ? "flex" : "none"
    }
  }

  showNotification("Notification clicked!", "info")
}

function markAllAsRead() {
  notificationsData.forEach((notification) => {
    notification.isRead = true
  })

  const notificationItems = document.querySelectorAll(".notification-item")
  notificationItems.forEach((item) => {
    item.classList.remove("unread")
  })

  const countElement = document.getElementById("notificationCount")
  if (countElement) {
    countElement.style.display = "none"
  }

  showNotification("All notifications marked as read", "success")
}

function toggleMobileNotifications() {
  const notificationsSection = document.getElementById("mobileNotificationsSection")

  if (notificationsSection) {
    const isVisible = notificationsSection.style.display !== "none"
    notificationsSection.style.display = isVisible ? "none" : "block"

    if (!isVisible) {
      loadMobileNotifications()
    }
  }
}

function loadMobileNotifications() {
  const mobileNotificationsList = document.getElementById("mobileNotificationsList")
  const mobileNotificationCount = document.getElementById("mobileNotificationCount")

  if (!mobileNotificationsList) return

  const unreadCount = notificationsData.filter((n) => !n.isRead).length
  if (mobileNotificationCount) {
    mobileNotificationCount.textContent = unreadCount
    mobileNotificationCount.style.display = unreadCount > 0 ? "flex" : "none"
  }

  mobileNotificationsList.innerHTML = notificationsData
    .map(
      (notification) => `
        <div class="notification-item ${!notification.isRead ? "unread" : ""}" onclick="handleNotificationClick(${notification.id})">
            <img src="${notification.userAvatar}" class="notification-avatar" alt="User">
            <div class="notification-content">
                <p>${generateNotificationMessage(notification)}</p>
                <small>${notification.time}</small>
            </div>
        </div>
    `,
    )
    .join("")
}

function loadNotifications() {
  const notificationsList = document.getElementById("notificationsList")
  const notificationCount = document.getElementById("notificationCount")

  if (!notificationsList) return

  // Update notification count
  const unreadCount = notificationsData.filter((n) => !n.isRead).length
  if (notificationCount) {
    notificationCount.textContent = unreadCount
    notificationCount.style.display = unreadCount > 0 ? "flex" : "none"
  }

  notificationsList.innerHTML = notificationsData
    .map(
      (notification) => `
        <li class="notification-item ${!notification.isRead ? "unread" : ""}" onclick="handleNotificationClick(${notification.id})">
            <img src="${notification.userAvatar}" class="notification-avatar" alt="User">
            <div class="notification-content">
                <p>${generateNotificationMessage(notification)}</p>
                <small>${notification.time}</small>
            </div>
        </li>
    `,
    )
    .join("")
}

// Window resize handler
window.addEventListener("resize", () => {
  if (window.innerWidth >= 992) {
    const mobileMenu = document.getElementById("mobileMenu")
    const hamburger = document.querySelector(".cyber-hamburger")
    if (mobileMenu && mobileMenu.classList.contains("show")) {
      mobileMenu.classList.remove("show")
      hamburger.classList.remove("active")
      document.body.style.overflow = ""
    }

    const mobileContainer = document.getElementById("mobileUserDropdownContainer")
    if (mobileContainer) {
      mobileContainer.classList.remove("show")
    }
  }
})
