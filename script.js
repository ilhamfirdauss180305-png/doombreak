// ======================================
// DOOMBREAK
// ======================================

// DATA APLIKASI
const appData = {
    instagram: {
        name: "Instagram",
        icon: "◎",
        className: "instagram"
    },

    youtufe: {
        name: "YouTube",
        icon: "▶",
        className: "youtube"
    },

    tiktok: {
        name: "TikTok",
        icon: "♪",
        className: "tiktok"
    },

    x: {
        name: "X",
        icon: "𝕏",
        className: "x-logo"
    },

    telegram: {
        name: "Telegram",
        icon: "➤",
        className: "telegram"
    }
};


// ======================================
// PENYIMPANAN LOCALSTORAGE
// ======================================

function getStoredData(key, fallback) {
    try {
        const data = localStorage.getItem(key);

        return data ? JSON.parse(data) : fallback;
    } catch (error) {
        return fallback;
    }
}

function saveStoredData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// ======================================
// STATE
// ======================================

let currentSlide = 0;

let morningHistory = getStoredData("doomBreakMorningHistory", {});

let currentMorningDate = "";

let currentChallengeName = "";
let currentChallengeIndex = 0;
let currentChallengeAnswers = [];

let challengeRecords = getStoredData("doomBreakChallengeRecords", []);


// ======================================
// TANGGAL
// ======================================

function getLocalDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(dateKey) {
    const date = new Date(`${dateKey}T12:00:00`);

    return date.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

function updateDateText() {
    const today = getLocalDateKey();

    const morningDateElement = document.getElementById("morningCurrentDate");

    if (morningDateElement) {
        morningDateElement.textContent = formatDate(today);
    }
}


// ======================================
// NAVIGASI
// ======================================

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const target = document.getElementById(pageId);

    if (target) {
        target.classList.add("active");
    }

    // Mode login dan daftar
    if (pageId === "loginPage" || pageId === "registerPage") {
        document.body.classList.add("auth-mode");
    } else {
        document.body.classList.remove("auth-mode");
    }

    // Navigasi dashboard
    document.querySelectorAll(".nav-button").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.page === pageId
        );
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================
// DASHBOARD CAROUSEL
// ======================================

const dashboardTrack = document.getElementById("dashboardTrack");
const sliderDots = document.querySelectorAll(".slider-dot");
const dashboardSlider = document.getElementById("dashboardSlider");

function updateDashboardSlider() {
    dashboardTrack.style.transform =
        `translateX(-${currentSlide * 100}%)`;

    sliderDots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentSlide);
    });
}

sliderDots.forEach(dot => {
    dot.addEventListener("click", () => {
        currentSlide = Number(dot.dataset.slide);
        updateDashboardSlider();
    });
});

let touchStartX = 0;
let touchEndX = 0;

dashboardSlider.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
});

dashboardSlider.addEventListener("touchend", event => {
    touchEndX = event.changedTouches[0].screenX;

    const distance = touchEndX - touchStartX;

    if (Math.abs(distance) < 50) {
        return;
    }

    if (distance < 0) {
        currentSlide++;

        if (currentSlide > 2) {
            currentSlide = 0;
        }
    } else {
        currentSlide--;

        if (currentSlide < 0) {
            currentSlide = 2;
        }
    }

    updateDashboardSlider();
});


// ======================================
// GRAFIK DURASI PENGGUNAAN
// ======================================

const usageData = [
    {
        app: "instagram",
        hours: 3.5
    },
    {
        app: "youtube",
        hours: 11
    },
    {
        app: "tiktok",
        hours: 9.5
    },
    {
        app: "x",
        hours: 11
    },
    {
        app: "telegram",
        hours: 12
    }
];

function renderUsageChart() {
    const chart = document.getElementById("usageChart");

    if (!chart) return;

    chart.innerHTML = "";

    // Mengubah angka desimal menjadi format jam dan menit
    function formatDuration(hours) {
        const totalMinutes = Math.round(hours * 60);
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;

        if (hour === 0) {
            return `${minute}m`;
        }

        if (minute === 0) {
            return `${hour}j`;
        }

        return `${hour}j ${minute}m`;
    }

    usageData.forEach(item => {
        const app = appData[item.app];

        if (!app) return;

        const barItem = document.createElement("div");
        barItem.className = "usage-bar-item";

        // Label durasi
        const duration = document.createElement("span");
        duration.className = "usage-duration";
        duration.textContent = formatDuration(item.hours);

        // Batang grafik
        const bar = document.createElement("div");
        bar.className = "usage-bar";

        const maxHours = Math.max(
            ...usageData.map(data => data.hours),
            1
        );

        bar.style.height = `${(item.hours / maxHours) * 100}%`;

        // Ikon aplikasi
        const icon = document.createElement("span");
        icon.className = `usage-app-icon ${app.className}`;
        icon.textContent = app.icon;

        // Susunan elemen
        barItem.appendChild(duration);
        barItem.appendChild(bar);
        barItem.appendChild(icon);

        chart.appendChild(barItem);
    });
}

const moodData = [
    3, 3.5, 4, 3.8, 4.5, 4.8,
    4.2, 5, 5.5, 6, 5.7, 4.8
];

function renderMoodChart() {
    const chart = document.getElementById("moodChart");

    const width = 500;
    const height = 200;

    const points = moodData.map((value, index) => {
        const x = (index / (moodData.length - 1)) * width;
        const y = height - ((value / 6) * height);

        return `${x},${y}`;
    });

    const pointsString = points.join(" ");

    const svg = `
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
            <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#9bcd5b" stop-opacity="0.35"/>
                    <stop offset="100%" stop-color="#9bcd5b" stop-opacity="0.02"/>
                </linearGradient>
            </defs>

            <polygon
                points="0,${height} ${pointsString} ${width},${height}"
                fill="url(#moodGradient)"
            />

            <polyline
                points="${pointsString}"
                fill="none"
                stroke="#83b84a"
                stroke-width="3"
                stroke-linejoin="round"
                stroke-linecap="round"
            />

            ${moodData.map((value, index) => {
                const x = (index / (moodData.length - 1)) * width;
                const y = height - ((value / 6) * height);

                return `
                    <circle
                        cx="${x}"
                        cy="${y}"
                        r="4"
                        fill="#ffffff"
                        stroke="#5b8d2b"
                        stroke-width="2"
                    />
                `;
            }).join("")}
        </svg>

        <div class="mood-month-labels">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>Mei</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Agu</span>
            <span>Sep</span>
            <span>Okt</span>
            <span>Nov</span>
            <span>Des</span>
        </div>
    `;

    chart.innerHTML = svg;
}


// ======================================
// APLIKASI TERKUNCI
// ======================================

const appCheckboxes = document.querySelectorAll(".app-lock-checkbox");

function renderLockedApps() {
    const container = document.getElementById("lockedAppIcons");

    container.innerHTML = "";

    const selectedApps = [];

    appCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedApps.push(checkbox.dataset.app);
        }
    });

    if (selectedApps.length === 0) {
        container.innerHTML = `
            <p class="empty-apps">
                Belum ada aplikasi yang dipilih.
            </p>
        `;

        return;
    }

    selectedApps.forEach(appKey => {
        const app = appData[appKey];

        const icon = document.createElement("div");

        icon.className = `locked-app-icon ${app.className}`;
        icon.textContent = app.icon;

        container.appendChild(icon);
    });

    saveStoredData("doomBreakSelectedApps", selectedApps);
}

function loadSelectedApps() {
    const savedApps = getStoredData(
        "doomBreakSelectedApps",
        ["instagram", "youtube", "tiktok", "x", "telegram"]
    );

    appCheckboxes.forEach(checkbox => {
        checkbox.checked = savedApps.includes(checkbox.dataset.app);
    });

    renderLockedApps();
}

appCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", renderLockedApps);
});


// ======================================
// TANTANGAN LAIN
// ======================================

const otherChallenges = {
    BreakMind: {
        description: "Jeda sejenak untuk pikiranmu.",
        questions: [
            {
                question: "Apa yang sedang kamu rasakan?",
                options: [
                    "Tenang",
                    "Lelah",
                    "Banyak pikiran",
                    "Cukup baik"
                ]
            },
            {
                question: "Apa yang paling memenuhi pikiranmu?",
                options: [
                    "Tugas",
                    "Hubungan dengan orang lain",
                    "Masa depan",
                    "Tidak ada hal tertentu"
                ]
            },
            {
                question: "Apa yang bisa kamu lakukan untuk menenangkan diri?",
                options: [
                    "Mengambil napas perlahan",
                    "Beristirahat dari layar",
                    "Menulis pikiran",
                    "Berbicara dengan orang yang dipercaya"
                ]
            }
        ]
    },

    BreakSoul: {
        description: "Tenangkan hati dan jiwamu.",
        questions: [
            {
                question: "Apa yang membuatmu merasa bersyukur?",
                options: [
                    "Keluarga",
                    "Kesehatan",
                    "Teman",
                    "Kesempatan hari ini"
                ]
            },
            {
                question: "Apa yang bisa membuat hatimu lebih tenang?",
                options: [
                    "Berdoa",
                    "Beribadah",
                    "Beristirahat",
                    "Berbicara dengan orang terdekat"
                ]
            }
        ]
    },

    SocialBreak: {
        description: "Terhubung kembali dengan lingkungan sekitar.",
        questions: [
            {
                question: "Siapa yang ingin kamu ajak berinteraksi?",
                options: [
                    "Keluarga",
                    "Teman",
                    "Orang yang sudah lama tidak dihubungi",
                    "Diriku sendiri"
                ]
            },
            {
                question: "Apa kegiatan tanpa ponsel yang ingin kamu lakukan?",
                options: [
                    "Mengobrol langsung",
                    "Berjalan santai",
                    "Membaca buku",
                    "Merapikan lingkungan"
                ]
            }
        ]
    }
};

function openChallenge(challengeName) {
    openFeatureHistory(challengeName);
 
    const challenge = otherChallenges[challengeName];

    if (!challenge) {
        return;
    }

    currentChallengeData = challenge.questions;
    currentChallengeIndex = 0;
    currentChallengeAnswers = [];

    document.getElementById("challengeTitle").textContent =
        challengeName;

    document.getElementById("challengeDescription").textContent =
        challenge.description;

    showPage("challengePage");

    renderOtherChallengeQuestion();
}

function renderOtherChallengeQuestion() {
    const question = currentChallengeData[currentChallengeIndex];

    document.getElementById("challengeCounter").textContent =
        `Pertanyaan ${currentChallengeIndex + 1} dari ${currentChallengeData.length}`;

    document.getElementById("challengeQuestion").textContent =
        question.question;

    document.getElementById("challengeProgress").style.width =
        `${((currentChallengeIndex + 1) / currentChallengeData.length) * 100}%`;

    const container = document.getElementById("challengeOptions");

    container.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "challenge-option";
        button.textContent = option;

        button.addEventListener("click", () => {
            currentChallengeAnswers[currentChallengeIndex] = option;

            document.querySelectorAll(".challenge-option").forEach((item, itemIndex) => {
                item.classList.toggle("selected", itemIndex === index);
            });
        });

        container.appendChild(button);
    });

    document.getElementById("challengeNextButton").textContent =
        currentChallengeIndex === currentChallengeData.length - 1
            ? "Selesaikan"
            : "Lanjutkan";
}

function finishOtherChallenge() {
    challengeRecords.unshift({
        title: currentChallengeName,
        date: getLocalDateKey(),
        answers: [...currentChallengeAnswers]
    });

    saveStoredData("doomBreakChallengeRecords", challengeRecords);

    alert("Tantangan berhasil diselesaikan!");

    showPage("homePage");
}


// ======================================
// PROFILE
// ======================================

function saveProfile() {
    const name = document.getElementById("profileName").value.trim();

    if (!name) {
        document.getElementById("profileFeedback").textContent =
            "Nama tidak boleh kosong.";

        return;
    }

    document.getElementById("greetingName").textContent =
        `Halo, ${name}`;

    document.getElementById("brandTitle").textContent =
        "DoomBreak";

    document.getElementById("profileAvatar").textContent =
        name.charAt(0).toUpperCase();

    document.getElementById("profileFeedback").textContent =
        "Profil berhasil disimpan.";

    saveStoredData("doomBreakUserName", name);
}


// ======================================
// MODE TAMPILAN
// ======================================

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const darkMode = document.body.classList.contains("dark-mode");

    saveStoredData("doomBreakDarkMode", darkMode);
}

function loadTheme() {
    const darkMode = getStoredData("doomBreakDarkMode", false);

    if (darkMode) {
        document.body.classList.add("dark-mode");
    }
}


// ======================================
// BATAS LAYAR
// ======================================

const dailyLimit = document.getElementById("dailyLimit");

dailyLimit.addEventListener("change", () => {
    saveStoredData("doomBreakDailyLimit", dailyLimit.value);
});

function loadDailyLimit() {
    const savedLimit = getStoredData("doomBreakDailyLimit", "3");

    dailyLimit.value = savedLimit;
}


// ======================================
// INIT
// ======================================

function initApp() {
    updateDateText();

    updateDashboardSlider();

    renderUsageChart();

    renderMoodChart();

    loadSelectedApps();

    loadTheme();

    loadDailyLimit();

    // Ambil nama pengguna yang tersimpan
const savedName = getStoredData("doomBreakUserName", "");

// Jika nama belum tersedia, gunakan nama default
const displayName = savedName.trim() || "Pengguna";

// Perbarui sapaan dashboard
const greetingName = document.getElementById("greetingName");

if (greetingName) {
    greetingName.textContent = `Halo, ${displayName}`;
}

// Perbarui nama di halaman profil
const profileName = document.getElementById("profileName");

if (profileName) {
    profileName.value = displayName;
}

// Perbarui inisial avatar
const profileAvatar = document.getElementById("profileAvatar");

if (profileAvatar) {
    profileAvatar.textContent =
        displayName.charAt(0).toUpperCase();
}
}
// ======================================
// RIWAYAT RESPONS FITUR DOOMBREAK
// ======================================

const featureHistoryIcons = {
    BreakMind: "🧠",
    BreakSoul: "🤲",
    SocialBreak: "👥"
};


// Mengambil daftar pertanyaan berdasarkan fitur
function getFeatureQuestions(featureName) {
    if (featureName === "MorningBreak") {
        return morningQuestions;
    }

    if (otherChallenges[featureName]) {
        return otherChallenges[featureName].questions;
    }

    return [];
}


// Membuka halaman daftar tanggal
function openFeatureHistory(featureName) {
    const title = document.getElementById("featureHistoryTitle");
    const icon = document.getElementById("featureHistoryIcon");
    const list = document.getElementById("featureHistoryList");

    if (!title || !icon || !list) return;

    title.textContent = featureName;
    icon.textContent = featureHistoryIcons[featureName] || "🌱";

    list.innerHTML = "";

    let dates = [];

    // MorningBreak menggunakan morningHistory
    if (featureName === "MorningBreak") {
        dates = Object.keys(morningHistory || {});
    } else {
        // Fitur lainnya menggunakan challengeRecords
        dates = (challengeRecords || [])
            .filter(record => record.title === featureName)
            .map(record => record.date);
    }

    // Hilangkan tanggal duplikat dan urutkan dari terbaru
    dates = [...new Set(dates)]
        .filter(Boolean)
        .sort((a, b) => b.localeCompare(a));

    if (dates.length === 0) {
        list.innerHTML = `
            <div class="history-empty">
                Belum ada rekap respons untuk fitur ini.
            </div>
        `;
    } else {
        dates.forEach(dateKey => {
            const button = document.createElement("button");

            button.className = "morning-date-button";

            button.innerHTML = `
                <span>${formatDate(dateKey)}</span>
                <span class="history-arrow">›</span>
            `;

            button.addEventListener("click", () => {
                openFeatureHistoryDetail(featureName, dateKey);
            });

            list.appendChild(button);
        });
    }

    showPage("featureHistoryPage");
}


// Membuka detail pertanyaan dan jawaban
function openFeatureHistoryDetail(featureName, dateKey) {
    const title = document.getElementById("featureDetailTitle");
    const date = document.getElementById("featureDetailDate");
    const content = document.getElementById("featureHistoryDetailContent");

    if (!title || !date || !content) return;

    title.textContent = featureName;
    date.textContent = formatDate(dateKey);

    content.innerHTML = "";

    let record;

    // Ambil data berdasarkan fitur dan tanggal
    if (featureName === "MorningBreak") {
        record = morningHistory[dateKey];
    } else {
        record = (challengeRecords || []).find(item =>
            item.title === featureName &&
            item.date === dateKey
        );
    }

    if (!record || !Array.isArray(record.answers)) {
    content.innerHTML = `
        <div class="history-qa-card">

            <div class="history-question">
                <strong>Pertanyaan</strong>
            </div>

            <div class="history-answer">
                <small>Hasil Rekapan</small>
                <p></p>
            </div>

        </div>

        <div class="history-qa-card">

            <div class="history-question">
                <strong>Jawaban</strong>
            </div>

            <div class="history-answer">
                <small>Hasil Rekapan</small>
                <p></p>
            </div>

        </div>
    `;

    showPage("featureHistoryDetailPage");
    return;
}

    const questions = getFeatureQuestions(featureName);

    record.answers.forEach((answer, index) => {
        const card = document.createElement("article");
        card.className = "history-qa-card";

        const questionText =
            questions[index]?.question ||
            `Pertanyaan ${index + 1}`;

        const questionSection = document.createElement("div");
        questionSection.className = "history-question";

        const number = document.createElement("span");
        number.className = "history-number";
        number.textContent = index + 1;

        const questionWrapper = document.createElement("div");

        const questionLabel = document.createElement("small");
        questionLabel.textContent = "Pertanyaan";

        const question = document.createElement("strong");
        question.textContent = questionText;

        questionWrapper.appendChild(questionLabel);
        questionWrapper.appendChild(question);

        questionSection.appendChild(number);
        questionSection.appendChild(questionWrapper);

        const answerSection = document.createElement("div");
        answerSection.className = "history-answer";

        const answerLabel = document.createElement("small");
        answerLabel.textContent = "Jawaban";

        const answerTextElement = document.createElement("p");
        answerTextElement.textContent =
            answer || "Tidak ada jawaban tersimpan";

        answerSection.appendChild(answerLabel);
        answerSection.appendChild(answerTextElement);

        card.appendChild(questionSection);
        card.appendChild(answerSection);

        content.appendChild(card);
    });

    showPage("featureHistoryDetailPage");
}
// =====================================
// DOOMBREAK LOGIN & REGISTER
// =====================================

function showLoginPage() {
    document.body.classList.add("auth-mode");

    document.getElementById("registerPage").classList.remove("active");
    document.getElementById("loginPage").classList.add("active");
}

function showRegisterPage() {
    document.body.classList.add("auth-mode");

    document.getElementById("loginPage").classList.remove("active");
    document.getElementById("registerPage").classList.add("active");
}


// REGISTER
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail")
            .value.trim().toLowerCase();

        const password = document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        if (password.length < 6) {
            alert("Password minimal 6 karakter.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Konfirmasi password tidak cocok.");
            return;
        }

        const users = JSON.parse(
            localStorage.getItem("doomBreakUsers") || "[]"
        );

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            alert("Email sudah terdaftar. Silakan masuk.");
            showLoginPage();
            return;
        }

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password
        };

        users.push(newUser);

        localStorage.setItem(
            "doomBreakUsers",
            JSON.stringify(users)
        );

        alert("Pendaftaran berhasil! Silakan masuk.");

        registerForm.reset();
        showLoginPage();
    });
}


// LOGIN
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail")
            .value.trim().toLowerCase();

        const password =
            document.getElementById("loginPassword").value;

        const users = JSON.parse(
            localStorage.getItem("doomBreakUsers") || "[]"
        );

        const user = users.find(
            item =>
                item.email === email &&
                item.password === password
        );

        if (!user) {
            alert("Email atau password salah.");
            return;
        }

        localStorage.setItem(
            "doomBreakCurrentUser",
            JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email
            })
        );

        alert("Login berhasil. Selamat datang, " + user.name + "!");

        loginForm.reset();

       document.body.classList.remove("auth-mode");

showPage("homePage");

updateUserHeader(user);
    });
}
// =====================================
// USER PROFILE HEADER
// =====================================

function updateUserHeader(user) {
    const greetingName = document.getElementById("greetingName");
    const userInitial = document.getElementById("userInitial");

    if (!user) {
        if (greetingName) {
            greetingName.textContent = "Pengguna";
        }

        if (userInitial) {
            userInitial.textContent = "D";
        }

        return;
    }

    const name = user.name || "Pengguna";
    const initial = name.trim().charAt(0).toUpperCase();

    if (greetingName) {
        greetingName.textContent = name;
    }

    if (userInitial) {
        userInitial.textContent = initial;
    }
}

initApp();
const currentUser = localStorage.getItem("doomBreakCurrentUser");

if (currentUser) {
    const user = JSON.parse(currentUser);

    document.body.classList.remove("auth-mode");

    showPage("homePage");
    updateUserHeader(user);
} else {
    document.body.classList.add("auth-mode");

    showPage("loginPage");
}