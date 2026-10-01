// Login & register via Firebase Auth. The ID token is exchanged for an HttpOnly session cookie
// on the backend, so Firebase keeps nothing in the browser (in-memory persistence).
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
    initializeAuth,
    inMemoryPersistence,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const auth = initializeAuth(initializeApp(CONFIG.FIREBASE), { persistence: inMemoryPersistence });

const FIREBASE_ERRORS = {
    "auth/invalid-credential": "Sai email hoặc mật khẩu!",
    "auth/invalid-email": "Email không hợp lệ!",
    "auth/user-disabled": "Tài khoản đã bị khóa!",
    "auth/email-already-in-use": "Email này đã được đăng ký!",
    "auth/weak-password": "Mật khẩu phải có ít nhất 6 ký tự!",
    "auth/too-many-requests": "Bạn thử quá nhiều lần, vui lòng đợi một lát!",
    "auth/network-request-failed": "Lỗi kết nối mạng!"
};

const $ = (id) => document.getElementById(id);

function errorMessage(err) {
    return FIREBASE_ERRORS[err.code] || err.message || "Đã có lỗi xảy ra, vui lòng thử lại!";
}

// Disables the form's submit button while `task` runs and reports any error
async function submitting(form, task) {
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
        await task();
    } catch (err) {
        console.error(err);
        alert(errorMessage(err));
    } finally {
        button.disabled = false;
    }
}

async function startSession(user, remember) {
    try {
        const idToken = await user.getIdToken();
        await api('/api/session', { method: 'POST', body: { idToken, remember } });
    } finally {
        await signOut(auth);
    }
    window.location.replace(CONFIG.HOME_PAGE);
}

function showForm(name) {
    $("login-box").hidden = name !== "login";
    $("register-box").hidden = name !== "register";
}

$("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    submitting(e.target, async () => {
        const { user } = await signInWithEmailAndPassword(auth, $("email").value.trim(), $("password").value);
        await startSession(user, $("remember").checked);
    });
});

$("register-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const password = $("reg-password").value;
    if (password !== $("reg-confirm-password").value) {
        alert("Mật khẩu xác nhận không trùng khớp!");
        return;
    }
    submitting(e.target, async () => {
        const { user } = await createUserWithEmailAndPassword(auth, $("reg-email").value.trim(), password);
        await updateProfile(user, { displayName: $("reg-name").value.trim() });
        await startSession(user, false);
    });
});

$("forgot-password").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = $("email").value.trim() || prompt("Nhập email của bạn để đặt lại mật khẩu:");
    if (!email) return;
    try {
        await sendPasswordResetEmail(auth, email);
        alert(`Đã gửi email đặt lại mật khẩu tới ${email}.`);
    } catch (err) {
        alert(errorMessage(err));
    }
});

$("show-register").addEventListener("click", (e) => { e.preventDefault(); showForm("register"); });
$("show-login").addEventListener("click", (e) => { e.preventDefault(); showForm("login"); });

// Already signed in → skip the login page
api('/api/me').then(() => window.location.replace(CONFIG.HOME_PAGE)).catch(() => {});
