# ⚡ LegacyBridge

> AI-powered COBOL to Modern Python API Translator

## 🌍 Live Demo
- **Frontend:** https://legacy-bridge-6j3gfh4q2-vinaydev00s-projects.vercel.app
- **Backend API:** https://legacybridge.onrender.com/docs

## 🚀 What is LegacyBridge?

Banks and governments run $3 trillion/day on COBOL systems built in 1959. Nobody wants to touch them. LegacyBridge uses AI to automatically translate legacy COBOL code into modern Python FastAPI endpoints — in seconds.

## ✨ Features

- 🤖 **AI Translation** — Upload COBOL, get production-ready Python API instantly
- 🔐 **Authentication** — Secure JWT-based login/register system
- 📊 **Dashboard** — Track all your translations with confidence scores
- 📚 **History** — Search, view, and delete past translations
- ⬇️ **Download** — Download generated Python files directly
- 📋 **Copy Code** — One-click copy of generated API code

## 🛠️ Tech Stack

### Backend
- **FastAPI** — Modern Python web framework
- **LangChain** — AI orchestration
- **Groq AI** — LLM for COBOL understanding and API generation
- **SQLite + SQLAlchemy** — Database
- **JWT Authentication** — Secure user sessions

### Frontend
- **React.js** — UI framework
- **Vite** — Build tool
- **Axios** — API calls

### DevOps
- **Render** — Backend deployment
- **Vercel** — Frontend deployment

## 🏃 Run Locally

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Create `.env` in backend folder:
```
GROQ_API_KEY=your_groq_api_key
```

## 🎯 Why LegacyBridge?

| Problem | Solution |
|---|---|
| COBOL developers retiring | AI understands legacy code |
| Modernization costs millions | LegacyBridge does it in seconds |
| Mobile apps can't connect to mainframes | Generated REST APIs bridge the gap |
| Manual translation takes months | Automated translation takes seconds |

## 👨‍💻 Built By

**Vinay** — CS undergraduate at Manipal University Jaipur

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue)](https://linkedin.com/in/vinaynarwal67)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black)](https://github.com/vinaydev00)