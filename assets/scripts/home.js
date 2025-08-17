class Home {
  constructor() {
    this.init();
  }

  init() {
    this.getAllFriendIds();
  }

  async getAllFriendIds() {
    try {
      const postUrl = window.ROOT
        ? `${window.ROOT}/home/get_all_friend_ids`
        : "/home/get_all_friend_ids";
      const response = await fetch(postUrl);
      const rawHTML = await response.text();
      try {
        const friendIds = JSON.parse(rawHTML);
        console.log(friendIds);
        // Load posts from friends
        if (
          friendIds &&
          friendIds.length > 0 &&
          typeof loadPostByIds === "function"
        ) {
          loadPostByIds(friendIds);
        }
      } catch (error) {
        console.error("Error parsing friend IDs:", rawHTML);
      }
    } catch (error) {
      console.error("Error fetching friend IDs:", error);
    }
  }
}

addEventListener("DOMContentLoaded", () => {
  const home = new Home();
});
