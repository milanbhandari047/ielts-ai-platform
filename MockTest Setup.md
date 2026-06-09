# Mock Test Engine — Setup Guide

## 1. Run Prisma migration

```bash
npx prisma migrate dev --name add_mock_test_engine
npx prisma generate
npx ts-node prisma/seed.ts
```

## 2. Install new backend dependencies

```bash
npm install node-cron express-rate-limit
npm install --save-dev @types/node-cron
```

## 3. Install new frontend dependencies

```bash
npm install recharts zustand axios sonner
npm install --save-dev @types/recharts
```

## 4. Environment variables required

### Backend (.env)

```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
OPENAI_API_KEY=sk-...
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## 5. Files added / modified

### Backend

```
backend/src/
├── app.ts                          ← register mock test routes + cron
├── middleware/
│   ├── require-auth.ts             ← JWT guard (updated with requireRole)
│   ├── require-plan.ts             ← subscription plan gate
│   └── rate-limiter.ts             ← brute force + daily limits
├── mock-test/
│   ├── mock-test.service.ts        ← all business logic
│   ├── mock-test.routes.ts         ← 6 REST endpoints
│   └── mock-test.cron.ts           ← auto-submit expired sessions
└── utils/
    └── band-calculator.ts          ← IELTS band tables + grading
```

### Frontend

```
frontend/
├── store/
│   └── exam-store.ts               ← Zustand session state (persisted)
├── hooks/
│   ├── useExamTimer.ts             ← countdown with auto-submit
│   └── useBeforeUnload.ts          ← tab close warning + fullscreen
├── components/exam/
│   ├── ExamHeader.tsx              ← sticky header with timer + nav
│   ├── ExamLobby.tsx               ← pre-exam instructions screen
│   ├── ExamBreak.tsx               ← 10-min break between L and W
│   └── ScoringScreen.tsx           ← animated scoring progress
└── app/mock-test/
    ├── page.tsx                    ← test list / lobby
    └── [id]/
        ├── page.tsx                ← exam shell (section router)
        ├── reading/
        │   └── ExamReadingSection.tsx
        ├── listening/
        │   └── ExamListeningSection.tsx
        ├── writing/
        │   └── ExamWritingSection.tsx
        ├── speaking/
        │   └── ExamSpeakingSection.tsx
        └── report/
            └── page.tsx            ← band report with radar chart + AI feedback
```

### Prisma (updated)

```
prisma/
├── schema.prisma   ← MockTest + MockTestSession fully updated
└── seed.ts         ← 1 complete academic mock test seeded
```

## 6. API endpoints

| Method | Path                                  | Description            |
| ------ | ------------------------------------- | ---------------------- |
| GET    | /api/mock-tests                       | List published tests   |
| POST   | /api/mock-tests/:id/sessions          | Start/resume session   |
| GET    | /api/mock-tests/sessions/:sid         | Get session state      |
| PATCH  | /api/mock-tests/sessions/:sid/submit  | Submit section answers |
| POST   | /api/mock-tests/sessions/:sid/abandon | Abandon session        |
| GET    | /api/mock-tests/sessions/:sid/report  | Get band report        |

## 7. Key behaviours

- **Session recovery**: Zustand persists answers to localStorage. On page refresh, the session resumes from the last saved state.
- **Auto-submit**: Each section timer auto-submits answers when time runs out.
- **Async AI scoring**: Writing and Speaking are scored by GPT-4o after submission. The report page polls every 5 seconds until scores arrive.
- **Token tracking**: Every GPT-4o call writes to AiTokenUsage with cost estimate.
- **Band history**: On completion, overall band is written to BandHistory and UserAnalytics.
- **Rate limiting**: 3 mock tests per day per user (enforced in both middleware and service).
- **Plan gating**: PREMIUM or INSTITUTION plan required to start a session.

## 8. Next Phase 2 module

After verifying Mock Test Engine works end-to-end, proceed to:
**AI Tutor Chat** — OpenAI streaming chat with grammar explanations and study plans.
