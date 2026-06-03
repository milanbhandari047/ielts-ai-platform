# IELTS AI Mock Test Platform — Complete File & Folder Structure

> **Stack:** Next.js · Flutter · Node.js + Express · PostgreSQL + Prisma · OpenAI API · Whisper · Stripe / eSewa  
> **Monorepo:** Turborepo + pnpm workspaces

---

```
ielts-ai-platform/
│
├── apps/
│   │
│   ├── web/                                         # Next.js Web Application
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── register/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── verify-email/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (dashboard)/
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── loading.tsx
│   │   │   │   │   └── error.tsx
│   │   │   │   │
│   │   │   │   ├── reading/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [testId]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── result/
│   │   │   │   │           └── page.tsx
│   │   │   │   │
│   │   │   │   ├── listening/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [testId]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── result/
│   │   │   │   │           └── page.tsx
│   │   │   │   │
│   │   │   │   ├── writing/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── task1/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── task2/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [submissionId]/
│   │   │   │   │       └── feedback/
│   │   │   │   │           └── page.tsx
│   │   │   │   │
│   │   │   │   ├── speaking/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── part1/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── part2/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── part3/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [submissionId]/
│   │   │   │   │       └── feedback/
│   │   │   │   │           └── page.tsx
│   │   │   │   │
│   │   │   │   ├── mock-test/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [sessionId]/
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── result/
│   │   │   │   │           └── page.tsx
│   │   │   │   │
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── reports/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── vocabulary/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── flashcards/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── quiz/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── ai-tutor/
│   │   │   │   │   └── page.tsx
│   │   │   │   │
│   │   │   │   ├── profile/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── edit/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── subscription/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── checkout/
│   │   │   │   │       └── page.tsx
│   │   │   │   │
│   │   │   │   ├── settings/
│   │   │   │   │   └── page.tsx
│   │   │   │   │
│   │   │   │   ├── leaderboard/
│   │   │   │   │   └── page.tsx
│   │   │   │   │
│   │   │   │   └── community/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── (public)/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── pricing/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [slug]/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── support/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...nextauth]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── trpc/
│   │   │   │   │   └── [trpc]/
│   │   │   │   │       └── route.ts
│   │   │   │   └── webhooks/
│   │   │   │       ├── stripe/
│   │   │   │       │   └── route.ts
│   │   │   │       └── esewa/
│   │   │   │           └── route.ts
│   │   │   │
│   │   │   ├── layout.tsx
│   │   │   ├── globals.css
│   │   │   └── not-found.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                                  # Base UI components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Dropdown.tsx
│   │   │   │   ├── Tabs.tsx
│   │   │   │   ├── Progress.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   └── Tooltip.tsx
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   ├── ProfileForm.tsx
│   │   │   │   └── StudyGoalForm.tsx
│   │   │   │
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── DashboardShell.tsx
│   │   │   │   └── AuthShell.tsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── BandPredictionCard.tsx
│   │   │   │   ├── ProgressChart.tsx
│   │   │   │   ├── RecentTests.tsx
│   │   │   │   ├── DailyGoal.tsx
│   │   │   │   ├── WeakSkillCard.tsx
│   │   │   │   ├── AIInsightsBanner.tsx
│   │   │   │   └── StreakTracker.tsx
│   │   │   │
│   │   │   ├── reading/
│   │   │   │   ├── PassageViewer.tsx
│   │   │   │   ├── QuestionNavigator.tsx
│   │   │   │   ├── HighlightTool.tsx
│   │   │   │   ├── NotesPanel.tsx
│   │   │   │   ├── ReadingTimer.tsx
│   │   │   │   ├── AnswerGrid.tsx
│   │   │   │   └── question-types/
│   │   │   │       ├── MultipleChoice.tsx
│   │   │   │       ├── TrueFalse.tsx
│   │   │   │       ├── FillBlank.tsx
│   │   │   │       ├── MatchHeadings.tsx
│   │   │   │       ├── ShortAnswer.tsx
│   │   │   │       └── SentenceCompletion.tsx
│   │   │   │
│   │   │   ├── listening/
│   │   │   │   ├── AudioPlayer.tsx
│   │   │   │   ├── PlaybackControls.tsx
│   │   │   │   ├── TranscriptPanel.tsx
│   │   │   │   ├── ListeningTimer.tsx
│   │   │   │   ├── QuestionSync.tsx
│   │   │   │   └── NotesSection.tsx
│   │   │   │
│   │   │   ├── writing/
│   │   │   │   ├── RichTextEditor.tsx
│   │   │   │   ├── WordCounter.tsx
│   │   │   │   ├── GraphViewer.tsx
│   │   │   │   ├── AIFeedbackPanel.tsx
│   │   │   │   ├── BandVisualization.tsx
│   │   │   │   ├── GrammarHighlight.tsx
│   │   │   │   ├── EssayStructureAnalyzer.tsx
│   │   │   │   └── SampleBand9Drawer.tsx
│   │   │   │
│   │   │   ├── speaking/
│   │   │   │   ├── VoiceRecorder.tsx
│   │   │   │   ├── CueCardDisplay.tsx
│   │   │   │   ├── LiveTranscript.tsx
│   │   │   │   ├── PronunciationFeedback.tsx
│   │   │   │   ├── SpeakingTimer.tsx
│   │   │   │   ├── AudioPlayback.tsx
│   │   │   │   └── FluencyMeter.tsx
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── BandProgressionGraph.tsx
│   │   │   │   ├── SkillRadarChart.tsx
│   │   │   │   ├── WeaknessHeatmap.tsx
│   │   │   │   ├── TimeSpentChart.tsx
│   │   │   │   └── ScoreBreakdown.tsx
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── AIChatInterface.tsx
│   │   │   │   ├── AIFeedbackCard.tsx
│   │   │   │   ├── AIRewriteSuggestion.tsx
│   │   │   │   ├── VocabSuggestionChip.tsx
│   │   │   │   ├── StudyPlanCard.tsx
│   │   │   │   └── AILoadingState.tsx
│   │   │   │
│   │   │   ├── mock-test/
│   │   │   │   ├── FullscreenExam.tsx
│   │   │   │   ├── ExamTimer.tsx
│   │   │   │   ├── SectionNavigator.tsx
│   │   │   │   ├── AutoSubmitWarning.tsx
│   │   │   │   ├── ResultScreen.tsx
│   │   │   │   └── BandScoreCard.tsx
│   │   │   │
│   │   │   ├── vocabulary/
│   │   │   │   ├── Flashcard.tsx
│   │   │   │   ├── DailyWordCard.tsx
│   │   │   │   ├── QuizCard.tsx
│   │   │   │   └── VocabProgress.tsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── DarkModeToggle.tsx
│   │   │       ├── BandScoreBadge.tsx
│   │   │       ├── DifficultyTag.tsx
│   │   │       ├── TimerCountdown.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       └── SEO.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useMockTest.ts
│   │   │   ├── useSpeech.ts
│   │   │   ├── useAI.ts
│   │   │   ├── useTimer.ts
│   │   │   ├── useAutoSave.ts
│   │   │   ├── useAnalytics.ts
│   │   │   ├── useVocabulary.ts
│   │   │   └── useSubscription.ts
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── writing.service.ts
│   │   │   ├── speaking.service.ts
│   │   │   ├── reading.service.ts
│   │   │   ├── listening.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── vocabulary.service.ts
│   │   │   ├── subscription.service.ts
│   │   │   └── mocktest.service.ts
│   │   │
│   │   ├── store/
│   │   │   ├── auth.store.ts
│   │   │   ├── mocktest.store.ts
│   │   │   ├── user.store.ts
│   │   │   ├── writing.store.ts
│   │   │   ├── speaking.store.ts
│   │   │   └── ui.store.ts
│   │   │
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── test.types.ts
│   │   │   ├── ai.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── analytics.types.ts
│   │   │   └── subscription.types.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── bandScore.ts
│   │   │   ├── dateHelpers.ts
│   │   │   ├── audioHelpers.ts
│   │   │   ├── validators.ts
│   │   │   ├── formatters.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── trpc.ts
│   │   │   ├── auth.ts
│   │   │   ├── prisma.ts
│   │   │   ├── stripe.ts
│   │   │   └── uploadthing.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── index.ts
│   │   │   └── auth.middleware.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── routes.ts
│   │   │   ├── bandDescriptors.ts
│   │   │   └── ielts.ts
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css
│   │   │   └── themes.css
│   │   │
│   │   ├── public/
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   ├── audio/
│   │   │   └── fonts/
│   │   │
│   │   ├── tests/
│   │   │   ├── unit/
│   │   │   │   ├── bandScore.test.ts
│   │   │   │   └── validators.test.ts
│   │   │   ├── integration/
│   │   │   │   └── writing.test.ts
│   │   │   └── e2e/
│   │   │       ├── mock-test.spec.ts
│   │   │       └── auth.spec.ts
│   │   │
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── mobile/                                      # Flutter Mobile Application
│   │   ├── lib/
│   │   │   ├── core/
│   │   │   │   ├── constants/
│   │   │   │   │   ├── app_constants.dart
│   │   │   │   │   ├── api_endpoints.dart
│   │   │   │   │   └── ielts_constants.dart
│   │   │   │   ├── themes/
│   │   │   │   │   ├── app_theme.dart
│   │   │   │   │   ├── color_scheme.dart
│   │   │   │   │   └── text_styles.dart
│   │   │   │   ├── routes/
│   │   │   │   │   ├── app_router.dart
│   │   │   │   │   └── route_names.dart
│   │   │   │   ├── network/
│   │   │   │   │   ├── dio_client.dart
│   │   │   │   │   ├── api_interceptors.dart
│   │   │   │   │   └── network_exceptions.dart
│   │   │   │   ├── storage/
│   │   │   │   │   ├── local_storage.dart
│   │   │   │   │   ├── secure_storage.dart
│   │   │   │   │   └── cache_manager.dart
│   │   │   │   └── utils/
│   │   │   │       ├── audio_utils.dart
│   │   │   │       ├── band_score_utils.dart
│   │   │   │       └── date_utils.dart
│   │   │   │
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── data/
│   │   │   │   │   │   ├── auth_repository.dart
│   │   │   │   │   │   └── auth_datasource.dart
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   ├── auth_usecase.dart
│   │   │   │   │   │   └── user_model.dart
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── login_screen.dart
│   │   │   │   │       ├── register_screen.dart
│   │   │   │   │       └── auth_provider.dart
│   │   │   │   │
│   │   │   │   ├── reading/
│   │   │   │   │   ├── data/
│   │   │   │   │   │   └── reading_repository.dart
│   │   │   │   │   ├── domain/
│   │   │   │   │   │   └── reading_models.dart
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── reading_screen.dart
│   │   │   │   │       ├── passage_viewer_widget.dart
│   │   │   │   │       └── reading_provider.dart
│   │   │   │   │
│   │   │   │   ├── listening/
│   │   │   │   │   ├── data/
│   │   │   │   │   │   └── listening_repository.dart
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── listening_screen.dart
│   │   │   │   │       └── audio_player_widget.dart
│   │   │   │   │
│   │   │   │   ├── writing/
│   │   │   │   │   ├── data/
│   │   │   │   │   │   └── writing_repository.dart
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── writing_screen.dart
│   │   │   │   │       ├── ai_feedback_widget.dart
│   │   │   │   │       └── writing_provider.dart
│   │   │   │   │
│   │   │   │   ├── speaking/
│   │   │   │   │   ├── data/
│   │   │   │   │   │   └── speaking_repository.dart
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── speaking_screen.dart
│   │   │   │   │       ├── voice_recorder_widget.dart
│   │   │   │   │       └── speaking_provider.dart
│   │   │   │   │
│   │   │   │   ├── mock_test/
│   │   │   │   │   ├── data/
│   │   │   │   │   │   └── mocktest_repository.dart
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── mock_test_screen.dart
│   │   │   │   │       ├── exam_timer_widget.dart
│   │   │   │   │       └── result_screen.dart
│   │   │   │   │
│   │   │   │   ├── vocabulary/
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── vocabulary_screen.dart
│   │   │   │   │       └── flashcard_widget.dart
│   │   │   │   │
│   │   │   │   ├── ai_tutor/
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── ai_tutor_screen.dart
│   │   │   │   │       └── chat_bubble_widget.dart
│   │   │   │   │
│   │   │   │   ├── analytics/
│   │   │   │   │   └── presentation/
│   │   │   │   │       ├── analytics_screen.dart
│   │   │   │   │       └── band_chart_widget.dart
│   │   │   │   │
│   │   │   │   └── profile/
│   │   │   │       └── presentation/
│   │   │   │           ├── profile_screen.dart
│   │   │   │           └── settings_screen.dart
│   │   │   │
│   │   │   ├── shared/
│   │   │   │   ├── widgets/
│   │   │   │   │   ├── band_score_badge.dart
│   │   │   │   │   ├── loading_overlay.dart
│   │   │   │   │   ├── custom_button.dart
│   │   │   │   │   ├── timer_widget.dart
│   │   │   │   │   ├── error_view.dart
│   │   │   │   │   └── empty_state.dart
│   │   │   │   ├── models/
│   │   │   │   │   ├── api_response.dart
│   │   │   │   │   ├── pagination.dart
│   │   │   │   │   └── band_score.dart
│   │   │   │   ├── services/
│   │   │   │   │   ├── audio_service.dart
│   │   │   │   │   ├── speech_service.dart
│   │   │   │   │   └── notification_service.dart
│   │   │   │   └── providers/
│   │   │   │       ├── app_provider.dart
│   │   │   │       └── theme_provider.dart
│   │   │   │
│   │   │   └── main.dart
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   ├── audio/
│   │   │   └── animations/
│   │   │
│   │   ├── test/
│   │   │   ├── widget_test.dart
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   │
│   │   ├── pubspec.yaml
│   │   ├── analysis_options.yaml
│   │   └── .env
│   │
│   └── admin/                                       # Admin Dashboard (Next.js)
│       ├── app/
│       │   ├── users/
│       │   │   ├── page.tsx
│       │   │   └── [userId]/
│       │   │       └── page.tsx
│       │   ├── tests/
│       │   │   ├── page.tsx
│       │   │   ├── create/
│       │   │   │   └── page.tsx
│       │   │   └── [testId]/
│       │   │       └── edit/
│       │   │           └── page.tsx
│       │   ├── subscriptions/
│       │   │   ├── page.tsx
│       │   │   └── plans/
│       │   │       └── page.tsx
│       │   ├── analytics/
│       │   │   ├── page.tsx
│       │   │   └── revenue/
│       │   │       └── page.tsx
│       │   ├── ai-monitoring/
│       │   │   ├── page.tsx
│       │   │   ├── tokens/
│       │   │   │   └── page.tsx
│       │   │   └── evaluations/
│       │   │       └── page.tsx
│       │   ├── reports/
│       │   │   └── page.tsx
│       │   ├── settings/
│       │   │   └── page.tsx
│       │   ├── cms/
│       │   │   ├── blog/
│       │   │   │   └── page.tsx
│       │   │   └── questions/
│       │   │       └── page.tsx
│       │   ├── layout.tsx
│       │   └── page.tsx
│       │
│       ├── components/
│       │   ├── UserTable.tsx
│       │   ├── SubscriptionManager.tsx
│       │   ├── AITokenDashboard.tsx
│       │   ├── TestCreator.tsx
│       │   ├── RevenueChart.tsx
│       │   └── AIEvaluationLog.tsx
│       │
│       ├── services/
│       │   ├── admin.service.ts
│       │   └── reports.service.ts
│       │
│       ├── hooks/
│       │   ├── useAdminData.ts
│       │   └── useAdminAuth.ts
│       │
│       ├── lib/
│       │   ├── auth.ts
│       │   └── prisma.ts
│       │
│       ├── middleware/
│       │   └── admin.middleware.ts
│       │
│       ├── .env
│       ├── next.config.ts
│       └── package.json
│
├── backend/                                         # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.ts
│   │   │   ├── redis.ts
│   │   │   ├── env.ts
│   │   │   ├── ai.ts
│   │   │   ├── s3.ts
│   │   │   └── stripe.ts
│   │   │
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.validation.ts
│   │   │   │   ├── auth.types.ts
│   │   │   │   └── strategies/
│   │   │   │       ├── jwt.strategy.ts
│   │   │   │       └── google.strategy.ts
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── users.controller.ts
│   │   │   │   ├── users.service.ts
│   │   │   │   ├── users.routes.ts
│   │   │   │   ├── users.validation.ts
│   │   │   │   └── users.types.ts
│   │   │   │
│   │   │   ├── reading/
│   │   │   │   ├── reading.controller.ts
│   │   │   │   ├── reading.service.ts
│   │   │   │   ├── reading.routes.ts
│   │   │   │   ├── reading.validation.ts
│   │   │   │   └── question-engine/
│   │   │   │       ├── question.factory.ts
│   │   │   │       ├── auto-validator.ts
│   │   │   │       └── score.calculator.ts
│   │   │   │
│   │   │   ├── listening/
│   │   │   │   ├── listening.controller.ts
│   │   │   │   ├── listening.service.ts
│   │   │   │   ├── listening.routes.ts
│   │   │   │   └── audio.processor.ts
│   │   │   │
│   │   │   ├── writing/
│   │   │   │   ├── writing.controller.ts
│   │   │   │   ├── writing.service.ts
│   │   │   │   ├── writing.routes.ts
│   │   │   │   ├── writing.validation.ts
│   │   │   │   └── evaluation.queue.ts
│   │   │   │
│   │   │   ├── speaking/
│   │   │   │   ├── speaking.controller.ts
│   │   │   │   ├── speaking.service.ts
│   │   │   │   ├── speaking.routes.ts
│   │   │   │   ├── speaking.validation.ts
│   │   │   │   └── pronunciation.analyzer.ts
│   │   │   │
│   │   │   ├── mock-test/
│   │   │   │   ├── mocktest.controller.ts
│   │   │   │   ├── mocktest.service.ts
│   │   │   │   ├── mocktest.routes.ts
│   │   │   │   ├── session.manager.ts
│   │   │   │   ├── timer.validator.ts
│   │   │   │   └── auto-score.ts
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── analytics.controller.ts
│   │   │   │   ├── analytics.service.ts
│   │   │   │   ├── analytics.routes.ts
│   │   │   │   ├── band.calculator.ts
│   │   │   │   └── report.generator.ts
│   │   │   │
│   │   │   ├── vocabulary/
│   │   │   │   ├── vocabulary.controller.ts
│   │   │   │   ├── vocabulary.service.ts
│   │   │   │   ├── vocabulary.routes.ts
│   │   │   │   └── spaced-repetition.ts
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── ai.controller.ts
│   │   │   │   ├── ai.routes.ts
│   │   │   │   ├── ai-tutor.service.ts
│   │   │   │   └── ai-tutor.ws.ts
│   │   │   │
│   │   │   ├── subscription/
│   │   │   │   ├── subscription.controller.ts
│   │   │   │   ├── subscription.service.ts
│   │   │   │   ├── subscription.routes.ts
│   │   │   │   └── plans.config.ts
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── payment.controller.ts
│   │   │   │   ├── stripe.service.ts
│   │   │   │   ├── esewa.service.ts
│   │   │   │   ├── payment.routes.ts
│   │   │   │   └── webhook.handler.ts
│   │   │   │
│   │   │   ├── notifications/
│   │   │   │   ├── notifications.service.ts
│   │   │   │   └── email.templates/
│   │   │   │       ├── welcome.hbs
│   │   │   │       ├── result-ready.hbs
│   │   │   │       └── streak-reminder.hbs
│   │   │   │
│   │   │   ├── leaderboard/
│   │   │   │   ├── leaderboard.service.ts
│   │   │   │   └── leaderboard.routes.ts
│   │   │   │
│   │   │   ├── community/
│   │   │   │   ├── community.controller.ts
│   │   │   │   ├── community.service.ts
│   │   │   │   └── community.routes.ts
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── admin.controller.ts
│   │   │       ├── admin.service.ts
│   │   │       └── admin.routes.ts
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   ├── rateLimit.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   ├── subscription.guard.ts
│   │   │   └── logger.middleware.ts
│   │   │
│   │   ├── services/
│   │   │   ├── ai/                                  # AI Integration Services
│   │   │   │   ├── openai.service.ts
│   │   │   │   ├── whisper.service.ts
│   │   │   │   ├── writing-evaluator.ts
│   │   │   │   ├── speaking-evaluator.ts
│   │   │   │   ├── pronunciation.service.ts
│   │   │   │   ├── grammar.service.ts
│   │   │   │   ├── feedback-generator.ts
│   │   │   │   ├── band-descriptor.ts
│   │   │   │   ├── adaptive-learning.ts
│   │   │   │   └── study-planner.ts
│   │   │   │
│   │   │   ├── aws/
│   │   │   │   ├── s3.service.ts
│   │   │   │   ├── cloudfront.service.ts
│   │   │   │   └── ses.service.ts
│   │   │   │
│   │   │   ├── email/
│   │   │   │   ├── email.service.ts
│   │   │   │   └── mailer.config.ts
│   │   │   │
│   │   │   ├── payment/
│   │   │   │   ├── stripe.client.ts
│   │   │   │   └── esewa.client.ts
│   │   │   │
│   │   │   ├── notification/
│   │   │   │   ├── push.service.ts
│   │   │   │   └── fcm.client.ts
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── events.service.ts
│   │   │   │   └── aggregator.ts
│   │   │   │
│   │   │   └── cache/
│   │   │       ├── redis.service.ts
│   │   │       └── cache.decorator.ts
│   │   │
│   │   ├── jobs/
│   │   │   ├── ai-evaluation.job.ts
│   │   │   ├── email.job.ts
│   │   │   ├── analytics.job.ts
│   │   │   ├── reminder.job.ts
│   │   │   ├── streak.job.ts
│   │   │   └── leaderboard.job.ts
│   │   │
│   │   ├── queues/
│   │   │   ├── ai.queue.ts
│   │   │   ├── email.queue.ts
│   │   │   ├── notification.queue.ts
│   │   │   └── queue.config.ts
│   │   │
│   │   ├── websocket/
│   │   │   ├── speaking.socket.ts
│   │   │   ├── realtime-ai.socket.ts
│   │   │   └── socket.gateway.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── helpers.ts
│   │   │   ├── encryption.ts
│   │   │   └── pagination.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── ielts.constants.ts
│   │   │   └── error.codes.ts
│   │   │
│   │   ├── types/
│   │   │   ├── express.d.ts
│   │   │   └── global.types.ts
│   │   │
│   │   ├── validators/
│   │   │   ├── band.validator.ts
│   │   │   └── essay.validator.ts
│   │   │
│   │   ├── docs/
│   │   │   ├── swagger.ts
│   │   │   └── swagger.yaml
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   └── migrations/
│   │       └── 20240101_init/
│   │           └── migration.sql
│   │
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── writing-evaluator.test.ts
│   │   │   ├── band-calculator.test.ts
│   │   │   └── auth.test.ts
│   │   ├── integration/
│   │   │   ├── auth.integration.test.ts
│   │   │   └── writing.integration.test.ts
│   │   └── e2e/
│   │       ├── mock-test.e2e.test.ts
│   │       └── payment.e2e.test.ts
│   │
│   ├── uploads/
│   │   ├── audio/
│   │   ├── essays/
│   │   └── temp/
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.ts
│   └── Dockerfile
│
├── ai-services/                                     # Dedicated AI Services
│   ├── writing-evaluator/
│   │   ├── prompts/
│   │   │   ├── task1-evaluator.prompt.ts
│   │   │   ├── task2-evaluator.prompt.ts
│   │   │   ├── grammar-checker.prompt.ts
│   │   │   ├── vocabulary-scorer.prompt.ts
│   │   │   └── system.prompt.ts
│   │   ├── descriptors/
│   │   │   ├── band-9.descriptor.ts
│   │   │   ├── band-7.descriptor.ts
│   │   │   ├── band-6.descriptor.ts
│   │   │   ├── band-5.descriptor.ts
│   │   │   ├── task-response.criteria.ts
│   │   │   ├── coherence.criteria.ts
│   │   │   ├── lexical.criteria.ts
│   │   │   └── grammar.criteria.ts
│   │   ├── evaluators/
│   │   │   ├── task-response.evaluator.ts
│   │   │   ├── coherence.evaluator.ts
│   │   │   ├── lexical.evaluator.ts
│   │   │   ├── grammar.evaluator.ts
│   │   │   ├── overall-band.calculator.ts
│   │   │   └── feedback-generator.ts
│   │   ├── utils/
│   │   │   ├── text-preprocessor.ts
│   │   │   ├── band-mapper.ts
│   │   │   ├── result-formatter.ts
│   │   │   └── rewrite-suggester.ts
│   │   └── index.ts
│   │
│   ├── speaking-evaluator/
│   │   ├── pronunciation/
│   │   │   ├── phoneme-analyzer.ts
│   │   │   ├── accent-detector.ts
│   │   │   └── pronunciation.scorer.ts
│   │   ├── fluency/
│   │   │   ├── hesitation-detector.ts
│   │   │   ├── speaking-speed.analyzer.ts
│   │   │   └── fluency.scorer.ts
│   │   ├── vocabulary/
│   │   │   ├── lexical-range.analyzer.ts
│   │   │   └── vocabulary.scorer.ts
│   │   ├── grammar/
│   │   │   ├── spoken-grammar.analyzer.ts
│   │   │   └── grammar.scorer.ts
│   │   ├── prompts/
│   │   │   ├── speaking.evaluator.prompt.ts
│   │   │   ├── part1.prompt.ts
│   │   │   ├── part2.prompt.ts
│   │   │   └── part3.prompt.ts
│   │   └── index.ts
│   │
│   ├── adaptive-learning/
│   │   ├── weakness-detector.ts
│   │   ├── difficulty-engine.ts
│   │   ├── recommendation.engine.ts
│   │   ├── study-planner.ts
│   │   ├── question-selector.ts
│   │   └── index.ts
│   │
│   ├── band-score-engine/
│   │   ├── reading.scorer.ts
│   │   ├── listening.scorer.ts
│   │   ├── overall.calculator.ts
│   │   ├── prediction.model.ts
│   │   └── index.ts
│   │
│   ├── prompt-engineering/
│   │   ├── base-prompts/
│   │   │   ├── writing.base.ts
│   │   │   ├── speaking.base.ts
│   │   │   └── tutor.base.ts
│   │   ├── chain-of-thought/
│   │   │   ├── cot.writing.ts
│   │   │   └── cot.speaking.ts
│   │   ├── few-shot/
│   │   │   ├── writing-examples.ts
│   │   │   └── speaking-examples.ts
│   │   ├── prompt-manager.ts
│   │   └── prompt-tester.ts
│   │
│   └── datasets/
│       ├── reading-passages/
│       ├── listening-scripts/
│       ├── writing-samples/
│       ├── band-9-essays/
│       └── vocabulary-lists/
│
├── packages/                                        # Shared Packages (Monorepo)
│   ├── ui/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   │   ├── index.tsx
│   │   │   │   │   └── Button.stories.tsx
│   │   │   │   ├── Input/
│   │   │   │   ├── Modal/
│   │   │   │   └── Toast/
│   │   │   ├── styles/
│   │   │   │   ├── tokens.css
│   │   │   │   └── reset.css
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── types/
│   │   ├── src/
│   │   │   ├── user.types.ts
│   │   │   ├── test.types.ts
│   │   │   ├── ai.types.ts
│   │   │   ├── payment.types.ts
│   │   │   ├── analytics.types.ts
│   │   │   └── ielts.types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── api-client/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── endpoints.ts
│   │   │   ├── interceptors.ts
│   │   │   └── types.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── shared-utils/
│   │   ├── src/
│   │   │   ├── bandScore.ts
│   │   │   ├── dateHelpers.ts
│   │   │   ├── validators.ts
│   │   │   └── formatters.ts
│   │   └── package.json
│   │
│   ├── eslint-config/
│   │   ├── index.js
│   │   ├── next.js
│   │   ├── react.js
│   │   └── package.json
│   │
│   └── tsconfig/
│       ├── base.json
│       ├── nextjs.json
│       ├── node.json
│       └── package.json
│
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.web
│   │   ├── Dockerfile.backend
│   │   ├── Dockerfile.admin
│   │   └── .dockerignore
│   │
│   ├── nginx/
│   │   ├── nginx.conf
│   │   ├── ssl/
│   │   └── locations/
│   │       ├── web.conf
│   │       ├── api.conf
│   │       └── ws.conf
│   │
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── modules/
│   │       ├── rds/
│   │       ├── ec2/
│   │       ├── s3/
│   │       └── cloudfront/
│   │
│   ├── kubernetes/
│   │   ├── deployments/
│   │   │   ├── web.yaml
│   │   │   ├── backend.yaml
│   │   │   └── admin.yaml
│   │   ├── services/
│   │   │   ├── web-svc.yaml
│   │   │   └── backend-svc.yaml
│   │   ├── ingress/
│   │   │   └── ingress.yaml
│   │   ├── configmaps/
│   │   └── secrets/
│   │
│   └── monitoring/
│       ├── prometheus/
│       │   └── prometheus.yml
│       ├── grafana/
│       │   ├── dashboards/
│       │   └── provisioning/
│       └── alerts/
│           ├── ai-costs.rules.yml
│           └── api.rules.yml
│
├── docs/
│   ├── api/
│   │   ├── openapi.yaml
│   │   └── postman-collection.json
│   ├── architecture/
│   │   ├── system-design.md
│   │   ├── ai-pipeline.md
│   │   └── data-flow.md
│   ├── database/
│   │   ├── schema.md
│   │   ├── erd.md
│   │   └── indexes.md
│   ├── prompts/
│   │   ├── writing-eval.md
│   │   ├── speaking-eval.md
│   │   └── tutor.md
│   ├── workflows/
│   │   ├── writing-pipeline.md
│   │   └── speaking-pipeline.md
│   └── deployment/
│       ├── setup.md
│       ├── ci-cd.md
│       └── scaling.md
│
├── scripts/
│   ├── setup.sh
│   ├── seed.ts
│   ├── deploy.sh
│   ├── generate-types.sh
│   └── backup-db.sh
│
├── .github/
│   ├── workflows/
│   │   ├── web.yml
│   │   ├── backend.yml
│   │   ├── mobile.yml
│   │   ├── admin.yml
│   │   ├── deploy.yml
│   │   └── ai-tests.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── CONTRIBUTING.md
│
├── .env
├── .env.example
├── turbo.json
├── pnpm-workspace.yaml
├── package.json
├── docker-compose.yml
├── docker-compose.dev.yml
└── README.md
```

---

## Stats

| Category | Count |
|---|---|
| Total folders | 180+ |
| Total files | 380+ |
| Apps | 4 (web, mobile, admin, backend) |
| Shared packages | 6 |
| AI service modules | 5 |

---

## Key Architecture Notes

### Monorepo Layout
- **`apps/web`** — Student-facing Next.js app (App Router)
- **`apps/mobile`** — Flutter app (feature-first, clean architecture)
- **`apps/admin`** — Internal admin dashboard (Next.js)
- **`backend`** — Node.js REST API + WebSocket server
- **`ai-services`** — Isolated AI evaluation and prompt logic
- **`packages`** — Shared types, UI components, utilities

### AI Pipeline Flow
```
Writing Submission
  → writing.queue.ts (Bull/BullMQ)
  → ai-evaluation.job.ts
  → writing-evaluator/evaluators/
  → band-descriptor mapping
  → feedback-generator.ts
  → Store result in DB → Notify user
```

```
Speaking Audio Upload
  → S3 (via aws/s3.service.ts)
  → whisper.service.ts (Speech-to-Text)
  → speaking-evaluator/ (pronunciation + fluency + grammar + vocab)
  → overall band score
  → feedback-generator.ts
  → WebSocket push to client
```

### Scalability Notes
- All AI jobs run through **BullMQ queues** — horizontally scalable workers
- **Redis** used for caching, sessions, and rate limiting
- **Turborepo** enables incremental builds — only changed packages rebuild
- `packages/types` is the single source of truth for all TypeScript types across apps
- `packages/api-client` is shared between web and admin to avoid duplicated API calls
- Feature-first folder structure in Flutter makes adding new screens non-breaking
