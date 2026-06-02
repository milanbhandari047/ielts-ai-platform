STEP 12 — Build MVP FIRST

Your own document already has correct MVP priority.

Build ONLY these first:

Phase 1 MVP
Must Build
Authentication
Dashboard
Reading Module
Listening Module
Writing AI
Speaking Recording
Analytics

DO NOT build:

Community
Gamification
Live Classes
AI Tutor
Mobile app

yet.

STEP 13 — Recommended Development Order
Week 1
Backend
Auth API
Prisma setup
JWT login/register
Frontend
Login page
Register page
Dashboard UI
Week 2
Reading Module

Build:

Passage viewer
Question panel
Timer
Result calculation

Your structure already defines components for this.

Week 3
Listening Module

Build:

Audio player
Questions
Transcript
Timer
Week 4
Writing AI

Build:

Essay editor
OpenAI evaluation
Band score feedback

Use:

GPT-4.1
GPT-4o-mini
Week 5
Speaking

Build:

Voice recording
Whisper transcription
AI feedback
STEP 14 — Important Architecture Advice
DO NOT start with microservices

At first:

Use ONLY:
backend/
apps/web/

Ignore:

ai-services/
kubernetes/
terraform/
monitoring/

until MVP works.

STEP 15 — Best Initial Tech Stack
Frontend

Use:

Next.js App Router
Tailwind CSS
Zustand
React Query
Axios
shadcn/ui
Backend

Use:

Express
Prisma
PostgreSQL
JWT
Zod
AI

Use:

OpenAI API
Whisper API
STEP 16 — Commands You Will Use Daily
Run frontend
cd apps/web
pnpm dev
Run backend
cd backend
npx ts-node-dev src/server.ts
Prisma Studio
npx prisma studio
Run migration
npx prisma migrate dev
FINAL RECOMMENDATION

Your structure is enterprise-level.

But for starting:

ONLY FOCUS ON:

apps/web
backend
prisma
auth
reading
writing

Everything else can come later.

Otherwise the project becomes too large too quickly.

A very good first milestone is:

✅ User Login
✅ Reading Test
✅ Writing AI Evaluation
✅ Dashboard

After that:

Speaking
Subscription
Analytics
Mobile App

can be added gradually.
