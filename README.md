# 📈 LearnTrade

**A full-stack stock market learning App.**

LearnTrade turns stock market education into a structured, guided journey — modules and lessons to work through, quizzes to test what stuck, progress tracking to show how far you've come, and an AI tutor on call whenever a concept doesn't click. (⚠️AI Tutor is still in working)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-AI%20Tutor-412991?logo=openai&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

---

## ✨ Features

### For learners
- **Structured curriculum** — content organized into modules, each containing sequential lessons
- **Interactive quizzes** — multiple-choice assessments at the end of each module, with scored attempts and results breakdown
- **Progress tracking** — per-lesson completion state and a personal dashboard showing how much of each module is done
- **AI Stock Tutor** — an in-app conversational tutor powered by OpenAI, with chat history persisted so conversations pick up where they left off
- **Secure accounts** — registration and login with hashed passwords and JWT-based sessions

### For administrators
- **Admin panel** — create and manage modules, lessons, quizzes and questions from the UI
- **Role-based access control** — admin-only routes enforced on both the client (route guards) and the server (middleware), so the API is protected independently of the UI

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React, Vite, React Router, Axios, Context API |
| **Backend** | Node.js, Express |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcrypt password hashing |
| **AI** | OpenAI API |
| **Tooling** | ESLint, Vite dev server with HMR |

---

## 🏗 Architecture

The project is a monorepo with a clean separation between the REST API and the single-page client.

```
LearnTrade/
├── backend/
│   └── src/
│       ├── config/          # Database connection
│       ├── controllers/     # Request handlers (auth, modules, lessons, quizzes, progress, AI tutor)
│       ├── middleware/      # JWT verification + role-based authorization
│       ├── models/          # Mongoose schemas
│       ├── routes/          # Express route definitions
│       ├── services/        # OpenAI integration + tutor orchestration
│       ├── utils/           # Prompt construction for the AI tutor
│       └── index.js         # App entry point
│
└── frontend/
    └── src/
        ├── api/             # Axios client + per-resource API modules
        ├── assets/          # Images and SVGs
        ├── components/      # Navbar, Footer, ModuleCard, AIStockTutor, route guards
        ├── context/         # AuthContext — global auth state
        ├── pages/           # Home, Login, Register, Modules, Lessons, Quiz, Progress, Admin
        └── App.jsx          # Routing
```

**Design notes worth calling out:**

- **Layered backend.** Routes stay thin, controllers handle HTTP concerns, and services own the external integrations — so swapping the AI provider touches one folder, not the whole codebase.
- **Prompt engineering isolated.** Tutor prompt construction lives in `utils/tutorPrompt.js` rather than being scattered through request handlers, making the tutor's behavior tunable in one place.
- **Defense in depth on auth.** `ProtectedRoute` and `AdminRoute` guard the UI, while `authMiddleware` and `roleMiddleware` independently guard the API.

---

## 📊 Data Model

| Model | Purpose |
|---|---|
| `User` | Accounts, hashed credentials, role (learner / admin) |
| `Module` | Top-level course unit |
| `Lesson` | Individual lesson belonging to a module |
| `LessonProgress` | Per-user, per-lesson completion tracking |
| `Quiz` | Assessment attached to a module |
| `Question` | Individual quiz question with options and correct answer |
| `QuizAttempt` | A user's submitted attempt, answers and score |
| `ChatMessage` | Persisted AI tutor conversation history |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or newer
- MongoDB (local instance or a MongoDB Atlas cluster)
- An OpenAI API key

### 1. Clone the repository

```bash
git clone https://github.com/puneett12/learntrade.git
cd learntrade
```

### 2. Configure and start the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (use `.env.example` as your template):

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
OPENAI_API_KEY=your_openai_api_key
```

Then start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 3. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port the Express server listens on |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs — use a long random value |
| `OPENAI_API_KEY` | API key for the AI tutor |

> **Note:** `.env` is git-ignored and never committed. `backend/.env.example` documents the required keys with empty values.

---

## 🔌 API Overview

All endpoints are served under `/api`.

| Route group | Responsibility |
|---|---|
| `/api/auth` | Registration, login, token issuance |
| `/api/modules` | Module listing and management |
| `/api/lessons` | Lesson content retrieval and management |
| `/api/quizzes` | Quiz and question delivery |
| `/api/attempts` | Quiz submission and scoring |
| `/api/progress` | Lesson completion and progress summaries |
| `/api/ai-tutor` | AI tutor conversation endpoint |

Protected routes require an `Authorization: Bearer <token>` header. Management operations additionally require an admin role.

---

## 🗺 Roadmap

- [ ] Live market data integration for real-world examples
- [ ] Simulated portfolio / paper trading practice
- [ ] Certificates on module completion
- [ ] Streaming responses from the AI tutor
- [ ] Automated test suite
- [ ] Deployment (containerized API + static frontend hosting)

---

## 👤 Author

**Puneet Tulsiani**  
GitHub: [@puneett12](https://github.com/puneett12)

---

<p align="center">Built to make learning the markets less intimidating.</p>
