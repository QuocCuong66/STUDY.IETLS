// IELTS Wonderland Chatbot Logic

function toggleChat() {
    const chatWin = document.getElementById('chat-window');
    if (!chatWin) return;
    
    const isActive = chatWin.classList.toggle('active');

    if (isActive) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(chatWin, 
                { scale: 0.8, opacity: 0, y: 50 }, 
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
            );
        }
        const inputField = document.getElementById('chat-input');
        if (inputField) inputField.focus();
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const container = document.getElementById('chat-messages');
    if (!input || !container) return;

    const userText = input.value.trim();
    if (!userText) return;

    // 1. Render User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-msg';
    userDiv.innerText = userText;
    container.appendChild(userDiv);

    input.value = '';
    container.scrollTop = container.scrollHeight;

    // 2. Render Loading State
    const aiDiv = document.createElement('div');
    aiDiv.className = 'message ai-msg';
    aiDiv.innerText = "Đang suy nghĩ...";
    container.appendChild(aiDiv);
    container.scrollTop = container.scrollHeight;

    // 3. Call Backend FastAPI Chatbot Endpoint
    try {
        const data = await api('/api/chat', { method: 'POST', body: { message: userText } });
        aiDiv.innerText = data.response;
    } catch (error) {
        console.error("Chatbot API Error:", error);
        if (error.status === 401) return Session.redirectToLogin();
        aiDiv.innerText = error.status
            ? error.message
            : "Lỗi kết nối Server Backend! Vui lòng kiểm tra lại.";
        aiDiv.style.color = "red";
    }

    container.scrollTop = container.scrollHeight;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
