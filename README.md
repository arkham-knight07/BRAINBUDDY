# BRAINBUDDY

A modern AI-powered lesson converter and quiz generator.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** FastAPI (Python), SQLite
- **AI/NLP:** Google Gemini (google-generativeai)
- **File Parsing:** PyPDF2 (PDF), python-pptx (PPTX), python-docx (DOCX)
- **Auth:** JWT (python-jose), passlib
- **Other:** CORS, logging, dotenv

## Features
- Upload PDF, PPTX, DOCX, or text files
- Generate summaries, quizzes, flashcards using Gemini AI
- Export as PPT or PDF
- User registration, login, password reset

## Deployment
- Manual deployment supported (Render, Vercel, Netlify, etc.)
- Environment variables via `.env`

## Quick Start
1. Clone the repo
2. Set up backend: `cd backend && pip install -r requirements.txt`
3. Set up frontend: `cd frontend && npm install`
4. Add your Gemini API key to `.env`
5. Run backend: `uvicorn app:app --reload`
6. Run frontend: `npm run dev`

---

```
ai-lesson-converter/
├── backend/
│   ├── app.py
│   ├── auth.py
│   ├── database.py
│   ├── models.py
│   ├── ai_service.py
│   ├── export_service.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ui/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```