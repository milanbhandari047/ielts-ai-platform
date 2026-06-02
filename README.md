
# 🎓 IELTS AI Mock Test Platform

An AI-powered full-stack IELTS preparation platform with web, mobile, and admin dashboards. Built for scalable learning, real-time AI evaluation, and adaptive test preparation.

---

## 🚀 Tech Stack

- **Frontend Web:** Next.js (App Router), Tailwind CSS, TypeScript
- **Admin Panel:** Next.js + TanStack Table
- **Mobile App:** Flutter (Clean Architecture)
- **Backend API:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **AI Services:** OpenAI (GPT-4/5), Whisper (Speech-to-Text)
- **Cache/Queue:** Redis + BullMQ
- **Payments:** Stripe / eSewa
- **Storage:** AWS S3
- **Monorepo:** Turborepo + pnpm
- **Deployment:** Docker + Kubernetes (optional)

---

## 📁 Project Structure

```

ielts-ai-platform/
├── apps/
│   ├── web/          # IELTS Student Web App (Next.js)
│   ├── admin/       # Admin Dashboard (Next.js)
│   └── mobile/      # Flutter Mobile App
│
├── backend/         # Node.js + Express API
├── ai-services/     # AI evaluation & prompt engines
├── packages/        # Shared UI, types, utils
├── infrastructure/  # Docker, Kubernetes, Terraform
├── docs/            # Architecture & API docs
├── scripts/         # Utility scripts
├── .github/         # CI/CD pipelines
├── turbo.json
├── pnpm-workspace.yaml
└── README.md

````

---

## 🧠 Core Features

### 📚 IELTS Modules
- Reading Practice + AI scoring
- Listening Tests with audio + transcription
- Writing Task 1 & 2 with AI evaluation
- Speaking practice with speech-to-text analysis

### 🤖 AI Features
- AI Writing Band Score Prediction
- Speaking Fluency & Pronunciation Analysis
- Grammar Correction Engine
- Personalized Study Plan Generator
- Adaptive Difficulty Adjustment

### 📊 Analytics
- Band score progress tracking
- Weak skill identification
- Performance heatmaps
- Study time tracking

### 🧑‍🏫 AI Tutor
- Chat-based IELTS assistant
- Vocabulary builder
- Real-time feedback system

### 🎯 Mock Test System
- Full IELTS exam simulation
- Timed test environment
- Auto scoring system

### 💳 Monetization
- Subscription plans (Free / Premium)
- Stripe & eSewa payment integration

---

## ⚙️ Backend Architecture

- Modular feature-based structure
- JWT Authentication + OAuth (Google)
- AI processing queue (BullMQ)
- Real-time communication (Socket.IO)
- File uploads (AWS S3)
- Scalable microservice-ready design

---

## 🧩 AI Architecture

- OpenAI GPT for evaluation & feedback
- Whisper for speech transcription
- Prompt engineering pipeline
- Band score prediction engine
- Adaptive learning system

---

## 📱 Mobile App (Flutter)

- Offline-first learning support
- Voice recording for speaking tests
- AI feedback integration
- Clean architecture (Data / Domain / Presentation)

---

## 🗄️ Database (Prisma)

Key models:
- User
- MockTest
- WritingSubmission
- SpeakingSubmission
- Subscription
- Vocabulary Progress
- Analytics

---

## 🛠️ Installation

```bash
# Clone repo
git clone https://github.com/milanbhandari047/ielts-ai-platform.git

cd ielts-ai-platform

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Run dev server
pnpm dev
````

---

## 🐳 Docker Setup

```bash
docker-compose up --build
```

---

## 📦 Environment Variables

Create `.env` file:

```bash
DATABASE_URL=
REDIS_URL=
JWT_SECRET=
OPENAI_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
STRIPE_SECRET_KEY=
ESEWA_SECRET_KEY=
```

---

## 📈 Roadmap

### Phase 1 (MVP)

* Auth system
* Reading, Listening, Writing, Speaking modules
* AI scoring engine
* Dashboard

### Phase 2

* AI Tutor chatbot
* Advanced analytics
* Teacher/Admin tools
* Adaptive learning system

### Phase 3

* Flutter mobile app
* Live speaking evaluation
* Gamification system
* Institution dashboard

---

## 🧑‍💻 Developer Notes

* Monorepo managed with **Turborepo**
* Shared packages used across web/admin/backend
* AI logic separated into `ai-services`
* Fully scalable microservice-ready architecture

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Author

Built with ❤️ by **Milan Bhandari**

---

## ⭐ If you like this project

Give it a star ⭐ and contribute!


