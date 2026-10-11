# Charity Compass

Charity Compass (also called Charity Finder) is a full-stack web application that helps users discover charitable organizations, save favourites, make donations, and track donation activity from a personal dashboard.

## Features

- Browse charities by category
- User registration and authentication
- Favourite/bookmark charities
- Donation flow with Razorpay integration
- Personal donation dashboard
- Charity registration
- Email OTP support
- Image uploads through Cloudinary

## Tech Stack

**Frontend**
- React 18
- Vite
- React Router
- React Icons
- React Hot Toast
- Razorpay

**Backend**
- Node.js
- Express
- MongoDB + Mongoose
- JWT authentication
- bcryptjs
- Cloudinary
- Nodemailer
- Razorpay

## Project Structure

```text
charity-finder-main/
├── client/   # React + Vite frontend
└── server/   # Express + MongoDB backend
```

## Local Setup

### 1. Requirements

- Node.js 18+
- MongoDB
- Git

### 2. Backend

```bash
cd server
npm install
```

Copy `server/.env.example` to `server/.env` and fill in the values required for the features you want to use.

Then run:

```bash
npm run dev
```

The backend runs on port `8000` by default.

### 3. Frontend

Open a second terminal:

```bash
cd client
npm install
```

Copy `client/.env.example` to `client/.env` and set the frontend API URL.

Then run:

```bash
npm run dev
```

Open the local URL shown by Vite (normally `http://localhost:5173`).

## Security

Environment files containing secrets are intentionally excluded from this repository. Never commit database credentials, JWT secrets, API secrets, email passwords, or other private credentials.

## Documentation

See `PROJECT_DOCS.md` for a detailed explanation of the architecture, database models, and application flow.
