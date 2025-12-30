# 📝 AI Notes App (Backend)

A secure, production-ready backend for a notes application with authentication,
protected CRUD operations, and an AI-ready architecture.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes using middleware

### 📝 Notes
- Create notes
- Read user-specific notes
- Update notes
- Delete notes
- MongoDB persistence

### 🤖 AI-Ready
- AI summarization route implemented
- Temporarily disabled due to billing/quota
- Can be re-enabled instantly later

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- dotenv

---

## 📁 Project Structure

ai-note-app/
├── backend/
│ ├── index.js
│ ├── routes/
│ ├── models/
│ ├── middleware/
│ └── .env (ignored)
└── README.md

yaml
Copy code

---

## ⚙️ Environment Variables

Create `.env` inside `backend/`:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
OPENAI_API_KEY=your_key

yaml
Copy code

---

## ▶️ Run Locally

cd backend
npm install
node index.js

lua
Copy code

Expected output:
MongoDB connected ✅
Server running on http://localhost:5000

markdown
Copy code

---

## 🔑 API Routes

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`

### Notes (Protected)
- POST `/api/notes`
- GET `/api/notes`
- PUT `/api/notes/:id`
- DELETE `/api/notes/:id`

Header required:
Authorization: Bearer <JWT_TOKEN>

yaml
Copy code

---

## 📌 Status
✅ Backend complete  
🟡 AI disabled temporarily  
🔜 Frontend planned  

---

## 👨‍💻 Author
Built by **Prateek**