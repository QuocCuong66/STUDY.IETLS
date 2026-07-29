// Fallback users for local offline use
const LOCAL_USERS = [
    { username: "lengocvananh", password: "181007" },
    { username: "admin", password: "123456" },
    { username: "hocvien1", password: "matkhau1" },
    { username: "hocvien2", password: "matkhau2" },
    { username: "giangvien", password: "gv2025" },
    { username: "nguyenan", password: "an123" },
    { username: "lethao", password: "thao321" }
];

async function login() {
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
    const localUser = LOCAL_USERS.find(u => u.username === username && u.password === password);
    if (localUser) {
        alert("Đăng nhập thành công! (Chế độ Local)");
        localStorage.setItem("user", username);
        window.location.href = "speaking_ietls.html";
    } else {
        alert("Sai tài khoản hoặc mật khẩu!");
    }

    return false;
}
