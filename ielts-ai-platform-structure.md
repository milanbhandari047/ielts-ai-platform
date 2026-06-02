# IELTS AI Mock Test Platform — Complete File & Folder Structure

> **Stack:** Next.js · Flutter · Node.js + Express · PostgreSQL + Prisma · OpenAI · Whisper · Stripe/eSewa  
> **Architecture:** Turborepo monorepo · Feature-based modules · Scalable & reusable

---

## Root Monorepo

```
ielts-ai-platform/
├── apps/
│   ├── web/
│   ├── mobile/
│   └── admin/
├── backend/
├── ai-services/
├── packages/
├── infrastructure/
├── docs/
├── scripts/
├── .github/
│   └── workflows/
├── .env
├── .env.example
├── .gitignore
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── docker-compose.yml
├── docker-compose.prod.yml
└── README.md
```

---

## apps/web/ — Next.js Web Application

```
apps/web/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   ├── verify-email/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (main)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── reading/
│   │   │   ├── page.tsx
│   │   │   ├── [testId]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── result/
│   │   │   │       └── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── listening/
│   │   │   ├── page.tsx
│   │   │   ├── [testId]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── result/
│   │   │   │       └── page.tsx
│   │   │   └── loading.tsx
│   │   │
│   │   ├── writing/
│   │   │   ├── page.tsx
│   │   │   ├── task1/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [submissionId]/
│   │   │   │       └── feedback/
│   │   │   │           └── page.tsx
│   │   │   ├── task2/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [submissionId]/
│   │   │   │       └── feedback/
│   │   │   │           └── page.tsx
│   │   │   └── history/
│   │   │       └── page.tsx
│   │   │
│   │   ├── speaking/
│   │   │   ├── page.tsx
│   │   │   ├── practice/
│   │   │   │   └── page.tsx
│   │   │   ├── [submissionId]/
│   │   │   │   └── feedback/
│   │   │   │       └── page.tsx
│   │   │   └── history/
│   │   │       └── page.tsx
│   │   │
│   │   ├── mock-test/
│   │   │   ├── page.tsx
│   │   │   ├── [testId]/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── reading/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── listening/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── writing/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── speaking/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── result/
│   │   │   │       └── page.tsx
│   │   │   └── history/
│   │   │       └── page.tsx
│   │   │
│   │   ├── analytics/
│   │   │   ├── page.tsx
│   │   │   ├── reading/
│   │   │   │   └── page.tsx
│   │   │   ├── listening/
│   │   │   │   └── page.tsx
│   │   │   ├── writing/
│   │   │   │   └── page.tsx
│   │   │   └── speaking/
│   │   │       └── page.tsx
│   │   │
│   │   ├── vocabulary/
│   │   │   ├── page.tsx
│   │   │   ├── flashcards/
│   │   │   │   └── page.tsx
│   │   │   ├── quiz/
│   │   │   │   └── page.tsx
│   │   │   └── saved/
│   │   │       └── page.tsx
│   │   │
│   │   ├── ai-tutor/
│   │   │   ├── page.tsx
│   │   │   └── [sessionId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── leaderboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── community/
│   │   │   ├── page.tsx
│   │   │   └── [postId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── subscription/
│   │   │   ├── page.tsx
│   │   │   └── success/
│   │   │       └── page.tsx
│   │   │
│   │   └── layout.tsx
│   │
│   ├── (public)/
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── pricing/
│   │   │   └── page.tsx
│   │   ├── support/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/
│   │   └── webhooks/
│   │       ├── stripe/
│   │       │   └── route.ts
│   │       └── esewa/
│   │           └── route.ts
│   │
│   ├── page.tsx                  # Landing Page
│   ├── layout.tsx                # Root Layout
│   ├── not-found.tsx
│   ├── error.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                       # Reusable Base Components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── modal.tsx
│   │   ├── toast.tsx
│   │   ├── badge.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── select.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio.tsx
│   │   ├── avatar.tsx
│   │   ├── progress.tsx
│   │   ├── skeleton.tsx
│   │   ├── tooltip.tsx
│   │   ├── dropdown.tsx
│   │   ├── sheet.tsx
│   │   ├── spinner.tsx
│   │   └── index.ts
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileNav.tsx
│   │   ├── BreadCrumb.tsx
│   │   └── PageHeader.tsx
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── SocialLogin.tsx
│   │   └── AuthGuard.tsx
│   │
│   ├── dashboard/
│   │   ├── BandScoreCard.tsx
│   │   ├── DailyGoalWidget.tsx
│   │   ├── RecentTests.tsx
│   │   ├── WeakSkillCard.tsx
│   │   ├── StreakWidget.tsx
│   │   ├── AIInsightCard.tsx
│   │   └── QuickStartButton.tsx
│   │
│   ├── reading/
│   │   ├── PassageViewer.tsx
│   │   ├── QuestionPanel.tsx
│   │   ├── QuestionNavigator.tsx
│   │   ├── HighlightTool.tsx
│   │   ├── NotesPanel.tsx
│   │   ├── ReadingTimer.tsx
│   │   ├── AnswerInput.tsx
│   │   └── ReadingResult.tsx
│   │
│   ├── listening/
│   │   ├── AudioPlayer.tsx
│   │   ├── PlaybackControls.tsx
│   │   ├── ListeningQuestions.tsx
│   │   ├── SyncedTranscript.tsx
│   │   ├── HeadphoneMode.tsx
│   │   └── ListeningResult.tsx
│   │
│   ├── writing/
│   │   ├── RichTextEditor.tsx
│   │   ├── WordCounter.tsx
│   │   ├── GrammarHighlighter.tsx
│   │   ├── Task1GraphViewer.tsx
│   │   ├── Task2Prompt.tsx
│   │   ├── AIFeedbackPanel.tsx
│   │   ├── BandVisualization.tsx
│   │   ├── WritingTimer.tsx
│   │   └── SampleAnswerDrawer.tsx
│   │
│   ├── speaking/
│   │   ├── VoiceRecorder.tsx
│   │   ├── CueCardDisplay.tsx
│   │   ├── SpeakingTimer.tsx
│   │   ├── AudioPlayback.tsx
│   │   ├── PronunciationHighlight.tsx
│   │   ├── TranscriptViewer.tsx
│   │   └── SpeakingFeedback.tsx
│   │
│   ├── mock-test/
│   │   ├── TestIntroScreen.tsx
│   │   ├── FullscreenTestLayout.tsx
│   │   ├── GlobalTimer.tsx
│   │   ├── SectionNav.tsx
│   │   ├── AutoSubmitAlert.tsx
│   │   └── MockTestResult.tsx
│   │
│   ├── ai/
│   │   ├── AIChatWindow.tsx
│   │   ├── AIMessageBubble.tsx
│   │   ├── AITypingIndicator.tsx
│   │   ├── AIStudyPlan.tsx
│   │   └── AIVocabBuilder.tsx
│   │
│   ├── vocabulary/
│   │   ├── FlashCard.tsx
│   │   ├── FlashCardDeck.tsx
│   │   ├── DailyWordWidget.tsx
│   │   ├── VocabQuiz.tsx
│   │   └── SavedWordsList.tsx
│   │
│   ├── analytics/
│   │   ├── BandProgressChart.tsx
│   │   ├── SkillRadarChart.tsx
│   │   ├── WeaknessHeatmap.tsx
│   │   ├── TimeSpentChart.tsx
│   │   └── PerformanceSummary.tsx
│   │
│   ├── charts/
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── RadarChart.tsx
│   │   ├── HeatmapChart.tsx
│   │   └── DonutChart.tsx
│   │
│   ├── subscription/
│   │   ├── PlanCard.tsx
│   │   ├── FeatureCompare.tsx
│   │   ├── PaymentForm.tsx
│   │   └── SubscriptionStatus.tsx
│   │
│   └── common/
│       ├── Timer.tsx
│       ├── CountdownCircle.tsx
│       ├── ScoreBadge.tsx
│       ├── BandMeter.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       ├── InfiniteScroll.tsx
│       └── ConfirmDialog.tsx
│
├── hooks/
│   ├── useAuth.ts
│   ├── useMockTest.ts
│   ├── useSpeech.ts
│   ├── useAI.ts
│   ├── useTimer.ts
│   ├── useRecorder.ts
│   ├── useAutoSave.ts
│   ├── useSubscription.ts
│   ├── useAnalytics.ts
│   ├── useVocabulary.ts
│   └── useLocalStorage.ts
│
├── services/
│   ├── api.ts                    # Axios base instance + interceptors
│   ├── auth.service.ts
│   ├── reading.service.ts
│   ├── listening.service.ts
│   ├── writing.service.ts
│   ├── speaking.service.ts
│   ├── mocktest.service.ts
│   ├── analytics.service.ts
│   ├── vocabulary.service.ts
│   ├── ai-tutor.service.ts
│   ├── subscription.service.ts
│   └── leaderboard.service.ts
│
├── store/
│   ├── auth.store.ts
│   ├── user.store.ts
│   ├── mocktest.store.ts
│   ├── reading.store.ts
│   ├── writing.store.ts
│   ├── speaking.store.ts
│   └── ui.store.ts
│
├── types/
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── reading.types.ts
│   ├── listening.types.ts
│   ├── writing.types.ts
│   ├── speaking.types.ts
│   ├── mocktest.types.ts
│   ├── analytics.types.ts
│   ├── vocabulary.types.ts
│   ├── subscription.types.ts
│   └── api.types.ts
│
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client (if SSR)
│   ├── utils.ts
│   ├── validations.ts            # Zod schemas
│   └── constants.ts
│
├── utils/
│   ├── bandScore.utils.ts
│   ├── date.utils.ts
│   ├── format.utils.ts
│   ├── audio.utils.ts
│   └── text.utils.ts
│
├── constants/
│   ├── ielts.constants.ts
│   ├── routes.constants.ts
│   ├── api.constants.ts
│   └── subscription.constants.ts
│
├── middleware/
│   └── middleware.ts             # Next.js route protection
│
├── public/
│   ├── images/
│   │   ├── logo.svg
│   │   ├── hero.png
│   │   └── og-image.png
│   ├── icons/
│   │   └── favicon.ico
│   └── fonts/
│
├── styles/
│   └── themes.css
│
├── tests/
│   ├── unit/
│   │   └── utils/
│   ├── integration/
│   │   └── services/
│   └── e2e/
│       └── auth.spec.ts
│
├── .env
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── jest.config.ts
├── vitest.config.ts
└── package.json
```

---

## apps/admin/ — Admin Dashboard (Next.js)

```
apps/admin/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Admin Overview
│   │   │
│   │   ├── users/
│   │   │   ├── page.tsx          # User list
│   │   │   └── [userId]/
│   │   │       └── page.tsx      # User details
│   │   │
│   │   ├── tests/
│   │   │   ├── page.tsx
│   │   │   ├── reading/
│   │   │   │   └── page.tsx
│   │   │   ├── listening/
│   │   │   │   └── page.tsx
│   │   │   ├── writing/
│   │   │   │   └── page.tsx
│   │   │   └── speaking/
│   │   │       └── page.tsx
│   │   │
│   │   ├── subscriptions/
│   │   │   └── page.tsx
│   │   │
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   │
│   │   ├── ai-monitoring/
│   │   │   ├── page.tsx          # Token usage, costs
│   │   │   └── logs/
│   │   │       └── page.tsx
│   │   │
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   │
│   │   ├── content/
│   │   │   ├── blog/
│   │   │   │   └── page.tsx
│   │   │   └── vocabulary/
│   │   │       └── page.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── data-table/
│   │   ├── DataTable.tsx
│   │   ├── Columns.tsx
│   │   └── Filters.tsx
│   ├── charts/
│   ├── forms/
│   └── layout/
│       ├── AdminSidebar.tsx
│       └── AdminHeader.tsx
│
├── hooks/
├── services/
├── store/
├── lib/
├── middleware/
│   └── middleware.ts
├── types/
├── .env
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## apps/mobile/ — Flutter Mobile Application

```
apps/mobile/
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   │   ├── app_constants.dart
│   │   │   ├── ielts_constants.dart
│   │   │   ├── api_constants.dart
│   │   │   └── route_constants.dart
│   │   │
│   │   ├── themes/
│   │   │   ├── app_theme.dart
│   │   │   ├── color_scheme.dart
│   │   │   └── text_styles.dart
│   │   │
│   │   ├── routes/
│   │   │   ├── app_router.dart
│   │   │   └── route_guards.dart
│   │   │
│   │   ├── network/
│   │   │   ├── api_client.dart
│   │   │   ├── interceptors.dart
│   │   │   └── network_exceptions.dart
│   │   │
│   │   ├── storage/
│   │   │   ├── secure_storage.dart
│   │   │   └── hive_storage.dart
│   │   │
│   │   └── utils/
│   │       ├── band_score_utils.dart
│   │       ├── date_utils.dart
│   │       └── audio_utils.dart
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── models/
│   │   │   │   │   ├── user_model.dart
│   │   │   │   │   └── auth_response.dart
│   │   │   │   ├── repositories/
│   │   │   │   │   └── auth_repository.dart
│   │   │   │   └── datasources/
│   │   │   │       └── auth_remote_datasource.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── user_entity.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── login_usecase.dart
│   │   │   │       └── register_usecase.dart
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       │   ├── login_screen.dart
│   │   │       │   ├── register_screen.dart
│   │   │       │   └── forgot_password_screen.dart
│   │   │       ├── widgets/
│   │   │       │   ├── auth_form.dart
│   │   │       │   └── social_login_button.dart
│   │   │       └── providers/
│   │   │           └── auth_provider.dart
│   │   │
│   │   ├── dashboard/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       │   └── dashboard_screen.dart
│   │   │       └── widgets/
│   │   │           ├── band_score_card.dart
│   │   │           ├── daily_goal_widget.dart
│   │   │           ├── recent_tests.dart
│   │   │           └── streak_widget.dart
│   │   │
│   │   ├── reading/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       │   ├── reading_list_screen.dart
│   │   │       │   ├── reading_test_screen.dart
│   │   │       │   └── reading_result_screen.dart
│   │   │       └── widgets/
│   │   │           ├── passage_viewer.dart
│   │   │           ├── question_panel.dart
│   │   │           └── reading_timer.dart
│   │   │
│   │   ├── listening/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       └── widgets/
│   │   │           ├── audio_player_widget.dart
│   │   │           └── listening_questions.dart
│   │   │
│   │   ├── writing/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       │   ├── writing_screen.dart
│   │   │       │   └── writing_feedback_screen.dart
│   │   │       └── widgets/
│   │   │           ├── essay_editor.dart
│   │   │           ├── word_counter.dart
│   │   │           └── ai_feedback_card.dart
│   │   │
│   │   ├── speaking/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       │   ├── speaking_screen.dart
│   │   │       │   └── speaking_result_screen.dart
│   │   │       └── widgets/
│   │   │           ├── voice_recorder.dart
│   │   │           ├── cue_card.dart
│   │   │           └── pronunciation_feedback.dart
│   │   │
│   │   ├── vocabulary/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       └── widgets/
│   │   │           ├── flash_card.dart
│   │   │           └── vocab_quiz.dart
│   │   │
│   │   ├── ai_tutor/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       │   └── ai_tutor_screen.dart
│   │   │       └── widgets/
│   │   │           ├── chat_bubble.dart
│   │   │           └── typing_indicator.dart
│   │   │
│   │   ├── analytics/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── screens/
│   │   │       │   └── analytics_screen.dart
│   │   │       └── widgets/
│   │   │           ├── band_chart.dart
│   │   │           └── progress_card.dart
│   │   │
│   │   └── profile/
│   │       ├── data/
│   │       ├── domain/
│   │       └── presentation/
│   │           ├── screens/
│   │           │   └── profile_screen.dart
│   │           └── widgets/
│   │
│   ├── shared/
│   │   ├── widgets/
│   │   │   ├── app_button.dart
│   │   │   ├── app_text_field.dart
│   │   │   ├── loading_indicator.dart
│   │   │   ├── error_widget.dart
│   │   │   ├── band_meter.dart
│   │   │   ├── timer_widget.dart
│   │   │   └── empty_state.dart
│   │   │
│   │   ├── models/
│   │   │   ├── band_score.dart
│   │   │   ├── ai_feedback.dart
│   │   │   └── pagination.dart
│   │   │
│   │   ├── services/
│   │   │   ├── audio_service.dart
│   │   │   ├── notification_service.dart
│   │   │   └── analytics_service.dart
│   │   │
│   │   └── providers/
│   │       ├── theme_provider.dart
│   │       └── connectivity_provider.dart
│   │
│   └── main.dart
│
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   └── onboarding/
│   ├── icons/
│   ├── audio/
│   │   └── sample/
│   └── animations/
│       └── lottie/
│
├── test/
│   ├── unit/
│   ├── widget/
│   └── integration/
│
├── android/
├── ios/
├── pubspec.yaml
├── pubspec.lock
├── analysis_options.yaml
├── .env
└── README.md
```

---

## backend/ — Node.js + Express API

```
backend/
├── src/
│   │
│   ├── config/
│   │   ├── db.ts                 # PostgreSQL / Prisma init
│   │   ├── redis.ts              # Redis / BullMQ init
│   │   ├── env.ts                # Env validation (Zod)
│   │   ├── ai.ts                 # OpenAI client config
│   │   ├── aws.ts                # AWS S3 config
│   │   └── stripe.ts             # Stripe config
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.validation.ts
│   │   │   ├── auth.types.ts
│   │   │   └── strategies/
│   │   │       ├── jwt.strategy.ts
│   │   │       └── google.strategy.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.routes.ts
│   │   │   ├── users.validation.ts
│   │   │   └── users.types.ts
│   │   │
│   │   ├── reading/
│   │   │   ├── reading.controller.ts
│   │   │   ├── reading.service.ts
│   │   │   ├── reading.routes.ts
│   │   │   ├── reading.validation.ts
│   │   │   ├── reading.types.ts
│   │   │   └── reading.scorer.ts
│   │   │
│   │   ├── listening/
│   │   │   ├── listening.controller.ts
│   │   │   ├── listening.service.ts
│   │   │   ├── listening.routes.ts
│   │   │   ├── listening.validation.ts
│   │   │   ├── listening.types.ts
│   │   │   └── listening.scorer.ts
│   │   │
│   │   ├── writing/
│   │   │   ├── writing.controller.ts
│   │   │   ├── writing.service.ts
│   │   │   ├── writing.routes.ts
│   │   │   ├── writing.validation.ts
│   │   │   ├── writing.types.ts
│   │   │   └── writing.scorer.ts
│   │   │
│   │   ├── speaking/
│   │   │   ├── speaking.controller.ts
│   │   │   ├── speaking.service.ts
│   │   │   ├── speaking.routes.ts
│   │   │   ├── speaking.validation.ts
│   │   │   ├── speaking.types.ts
│   │   │   └── speaking.scorer.ts
│   │   │
│   │   ├── mock-test/
│   │   │   ├── mocktest.controller.ts
│   │   │   ├── mocktest.service.ts
│   │   │   ├── mocktest.routes.ts
│   │   │   ├── mocktest.validation.ts
│   │   │   ├── mocktest.types.ts
│   │   │   └── mocktest.session.ts
│   │   │
│   │   ├── vocabulary/
│   │   │   ├── vocabulary.controller.ts
│   │   │   ├── vocabulary.service.ts
│   │   │   ├── vocabulary.routes.ts
│   │   │   ├── vocabulary.types.ts
│   │   │   └── spaced-repetition.ts
│   │   │
│   │   ├── analytics/
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── analytics.routes.ts
│   │   │   └── analytics.types.ts
│   │   │
│   │   ├── ai/
│   │   │   ├── ai.controller.ts
│   │   │   ├── ai.service.ts
│   │   │   ├── ai.routes.ts
│   │   │   └── ai.types.ts
│   │   │
│   │   ├── subscription/
│   │   │   ├── subscription.controller.ts
│   │   │   ├── subscription.service.ts
│   │   │   ├── subscription.routes.ts
│   │   │   ├── subscription.validation.ts
│   │   │   └── subscription.types.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── stripe.handler.ts
│   │   │   └── esewa.handler.ts
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   ├── notifications.routes.ts
│   │   │   └── notifications.types.ts
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── leaderboard.controller.ts
│   │   │   ├── leaderboard.service.ts
│   │   │   ├── leaderboard.routes.ts
│   │   │   └── leaderboard.types.ts
│   │   │
│   │   ├── community/
│   │   │   ├── community.controller.ts
│   │   │   ├── community.service.ts
│   │   │   ├── community.routes.ts
│   │   │   └── community.types.ts
│   │   │
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       ├── admin.service.ts
│   │       ├── admin.routes.ts
│   │       └── admin.types.ts
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── upload.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── subscription.middleware.ts
│   │   └── logger.middleware.ts
│   │
│   ├── services/
│   │   │
│   │   ├── ai/
│   │   │   ├── openai.service.ts         # Base OpenAI client
│   │   │   ├── whisper.service.ts        # Speech-to-text
│   │   │   ├── writing-evaluator.ts      # Writing AI scoring
│   │   │   ├── speaking-evaluator.ts     # Speaking AI scoring
│   │   │   ├── pronunciation.service.ts
│   │   │   ├── grammar.service.ts
│   │   │   ├── vocabulary.service.ts
│   │   │   ├── feedback-generator.ts     # Actionable feedback builder
│   │   │   ├── band-predictor.ts
│   │   │   └── study-plan.service.ts
│   │   │
│   │   ├── aws/
│   │   │   ├── s3.service.ts
│   │   │   └── cloudfront.service.ts
│   │   │
│   │   ├── email/
│   │   │   ├── email.service.ts
│   │   │   └── templates/
│   │   │       ├── welcome.template.ts
│   │   │       ├── verify-email.template.ts
│   │   │       ├── reset-password.template.ts
│   │   │       └── test-result.template.ts
│   │   │
│   │   ├── payment/
│   │   │   ├── stripe.service.ts
│   │   │   └── esewa.service.ts
│   │   │
│   │   ├── notification/
│   │   │   ├── push.service.ts
│   │   │   └── in-app.service.ts
│   │   │
│   │   └── analytics/
│   │       ├── tracker.service.ts
│   │       └── report.service.ts
│   │
│   ├── jobs/
│   │   ├── ai-evaluation.job.ts      # Process writing/speaking queues
│   │   ├── email.job.ts
│   │   ├── analytics.job.ts
│   │   ├── reminder.job.ts           # Daily study reminders
│   │   └── leaderboard.job.ts        # Weekly leaderboard reset
│   │
│   ├── queues/
│   │   ├── ai.queue.ts               # BullMQ AI evaluation queue
│   │   ├── email.queue.ts
│   │   └── notification.queue.ts
│   │
│   ├── websocket/
│   │   ├── index.ts                  # Socket.IO server init
│   │   ├── speaking.socket.ts        # Real-time speaking session
│   │   └── realtime-ai.socket.ts     # Live AI feedback stream
│   │
│   ├── utils/
│   │   ├── bandScore.utils.ts
│   │   ├── pagination.utils.ts
│   │   ├── crypto.utils.ts
│   │   ├── date.utils.ts
│   │   └── string.utils.ts
│   │
│   ├── constants/
│   │   ├── ielts.constants.ts
│   │   ├── bandDescriptors.constants.ts
│   │   └── roles.constants.ts
│   │
│   ├── types/
│   │   ├── express.d.ts              # Extend Express Request
│   │   ├── common.types.ts
│   │   └── ai.types.ts
│   │
│   ├── validators/
│   │   ├── common.validator.ts
│   │   └── file.validator.ts
│   │
│   ├── docs/
│   │   └── swagger.ts                # Swagger/OpenAPI setup
│   │
│   ├── app.ts                        # Express app factory
│   └── server.ts                     # Entry point
│
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
│
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── reading.test.ts
│   │   ├── writing.test.ts
│   │   └── speaking.test.ts
│   └── e2e/
│       └── mocktest.e2e.ts
│
├── uploads/
│   ├── audio/
│   ├── essays/
│   └── temp/
│
├── .env
├── .env.example
├── package.json
├── tsconfig.json
├── jest.config.ts
└── dockerfile
```

---

## ai-services/ — Dedicated AI Service Layer

```
ai-services/
│
├── writing-evaluator/
│   ├── prompts/
│   │   ├── task1-evaluation.prompt.ts    # Academic Graph/Chart
│   │   ├── task2-evaluation.prompt.ts    # Essay evaluation
│   │   ├── grammar-check.prompt.ts
│   │   └── rewrite-suggestion.prompt.ts
│   │
│   ├── descriptors/
│   │   ├── band-descriptors.ts           # Official IELTS band descriptors
│   │   ├── task-response.descriptor.ts
│   │   ├── coherence.descriptor.ts
│   │   ├── lexical.descriptor.ts
│   │   └── grammar.descriptor.ts
│   │
│   ├── evaluators/
│   │   ├── task-response.evaluator.ts
│   │   ├── coherence.evaluator.ts
│   │   ├── lexical.evaluator.ts
│   │   ├── grammar.evaluator.ts
│   │   └── overall.evaluator.ts
│   │
│   └── utils/
│       ├── preprocessing.ts
│       ├── score-mapper.ts
│       └── feedback-builder.ts
│
├── speaking-evaluator/
│   ├── pronunciation/
│   │   ├── phoneme-analyzer.ts
│   │   └── pronunciation.prompt.ts
│   │
│   ├── fluency/
│   │   ├── hesitation-detector.ts
│   │   ├── speed-analyzer.ts
│   │   └── fluency.prompt.ts
│   │
│   ├── vocabulary/
│   │   ├── lexical-range.analyzer.ts
│   │   └── vocabulary.prompt.ts
│   │
│   └── grammar/
│       ├── spoken-grammar.analyzer.ts
│       └── grammar.prompt.ts
│
├── adaptive-learning/
│   ├── weakness-detector.ts
│   ├── difficulty-adjuster.ts
│   └── adaptive.prompt.ts
│
├── recommendation-engine/
│   ├── study-plan.generator.ts
│   ├── resource-recommender.ts
│   └── practice-suggester.ts
│
├── band-score-engine/
│   ├── score-calculator.ts
│   ├── band-mapper.ts
│   └── confidence-scorer.ts
│
├── prompt-engineering/
│   ├── base-prompts.ts
│   ├── prompt-builder.ts
│   ├── chain-of-thought.ts
│   └── few-shot-examples.ts
│
└── datasets/
    ├── band9-essays/
    ├── sample-speaking/
    └── vocabulary-lists/
        ├── academic-wordlist.json
        └── ielts-vocab.json
```

---

## packages/ — Shared Monorepo Packages

```
packages/
│
├── ui/                           # Shared design system
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.stories.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Badge/
│   │   │   └── ...
│   │   ├── tokens/
│   │   │   ├── colors.ts
│   │   │   ├── spacing.ts
│   │   │   └── typography.ts
│   │   └── index.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── types/                        # Shared TypeScript types
│   ├── src/
│   │   ├── auth.types.ts
│   │   ├── ielts.types.ts
│   │   ├── ai.types.ts
│   │   ├── api.types.ts
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
│
├── api-client/                   # Shared API client (fetch wrapper)
│   ├── src/
│   │   ├── client.ts
│   │   ├── endpoints.ts
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
│
├── shared-utils/                 # Shared utility functions
│   ├── src/
│   │   ├── bandScore.ts
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── index.ts
│   ├── tsconfig.json
│   └── package.json
│
├── eslint-config/
│   ├── index.js
│   ├── next.js
│   └── package.json
│
└── tsconfig/
    ├── base.json
    ├── nextjs.json
    ├── node.json
    └── package.json
```

---

## infrastructure/

```
infrastructure/
│
├── docker/
│   ├── web.dockerfile
│   ├── backend.dockerfile
│   ├── admin.dockerfile
│   └── ai-services.dockerfile
│
├── nginx/
│   ├── nginx.conf
│   ├── ssl/
│   └── sites/
│       ├── web.conf
│       ├── api.conf
│       └── admin.conf
│
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   └── modules/
│       ├── rds/
│       ├── s3/
│       ├── ec2/
│       └── cloudfront/
│
├── kubernetes/
│   ├── namespace.yaml
│   ├── web-deployment.yaml
│   ├── api-deployment.yaml
│   ├── worker-deployment.yaml
│   ├── redis-deployment.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml                  # Horizontal Pod Autoscaler
│   └── secrets.yaml
│
└── monitoring/
    ├── prometheus/
    │   └── prometheus.yml
    ├── grafana/
    │   └── dashboards/
    │       └── ielts-platform.json
    └── alertmanager/
        └── alerts.yml
```

---

## docs/

```
docs/
│
├── api/
│   ├── auth.md
│   ├── reading.md
│   ├── listening.md
│   ├── writing.md
│   ├── speaking.md
│   └── ai-services.md
│
├── architecture/
│   ├── overview.md
│   ├── ai-pipeline.md
│   └── data-flow.md
│
├── database/
│   ├── schema-overview.md
│   └── erd.png
│
├── prompts/
│   ├── writing-evaluation.md
│   ├── speaking-evaluation.md
│   └── ai-tutor.md
│
├── workflows/
│   ├── writing-scoring-flow.md
│   └── speaking-scoring-flow.md
│
└── deployment/
    ├── local-setup.md
    ├── staging.md
    └── production.md
```

---

## .github/ — CI/CD Pipelines

```
.github/
└── workflows/
    ├── frontend.yml              # Lint, test, build web + admin
    ├── backend.yml               # Lint, test, build backend
    ├── mobile.yml                # Flutter test + build
    ├── deploy-staging.yml
    └── deploy-production.yml
```

---

## prisma/schema.prisma — Database Models

```prisma
// Key models (expand as needed)

model User {
  id              String   @id @default(cuid())
  name            String
  email           String   @unique
  passwordHash    String?
  role            Role     @default(STUDENT)
  targetBand      Float?
  avatarUrl       String?
  streak          Int      @default(0)
  lastActiveAt    DateTime?
  emailVerified   Boolean  @default(false)
  subscriptionId  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  subscription    Subscription?
  mockTests       MockTestAttempt[]
  writingSubmissions  WritingSubmission[]
  speakingSubmissions SpeakingSubmission[]
  analytics       UserAnalytics?
  vocabularyProgress VocabProgress[]
}

enum Role { STUDENT TEACHER ADMIN }

model MockTest {
  id          String   @id @default(cuid())
  title       String
  type        TestType
  duration    Int
  passages    ReadingPassage[]
  audioFiles  ListeningAudio[]
  writingTasks WritingTask[]
  speakingParts SpeakingPart[]
  createdAt   DateTime @default(now())
}

enum TestType { ACADEMIC GENERAL_TRAINING }

model MockTestAttempt {
  id            String   @id @default(cuid())
  userId        String
  testId        String
  startedAt     DateTime
  completedAt   DateTime?
  readingBand   Float?
  listeningBand Float?
  writingBand   Float?
  speakingBand  Float?
  overallBand   Float?
  user          User     @relation(fields: [userId], references: [id])
  test          MockTest @relation(fields: [testId], references: [id])
}

model WritingSubmission {
  id          String   @id @default(cuid())
  userId      String
  taskType    Int      // 1 or 2
  essay       String
  wordCount   Int
  aiScore     Json?    // { taskResponse, coherence, lexical, grammar, overall }
  feedback    String?
  band        Float?
  submittedAt DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model SpeakingSubmission {
  id          String   @id @default(cuid())
  userId      String
  audioUrl    String
  transcript  String?
  aiScore     Json?    // { fluency, pronunciation, grammar, vocabulary, overall }
  feedback    String?
  band        Float?
  submittedAt DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
}

model UserAnalytics {
  id            String   @id @default(cuid())
  userId        String   @unique
  readingBand   Float    @default(0)
  listeningBand Float    @default(0)
  writingBand   Float    @default(0)
  speakingBand  Float    @default(0)
  totalTests    Int      @default(0)
  studyHours    Float    @default(0)
  updatedAt     DateTime @updatedAt
  user          User     @relation(fields: [userId], references: [id])
}

model Subscription {
  id         String             @id @default(cuid())
  userId     String             @unique
  plan       SubscriptionPlan
  status     SubscriptionStatus
  startDate  DateTime
  endDate    DateTime?
  stripeId   String?
  user       User               @relation(fields: [userId], references: [id])
}

enum SubscriptionPlan   { FREE PREMIUM INSTITUTIONAL }
enum SubscriptionStatus { ACTIVE CANCELLED EXPIRED TRIALING }

model VocabWord {
  id          String   @id @default(cuid())
  word        String   @unique
  definition  String
  synonyms    String[]
  examples    String[]
  difficulty  Int      // 1-5
  category    String?
  progress    VocabProgress[]
}

model VocabProgress {
  id          String   @id @default(cuid())
  userId      String
  wordId      String
  easeFactor  Float    @default(2.5)   // Spaced repetition
  interval    Int      @default(1)
  repetitions Int      @default(0)
  nextReview  DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id])
  word        VocabWord @relation(fields: [wordId], references: [id])
}
```

---

## Root Config Files

```
/
├── turbo.json                    # Turborepo pipeline config
├── pnpm-workspace.yaml           # Workspace packages
├── package.json                  # Root scripts
├── docker-compose.yml            # Local dev (web, api, postgres, redis)
├── docker-compose.prod.yml       # Production overrides
├── .env                          # Root shared env vars
├── .env.example
└── .gitignore
```

---

## Key Environment Variables

```bash
# .env.example (root)

# App
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:4000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ielts_db
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
OPENAI_API_KEY=
OPENAI_ORG_ID=

# AWS
AWS_REGION=ap-south-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
ESEWA_SECRET_KEY=
ESEWA_MERCHANT_CODE=

# Email
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=noreply@ieltsplatform.com
```

---

## MVP Phase Checklist

| Phase | Features | Status |
|-------|----------|--------|
| **Phase 1** | Auth, Reading, Listening, Writing AI, Speaking Recording, Dashboard | 🚧 Build first |
| **Phase 2** | AI Tutor, Full Analytics, Teacher Panel, Adaptive Testing | 📋 Next |
| **Phase 3** | Mobile App (Flutter), Live Classes, AI Examiner, Gamification | 🔮 Future |

---

*Total: ~180+ files and folders across the full platform*
