const path = require('path');
const fs = require('fs');
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

// Serve the built React app when it is present (production deploys such as
// Render). One web service then hosts BOTH the API and the UI on the same
// origin — no CORS and no cookie issues. In local development the Vite dev
// server serves the UI and this block simply stays inert.
const CLIENT_DIST = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));

  // SPA fallback — any non-API GET (e.g. /faculty, /student) returns
  // index.html so deep links and refreshes work with React Router's
  // HashRouter (and with any future browser route).
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(CLIENT_DIST, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

module.exports = app;
