// ================= STATE & LOCAL STORAGE (Safe Loading) =================
function getSafeStorage(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.warn("Storage error, resetting data for:", key);
        return fallback;
    }
}

let stories = getSafeStorage("priya_stories_data", INITIAL_STORIES);
let favorites = getSafeStorage("priya_favorites", []);
let currentTab = "home";

// Audio Player State
const audio = document.getElementById("mainAudio");
let activeStoryId = null;
let activeEpIndex = 0;
let isSeeking = false;

// ================= INIT =================
window.addEventListener("DOMContentLoaded", () => {
    renderHome();
    renderDiscover("All");
    renderLibrary();
    renderRanking();
    restoreLastPlaybackSession();
    checkSavedUser();
    updateCoinUI();
    setupKeyboardControls();
});

// ================= HELPERS =================
function saveStoriesData() {
    localStorage.setItem("priya_stories_data", JSON.stringify(stories));
}

function showToast(message, duration = 2800) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function formatTime(sec) {
    if (!sec || isNaN(sec)) return "00:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
}

function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
}

// ================= DAILY REWARDS =================
function openRewardsModal() {
    document.getElementById("rewardsModal").classList.remove("hidden");
    checkRewardStatus();
}
function closeRewardsModal() {
    document.getElementById("rewardsModal").classList.add("hidden");
}
function updateCoinUI() {
    const coins = localStorage.getItem("priya_coins") || 0;
    document.getElementById("coinBalance").innerText = coins;
}
function checkRewardStatus() {
    const lastClaimDate = localStorage.getItem("priya_last_claim_date");
    const streak = parseInt(localStorage.getItem("priya_streak")) || 1;
    const today = new Date().toDateString();
    const btn = document.getElementById("claimRewardBtn");
    
    if (lastClaimDate === today) {
        btn.innerText = "Claimed for Today ✅";
        btn.disabled = true;
        btn.style.opacity = "0.6";
    } else {
        btn.innerText = `Claim Day ${streak} Reward`;
        btn.disabled = false;
        btn.style.opacity = "1";
    }
    document.getElementById("streakDay").innerText = streak;
}
function claimDailyReward() {
    const lastClaimDate = localStorage.getItem("priya_last_claim_date");
    let streak = parseInt(localStorage.getItem("priya_streak")) || 1;
    let coins = parseInt(localStorage.getItem("priya_coins")) || 0;
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastClaimDate === today) return;
    
    if (lastClaimDate === yesterday.toDateString()) {
        streak++;
        if (streak > 7) streak = 1;
    } else {
        streak = 1;
    }
    
    const rewardCoins = streak === 1 ? 100 : 10;
    coins += rewardCoins;
    localStorage.setItem("priya_coins", coins);
    localStorage.setItem("priya_streak", streak);
    localStorage.setItem("priya_last_claim_date", today);
    
    updateCoinUI();
    checkRewardStatus();
    showToast(`🎉 ${rewardCoins} Coins mil gaye! Streak: Day ${streak}`);
}

// ================= HOME =================
function renderHome() {
    renderContinueListening();
    renderHomeCategories();
}

function renderContinueListening() {
    const container = document.getElementById("continueListening");
    const saved = getSafeStorage("priya_playback_state", null);
    
    if (!saved || !activeStoryId) {
        container.classList.add("hidden");
        return;
    }
    const story = stories.find(s => s.id === saved.storyId);
    if (!story) {
        container.classList.add("hidden");
        return;
    }
    const ep = story.episodes[saved.epIndex];
    container.classList.remove("hidden");
    container.innerHTML = `
        <div class="continue-card" onclick="startEpisode('${story.id}', ${saved.epIndex})">
            <img src="${story.cover}" alt="${story.title}" loading="lazy">
            <div class="continue-info">
                <p class="continue-label">Continue Listening</p>
                <h3>${story.title}</h3>
                <p>${ep.title}</p>
            </div>
            <button class="continue-play">▶️</button>
        </div>
    `;
}

function renderHomeCategories() {
    const container = document.getElementById("homeCategoriesContainer");
    container.innerHTML = "";
    CATEGORIES.forEach(category => {
        const catStories = stories.filter(s => s.category === category);
        if (catStories.length === 0) return;
        const block = document.createElement("div");
        block.className = "category-block";
        block.innerHTML = `
            <div class="category-title"><span>${category}</span></div>
            <div class="horizontal-scroll">
                ${catStories.map(story => createStoryCardHTML(story)).join("")}
            </div>
        `;
        container.appendChild(block);
    });
}

function createStoryCardHTML(story) {
    const isFav = favorites.includes(story.id);
    return `
        <div class="story-card" onclick="openStoryProfile('${story.id}')">
            <span class="play-badge">🎧 ${formatNumber(story.plays)}</span>
            <button class="fav-heart-btn" onclick="toggleFavorite(event, '${story.id}')" aria-label="Favorite">
                ${isFav ? "❤️" : "🤍"}
            </button>
            <img src="${story.cover}" alt="${story.title}" loading="lazy">
            <div class="story-card-body">
                <div class="story-card-title">${story.title}</div>
                <div class="story-card-cat">${story.category} • ${story.episodes.length} Eps</div>
            </div>
        </div>
    `;
}

// ================= TABS =================
function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
    
    const tabEl = document.getElementById(`${tabName}Tab`);
    if (tabEl) tabEl.classList.remove("hidden");
    
    const navEl = document.getElementById(`nav-${tabName}`);
    if (navEl) navEl.classList.add("active");
    
    if (tabName === "home") renderHome();
    if (tabName === "library") renderLibrary();
}

// ================= DISCOVER =================
function renderDiscover(selectedGenre) {
    const chipsBox = document.getElementById("discoverChips");
    const allGenres = ["All", ...CATEGORIES];
    chipsBox.innerHTML = allGenres.map(g => `
        <button class="chip ${g === selectedGenre ? 'active' : ''}" onclick="renderDiscover('${g}')">${g}</button>
    `).join("");
    
    const filtered = selectedGenre === "All" ? stories : stories.filter(s => s.category === selectedGenre);
    document.getElementById("discoverGrid").innerHTML = filtered.map(s => createStoryCardHTML(s)).join("");
}

// ================= LIBRARY =================
function renderLibrary() {
    const libGrid = document.getElementById("libraryGrid");
    const favStories = stories.filter(s => favorites.includes(s.id));
    if (favStories.length === 0) {
        libGrid.innerHTML = `
            <div class="empty-state">
                <p>Abhi koi favorite story nahi hai.</p>
                <button class="submit-login-btn" onclick="switchTab('discover')">Discover Stories</button>
            </div>
        `;
        return;
    }
    libGrid.innerHTML = favStories.map(s => createStoryCardHTML(s)).join("");
}

// ================= RANKING =================
function renderRanking() {
    const rankContainer = document.getElementById("rankingList");
    const sorted = [...stories].sort((a, b) => b.plays - a.plays).slice(0, 50);
    rankContainer.innerHTML = sorted.map((story, idx) => {
        const rank = idx + 1;
        const rankClass = rank <= 3 ? `rank-${rank}` : "";
        return `
            <div class="ranking-item" onclick="openStoryProfile('${story.id}')">
                <div class="rank-number ${rankClass}">#${rank}</div>
                <img src="${story.cover}" alt="${story.title}" loading="lazy">
                <div class="ranking-info">
                    <h4>${story.title}</h4>
                    <p>${story.category} • ${story.episodes.length} Eps</p>
                    <div class="ranking-plays">🔥 ${story.plays.toLocaleString()} Plays</div>
                </div>
            </div>
        `;
    }).join("");
}

// ================= STORY PROFILE =================
function openStoryProfile(storyId) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;
    
    document.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));
    document.getElementById("storyProfileView").classList.remove("hidden");
    
    const isFav = favorites.includes(story.id);
    document.getElementById("storyProfileContent").innerHTML = `
        <div class="profile-header">
            <img src="${story.cover}" alt="${story.title}" loading="lazy">
            <div class="profile-meta">
                <h2>${story.title}</h2>
                <span class="chip active">${story.category}</span>
                <div class="profile-stats">🎧 ${story.plays.toLocaleString()} Total Plays</div>
                <p class="profile-desc">${story.description}</p>
                <button class="fav-action-btn" onclick="toggleFavorite(event, '${story.id}')">
                    ${isFav ? "❤️ Library mein Added" : "🤍 Add to My Library"}
                </button>
            </div>
        </div>
        <h3>📋 Episodes (${story.episodes.length})</h3>
        <div class="episodes-list">
            ${story.episodes.map((ep, index) => {
                const isCurrent = (activeStoryId === story.id && activeEpIndex === index);
                return `
                    <div class="episode-row ${isCurrent ? 'playing-ep' : ''}" onclick="startEpisode('${story.id}', ${index})">
                        <div>
                            <h4>${ep.title}</h4>
                            <small>⏱ ${ep.duration}</small>
                        </div>
                        <button class="icon-btn">${isCurrent && !audio.paused ? "⏸" : "▶️"}</button>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}

function goBackFromProfile() {
    switchTab(currentTab);
}

// ================= FAVORITES =================
function toggleFavorite(event, storyId) {
    event.stopPropagation();
    if (favorites.includes(storyId)) {
        favorites = favorites.filter(id => id !== storyId);
        showToast("Library se hata diya");
    } else {
        favorites.push(storyId);
        showToast("❤️ Library mein add ho gaya");
    }
    localStorage.setItem("priya_favorites", JSON.stringify(favorites));
    renderLibrary();
    
    if (!document.getElementById("storyProfileView").classList.contains("hidden")) {
        openStoryProfile(storyId);
    }
    if (currentTab === "home") renderHomeCategories();
}

// ================= AUDIO PLAYER =================
function startEpisode(storyId, epIndex) {
    const story = stories.find(s => s.id === storyId);
    if (!story || !story.episodes[epIndex]) return;
    
    const ep = story.episodes[epIndex];
    
    if (activeStoryId !== storyId || activeEpIndex !== epIndex) {
        activeStoryId = storyId;
        activeEpIndex = epIndex;
        audio.src = ep.audioUrl;
        audio.currentTime = 0;
        
        story.plays += 1;
        saveStoriesData();
        renderRanking();
    }
    
    updatePlayerUI(story, ep);
    openFullPlayer();
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.catch(err => {
            console.warn("Autoplay blocked:", err);
            showToast("Play button dabao audio chalu karne ke liye.");
        });
    }
    
    updatePlayPauseIcons();
    renderContinueListening();
    
    // Refresh profile UI if it's open to show active episode
    if (!document.getElementById("storyProfileView").classList.contains("hidden")) {
        openStoryProfile(storyId);
    }
}

function updatePlayerUI(story, ep) {
    document.getElementById("fpCover").src = story.cover;
    document.getElementById("fpStoryTitle").innerText = story.title;
    document.getElementById("fpEpisodeTitle").innerText = ep.title;
    document.getElementById("fpPlayCount").innerText = `🎧 ${story.plays.toLocaleString()} Plays`;
    
    document.getElementById("miniPlayer").classList.remove("hidden");
    document.getElementById("mpCover").src = story.cover;
    document.getElementById("mpStoryTitle").innerText = story.title;
    document.getElementById("mpEpTitle").innerHTML = `${ep.title} • <span id="mpTime">${formatTime(audio.currentTime)}</span>`;
    
    const suggestions = stories.filter(s => s.id !== story.id).slice(0, 8);
    document.getElementById("playerSuggestionList").innerHTML = suggestions.map(s => createStoryCardHTML(s)).join("");
}

function togglePlayPause() {
    if (!activeStoryId) return;
    if (audio.paused) {
        audio.play().catch(() => showToast("Audio load ho raha hai, kripya thoda wait karein."));
    } else {
        audio.pause();
    }
    updatePlayPauseIcons();
    savePlaybackProgress();
}

function updatePlayPauseIcons() {
    const icon = audio.paused ? "▶️" : "⏸";
    document.getElementById("fpPlayPauseBtn").innerText = icon;
    document.getElementById("mpPlayPauseBtn").innerText = icon;
}

function minimizePlayer() {
    document.getElementById("fullPlayerView").classList.add("hidden");
    document.getElementById("miniPlayer").classList.remove("hidden");
}

function openFullPlayer() {
    if (activeStoryId) {
        document.getElementById("fullPlayerView").classList.remove("hidden");
    }
}

function skipSeconds(sec) {
    if (!audio.duration) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + sec));
}

function prevEpisode() {
    if (activeEpIndex > 0) {
        startEpisode(activeStoryId, activeEpIndex - 1);
    } else {
        showToast("Yeh pehla episode hai");
    }
}

function nextEpisode() {
    const story = stories.find(s => s.id === activeStoryId);
    if (story && activeEpIndex < story.episodes.length - 1) {
        startEpisode(activeStoryId, activeEpIndex + 1);
    } else {
        showToast("Kahani ka last episode ho gaya");
    }
}

function seekAudio() {
    if (!audio.duration) return;
    isSeeking = true;
    const percent = document.getElementById("seekBar").value;
    audio.currentTime = (percent / 100) * audio.duration;
}

// Audio Events
audio.addEventListener("timeupdate", () => {
    if (isSeeking) return;
    const cur = audio.currentTime || 0;
    const dur = audio.duration || 0;
    
    document.getElementById("currentTimeText").innerText = formatTime(cur);
    document.getElementById("totalTimeText").innerText = formatTime(dur);
    
    const mpTime = document.getElementById("mpTime");
    if (mpTime) mpTime.innerText = formatTime(cur);
    
    if (dur > 0) {
        document.getElementById("seekBar").value = (cur / dur) * 100;
    }
    savePlaybackProgress();
});

audio.addEventListener("play", updatePlayPauseIcons);
audio.addEventListener("pause", updatePlayPauseIcons);
audio.addEventListener("ended", nextEpisode);
audio.addEventListener("seeking", () => isSeeking = true);
audio.addEventListener("seeked", () => isSeeking = false);
audio.addEventListener("error", () => {
    if(activeStoryId) showToast("⚠️ Audio load karne mein dikkat aayi. Network check karein.");
});

// ================= PLAYBACK PROGRESS =================
function savePlaybackProgress() {
    if (!activeStoryId) return;
    localStorage.setItem("priya_playback_state", JSON.stringify({
        storyId: activeStoryId,
        epIndex: activeEpIndex,
        currentTime: audio.currentTime
    }));
}

function restoreLastPlaybackSession() {
    const saved = getSafeStorage("priya_playback_state", null);
    if (!saved) return;
    
    const story = stories.find(s => s.id === saved.storyId);
    if (!story || !story.episodes[saved.epIndex]) return;
    
    activeStoryId = saved.storyId;
    activeEpIndex = saved.epIndex;
    const ep = story.episodes[activeEpIndex];
    
    audio.src = ep.audioUrl;
    audio.addEventListener("loadedmetadata", function setTimeOnce() {
        if (saved.currentTime && saved.currentTime < audio.duration) {
            audio.currentTime = saved.currentTime;
        }
        audio.removeEventListener("loadedmetadata", setTimeOnce);
    });
    
    updatePlayerUI(story, ep);
    updatePlayPauseIcons();
    document.getElementById("miniPlayer").classList.remove("hidden");
}

// ================= KEYBOARD CONTROLS =================
function setupKeyboardControls() {
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && e.target.tagName !== "INPUT") {
            e.preventDefault();
            togglePlayPause();
        }
        if (e.code === "ArrowRight") skipSeconds(10);
        if (e.code === "ArrowLeft") skipSeconds(-10);
    });
}

// ================= SEARCH =================
let searchTimeout = null;
function openSearch() {
    document.getElementById("searchView").classList.remove("hidden");
    document.getElementById("searchInput").focus();
}

function closeSearchAndGoHome() {
    document.getElementById("searchView").classList.add("hidden");
    switchTab("home");
}

function clearSearchInput() {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchSuggestions").innerHTML = "";
    document.getElementById("searchInput").focus();
}

function handleSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = document.getElementById("searchInput").value.trim().toLowerCase();
        const resultsBox = document.getElementById("searchSuggestions");
        
        if (!query) {
            resultsBox.innerHTML = "";
            return;
        }
        const matched = stories.filter(s =>
            s.title.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query)
        );
        if (matched.length === 0) {
            resultsBox.innerHTML = `<p class="empty-search">Koi story nahi mili</p>`;
            return;
        }
        resultsBox.innerHTML = matched.map(s => `
            <div class="search-item" onclick="selectSearchResult('${s.id}')">
                <img src="${s.cover}" alt="" loading="lazy">
                <div>
                    <h4>${s.title}</h4>
                    <small>${s.category}</small>
                </div>
            </div>
        `).join("");
    }, 250);
}

function selectSearchResult(storyId) {
    document.getElementById("searchView").classList.add("hidden");
    openStoryProfile(storyId);
}

// ================= LOGIN =================
function openLoginModal() {
    document.getElementById("loginModal").classList.remove("hidden");
}

function closeLoginModal() {
    document.getElementById("loginModal").classList.add("hidden");
}

function submitLogin(e) {
    e.preventDefault();
    const name = document.getElementById("loginName").value.trim();
    const contact = document.getElementById("loginContact").value.trim();
    const password = document.getElementById("loginPass").value;
    
    if (!name || !contact || !password) {
        showToast("Sab fields bharo");
        return;
    }
    
    const user = { name, contact, password, time: new Date().toLocaleString() };
    localStorage.setItem("priya_current_user", JSON.stringify(user));
    
    document.getElementById("userAvatar").innerText = name.charAt(0).toUpperCase();
    document.getElementById("loginStatusMsg").innerText = "✅ Login successful!";
    
    showToast(`Welcome ${name}!`);
    
    setTimeout(() => {
        closeLoginModal();
        document.getElementById("loginForm").reset();
        document.getElementById("loginStatusMsg").innerText = "";
    }, 1000);
}

function checkSavedUser() {
    const user = getSafeStorage("priya_current_user", null);
    if (user && user.name) {
        document.getElementById("userAvatar").innerText = user.name.charAt(0).toUpperCase();
    }
}
