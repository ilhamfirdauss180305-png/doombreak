// ======================================
// DOOMBREAK AUTHENTICATION
// ======================================


// ======================================
// REGISTER
// ======================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document
            .getElementById("registerName")
            .value.trim();

        const email = document
            .getElementById("registerEmail")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("registerPassword")
            .value;

        const confirmPassword = document
            .getElementById("confirmPassword")
            .value;


        // Validasi password

        if (password.length < 6) {
            alert("Password minimal 6 karakter.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Konfirmasi password tidak cocok.");
            return;
        }


        // Ambil data pengguna

        const users = JSON.parse(
            localStorage.getItem("doomBreakUsers") || "[]"
        );


        // Periksa email

        const existingUser = users.find(
            user => user.email === email
        );

        if (existingUser) {
            alert("Email sudah terdaftar. Silakan masuk.");
            window.location.href = "login.html";
            return;
        }


        // Buat akun baru

        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: password
        };


        // Simpan akun

        users.push(newUser);

        localStorage.setItem(
            "doomBreakUsers",
            JSON.stringify(users)
        );


        alert("Pendaftaran berhasil! Silakan masuk.");

        registerForm.reset();

        window.location.href = "login.html";
    });
}



// ======================================
// LOGIN
// ======================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document
            .getElementById("loginEmail")
            .value.trim()
            .toLowerCase();

        const password = document
            .getElementById("loginPassword")
            .value;


        // Ambil data pengguna

        const users = JSON.parse(
            localStorage.getItem("doomBreakUsers") || "[]"
        );


        // Cari akun

        const user = users.find(
            item =>
                item.email === email &&
                item.password === password
        );


        // Jika akun tidak ditemukan

        if (!user) {
            alert("Email atau password salah.");
            return;
        }


        // Simpan pengguna yang sedang login

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

        window.location.href = "index.html";
    });
}