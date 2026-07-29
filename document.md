# 🎨 BÁO CÁO CẤU TRÚC CSS & HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM DOCUMENT)

Tài liệu này tổng hợp toàn bộ **Hệ thống Thiết kế (Design System)**, **Mã màu (Color Palette)**, **Hiệu ứng Kính (Glassmorphic FX)**, **Keyframe Animations** và **Cấu trúc CSS** của dự án **IELTS Wonderland**. Bạn có thể sao chép và tái sử dụng bộ cấu trúc này cho các dự án Web khác.

---

## 1. 🌈 Biến Môi Trường & Mã Màu (CSS Custom Properties)

Khai báo tại `:root` để dễ dàng thay đổi Theme/Color palette toàn website:

```css
:root {
    /* Palette Màu Chính */
    --primary: #FF6B6B;       /* Đỏ Coral / Hồng Nổi Bật */
    --secondary: #4ECDC4;     /* Xanh Ngọc Mint */
    --accent: #FFE66D;        /* Vàng Nắng Nổi Bật */
    --purple: #A29BFE;        /* Tím Pastel */

    /* Typography / Màu Chữ */
    --text-dark: #2d3436;      /* Đen Than / Chữ Chính */
    --text-light: #636e72;     /* Xám Ghi / Chữ Phụ */

    /* Glassmorphism Effect Tokens */
    --glass-bg: rgba(255, 255, 255, 0.4);       /* Nền kính mờ */
    --glass-border: rgba(255, 255, 255, 0.8);   /* Viền kính mờ */
}
```

---

## 2. 🌀 Hiệu Ứng Nền Động (Animated Gradient Background)

Tạo cảm giác hiện đại, chuyển động mượt mà liên tục ở background:

```css
body {
    font-family: 'Nunito', 'Poppins', sans-serif;
    color: var(--text-dark);
    min-height: 100vh;
    background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #ffd1ff, #a1c4fd, #c2e9fb);
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
```

---

## 3. 💎 Hiệu Ứng Kính Trong Suốt (Glassmorphic Cards)

### 3.1 Khung Đăng nhập / Đăng ký (Auth Card)
```css
.div1 {
    width: 420px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    color: #fff;
    padding: 30px 40px;
    border-radius: 15px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
}

.input-box input {
    width: 100%;
    height: 50px;
    background: transparent;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 40px;
    color: white;
    font-size: 16px;
    padding: 15px 45px 15px 20px;
    outline: none;
    transition: border-color 0.3s ease;
}

.input-box input:focus {
    border-color: var(--secondary);
}
```

### 3.2 Khung Nội Dung / Dashboard Section Card
```css
.section-container {
    margin-bottom: 80px;
    padding: 40px;
    background: var(--glass-bg);
    backdrop-filter: blur(15px);
    border-radius: 40px;
    border: 3px solid var(--glass-border);
}
```

---

## 4. 🔘 Nút Bấm Đa Dạng (Cute & Modern Buttons)

### 4.1 Nút Gradient Bo Tròn Siêu Đẹp (`.btn-cute`)
```css
.btn-cute {
    padding: 15px 50px;
    font-size: 1.3rem;
    font-weight: 800;
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    border: none;
    color: white;
    border-radius: 50px;
    cursor: pointer;
    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
}

.btn-cute:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 20px 30px rgba(255, 107, 107, 0.5);
}
```

### 4.2 Nút Form Nút Bấm Rộng (`.btn`)
```css
.btn {
    width: 100%;
    height: 45px;
    background: linear-gradient(45deg, var(--primary), var(--secondary));
    border: none;
    border-radius: 40px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}
```

---

## 5. 📐 Lưới Grid & Thẻ Bài Học (Responsive Grid & Cards)

```css
.lessons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
}

.lesson-card {
    background: var(--glass-bg);
    backdrop-filter: blur(15px) saturate(150%);
    border: 3px solid var(--glass-border);
    border-radius: 35px;
    padding: 35px;
    height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
}

.lesson-card:hover {
    transform: translateY(-15px) scale(1.03);
    background: rgba(255, 255, 255, 0.7);
    box-shadow: 0 30px 50px rgba(0, 0, 0, 0.15);
}
```

---

## 6. 💬 Cửa Sổ AI Chatbot Nổi (Floating Chatbot Widget)

```css
.chat-widget {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 20000;
}

.chat-button {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background: linear-gradient(45deg, var(--primary), var(--purple));
    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: 0.3s;
    font-size: 30px;
    border: 3px solid white;
}

.chat-button:hover {
    transform: scale(1.1) rotate(10deg);
}

.chat-window {
    position: absolute;
    bottom: 85px;
    right: 0;
    width: 360px;
    height: 520px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(15px);
    border-radius: 30px;
    border: 3px solid var(--primary);
    display: none;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    z-index: 20001;
}

.chat-window.active {
    display: flex;
    animation: slideUp 0.4s ease forwards;
}

@keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.message {
    padding: 12px 16px;
    border-radius: 20px;
    max-width: 82%;
    font-size: 0.95rem;
    line-height: 1.45;
}

.user-msg {
    background: var(--secondary);
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 5px;
}

.ai-msg {
    background: #f0f3f6;
    color: var(--text-dark);
    align-self: flex-start;
    border-bottom-left-radius: 5px;
}
```

---

## 7. 🎬 Cửa Sổ Xem Video Fullscreen (Fullscreen Video Overlay)

```css
.fullscreen-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
}

.fullscreen-overlay.active {
    opacity: 1;
    pointer-events: all;
}

.fullscreen-video-container {
    width: 90%;
    height: 80%;
    background: #000;
    border-radius: 20px;
    box-shadow: 0 0 50px rgba(255, 107, 107, 0.5);
    overflow: hidden;
    position: relative;
}
```

---

## 8. 📦 Mẫu HTML Để Tái Sử Dụng Nhanh (Starter Boilerplate)

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Mới của Bạn</title>
    <!-- Fonts Google -->
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;800&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <!-- Icon Boxicons -->
    <link href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Tiêu Đề Gradient ✨</h1>
        <p class="subtitle">Mô tả ngắn trang web với nền Glassmorphism mờ mượt.</p>
        <button class="btn-cute">Nút Bấm Xịn Xò 🚀</button>
    </div>
</body>
</html>
```

---
*Tài liệu này được trích xuất hoàn chỉnh từ giao diện dự án IELTS Wonderland.*
