let debounceTimer;

// Setup comprehensive search functionality
function setupSearchFunctionality() {
    // Setup desktop search
    const desktopSearchInput = document.getElementById("searchInput");
    const desktopSuggestions = document.getElementById("searchSuggestions");

    if (desktopSearchInput && desktopSuggestions) {
        desktopSearchInput.addEventListener("input", (e) => handleSearchInput(e, "desktop"));
        desktopSearchInput.addEventListener("keydown", (e) => handleSearchKeydown(e, "desktop"));
        desktopSearchInput.addEventListener("focus", () => showSearchSuggestions("desktop"));
        desktopSearchInput.addEventListener("blur", () => {
            setTimeout(() => {
                hideSearchSuggestions("desktop");
            }, 200); // 200ms delay gives time to navigate
        });
    }

    // Setup mobile search (will be called when mobile menu opens)
    setupMobileSearchEvents();
}

function setupMobileSearchEvents() {
    const mobileSearchInput = document.getElementById("mobileSearchInput");
    const mobileSuggestions = document.getElementById("mobileSearchSuggestions");

    if (mobileSearchInput && mobileSuggestions) {
        // Remove existing listeners to prevent duplicates
        mobileSearchInput.removeEventListener("input", handleMobileInput);
        mobileSearchInput.removeEventListener("keydown", handleMobileKeydown);
        mobileSearchInput.removeEventListener("focus", handleMobileFocus);
        mobileSearchInput.removeEventListener("blur", handleMobileBlur);

        // Add new listeners
        mobileSearchInput.addEventListener("input", handleMobileInput);
        mobileSearchInput.addEventListener("keydown", handleMobileKeydown);
        mobileSearchInput.addEventListener("focus", handleMobileFocus);
        mobileSearchInput.addEventListener("blur", handleMobileBlur);
    }
}

// Mobile search event handlers
function handleMobileInput(e) {
    const query = e.target.value.toLowerCase();
    if (query.length > 0) {
        showSearchSuggestions("mobile");
        // filterSearchSuggestions(query, 'mobile')
    } else {
        hideSearchSuggestions("mobile");
    }
}

function handleMobileKeydown(e) {
    if (e.key === "Enter") {
        const query = e.target.value.toLowerCase();
        performSearch(query);
        hideSearchSuggestions("mobile");
    }
}

function handleMobileFocus() {
    const query = document.getElementById("mobileSearchInput").value.toLowerCase();
    if (query.length > 0) {
        showSearchSuggestions("mobile");
        // filterSearchSuggestions(query, 'mobile')
    }
}

function handleMobileBlur() {
       setTimeout(() => {
                hideSearchSuggestions("mobile");
            }, 200);

}

// Updated Search Functions to handle both desktop and mobile
function handleSearchInput(e, type = "desktop") {
    const query = e.target.value.trim();

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (query.length > 0) {
            performSearch(query, type);
        } else {
            hideSearchSuggestions(type);
        }
    }, 300);
}

function handleSearchKeydown(e, type = "desktop") {
    if (e.key === "Enter") {
        const query = e.target.value.toLowerCase();
        performSearch(query);
        hideSearchSuggestions(type);
    }
}

function showSearchSuggestions(type = "desktop") {
    const suggestionsId = type === "mobile" ? "mobileSearchSuggestions" : "searchSuggestions";
    const suggestions = document.getElementById(suggestionsId);
    if (suggestions) {
        suggestions.style.display = "block";
        const inputId = type === "mobile" ? "mobileSearchInput" : "searchInput";
        const input = document.getElementById(inputId);
        if (input && input.value.trim().length > 0) {
            performSearch(input.value.trim(), type);
        }
    }
}

function hideSearchSuggestions(type = "desktop") {
    const suggestionsId = type === "mobile" ? "mobileSearchSuggestions" : "searchSuggestions";
    const suggestions = document.getElementById(suggestionsId);
    if (suggestions) {
        suggestions.style.display = "none";
    }
}

function selectSuggestion(type, id) {
    console.log(`Selected ${type}: ${id}`);
    showNotification(`Selected ${type}: ${id}`, "info");
    if (type === "Person") {
        const baseUrl = window.ROOT || "";
        window.location.href = `${baseUrl}/profile/${id}`;
        console.log(`Redirecting to profile: ${baseUrl}/profile/${id}`);
    }
    hideSearchSuggestions();
}

function openAdvancedSearch() {
    showNotification("Advanced Search - Navigator page coming soon!", "info");
}

function performSearch(query, type = "desktop") {
    const baseUrl = window.ROOT || "";
    const url = `${baseUrl}/search/find?q=${encodeURIComponent(query)}`;
    fetch(url)
        .then((res) => res.json())
        .then((results) => {
            const suggestionsId = type === "mobile" ? "mobileSearchSuggestions" : "searchSuggestions";
            const suggestions = document.getElementById(suggestionsId);
            if (!suggestions) return;

            if (!Array.isArray(results) || results.length === 0) {
                suggestions.innerHTML = "<div class='suggestion-empty'>No users found</div>";
                suggestions.style.display = "block";
                return;
            }

            suggestions.innerHTML = results
                .map(
                    (user) => `
                <div class="suggestion-item">
                        <img src="${user.profile_photo}" class="suggestion-avatar" alt="${user.Full_Name}">
                        <div class="suggestion-info">
                                <div class="suggestion-name">${createUserLink(user.user_id, user.Full_Name)}</div>
                                <div class="suggestion-type">Person</div>
                        </div>
                </div>
            `
                )
                .join("");
            suggestions.style.display = "block";
        })
        .catch((err) => {
            console.error("Search failed:", err);
            showNotification("Search failed", "error");
        });
}
