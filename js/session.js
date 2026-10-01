// Guards protected pages: redirects to login when the session cookie is missing or expired
const Session = {
    user: null,

    async require() {
        try {
            this.user = await api('/api/me');
            const nameEl = document.getElementById('user-name');
            if (nameEl) nameEl.innerText = this.user.name || this.user.email;
        } catch (err) {
            if (err.status === 401) this.redirectToLogin();
        }
    },

    async logout() {
        try {
            await api('/api/logout', { method: 'POST' });
        } finally {
            this.redirectToLogin();
        }
    },

    redirectToLogin() {
        window.location.replace(CONFIG.LOGIN_PAGE);
    }
};

Session.require();
