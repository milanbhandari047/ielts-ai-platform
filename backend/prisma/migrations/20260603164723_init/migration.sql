/*
  Warnings:

  - You are about to drop the column `completion` on the `ai_token_usage` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `ai_token_usage` table. All the data in the column will be lost.
  - You are about to drop the column `promptTokens` on the `ai_token_usage` table. All the data in the column will be lost.
  - You are about to drop the column `totalTokens` on the `ai_token_usage` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `ai_tutor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ai_tutor_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `listening` on the `band_history` table. All the data in the column will be lost.
  - You are about to drop the column `reading` on the `band_history` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `band_history` table. All the data in the column will be lost.
  - You are about to drop the column `speaking` on the `band_history` table. All the data in the column will be lost.
  - You are about to drop the column `writing` on the `band_history` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `community_comments` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `community_comments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `community_comments` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `community_posts` table. All the data in the column will be lost.
  - You are about to drop the column `isPinned` on the `community_posts` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `community_posts` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `community_posts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `community_posts` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `community_posts` table. All the data in the column will be lost.
  - You are about to drop the column `allTimeRank` on the `leaderboard_entries` table. All the data in the column will be lost.
  - You are about to drop the column `allTimeScore` on the `leaderboard_entries` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyRank` on the `leaderboard_entries` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyScore` on the `leaderboard_entries` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `leaderboard_entries` table. All the data in the column will be lost.
  - You are about to drop the column `weeklyRank` on the `leaderboard_entries` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `listening_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `listening_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `timeTaken` on the `listening_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `listening_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `listening_questions` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `listening_questions` table. All the data in the column will be lost.
  - You are about to drop the column `marks` on the `listening_questions` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `listening_questions` table. All the data in the column will be lost.
  - You are about to drop the column `questionNumber` on the `listening_questions` table. All the data in the column will be lost.
  - You are about to drop the column `questionType` on the `listening_questions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `listening_questions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `listening_sections` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `listening_sections` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `listening_sections` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `listening_sections` table. All the data in the column will be lost.
  - You are about to drop the column `transcript` on the `listening_sections` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `listening_sections` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `timeLimit` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `totalMarks` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `listening_tests` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `listeningAttemptId` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `readingAttemptId` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `speakingSubmissionId` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `startedAt` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `timeTaken` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `writingSubmissionId` on the `mock_test_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `listeningTestId` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `readingTestId` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `speakingTestId` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `totalTime` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `writingTestId` on the `mock_tests` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `password_resets` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `reading_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reading_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `timeTaken` on the `reading_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reading_attempts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reading_passages` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `reading_passages` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `reading_passages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reading_passages` table. All the data in the column will be lost.
  - You are about to drop the column `wordCount` on the `reading_passages` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reading_questions` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `reading_questions` table. All the data in the column will be lost.
  - You are about to drop the column `marks` on the `reading_questions` table. All the data in the column will be lost.
  - You are about to drop the column `questionNumber` on the `reading_questions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reading_questions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reading_tests` table. All the data in the column will be lost.
  - You are about to drop the column `createdBy` on the `reading_tests` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `reading_tests` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `reading_tests` table. All the data in the column will be lost.
  - You are about to drop the column `timeLimit` on the `reading_tests` table. All the data in the column will be lost.
  - You are about to drop the column `totalMarks` on the `reading_tests` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `reading_tests` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `bulletPoints` on the `speaking_cue_cards` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `speaking_cue_cards` table. All the data in the column will be lost.
  - You are about to drop the column `followUpQs` on the `speaking_cue_cards` table. All the data in the column will be lost.
  - You are about to drop the column `prepTime` on the `speaking_cue_cards` table. All the data in the column will be lost.
  - You are about to drop the column `speakTime` on the `speaking_cue_cards` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `speaking_cue_cards` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `speaking_cue_cards` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatedAt` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `feedback` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `fluencyBand` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `grammarBand` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `grammarErrors` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `hesitationCount` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `lexicalBand` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `overallBand` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `part` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `pronunciationBand` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `pronunciationErrors` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `speakingSpeed` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `vocabularySuggs` on the `speaking_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `study_goals` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `study_goals` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `study_goals` table. All the data in the column will be lost.
  - You are about to drop the column `cancelAtPeriodEnd` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodEnd` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodStart` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `currentStreak` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `lastStudiedAt` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `longestStreak` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `overallBand` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `totalListeningTests` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `totalMockTests` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `totalReadingTests` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `totalSpeakingTests` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `totalStudyMinutes` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `totalWritingTests` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_analytics` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `examDate` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `institution` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `studyLevel` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerifiedAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerifyExpiry` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerifyToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `oauthId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `oauthProvider` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `antonyms` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `band` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `definition` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `examples` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `partOfSpeech` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `pronunciation` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `synonyms` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `topic` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `vocabulary` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `vocabulary_progress` table. All the data in the column will be lost.
  - You are about to drop the column `easeFactor` on the `vocabulary_progress` table. All the data in the column will be lost.
  - You are about to drop the column `interval` on the `vocabulary_progress` table. All the data in the column will be lost.
  - You are about to drop the column `lastReviewedAt` on the `vocabulary_progress` table. All the data in the column will be lost.
  - You are about to drop the column `nextReviewAt` on the `vocabulary_progress` table. All the data in the column will be lost.
  - You are about to drop the column `timesCorrect` on the `vocabulary_progress` table. All the data in the column will be lost.
  - You are about to drop the column `timesReviewed` on the `vocabulary_progress` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `vocabulary_progress` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `writing_prompts` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `writing_prompts` table. All the data in the column will be lost.
  - You are about to drop the column `minWords` on the `writing_prompts` table. All the data in the column will be lost.
  - You are about to drop the column `sampleBand9` on the `writing_prompts` table. All the data in the column will be lost.
  - You are about to drop the column `testId` on the `writing_prompts` table. All the data in the column will be lost.
  - You are about to drop the column `timeLimit` on the `writing_prompts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `writing_prompts` table. All the data in the column will be lost.
  - You are about to drop the column `coherenceBand` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `evaluatedAt` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `grammarBand` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `grammarErrors` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `lexicalBand` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `rewriteSuggestion` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `structureAnalysis` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `task` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `timeTaken` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the column `vocabularySuggs` on the `writing_submissions` table. All the data in the column will be lost.
  - You are about to drop the `ai_tutor_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `listening_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `oauth_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reading_answers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `saved_words` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `speaking_tests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `writing_tests` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `notifications` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `cueCardId` on table `speaking_submissions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `meaning` to the `vocabulary` table without a default value. This is not possible if the table is not empty.
  - Made the column `promptId` on table `writing_submissions` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ai_tutor_messages" DROP CONSTRAINT "ai_tutor_messages_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "community_comments" DROP CONSTRAINT "community_comments_postId_fkey";

-- DropForeignKey
ALTER TABLE "community_comments" DROP CONSTRAINT "community_comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "listening_answers" DROP CONSTRAINT "listening_answers_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "listening_answers" DROP CONSTRAINT "listening_answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "oauth_accounts" DROP CONSTRAINT "oauth_accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "reading_answers" DROP CONSTRAINT "reading_answers_attemptId_fkey";

-- DropForeignKey
ALTER TABLE "reading_answers" DROP CONSTRAINT "reading_answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "saved_words" DROP CONSTRAINT "saved_words_userId_fkey";

-- DropForeignKey
ALTER TABLE "saved_words" DROP CONSTRAINT "saved_words_vocabularyId_fkey";

-- DropForeignKey
ALTER TABLE "speaking_cue_cards" DROP CONSTRAINT "speaking_cue_cards_testId_fkey";

-- DropForeignKey
ALTER TABLE "speaking_submissions" DROP CONSTRAINT "speaking_submissions_cueCardId_fkey";

-- DropForeignKey
ALTER TABLE "vocabulary_progress" DROP CONSTRAINT "vocabulary_progress_vocabularyId_fkey";

-- DropForeignKey
ALTER TABLE "writing_prompts" DROP CONSTRAINT "writing_prompts_testId_fkey";

-- DropForeignKey
ALTER TABLE "writing_submissions" DROP CONSTRAINT "writing_submissions_promptId_fkey";

-- AlterTable
ALTER TABLE "ai_token_usage" DROP COLUMN "completion",
DROP COLUMN "cost",
DROP COLUMN "promptTokens",
DROP COLUMN "totalTokens",
ADD COLUMN     "tokens" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ai_tutor_sessions" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "band_history" DROP COLUMN "listening",
DROP COLUMN "reading",
DROP COLUMN "sourceId",
DROP COLUMN "speaking",
DROP COLUMN "writing";

-- AlterTable
ALTER TABLE "blog_posts" DROP COLUMN "authorId",
DROP COLUMN "coverImage",
DROP COLUMN "createdAt",
DROP COLUMN "excerpt",
DROP COLUMN "publishedAt",
DROP COLUMN "status",
DROP COLUMN "tags",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "community_comments" DROP COLUMN "createdAt",
DROP COLUMN "likes",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "community_posts" DROP COLUMN "createdAt",
DROP COLUMN "isPinned",
DROP COLUMN "likes",
DROP COLUMN "tags",
DROP COLUMN "updatedAt",
DROP COLUMN "views";

-- AlterTable
ALTER TABLE "leaderboard_entries" DROP COLUMN "allTimeRank",
DROP COLUMN "allTimeScore",
DROP COLUMN "monthlyRank",
DROP COLUMN "monthlyScore",
DROP COLUMN "updatedAt",
DROP COLUMN "weeklyRank";

-- AlterTable
ALTER TABLE "listening_attempts" DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "timeTaken",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "listening_questions" DROP COLUMN "createdAt",
DROP COLUMN "explanation",
DROP COLUMN "marks",
DROP COLUMN "options",
DROP COLUMN "questionNumber",
DROP COLUMN "questionType",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "listening_sections" DROP COLUMN "createdAt",
DROP COLUMN "duration",
DROP COLUMN "order",
DROP COLUMN "title",
DROP COLUMN "transcript",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "listening_tests" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "difficulty",
DROP COLUMN "status",
DROP COLUMN "tags",
DROP COLUMN "timeLimit",
DROP COLUMN "totalMarks",
DROP COLUMN "type",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "mock_test_sessions" DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "listeningAttemptId",
DROP COLUMN "readingAttemptId",
DROP COLUMN "speakingSubmissionId",
DROP COLUMN "startedAt",
DROP COLUMN "timeTaken",
DROP COLUMN "updatedAt",
DROP COLUMN "writingSubmissionId";

-- AlterTable
ALTER TABLE "mock_tests" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "difficulty",
DROP COLUMN "listeningTestId",
DROP COLUMN "readingTestId",
DROP COLUMN "speakingTestId",
DROP COLUMN "status",
DROP COLUMN "totalTime",
DROP COLUMN "type",
DROP COLUMN "updatedAt",
DROP COLUMN "writingTestId";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "createdAt",
DROP COLUMN "metadata",
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "password_resets" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "reading_attempts" DROP COLUMN "completedAt",
DROP COLUMN "createdAt",
DROP COLUMN "timeTaken",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "reading_passages" DROP COLUMN "createdAt",
DROP COLUMN "order",
DROP COLUMN "source",
DROP COLUMN "updatedAt",
DROP COLUMN "wordCount";

-- AlterTable
ALTER TABLE "reading_questions" DROP COLUMN "createdAt",
DROP COLUMN "explanation",
DROP COLUMN "marks",
DROP COLUMN "questionNumber",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "reading_tests" DROP COLUMN "createdAt",
DROP COLUMN "createdBy",
DROP COLUMN "difficulty",
DROP COLUMN "tags",
DROP COLUMN "timeLimit",
DROP COLUMN "totalMarks",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "speaking_cue_cards" DROP COLUMN "bulletPoints",
DROP COLUMN "createdAt",
DROP COLUMN "followUpQs",
DROP COLUMN "prepTime",
DROP COLUMN "speakTime",
DROP COLUMN "testId",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "speaking_submissions" DROP COLUMN "createdAt",
DROP COLUMN "duration",
DROP COLUMN "evaluatedAt",
DROP COLUMN "feedback",
DROP COLUMN "fluencyBand",
DROP COLUMN "grammarBand",
DROP COLUMN "grammarErrors",
DROP COLUMN "hesitationCount",
DROP COLUMN "lexicalBand",
DROP COLUMN "overallBand",
DROP COLUMN "part",
DROP COLUMN "pronunciationBand",
DROP COLUMN "pronunciationErrors",
DROP COLUMN "speakingSpeed",
DROP COLUMN "updatedAt",
DROP COLUMN "vocabularySuggs",
ADD COLUMN     "fluency" DOUBLE PRECISION,
ADD COLUMN     "grammar" DOUBLE PRECISION,
ADD COLUMN     "pronunciation" DOUBLE PRECISION,
ADD COLUMN     "vocabulary" DOUBLE PRECISION,
ALTER COLUMN "cueCardId" SET NOT NULL;

-- AlterTable
ALTER TABLE "study_goals" DROP COLUMN "createdAt",
DROP COLUMN "isActive",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "cancelAtPeriodEnd",
DROP COLUMN "createdAt",
DROP COLUMN "currentPeriodEnd",
DROP COLUMN "currentPeriodStart",
DROP COLUMN "updatedAt",
ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "startAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user_analytics" DROP COLUMN "currentStreak",
DROP COLUMN "lastStudiedAt",
DROP COLUMN "longestStreak",
DROP COLUMN "overallBand",
DROP COLUMN "totalListeningTests",
DROP COLUMN "totalMockTests",
DROP COLUMN "totalReadingTests",
DROP COLUMN "totalSpeakingTests",
DROP COLUMN "totalStudyMinutes",
DROP COLUMN "totalWritingTests",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "user_profiles" DROP COLUMN "createdAt",
DROP COLUMN "examDate",
DROP COLUMN "institution",
DROP COLUMN "studyLevel",
DROP COLUMN "timezone",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerifiedAt",
DROP COLUMN "emailVerifyExpiry",
DROP COLUMN "emailVerifyToken",
DROP COLUMN "isActive",
DROP COLUMN "oauthId",
DROP COLUMN "oauthProvider";

-- AlterTable
ALTER TABLE "vocabulary" DROP COLUMN "antonyms",
DROP COLUMN "band",
DROP COLUMN "createdAt",
DROP COLUMN "definition",
DROP COLUMN "difficulty",
DROP COLUMN "examples",
DROP COLUMN "partOfSpeech",
DROP COLUMN "pronunciation",
DROP COLUMN "synonyms",
DROP COLUMN "topic",
DROP COLUMN "updatedAt",
ADD COLUMN     "meaning" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vocabulary_progress" DROP COLUMN "createdAt",
DROP COLUMN "easeFactor",
DROP COLUMN "interval",
DROP COLUMN "lastReviewedAt",
DROP COLUMN "nextReviewAt",
DROP COLUMN "timesCorrect",
DROP COLUMN "timesReviewed",
DROP COLUMN "updatedAt",
ADD COLUMN     "correctCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "writing_prompts" DROP COLUMN "createdAt",
DROP COLUMN "imageUrl",
DROP COLUMN "minWords",
DROP COLUMN "sampleBand9",
DROP COLUMN "testId",
DROP COLUMN "timeLimit",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "writing_submissions" DROP COLUMN "coherenceBand",
DROP COLUMN "createdAt",
DROP COLUMN "evaluatedAt",
DROP COLUMN "grammarBand",
DROP COLUMN "grammarErrors",
DROP COLUMN "lexicalBand",
DROP COLUMN "rewriteSuggestion",
DROP COLUMN "structureAnalysis",
DROP COLUMN "task",
DROP COLUMN "timeTaken",
DROP COLUMN "updatedAt",
DROP COLUMN "vocabularySuggs",
ADD COLUMN     "coherence" DOUBLE PRECISION,
ADD COLUMN     "grammar" DOUBLE PRECISION,
ADD COLUMN     "lexical" DOUBLE PRECISION,
ALTER COLUMN "promptId" SET NOT NULL,
ALTER COLUMN "wordCount" DROP DEFAULT;

-- DropTable
DROP TABLE "ai_tutor_messages";

-- DropTable
DROP TABLE "listening_answers";

-- DropTable
DROP TABLE "oauth_accounts";

-- DropTable
DROP TABLE "reading_answers";

-- DropTable
DROP TABLE "saved_words";

-- DropTable
DROP TABLE "speaking_tests";

-- DropTable
DROP TABLE "writing_tests";

-- CreateTable
CREATE TABLE "SavedWord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SavedWord_userId_vocabularyId_key" ON "SavedWord"("userId", "vocabularyId");

-- AddForeignKey
ALTER TABLE "SavedWord" ADD CONSTRAINT "SavedWord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedWord" ADD CONSTRAINT "SavedWord_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "writing_submissions" ADD CONSTRAINT "writing_submissions_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "writing_prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaking_submissions" ADD CONSTRAINT "speaking_submissions_cueCardId_fkey" FOREIGN KEY ("cueCardId") REFERENCES "speaking_cue_cards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vocabulary_progress" ADD CONSTRAINT "vocabulary_progress_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
