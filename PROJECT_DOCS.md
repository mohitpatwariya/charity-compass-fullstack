# Charity Compass — Project Documentation

*A simple, interview-friendly explanation of the project.*

---

## 1. What is this project?

**Charity Compass** (also called Charity Finder) is a web platform where people can:

- **Browse** different charity organizations by category (education, health, animals, etc.)
- **Donate** to any charity using an online payment gateway
- **Save** favourite charities as bookmarks
- **Track** their own donations from a personal dashboard
- **Register** their own charity so others can donate to it

In one line: *"An online marketplace that connects donors with charities and lets them donate securely."*

---

## 2. Tech Stack (What is built with what)

### Frontend (what the user sees in the browser)
| Tech | Why we use it |
|---|---|
| **React 18** | Component-based UI library. Builds the pages. |
| **Vite** | Dev server + bundler. Much faster than Create React App. |
| **React Router DOM** | Handles page navigation (`/`, `/loginUser`, `/dashboard`, etc.) without full page reloads. |
| **React Icons** | Ready-made icon set (search, heart, user, etc.). |
| **React Hot Toast** | Nice pop-up notifications (e.g., "Login successful"). |
| **React Razorpay** | Opens the Razorpay payment popup on the frontend. |
| **Dicebear** | Auto-generates cute avatar images from a username. |
| **Plain CSS** | Styles are in `client/src/index.css`. |

### Backend (the server that talks to the database)
| Tech | Why we use it |
|---|---|
| **Node.js + Express** | JavaScript runtime + web framework. Serves the API. |
| **MongoDB + Mongoose** | Document database + object modeling library. Stores users, charities, donations, etc. |
| **JWT (jsonwebtoken)** | Creates access/refresh tokens so the server knows *who* is making a request. |
| **bcryptjs** | Hashes passwords so we never store them in plain text. |
| **cookie-parser** | Reads cookies from incoming requests (the auth tokens are stored as cookies). |
| **cors** | Allows the frontend on `localhost:5173` to talk to the backend on `localhost:8000`. |
| **express-fileupload** | Handles uploaded files (charity images, profile pics). |
| **Cloudinary** | Cloud image hosting. We upload the image to Cloudinary and store the URL in MongoDB. |
| **Razorpay** | Payment gateway. Handles the actual money transfer. |
| **Nodemailer** | Sends emails (OTP verification, donation confirmation receipts). |
| **otp-generator** | Generates random 6-digit OTPs for email verification. |
| **dotenv** | Loads secrets from the `.env` file into `process.env`. |

### Dev tools
- **nodemon** — auto-restarts the server when code changes
- **ESLint + Prettier** — code linting and formatting

---

## 3. Project Structure

```
charity-finder-main/
├── client/                  ← React frontend
│   ├── src/
│   │   ├── pages/           ← Full pages (Home, Login, Dashboard, Charities...)
│   │   ├── components/      ← Reusable pieces (CharityCard, Loading, Payment...)
│   │   ├── utils/           ← Helper functions
│   │   ├── App.jsx          ← Main app + routing
│   │   └── main.jsx         ← Entry point
│   ├── .env                 ← VITE_API_URL points to the backend
│   └── package.json
│
└── server/                  ← Express backend
    ├── src/
    │   ├── models/          ← Mongoose schemas (User, Charity, Donation...)
    │   ├── controllers/     ← Business logic for each route
    │   ├── routes/          ← URL routing (which URL calls which controller)
    │   ├── middlewares/     ← Auth middleware (checks JWT before letting request through)
    │   ├── utils/           ← Reusable helpers (cloudinary, razorpay, nodemailer, error handler)
    │   ├── database/        ← MongoDB connection
    │   ├── app.js           ← Express app setup (mounts routes/middleware)
    │   └── index.js         ← Starts the server
    ├── .env                 ← All secrets (Mongo URI, JWT secret, Razorpay key...)
    └── package.json
```

---

## 4. Database Design (MongoDB Collections)

Think of collections as tables. Here's what each stores:

| Collection | What it holds |
|---|---|
| **User** | email, username, hashed password, refresh token, list of saved charities, list of donations made, list of charities they created |
| **Charity** | name, description, website, category (ref), address (ref), owner (User ref), image, donation link, banks |
| **Category** | name (e.g., "Education"), list of charities in that category |
| **Donation** | user (ref), charity (ref), amount, date, paymentMethod, paymentId |
| **Address** | district, city, state, country, pincode |
| **Otp** | otp code, email, createdAt (auto-deletes after 5 minutes) |
| **Bank** | bank name, IFSC code, account number |
| **Profile** | extra user info (image, contact number, address ref) |

The relationships between collections are handled by storing **ObjectId refs** (like foreign keys).

---

## 5. Overall Flow (End-to-End)

Here's what happens step-by-step when a user uses the app:

### A) Registration flow
1. User opens `/registerUser` and fills the form (name, email, password).
2. Frontend calls `POST /api/otp/sendOtp` → backend generates a 6-digit OTP, saves it in the DB, and emails it to the user via Nodemailer.
3. User enters the OTP in the frontend → frontend calls `POST /api/otp/verifyOtp` to confirm it matches.
4. Frontend then calls `POST /api/users/register`. Backend hashes the password with bcrypt and saves the user in MongoDB.

### B) Login flow
1. User goes to `/loginUser`, enters email + password.
2. Frontend calls `POST /api/users/login`.
3. Backend compares the password with the stored hash (`bcrypt.compare`).
4. If correct, backend generates two JWTs:
   - **Access token** — short-lived (1 day). Sent to backend on every request to prove identity.
   - **Refresh token** — long-lived (10 days). Used to get a new access token when the old one expires.
5. Both tokens are sent back as **cookies** (`httpOnly`) so the browser stores them automatically.

### C) Auth-protected requests
- Every protected route runs through the `verifyToken` middleware.
- The middleware reads the JWT from the cookie, verifies its signature with the secret, decodes the user ID, and attaches the user to `req.user`.
- Only then does the controller run.

### D) Browsing & bookmarking
1. `/charities` page loads → frontend calls `POST /api/charity/getCharityByCategory` to fetch charities.
2. User clicks the heart icon on a charity → frontend calls `PUT /api/users/updateBookmark` → backend adds/removes it from the user's `savedCharities` array.

### E) Donation flow (the interesting one)
1. User clicks "Donate" on a charity.
2. Frontend calls `POST /api/donation/createPaymentOrder` with the amount.
3. Backend uses the Razorpay SDK to create an **order** on Razorpay's servers and returns the `orderId` to the frontend.
4. Frontend opens the Razorpay checkout popup with that `orderId`. The user pays inside Razorpay's popup (we never see their card details).
5. Razorpay returns a **payment signature** to the frontend.
6. Frontend calls `POST /api/donation/paymentCallback` with the signature.
7. Backend **verifies the signature** using `crypto.createHmac('sha256', RAZORPAY_SECRET)` — this proves the payment is real and not faked.
8. If valid, backend saves a Donation document in MongoDB.
9. A **Mongoose post-save hook** fires that automatically emails the user a thank-you receipt via Nodemailer.

### F) Dashboard
- User visits `/dashboard` → frontend calls `GET /api/users/getDonations` and `GET /api/users/getSavedCharities`.
- Shows total donated, list of donations, saved charities.

---

## 6. Key API Endpoints

| Method | URL | What it does | Auth needed? |
|---|---|---|---|
| POST | `/api/otp/sendOtp` | Send verification OTP by email | No |
| POST | `/api/otp/verifyOtp` | Verify the OTP | No |
| POST | `/api/users/register` | Create a new user | No |
| POST | `/api/users/login` | Log in, receive tokens | No |
| GET | `/api/users/getLoginStatus` | Check if user is logged in | Optional |
| POST | `/api/users/logout` | Log out, clear cookies | Yes |
| GET | `/api/users/getUserProfile` | Get logged-in user's profile | Yes |
| GET | `/api/users/getDonations` | Get user's donation history | Yes |
| GET | `/api/users/getSavedCharities` | Get user's bookmarks | Yes |
| PUT | `/api/users/updateBookmark` | Add/remove bookmark | Yes |
| GET | `/api/users/getTotalDonation` | Total amount donated | Yes |
| GET | `/api/category/getAllCategories` | List all categories | Yes |
| POST | `/api/charity/getCharityByCategory` | Charities in a category | Yes |
| GET | `/api/charity/getCharityById/:id` | One charity's details | Yes |
| POST | `/api/charity/registerCharity` | Register a new charity | Yes |
| POST | `/api/donation/createPaymentOrder` | Create Razorpay order | Yes |
| POST | `/api/donation/paymentCallback` | Verify payment + save donation | Yes |

---

## 7. Common Interview Questions (be ready for these)

**Q: Why did you use JWT instead of session-based auth?**
> JWTs are stateless — the server doesn't need to store session data anywhere. This makes it easier to scale horizontally. We store the token in an `httpOnly` cookie so JavaScript can't read it (helps prevent XSS attacks).

**Q: Why access token + refresh token, not just one token?**
> The access token is short-lived (1 day) so if it's stolen, damage is limited. The refresh token is long-lived and only used to get new access tokens — so the user doesn't have to log in again every day.

**Q: How do you keep passwords secure?**
> We never store the raw password. `bcrypt` hashes it with a salt before saving. On login, we compare hashes — we can't ever reverse the hash back to a password.

**Q: How does the Razorpay integration actually work?**
> Three-step: (1) backend creates an order on Razorpay, (2) frontend opens Razorpay's popup so the user pays without ever exposing card details to us, (3) backend verifies the signature Razorpay returns using HMAC-SHA256 with our secret key — this proves the payment is genuine and wasn't faked by tampering with the frontend.

**Q: Why upload images to Cloudinary instead of saving them on the server?**
> Cloud storage scales better, gives us CDN delivery for speed, and doesn't fill up server disk. We upload the file to Cloudinary and just store the returned URL in MongoDB.

**Q: How does the OTP verification work? Why does it auto-expire?**
> The OTP model has `expires: 5*60` on the `createdAt` field — this is a MongoDB TTL index that automatically deletes the document 5 minutes after creation. So even without a cron job, expired OTPs clean themselves up.

**Q: How is CORS handled?**
> The Express server uses the `cors` middleware with `origin: process.env.CORS_ORIGIN` and `credentials: true`. This allows the frontend on port 5173 to make authenticated requests (with cookies) to the backend on port 8000.

**Q: What is Mongoose middleware and where did you use it?**
> Mongoose middleware are functions that run before/after schema operations (save, validate, etc.). We used a **pre-save** hook on the User model to hash the password automatically, and a **post-save** hook on the Donation model to send the thank-you email automatically.

**Q: What would you improve if you had more time?**
> A few things: proper input validation (e.g., with Zod or Joi), rate limiting on OTP endpoints to prevent spam, admin panel for managing charities, unit + integration tests, deploying to production (backend on Render, frontend on Vercel, DB on MongoDB Atlas), and moving the file upload from `express-fileupload` to `multer` streaming for better memory handling.

---

## 8. TL;DR — The 30-second pitch

> "It's a full-stack MERN application where users can browse charities, donate to them via Razorpay, and track their donations. The frontend is React with Vite; the backend is Express with MongoDB. Auth uses JWT with access and refresh tokens stored in httpOnly cookies. Images go through Cloudinary, payments through Razorpay with HMAC signature verification, and emails through Nodemailer. It follows the MVC pattern — models, controllers, routes cleanly separated."
