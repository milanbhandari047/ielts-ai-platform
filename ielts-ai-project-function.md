# IELTS Mock Test Platform – Complete System Features & Architecture

## Recommended Tech Stack

- Frontend Web: Next.js
- Mobile App: Flutter
- Backend: Node.js + Express
- Database: PostgreSQL + Prisma
- AI APIs: OpenAI API
- Speech-to-Text: Whisper API
- Payments: Stripe / eSewa

---

# Core Modules

## 1. Authentication System

### Frontend Features

- Login/Register
- Google Login
- Forgot Password
- Email Verification
- User Profile
- Avatar Upload
- Daily Streak UI
- Study Goal Setup

### Backend Features

- JWT Authentication
- Refresh Tokens
- OAuth Login
- Email Verification Service
- Password Reset System
- Role-based Access
  - Student
  - Teacher
  - Admin

---

## 2. IELTS Dashboard

### Frontend

- Overall Band Prediction
- Recent Mock Tests
- Daily Practice Goals
- Weak Skill Analysis
- Progress Charts
- Continue Practice Button
- AI Suggestions

### Backend

- User Analytics Engine
- Band Score Calculation
- Recommendation Engine
- Goal Tracking
- Progress Aggregation

---

## 3. Reading Module

### Frontend

- Passage Viewer
- Highlight Text
- Notes Section
- Timer
- Question Navigator
- Auto-save Answers
- Dark Mode Reading
- Multiple Question Types

### Backend

- Reading Test CRUD
- Question Engine
- Auto Validation
- Score Calculator
- Passage Management
- Difficulty Tagging

### AI Features

- Wrong Answer Explanation
- Vocabulary Explanation
- Skimming & Scanning Suggestions
- Dynamic Question Generation

---

## 4. Listening Module

### Frontend

- Audio Player
- Playback Speed Control
- Question Sync
- Notes System
- Timer
- Headphone Mode

### Backend

- Audio Upload System
- Streaming API
- Listening Question Engine
- Listening Score Calculator
- Attempt Tracking

### AI Features

- Accent Adaptation Suggestions
- Transcript Analysis
- Keyword Recognition Analysis
- Weak Pattern Detection

---

## 5. Writing Module

### Frontend

- Rich Text Editor
- Word Counter
- Grammar Highlights
- Task 1 Graph Viewer
- Task 2 Essay Editor
- Autosave Drafts
- AI Feedback Panel
- Band Visualization

### Backend

- Essay Submission API
- AI Evaluation Queue
- Writing Analytics
- Grammar Analysis Storage
- Vocabulary Scoring Engine

---

# AI Writing Evaluation System

### AI Evaluation Criteria

- Task Response
- Coherence & Cohesion
- Lexical Resource
- Grammar Range & Accuracy

### AI Output Example

{
"overallBand": 6.5,
"taskResponse": 6,
"coherence": 7,
"lexical": 6.5,
"grammar": 6
}

### Advanced AI Features

- Band Predictor
- AI Rewrite Suggestions
- Grammar Correction
- Vocabulary Suggestions
- Sample Band 9 Answers
- Essay Structure Analysis

---

## 6. Speaking Module

### Frontend

- Voice Recording
- Live Timer
- Cue Card Display
- Speaking Playback
- Pronunciation Highlights
- Real-time Transcript

### Backend

- Audio Upload API
- Speech-to-text Processing
- Pronunciation Analysis
- Fluency Scoring
- Speaking History Storage

### AI Speaking Evaluation

- Fluency
- Pronunciation
- Grammar
- Vocabulary
- Hesitation Detection
- Speaking Speed Analysis

---

## 7. Full Mock Test Engine

### Frontend

- Real IELTS Simulation
- Fullscreen Exam Mode
- Timer Synchronization
- Auto Submit
- Result Screen

### Backend

- Test Session Engine
- Timer Validation
- Auto Scoring
- Test Analytics
- Submission Management

---

## 8. AI Personal Tutor

### Features

- Ask IELTS Questions
- Grammar Explanations
- Essay Brainstorming
- Vocabulary Builder
- Personalized Study Plans
- Daily Practice Tasks

---

## 9. Vocabulary Builder

### Frontend

- Flashcards
- Daily Words
- Synonyms
- Quiz Mode
- Save Difficult Words

### Backend

- Vocabulary Database
- Progress Tracking
- Spaced Repetition Algorithm

---

## 10. Analytics & Reports

### Frontend

- Band Progression Graph
- Skill Comparison Chart
- Time Spent Analytics
- Weakness Heatmap

### Backend

- Statistics Engine
- Report Generation
- AI Learning Insights

---

## 11. Teacher Panel

- Create Tests
- Review Students
- Manual Score Override
- Live Classes
- Assignment Upload
- Feedback Dashboard

---

## 12. Admin Panel

- User Management
- Subscription Management
- AI Token Monitoring
- Revenue Analytics
- CMS/Blog Management

---

## 13. Subscription System

### Free Plan

- Limited Mock Tests
- Limited AI Evaluations

### Premium Plan

- Unlimited AI Scoring
- Full Analytics
- AI Tutor
- Advanced Reports

---

# AI Architecture

## Writing Scoring Pipeline

Student Essay
→ Preprocessing
→ Grammar Analysis
→ Prompt Engineering
→ OpenAI Evaluation
→ Band Descriptor Mapping
→ Store Result

## Speaking Evaluation Pipeline

Audio Upload
→ Speech-to-Text
→ Transcript Cleanup
→ AI Evaluation
→ Band Score Generation
→ Feedback & Suggestions

---

# Database Models

## Users

- id
- name
- email
- role
- targetBand

## MockTests

- id
- title
- type
- duration

## Questions

- id
- testId
- questionType
- correctAnswer

## WritingSubmissions

- id
- userId
- essay
- aiScore
- feedback

## SpeakingSubmissions

- id
- audioUrl
- transcript
- aiScore

## Analytics

- userId
- readingBand
- listeningBand
- writingBand
- speakingBand

---

# Advanced AI Features

- Adaptive Mock Tests
- Weakness Detection
- AI Study Planner
- AI Speaking Interviewer
- AI Generated Mock Tests

---

# Monetization Ideas

- Monthly Subscription
- Institution Accounts
- Teacher Dashboard Subscription
- AI Evaluation Credits
- Premium Mock Tests

---

# MVP Development Plan

## Phase 1

- Authentication
- Reading Tests
- Listening Tests
- Writing AI Scoring
- Speaking Recording
- Dashboard

## Phase 2

- AI Tutor
- Full Analytics
- Teacher Panel
- Adaptive Testing

## Phase 3

- Mobile App
- Live Classes
- AI Examiner
- Gamification

---

# Recommended Folder Structure

apps/
web/
mobile/
admin/

backend/
auth/
ai/
mocktest/
speaking/
writing/
analytics/

ai-services/
writing-evaluator/
speaking-evaluator/
band-descriptor-engine/
