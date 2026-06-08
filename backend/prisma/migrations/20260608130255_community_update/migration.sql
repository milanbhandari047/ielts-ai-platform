/*
  Warnings:

  - You are about to drop the `SavedWord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `ai_tutor_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `community_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `community_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `mock_test_sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `mock_tests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SavedWord" DROP CONSTRAINT "SavedWord_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedWord" DROP CONSTRAINT "SavedWord_vocabularyId_fkey";

-- AlterTable
ALTER TABLE "ai_token_usage" ADD COLUMN     "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "sessionId" TEXT;

-- AlterTable
ALTER TABLE "ai_tutor_sessions" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "community_comments" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "community_posts" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "mock_test_sessions" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "listeningAnswers" JSONB,
ADD COLUMN     "listeningDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "listeningStartedAt" TIMESTAMP(3),
ADD COLUMN     "readingAnswers" JSONB,
ADD COLUMN     "readingDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readingStartedAt" TIMESTAMP(3),
ADD COLUMN     "speakingAudioUrl" TEXT,
ADD COLUMN     "speakingDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "speakingFeedback" JSONB,
ADD COLUMN     "speakingStartedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "writingDone" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "writingEssay" TEXT,
ADD COLUMN     "writingFeedback" JSONB,
ADD COLUMN     "writingStartedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "mock_tests" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "listeningMinutes" INTEGER NOT NULL DEFAULT 40,
ADD COLUMN     "listeningTestId" TEXT,
ADD COLUMN     "readingMinutes" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "readingTestId" TEXT,
ADD COLUMN     "speakingCueCardId" TEXT,
ADD COLUMN     "speakingMinutes" INTEGER NOT NULL DEFAULT 15,
ADD COLUMN     "status" "TestStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "type" "TestType" NOT NULL DEFAULT 'ACADEMIC',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "writingMinutes" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN     "writingPromptId" TEXT;

-- AlterTable
ALTER TABLE "vocabulary_progress" ADD COLUMN     "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
ADD COLUMN     "interval" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "nextReview" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "repetitions" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "SavedWord";

-- CreateTable
CREATE TABLE "saved_words" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vocabularyId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_likes" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_bookmarks" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "post_reports" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_reports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_words_userId_vocabularyId_key" ON "saved_words"("userId", "vocabularyId");

-- CreateIndex
CREATE UNIQUE INDEX "post_likes_postId_userId_key" ON "post_likes"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_bookmarks_postId_userId_key" ON "post_bookmarks"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "post_reports_postId_userId_key" ON "post_reports"("postId", "userId");

-- AddForeignKey
ALTER TABLE "saved_words" ADD CONSTRAINT "saved_words_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_words" ADD CONSTRAINT "saved_words_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "vocabulary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_tests" ADD CONSTRAINT "mock_tests_readingTestId_fkey" FOREIGN KEY ("readingTestId") REFERENCES "reading_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_tests" ADD CONSTRAINT "mock_tests_listeningTestId_fkey" FOREIGN KEY ("listeningTestId") REFERENCES "listening_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_tests" ADD CONSTRAINT "mock_tests_writingPromptId_fkey" FOREIGN KEY ("writingPromptId") REFERENCES "writing_prompts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mock_tests" ADD CONSTRAINT "mock_tests_speakingCueCardId_fkey" FOREIGN KEY ("speakingCueCardId") REFERENCES "speaking_cue_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_bookmarks" ADD CONSTRAINT "post_bookmarks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_reports" ADD CONSTRAINT "post_reports_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
