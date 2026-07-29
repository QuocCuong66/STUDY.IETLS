// Fallback users for local offline use
const DEFAULT_LOCAL_USERS = [
    { username: "lengocvananh", password: "181007" },
    { username: "admin", password: "123456" },
    { username: "hocvien1", password: "matkhau1" },
    { username: "hocvien2", password: "matkhau2" },
    { username: "giangvien", password: "gv2025" },
    { username: "nguyenan", password: "an123" },
    { username: "lethao", password: "thao321" }
];

function getLocalUsers() {
    try {
        const stored = localStorage.getItem("custom_users");
        if (stored) {
            const customUsers = JSON.parse(stored);
            return [...DEFAULT_LOCAL_USERS, ...customUsers];
        }
    } catch (e) {
        console.error("Error reading custom users from localStorage", e);
    }
    return DEFAULT_LOCAL_USERS;
}

function saveCustomUser(username, password) {
    try {
        const stored = localStorage.getItem("custom_users");
        const customUsers = stored ? JSON.parse(stored) : [];
        if (!customUsers.some(u => u.username === username)) {
            customUsers.push({ username, password });
            localStorage.setItem("custom_users", JSON.stringify(customUsers));
        }
    } catch (e) {
        console.error("Error saving custom user to localStorage", e);
    }
}

// Show/Hide Register & Login forms
function showRegisterForm() {
    const loginBox = document.getElementById("login-box");
    const registerBox = document.getElementById("register-box");
    if (loginBox) loginBox.style.display = "none";
    if (registerBox) registerBox.style.display = "block";
}

function showLoginForm() {
    const loginBox = document.getElementById("login-box");
    const registerBox = document.getElementById("register-box");
    if (registerBox) registerBox.style.display = "none";
    if (loginBox) loginBox.style.display = "block";
}

async function login(event) {
    if (event) event.preventDefault();
    
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    
    if (!usernameInput || !passwordInput) return false;
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        alert("Vui lòng nhập tài khoản và mật khẩu!");
        return false;
    }

    try {
        // Try calling Backend API
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                alert(data.message || "Đăng nhập thành công!");
                localStorage.setItem("user", username);
                window.location.href = "speaking_ietls.html";
                return false;
            } else {
                alert(data.message || "Sai tài khoản hoặc mật khẩu!");
                return false;
            }
        }
    } catch (err) {
        console.warn("Backend API error or offline, checking local fallback credentials:", err);
    }

    // Local fallback if API is not reachable
    const usersList = getLocalUsers();
    const localUser = usersList.find(u => u.username === username && u.password === password);
    if (localUser) {
        alert("Đăng nhập thành công! (Chế độ Local)");
        localStorage.setItem("user", username);
        window.location.href = "speaking_ietls.html";
    } else {
        alert("Sai tài khoản hoặc mật khẩu!");
    }

    return false;
}

async function register(event) {
    if (event) event.preventDefault();

    const regUsernameInput = document.getElementById("reg-username");
    const regPasswordInput = document.getElementById("reg-password");
    const regConfirmInput = document.getElementById("reg-confirm-password");

    if (!regUsernameInput || !regPasswordInput || !regConfirmInput) return false;

    const username = regUsernameInput.value.trim();
    const password = regPasswordInput.value.trim();
    const confirmPassword = regConfirmInput.value.trim();

    if (!username || !password || !confirmPassword) {
        alert("Vui lòng điền đầy đủ các thông tin đăng ký!");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không trùng khớp!");
        return false;
    }

    let isSuccess = false;
    let successMsg = "Đăng ký tài khoản thành công!";

    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                isSuccess = true;
                successMsg = data.message;
            } else {
                alert(data.message || "Đăng ký không thành công!");
                return false;
            }
        }
    } catch (err) {
        console.warn("Backend API offline, registering locally in browser storage:", err);
        const usersList = getLocalUsers();
        if (usersList.some(u => u.username === username)) {
            alert("Tài khoản đã tồn tại! Vui lòng chọn tên khác.");
            return false;
        }
        isSuccess = true;
        successMsg = "Đăng ký tài khoản thành công (Chế độ Local)!";
    }

    if (isSuccess) {
        saveCustomUser(username, password);
        alert(successMsg);
        // Fill login inputs automatically
        const loginUsernameInput = document.getElementById("username");
        const loginPasswordInput = document.getElementById("password");
        if (loginUsernameInput) loginUsernameInput.value = username;
        if (loginPasswordInput) loginPasswordInput.value = password;
        
        // Clear register inputs
        regUsernameInput.value = "";
        regPasswordInput.value = "";
        regConfirmInput.value = "";
        
        showLoginForm();
    }

    return false;
}
