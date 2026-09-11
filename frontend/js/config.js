// API Configuration for IELTS Wonderland Frontend
const CONFIG = {
    // Automatically use local backend during development, or set your Render backend URL for production
    // Example Render URL: 'https://ielts-backend.onrender.com'
    API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'
        ? 'http://localhost:8000'
        : (window.BACKEND_URL || 'https://study-ietls-1.onrender.com')
};

console.log("IELTS Wonderland API connected to:", CONFIG.API_BASE_URL);
