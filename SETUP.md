# How to Run Charity Compass Locally

Follow these steps in order. Whole thing takes about 10 minutes.

---

## 1. What you need installed

- **Node.js** (v18 or later) — https://nodejs.org
- **MongoDB Community** — the database
- **Git** (only if you're cloning from GitHub) — https://git-scm.com

### Install MongoDB

**On macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**On Windows:**
Download the installer from https://www.mongodb.com/try/download/community and follow the setup. Make sure "Install MongoDB as a Service" is checked so it starts automatically.

**On Linux (Ubuntu/Debian):**
Follow the official guide: https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/

**Check MongoDB is running:**
```bash
# macOS/Linux
lsof -i:27017
# Windows
netstat -an | findstr 27017
```
You should see something listening on port `27017`.

---

## 2. Get the code

If you got the folder as a zip, unzip it. If it's on GitHub:
```bash
git clone <the-repo-url>
cd charity-finder-main
```

The project has **two folders**:
- `client/` — the React frontend
- `server/` — the Node.js backend

---

## 3. Set up the server

```bash
cd server
npm install
```

Create a file called `.env` inside the `server/` folder and paste this into it:

```env
PORT=8000
CORS_ORIGIN=http://localhost:5173

MONGODB_URI=mongodb://127.0.0.1:27017
DB_NAME=charity_finder

ACCESS_TOKEN_SECRET=dev_access_token_secret_change_me
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=dev_refresh_token_secret_change_me
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RAZORPAY_KEY=your_razorpay_test_key
RAZORPAY_SECRET=

MAIL_HOST=smtp.gmail.com
USER_MAIL=
USER_PASS=
```

> The Cloudinary, Razorpay-secret, and mail fields can stay blank. Auth and browsing will work; only image uploads / real payments / OTP emails need those filled in.

Start the server:
```bash
npm run dev
```

You should see:
```
DB connected successfully
Server started at port: 8000
```

Keep this terminal open.

---

## 4. Set up the client

Open a **new terminal window** and:

```bash
cd client
npm install
```

Create `client/.env` locally (do not commit it to GitHub):
```env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY=your_razorpay_test_key
```

Start the client:
```bash
npm run dev
```

You should see:
```
VITE v5.2.2  ready in ... ms
➜  Local:   http://localhost:5173/
```

---

## 5. Open the app

Go to **http://localhost:5173** in your browser. Register a new account and try it out.

---

## Common issues

**"DB connection error" or "MongoServerError"** — MongoDB is not running. Start it (`brew services start mongodb-community` on Mac, or the MongoDB service on Windows).

**"Port 8000 already in use"** — something else is using port 8000. Change `PORT=8000` to `PORT=8001` in `server/.env` and update `VITE_API_URL` in `client/.env` to match.

**"Cannot find module ..."** — run `npm install` again in the folder that errored.

**Emails / OTP don't arrive** — that's expected; the mail credentials in `.env` are blank. You can create a Gmail App Password and fill `USER_MAIL` and `USER_PASS` if you want it working.
