// API Configuration for IELTS Wonderland Frontend
const CONFIG = {
    // Automatically use local backend during development, or set your Render backend URL for production
    API_BASE_URL: (function() {
        if (typeof window !== 'undefined') {
            const host = window.location.hostname;
            const port = window.location.port;
            // If running locally or opened directly via file://
            if (host === 'localhost' || host === '127.0.0.1' || window.location.protocol === 'file:') {
                // If loaded from port 5000 (Node backend), or default port 8000
                if (port === '5000') {
                    return 'http://localhost:5000';
                }
                return 'http://localhost:8000';
            }
            if (window.BACKEND_URL) {
                return window.BACKEND_URL;
            }
        }
        return 'https://ielts-backend.onrender.com';
    })()
};

console.log("IELTS Wonderland API connected to:", CONFIG.API_BASE_URL);
