let notificationsData = [];
let friendRequestsData = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchNotifications();
  fetchFriendRequests();
});

async function fetchNotifications() {
  try {
    const response = await fetch(`${window.ROOT}/notification/fetch_all`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    notificationsData = await response.json();
    loadNotifications();
    loadMobileNotifications();
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    showNotification("Failed to load notifications", "error");
  }
}

async function fetchFriendRequests() {
  try {
    const response = await fetch(`${window.ROOT}/friendship/get_friend_requests`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    friendRequestsData = await response.json();
    loadFriendRequests();
    loadMobileFriendRequests();
  } catch (error) {
    console.error("Failed to fetch friend requests:", error);
  }
}

function generateNotificationMessage(notification) {
    const userLink = `<a href="${window.ROOT}/profile/${notification.action_by}" class="notification-user-link">${notification.userName}</a>`;
    return `${userLink} ${notification.content}` || 'New notification';
}




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

function toggleFriendsDropdown() {
  const container = document.getElementById("friendsDropdownContainer")
  if (container) {
    const isVisible = container.classList.contains("show")
    closeAllDropdowns()
    if (!isVisible) {
      container.classList.add("show")
      fetchFriendRequests() // Refresh data when opening
    }
  }
}

function toggleMobileFriends() {
  const friendsSection = document.getElementById("mobileFriendsSection")
  if (friendsSection) {
    const isVisible = friendsSection.style.display === "block"
    // Hide other mobile sections
    document.getElementById("mobileNotificationsSection").style.display = "none"
    
    if (isVisible) {
      friendsSection.style.display = "none"
    } else {
      friendsSection.style.display = "block"
      fetchFriendRequests() // Refresh data when opening
    }
  }
}

async function acceptFriendRequest(senderId) {
  try {
    const response = await fetch(`${window.ROOT}/friendship/accept_request/${senderId}`, {
      method: 'POST'
    });
    const result = await response.json();
    
    if (result.status === 'success') {
      showNotification("Friend request accepted!", "success");
      fetchFriendRequests(); // Refresh the list
    } else {
      showNotification("Failed to accept friend request", "error");
    }
  } catch (error) {
    console.error("Error accepting friend request:", error);
    showNotification("Failed to accept friend request", "error");
  }
}

async function rejectFriendRequest(senderId) {
  try {
    const response = await fetch(`${window.ROOT}/friendship/reject_request/${senderId}`, {
      method: 'POST'
    });
    const result = await response.json();
    
    if (result.status === 'success') {
      showNotification("Friend request rejected", "info");
      fetchFriendRequests(); // Refresh the list
    } else {
      showNotification("Failed to reject friend request", "error");
    }
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    showNotification("Failed to reject friend request", "error");
  }
}

function markAllFriendRequestsAsSeen() {
  // This function can be implemented later if needed
  // for now, we'll just hide the badge
  const badges = document.querySelectorAll('.friend-request-badge');
  badges.forEach(badge => badge.style.display = 'none');
}

function loadFriendRequests() {
  const friendRequestsList = document.getElementById("friendRequestsList")
  const friendRequestBadge = document.getElementById("friendRequestBadge")

  if (!friendRequestsList) return

  // Update badge count
  const requestCount = friendRequestsData.length
  if (friendRequestBadge) {
    if (requestCount > 0) {
      friendRequestBadge.textContent = requestCount
      friendRequestBadge.style.display = "block"
    } else {
      friendRequestBadge.style.display = "none"
    }
  }

  // Populate friend requests list
  if (requestCount === 0) {
    friendRequestsList.innerHTML = '<li class="no-friends-message">No pending friend requests</li>'
  } else {
    friendRequestsList.innerHTML = friendRequestsData
      .map(
        (request) => `
        <li class="friend-request-item">
            <div class="friend-request-content">
                <img src="${request.pfp || '/Friendora/assets/images/default_pfp.png'}" class="friend-request-avatar" alt="User">
                <div class="friend-request-info">
                    <p class="friend-request-name">${request.fname} ${request.lname}</p>
                    <div class="friend-request-actions">
                        <button class="btn btn-sm cyber-btn-primary" onclick="acceptFriendRequest(${request.sender_id})">Accept</button>
                        <button class="btn btn-sm cyber-btn-secondary" onclick="rejectFriendRequest(${request.sender_id})">Reject</button>
                    </div>
                </div>
            </div>
        </li>
    `,
      )
      .join("")
  }
}

function loadMobileFriendRequests() {
  const mobileFriendRequestsList = document.getElementById("mobileFriendRequestsList")
  const mobileFriendRequestBadge = document.getElementById("mobileFriendRequestBadge")

  if (!mobileFriendRequestsList) return

  const requestCount = friendRequestsData.length
  if (mobileFriendRequestBadge) {
    if (requestCount > 0) {
      mobileFriendRequestBadge.textContent = requestCount
      mobileFriendRequestBadge.style.display = "block"
    } else {
      mobileFriendRequestBadge.style.display = "none"
    }
  }

  if (requestCount === 0) {
    mobileFriendRequestsList.innerHTML = '<li class="no-friends-message">No pending friend requests</li>'
  } else {
    mobileFriendRequestsList.innerHTML = friendRequestsData
      .map(
        (request) => `
        <li class="friend-request-item mobile">
            <div class="friend-request-content">
                <img src="${request.pfp || '/Friendora/assets/images/default_pfp.png'}" class="friend-request-avatar" alt="User">
                <div class="friend-request-info">
                    <p class="friend-request-name">${request.fname} ${request.lname}</p>
                    <div class="friend-request-actions">
                        <button class="btn btn-sm cyber-btn-primary" onclick="acceptFriendRequest(${request.sender_id})">Accept</button>
                        <button class="btn btn-sm cyber-btn-secondary" onclick="rejectFriendRequest(${request.sender_id})">Reject</button>
                    </div>
                </div>
            </div>
        </li>
    `,
      )
      .join("")
  }
}

function closeAllDropdowns() {
  const dropdowns = ["notificationDropdownContainer", "userDropdownContainer", "mobileUserDropdownContainer", "friendsDropdownContainer"]
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

async function handleNotificationClick(notificationId) {
  const notification = notificationsData.find((n) => n.notification_id === notificationId);
  if (notification && !notification.is_read) {
    try {
      const response = await fetch(`${window.location.origin}/Friendora/notification/mark_as_read/${notificationId}`, {
        method: 'POST',
      });
      if (response.ok) {
        notification.is_read = 1;
        updateNotificationUI();
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }
}

async function markAllAsRead() {
  try {
    const response = await fetch(`${window.location.origin}/Friendora/notification/mark_all_as_read`, {
      method: 'POST',
    });
    if (response.ok) {
      notificationsData.forEach((notification) => {
        notification.is_read = 1;
      });
      updateNotificationUI();
      showNotification("All notifications marked as read", "success");
    }
  } catch (error) {
    console.error("Failed to mark all notifications as read:", error);
    showNotification("Failed to mark all as read", "error");
  }
}

function updateNotificationUI() {
  loadNotifications();
  loadMobileNotifications();
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

  const unreadCount = notificationsData.filter((n) => !n.is_read).length
  if (mobileNotificationCount) {
    mobileNotificationCount.textContent = unreadCount
    mobileNotificationCount.style.display = unreadCount > 0 ? "flex" : "none"
  }

  mobileNotificationsList.innerHTML = notificationsData
    .map(
      (notification) => `
        <div class="notification-item ${!notification.is_read ? "unread" : ""}" onclick="handleNotificationClick(${notification.notification_id})">
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
  const unreadCount = notificationsData.filter((n) => !n.is_read).length
  if (notificationCount) {
    notificationCount.textContent = unreadCount
    notificationCount.style.display = unreadCount > 0 ? "flex" : "none"
  }

  notificationsList.innerHTML = notificationsData
    .map(
      (notification) => `
        <li class="notification-item ${!notification.is_read ? "unread" : ""}" onclick="handleNotificationClick(${notification.notification_id})">
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
