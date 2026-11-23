# Gowtham S — Portfolio Backend API

Production Express.js & MongoDB Atlas backend for Gowtham S's portfolio website.

---

## 🚀 Features

- **MongoDB Atlas Integration**: Connects securely via Mongoose to store inquiries in the `contact_messages` collection.
- **RESTful Endpoints**:
  - `POST /api/contact`: Public endpoint with rate limiting & input sanitization.
  - `GET /api/contact`: Admin inquiry viewer with filtering & search.
  - `PATCH /api/contact/:id/status`: Toggle message read/unread status.
  - `DELETE /api/contact/:id`: Secure deletion of messages.
  - `POST /api/auth/login`: Admin authentication with bcrypt & JWT tokens.
  - `GET /api/health`: Health status & database connection status.
- **Security & Protection**:
  - `express-rate-limit` prevents spam and brute-force attempts.
  - `validator` sanitizes and escapes all user strings.
  - Dynamic CORS for localhost and production Vercel frontend domains.
  - Strict JWT verification for administrative routes.

---

## 🛠️ Environment Configuration

Create a `.env` file based on `.env.example`:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
ADMIN_EMAIL=gowthamsubra31@gmail.com
ADMIN_PASSWORD_HASH=your_bcrypt_hash
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## 📦 Local Running

```bash
npm install
npm run dev
```

---

## ☁️ Deployment on Render

1. Create a **New Web Service** on [Render](https://render.com/).
2. Connect your GitHub repository: `https://github.com/gowthamsubra2005-afk/portfolio-backend-.git`.
3. Set **Build Command**: `npm install`.
4. Set **Start Command**: `npm start`.
5. Under **Environment Variables**, set:
   - `MONGODB_URI`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH`
   - `JWT_SECRET`
   - `FRONTEND_URL`
