# IARE Connect

**Mini MERN Authentication & Role-Based Dashboard** — built for the CDC Developer Selection Assignment.

IARE Connect is a deliberately small, complete MERN application that demonstrates **authentication**, **role-based access control**, **basic account management** and a **clean React UI**. Three roles exist — **Admin**, **Faculty** and **Student**. The Admin creates Faculty and Student accounts. Faculty and Students log in and view **only their own profile**. Every Student additionally sees a **unique QR code** on their dashboard.

> This assignment is intentionally small. There is **no attendance scanning** and **no course management** — only what the assignment asks for.

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React (JavaScript) + Vite, Tailwind CSS, React Router |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Passwords | bcrypt (bcryptjs — pure-JS bcrypt implementation), strength 10 |
| Sessions | JWT stored in an **httpOnly** cookie |
| Version control | Git & GitHub |

---

## Project Structure

```
project/
  server/
    src/
      config/db.js
      models/User.js
      controllers/
        auth.controller.js
        admin.controller.js
        profile.controller.js
      routes/
        auth.routes.js
        admin.routes.js
        profile.routes.js
      middleware/
        auth.middleware.js
        role.middleware.js
        error.middleware.js
      scripts/seedAdmin.js
      utils/
        generateToken.js
        sanitizeUser.js
      app.js
      server.js
    .env.example
    package.json

  client/
    src/
      api/
        apiClient.js
        auth.api.js
        admin.api.js
        profile.api.js
      components/
        Navbar.jsx
        ProtectedRoute.jsx
        RoleRoute.jsx
        FormInput.jsx
        ChangePasswordModal.jsx
        ResetPasswordModal.jsx
        Toast.jsx
        LoginCinematic.jsx
        RoleOrbitArt.jsx
        ScrollToTop.jsx
      pages/
        LoginPage.jsx
        AdminDashboard.jsx
        FacultyDashboard.jsx
        StudentDashboard.jsx
      context/AuthContext.jsx
      App.jsx
      index.css
      main.jsx
    package.json

  README.md
```

Models, routes, controllers, middleware and React components are organised by responsibility — the backend is never a single file.

---

## Setup Instructions

**Prerequisites:** Node.js 18+, npm, and a running MongoDB (local install or Atlas).

### 1. Clone and install

```bash
git clone <your-repo-url> iare-connect
cd iare-connect

# Backend dependencies
cd server
npm install

# Frontend dependencies (new terminal)
cd ../client
npm install
```

### 2. Configure the backend environment

```bash
cd server
cp .env.example .env
```

Open `server/.env` and fill in every value (see the table below).

### 3. Seed the initial Admin

```bash
cd server
npm run seed:admin
```

### 4. Start everything

```bash
# Terminal 1 — API on http://localhost:5000
cd server
npm run dev          # or: npm start

# Terminal 2 — React on http://localhost:5173
cd client
npm run dev
```

Open **http://localhost:5173**, log in as the seeded Admin, create a Faculty and a Student account, then log in as each to see their dashboards.

---

## Deploying to Render (single web service)

The API also serves the built React app whenever `client/dist` exists, so **one
Render web service hosts the whole product** on a single origin — no CORS or
cookie issues, and every feature behaves exactly as it does locally.

1. In Render choose **New → Web Service** and connect this GitHub repository.
2. Use these settings:

   | Field | Value |
   | --- | --- |
   | Root Directory | *(leave empty — repository root)* |
   | Runtime | Node |
   | Build Command | `npm --prefix client install --include=dev && npm --prefix client run build && npm --prefix server install` |
   | Start Command | `npm --prefix server start` |
   | Health Check Path | `/` |

3. Add the environment variables (**Environment** tab):

   | Variable | Value |
   | --- | --- |
   | `MONGO_URI` | your **MongoDB Atlas** connection string (allow-list `0.0.0.0/0` or Render's IPs) |
   | `JWT_SECRET` | any long random string |
   | `SEED_ADMIN_EMAIL` | the Admin email you want (e.g. `admin@iare.ac.in`) |
   | `SEED_ADMIN_PASSWORD` | the Admin password (8+ chars) — shared out-of-band, never committed |

4. **Nothing else to seed** — the server creates the Admin automatically on
   its first boot from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` (idempotent;
   it never changes an existing password). If you ever want to create it
   manually instead, run `npm --prefix server run seed:admin` from the
   Render Shell.
5. Open the service URL — the login page is served from the same origin, the session cookie is set securely, and all features (roles, QR codes, password flows) work.

Notes:
- Render runs with `NODE_ENV=production`, so the auth cookie is automatically `Secure` (HTTPS is included by default).
- `.nvmrc` pins Node 22.
- Split-deploy alternative (static site for the client + separate API service): set `VITE_API_URL=https://<api-host>/api` in the client's build environment and `CLIENT_ORIGIN=https://<client-host>` on the API.

---

## Environment Variables

`server/.env` (copy from `server/.env.example` — **the real `.env` is never committed**):

| Variable | Example | Purpose |
| --- | --- | --- |
| `PORT` | `5000` | Port the Express API listens on |
| `MONGO_URI` | `mongodb://127.0.0.1:27017/iare-connect` | MongoDB connection string |
| `JWT_SECRET` | *(long random string)* | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | `1d` | Session lifetime (`1d`, `12h`, `60m`…) |
| `CLIENT_ORIGIN` | `http://localhost:5173,http://localhost:5174` | Allowed CORS origin(s) — comma-separated list allowed |
| `NODE_ENV` | `development` | `production` makes the auth cookie `Secure` |
| `SEED_ADMIN_EMAIL` | *(you choose)* | Email of the Admin created by the seed script |
| `SEED_ADMIN_PASSWORD` | *(you choose, 8+ chars)* | Password of the seeded Admin (min 8 chars) |

---

## Seeding the initial Admin

There is **no public Admin registration**. The first Admin is created only by the seed script:

```bash
cd server
npm run seed:admin
```

- Reads `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` from `server/.env` — no credentials are committed to GitHub.
- The password is stored **only as a bcrypt hash**.
- Running the script twice is safe: it detects the existing Admin and exits without changes.

When the Admin creates a **Faculty** or **Student** account, no password is typed — it **defaults to the account's email address** (e.g. `patro@iare.ac.in`, `26951A1278@iare.ac.in`). Passwords are case-insensitive, so any capitalisation logs in. An Admin can re-issue a credential any time with the per-row **Reset password** action, which applies the same username-as-password rule.

**Demo credentials** for evaluation are shared separately with the evaluation team through a safe channel (never committed to this repository).

---

## API Endpoints

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | Public | Authenticate a user (email + password) |
| POST | `/api/auth/logout` | Authenticated | Log out / clear the session cookie |
| GET | `/api/auth/me` | Authenticated | Return the logged-in user's basic details |
| PUT | `/api/auth/change-password` | Faculty & Student | Change your own password (current one required) |
| POST | `/api/admin/faculty` | Admin only | Create a Faculty account |
| GET | `/api/admin/faculty` | Admin only | List Faculty accounts |
| POST | `/api/admin/students` | Admin only | Create a Student account |
| GET | `/api/admin/students` | Admin only | List Student accounts |
| PUT | `/api/admin/users/:userId/reset-password` | Admin only | Reset a Faculty/Student password to their username |
| GET | `/api/profile/me` | Authenticated | Return the current user's own profile |

### How it works

- **Login** (`POST /api/auth/login`) verifies the bcrypt hash and returns the user, setting a JWT (`{ id, role }`) in an **httpOnly, SameSite=Lax cookie** — JavaScript on the frontend can never read the token. An optional `role` field names the sign-in tab that was used; an account may only sign in from its own tab, and that check runs **only after the password matches**, so it adds no account-enumeration vector.
- **Every protected route** runs `auth.middleware.js` (`protect`), which verifies the JWT and loads the user **from the database**. Role checks are then enforced by `role.middleware.js` (`authorize('admin')`) **inside Express** — hiding buttons in React is never the security boundary.
- **`/api/profile/me`** takes the user from the verified session. No user id or role is accepted from the frontend, so one user can never request another user's profile.
- **Duplicate email / roll number** conflicts return `409` with a friendly message (unique indexes + graceful error handling).
- **Password hashes are never returned** — excluded at the schema level (`select: false`) and again in `sanitizeUser`.

### Database model

A single `User` model with a `role` field:

| Field | Notes |
| --- | --- |
| `name` | Required |
| `email` | Required, **unique**, lowercased |
| `passwordHash` | bcrypt hash only — plaintext is never stored, `select: false` |
| `role` | `admin` \| `faculty` \| `student` (enum) |
| `rollNumber` | Required for students, **unique** (sparse index) |
| `branch` | Students — study branch (e.g. Information Technology) |
| `studentQrId` | Students only — **unique** random identifier (`IARE-STU-…`) |
| timestamps | `createdAt` / `updatedAt` |

### The student QR code

Every Student dashboard renders a QR code generated **in the browser** from their `studentQrId`. The QR contains **only that non-sensitive identifier** — never a password and never an authentication token. QR scanning and attendance recording are out of scope for this assignment.

---

## Features at a glance

- **Login page** — email + password, show/hide password, loading state, clear invalid-credentials error, responsive split layout.
- **Admin dashboard** — simple tab navigation: *Add Faculty*, *Add Student*, *Faculty List*, *Student List*; success and validation banners; loading skeletons; empty states.
- **Faculty dashboard** — name, email, role, logout.
- **Student dashboard** — name, email, roll number, branch, role, **unique QR code**, logout.
- **Password management** — Faculty & Students change their own password from the Navbar name menu; the Admin can re-issue any credential with the per-row **Reset password** action. Passwords are case-insensitive.
- **Sign-in cinematic** — a short, calm 4-second animation plays after successful authentication before the dashboard opens (skippable; honours reduced-motion).
- Light **and** dark theme with a toggle (preference saved locally).
- Clear **empty, loading and error** states on every page.

---

## Testing Checklist (verified)

All items from the assignment's testing checklist were exercised end-to-end against the running API:

- [x] Seeded Admin can log in.
- [x] Invalid credentials are rejected (same message for unknown email vs wrong password — no account enumeration).
- [x] Admin can create Faculty and Student accounts.
- [x] Duplicate emails are rejected (409).
- [x] Duplicate student roll numbers are rejected (409).
- [x] Newly created Faculty can log in and view their own profile.
- [x] Newly created Student can log in and view their own profile and QR code.
- [x] Each student receives a unique QR code.
- [x] Faculty cannot access Admin-only APIs (403).
- [x] Student cannot access Admin-only APIs (403).
- [x] A user cannot request another user's profile by changing a URL or request body (identity always comes from the verified JWT).
- [x] Password hashes are not included in API responses.
- [x] Logout and protected-page behavior work correctly (401 after logout; unauthenticated access blocked).

Extensions beyond the assignment document (role-tab sign-in, self-service password change, Admin credential reset, case-insensitive passwords) were verified end-to-end against the live API the same way.

---

## Screenshots

_Add screenshots (or a 3–5 minute demo video) before submitting:_

1. Login page (and an invalid-credentials error)
2. Admin dashboard — creating a Faculty account (success banner)
3. Admin dashboard — creating a Student account (success message with generated QR ID)
4. Admin dashboard — Faculty list and Student list
5. Faculty dashboard — own profile only
6. Student dashboard — own profile **with the unique QR code**
7. Faculty/Student hitting an Admin API → `403` (browser dev-tools / response)

```bash
# Capture from a running app:
# Terminal 1: cd server && npm run dev
# Terminal 2: cd client && npm run dev
```

---

## AI Tools Used

- **Claude (Anthropic) via OpenCode** — used to draft the Express/Mongoose backend, the React/Tailwind frontend and this README.
- The generated code was **run and tested end-to-end**: the seed script, login for all three roles, account creation, duplicate-email and duplicate-roll-number rejections, role-based API denials, profile isolation, QR uniqueness, and logout behaviour were all verified against a live MongoDB before submission.

---

## Known Limitations

- **Deliberately out of scope** (per the assignment): attendance scanning, course management, self-service password recovery by email (an Admin can still re-issue credentials — see *Seeding the initial Admin*), email verification, profile images and editing/deleting accounts.
- Login sessions are stored in an httpOnly cookie — over plain `http://localhost` this is fine for evaluation; deploy behind **HTTPS** with `NODE_ENV=production` for real use.
- No rate limiting or account lockout on login (kept minimal for the assignment).
- The QR code is generated client-side from the `studentQrId`; building a scanner is explicitly out of scope.
- No automated test suite — verification was done with an end-to-end manual/API check of the assignment's testing checklist.

---

## Security Notes

- Passwords hashed with bcrypt (strength 10); plaintext passwords are never stored or logged.
- Auth secret and MongoDB URI live only in environment variables; `.env` is git-ignored, `.env.example` is committed with placeholders.
- Admin endpoints require authentication **and** the `admin` role in Express middleware.
- The profile endpoint returns only the authenticated user's own record.
- Inputs are validated server-side (email format, required fields, role values, student roll numbers, 8+ character passwords) and duplicate email/roll number errors are handled gracefully.
