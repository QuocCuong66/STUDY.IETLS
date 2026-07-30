const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Khai báo PORT trước
// Render sẽ tự động cấp một PORT ngẫu nhiên qua process.env.PORT
const PORT = process.env.PORT || 5000;

// 2. Cấu hình CORS cho phép Vercel frontend truy cập
app.use(cors({
  origin: ['https://study-ietls.vercel.app', 'http://localhost:3000', 'http://127.0.0.1:5500'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Routes cơ bản
app.get('/', (req, res) => {
  res.json({ status: 'online', message: 'IELTS Wonderland Backend API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// 3. Khởi chạy Server với host '0.0.0.0' để chấp nhận kết nối bên ngoài container Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
