// App configuration for IELTS Wonderland Frontend
const IS_LOCAL = ['localhost', '127.0.0.1'].includes(window.location.hostname);

const CONFIG = {
    // Production calls /api on the same domain; vercel.json proxies it to the Render backend
    API_BASE_URL: IS_LOCAL ? 'http://localhost:8000' : '',

    // Firebase Console → Project settings → General → Your apps → SDK setup and configuration
    FIREBASE: {
        apiKey: "AIzaSyCa7Q4bXbx-TH74ibInrl_uc9a-IyC-ufQ",
        authDomain: "study-ce4fa.firebaseapp.com",
        projectId: "study-ce4fa",
        appId: "1:285060171147:web:39a96797315e6be8489b8e"
    },

    LOGIN_PAGE: 'index.html',
    HOME_PAGE: 'speaking_ietls.html'
};

// Fetch wrapper that always sends the session cookie and returns parsed JSON.
// Throws an Error carrying `status` and the server's `detail` message on failure.
async function api(path, { method = 'GET', body } = {}) {
    const res = await fetch(`${CONFIG.API_BASE_URL}${path}`, {
        method,
        credentials: 'include',
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        const error = new Error(data.detail || `Lỗi máy chủ (${res.status})`);
        error.status = res.status;
        throw error;
    }
    return data;
}
