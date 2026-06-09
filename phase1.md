# IELTS AI Platform — Phase 1 Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL 15+
- pnpm (recommended) or npm

---

## 1. Clone & install

```bash
# Backend
cd backend
cp .env.example .env       # fill in your values
npm install

# Frontend
cd ../apps/web
cp .env.example .env.local
npm install
```

---

## 2. Database setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed sample data (reading tests, writing prompts, cue cards, demo users)
npm run db:seed
```

Demo accounts after seed:
| Role | Email | Password |
|---------|-------------------------|--------------|
| Admin | admin@ieltsai.com | Admin@123 |
| Student | student@ieltsai.com | Student@123 |

---

## 3. Run in development

```bash
# Terminal 1 — Backend (port 4000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd apps/web
npm run dev
```

Open http://localhost:3000

---

## 4. Environment variables — Backend

| Variable               | Description                         |
| ---------------------- | ----------------------------------- |
| `DATABASE_URL`         | PostgreSQL connection string        |
| `JWT_SECRET`           | Long random secret (64+ chars)      |
| `OPENAI_API_KEY`       | OpenAI API key (GPT-4o + Whisper)   |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID              |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret          |
| `CLIENT_URL`           | Frontend URL (for CORS + redirects) |
| `SMTP_*`               | Nodemailer SMTP settings            |

---

## 5. Phase 1 Feature Map

### ✅ Authentication

- Email/password register + login
- JWT access token (15 min) + refresh token (7 days)
- Google OAuth
- Email verification
- Forgot/reset password
- Change password
- Session cookie sync for Next.js middleware

### ✅ Dashboard

- Band prediction ring chart
- Per-skill progress bars
- Streak tracker
- Weak skill focus cards
- Recent activity feed
- Daily goal widget
- Quick start buttons

### ✅ Reading Module

- Test list (paginated)
- Split-view: passage left, questions right
- All IELTS question types (MCQ, T/F/NG, Fill blank, Match, Short answer)
- 60-minute countdown timer with auto-submit
- Instant auto-scoring + band calculation
- Answer review with correct answers

### ✅ Listening Module

- Test list
- Audio player with speed control (0.75×, 1×, 1.25×, 1.5×)
- Multi-section navigation
- 40-minute timer with auto-submit
- Instant scoring + band

### ✅ Writing Module (AI)

- Task 1 (graph/chart description, min 150 words)
- Task 2 (essay, min 250 words)
- Word counter + autosave
- GPT-4o evaluation: Task Response, Coherence, Lexical, Grammar
- Band score breakdown with per-criterion feedback
- AI-improved version
- Polling feedback page

### ✅ Speaking Module (AI + Whisper)

- Part 1, 2, 3 cue cards
- MediaRecorder voice recording
- Preparation timer (Part 2: 60s)
- Recording timer per part
- Whisper-1 transcription
- GPT-4o evaluation: Fluency, Pronunciation, Grammar, Vocabulary
- Full transcript display
- Polling feedback page

### ✅ Analytics

- Per-skill band display
- Band history timeline
- Weak skill detection
- Streak tracking

### ✅ Profile

- Edit name + target band
- Set study goal (target band + date + daily minutes)
- Change password

---

## 6. API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
POST   /api/auth/logout-all
GET    /api/auth/me
GET    /api/auth/verify-email?token=
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/change-password
POST   /api/auth/resend-verification
GET    /api/auth/oauth/google
GET    /api/auth/oauth/google/callback

GET    /api/users/me
PATCH  /api/users/me
POST   /api/users/me/avatar

GET    /api/reading/tests
GET    /api/reading/tests/:testId
POST   /api/reading/submit
GET    /api/reading/attempts/:attemptId

GET    /api/listening/tests
GET    /api/listening/tests/:testId
POST   /api/listening/submit

GET    /api/writing/prompts?task=TASK1|TASK2
GET    /api/writing/prompts/:promptId
POST   /api/writing/submit          (202 Accepted — async AI)
GET    /api/writing/submissions
GET    /api/writing/submissions/:id  (poll for result)

GET    /api/speaking/cue-cards?part=PART1|PART2|PART3
POST   /api/speaking/submit          (multipart/form-data — async AI)
GET    /api/speaking/submissions
GET    /api/speaking/submissions/:id (poll for result)

GET    /api/analytics/dashboard
POST   /api/analytics/goal

GET    /health
```

---

## 7. Next — Phase 2

- AI Tutor chat (OpenAI streaming)
- Full Analytics charts (recharts)
- Teacher Panel
- Vocabulary Builder with spaced repetition
- Mock Test engine (all 4 sections combined)
- Subscription + Stripe/eSewa integration
