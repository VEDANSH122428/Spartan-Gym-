# Spartans Gym

A website and admin panel for Spartans Gym, Pilkhuwa. Visitors can browse the gym, pick a membership plan, pay by UPI and register. The gym owner manages daily attendance and memberships from a password-protected admin dashboard.

**Live site:** https://spartan-gym-frontend.onrender.com
**API:** https://spartan-gym-backend.onrender.com/api/

> Both services run on Render's free tier, so the first request after a quiet period can take up to a minute while the backend wakes up.

## Features

**Public website**
- Hero, about, facilities, trainers, gym timings and reviews sections
- Membership plans with a "Pay Now" popup: a UPI QR code generated for the chosen plan's amount, a copyable UPI ID and an "Open UPI App" button
- Member registration form
- Contact section with WhatsApp chat, "Get Directions" and an embedded Google Map
- 3D gym tour section (placeholder, 360 photos coming soon)

**Admin dashboard**
- Secure admin login (JWT)
- Mark each member present or absent for the day, with live counts
- Export the day's attendance to Excel
- Activate or renew a membership: pick a start date and the end date is calculated from the member's plan
- Membership status per member: pending, active or expired
- Automatic emails: a reminder 3 days before a membership expires, and a notice when it has expired

## Tech stack

| Part | Technology |
|---|---|
| Frontend | React (Create React App + craco), Tailwind CSS, shadcn/ui, React Router, Axios |
| Backend | Python, FastAPI, Motor (async MongoDB driver), PyJWT, bcrypt, openpyxl |
| Database | MongoDB Atlas |
| Hosting | Render (backend web service + frontend static site) |
| Scheduling | GitHub Actions (daily expiry check) |
| Email | Gmail SMTP with an app password |

## Project structure

```
.
├── backend/
│   ├── server.py            # FastAPI app: all API routes and models
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── App.js           # Routes
│       └── pages/
│           ├── HomePage.js
│           ├── RegisterPage.js
│           ├── AdminLogin.js
│           └── AdminDashboard.js
└── .github/workflows/
    └── check-expiry.yml     # Daily membership expiry check
```

## Environment variables

**Backend** (`backend/.env` locally, or Render's Environment tab):

| Variable | Purpose |
|---|---|
| `MONGO_URL` | MongoDB Atlas connection string |
| `DB_NAME` | Database name |
| `CORS_ORIGINS` | Allowed origins (`*` or your frontend URL) |
| `JWT_SECRET` | Long random string used to sign admin tokens |
| `EMAIL_ADDRESS` | Gmail address that sends reminder emails |
| `EMAIL_APP_PASSWORD` | Gmail app password (not your normal password) |
| `CRON_SECRET` | Shared secret protecting the expiry-check endpoint |

**Frontend** (`frontend/.env`):

| Variable | Purpose |
|---|---|
| `REACT_APP_BACKEND_URL` | Base URL of the backend, without `/api` |

Never commit `.env` files or real credentials.

## Run locally

Prerequisites: Python 3.11, Node.js, Yarn, and a MongoDB database (a free Atlas cluster works).

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --port 8001

# Frontend (in a second terminal)
cd frontend
yarn install
yarn start
```

Set `REACT_APP_BACKEND_URL=http://localhost:8001` in `frontend/.env` for local development.

On a fresh database, create the admin account once by sending a `POST` request to `/api/admin/setup`. Then log in at `/admin/login`.

## Deployment (Render)

**Backend: Web Service**
- Build command: `cd backend && pip install -r requirements.txt`
- Start command: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
- Environment: all backend variables above, plus `PYTHON_VERSION=3.11.9`

**Frontend: Static Site**
- Build command: `cd frontend && yarn install && yarn build`
- Publish directory: `frontend/build`
- Environment: `REACT_APP_BACKEND_URL` set to the backend URL

**MongoDB Atlas**
- Under Network Access, allow `0.0.0.0/0` so Render can connect.

Both services auto-deploy when you push to `main`.

## Daily expiry check

`.github/workflows/check-expiry.yml` runs every day at 03:00 UTC (08:30 IST) and calls `POST /api/cron/check-expiry` with an `X-Cron-Secret` header. The endpoint emails members whose membership ends in 3 days and marks lapsed memberships as expired.

Add the same secret value as a repository secret named `CRON_SECRET` (Settings > Secrets and variables > Actions). You can also run the workflow manually from the Actions tab.

## API overview

| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | `/api/admin/setup` | none | Create the initial admin account |
| POST | `/api/admin/login` | none | Admin login, returns a JWT |
| POST | `/api/members` | none | Register a member |
| GET | `/api/members` | admin | List members |
| PUT | `/api/members/{id}/membership` | admin | Activate or renew a membership |
| POST | `/api/attendance` | admin | Mark attendance for today |
| GET | `/api/attendance/today` | admin | Today's attendance |
| GET | `/api/attendance/export` | admin | Download attendance as Excel |
| POST | `/api/cron/check-expiry` | cron secret | Send reminders and expire memberships |

## Roadmap

- Monthly attendance summary with one-click download
- Diet request panel (member request, admin reply, automatic email)
- AI-generated personal workout plans
- Daily check-in streaks and badges
- 360-degree virtual gym tour

## Author

Built by Vedansh Goel.
