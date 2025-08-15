class Settings {
  constructor() {
    this.currentUserId = window.currentUserId;
    this.init();
  }

  init() {
    // Initialization code here
    this.loadUserData();
  }

  async loadUserData() {
    try {
      const response = await fetch(`${window.ROOT}/settings/get_user_info`);
      const data = await response.json();

      if (data.status === "success") {
        this.populateUserData(data.user_info);
      } else {
        console.error("Failed to load user data:", data.message);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  }

  populateUserData(user_info) {
    // Check if elements exist before setting values
    const fname = document.getElementById("fname");
    const minit = document.getElementById("minit");
    const lname = document.getElementById("lname");
    const email = document.getElementById("email");
    const pwd = document.getElementById("pwd");

    if (fname) fname.value = user_info.fname || "";
    if (minit) minit.value = user_info.minit || "";
    if (lname) lname.value = user_info.lname || "";
    if (email) email.value = user_info.email || "";
    if (pwd) pwd.value = ""; // Don't populate password for security
  }

  async updateFname() {
    const fname = document.getElementById("fname").value;
    try {
      const response = await fetch(
        `${window.ROOT}/settings/update_user_fname`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fname }),
        }
      );
      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
        if (data.status === "success") {
          showNotification("First name updated", "success");
        } else {
          showNotification("Failed to update first name:", "error");
        }
      } catch (error) {
        console.error("Error parsing response:", rawText);
      }
    } catch (error) {
      console.error("Error updating first name:", error);
    }
  }
  async updateMinit() {
    const minit = document.getElementById("minit").value;
    try {
      const response = await fetch(
        `${window.ROOT}/settings/update_user_minit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ minit }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        showNotification("Middle initial updated", "success");
      } else {
        showNotification("Failed to update middle initial:", "error");
      }
    } catch (error) {
      console.error("Error updating middle initial:", error);
    }
  }
  async updateLname() {
    const lname = document.getElementById("lname").value;
    try {
      const response = await fetch(
        `${window.ROOT}/settings/update_user_lname`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lname }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        showNotification("Last name updated", "success");
      } else {
        showNotification("Failed to update last name:", "error");
      }
    } catch (error) {
      console.error("Error updating last name:", error);
    }
  }
  async updateEmail() {
    const email = document.getElementById("email").value;
    try {
      const response = await fetch(
        `${window.ROOT}/settings/update_user_email`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        showNotification("Email updated", "success");
      } else if (data.message === "Email already exists") {
        showNotification("Email is taken", "info");
      } else {
        showNotification("Failed to update email", "error");
      }
    } catch (error) {
      console.error("Error updating email:", error);
    }
  }
  async updatePassword() {
    const password = document.getElementById("pwd").value;
    try {
      const response = await fetch(
        `${window.ROOT}/settings/update_user_password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        showNotification("Password updated", "success");
      } else {
        showNotification("Failed to update password:", "error");
      }
    } catch (error) {
      console.error("Error updating password:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.settings = new Settings();
});

document.addEventListener("beforeunload", () => {
  if (window.settings) {
    window.settings.destroy();
  }
});
