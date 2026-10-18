const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const profileRoutes = require('./routes/profile.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// CORS — only the React app may call the API, and it may send cookies.
// CLIENT_ORIGIN may list several origins separated by commas, e.g.
// "http://localhost:5173,http://localhost:5174" (Vite auto-increments the
// port when 5173 is already in use).
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// API routes (exactly the contract from the assignment document)
app.use('/api/auth', authRoutes); // login, logout, me
app.use('/api/admin', adminRoutes); // create/list faculty & students (admin only)
app.use('/api/profile', profileRoutes); // current user's own profile

app.use(notFound);
app.use(errorHandler);

module.exports = app;
