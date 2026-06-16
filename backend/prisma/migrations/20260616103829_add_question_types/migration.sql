-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'MULTIPLE_CHOICE_MULTI';
ALTER TYPE "QuestionType" ADD VALUE 'YES_NO_NOT_GIVEN';
ALTER TYPE "QuestionType" ADD VALUE 'MATCH_FEATURES';
ALTER TYPE "QuestionType" ADD VALUE 'MATCH_SENTENCE_ENDINGS';
ALTER TYPE "QuestionType" ADD VALUE 'SUMMARY_COMPLETION_BANK';
ALTER TYPE "QuestionType" ADD VALUE 'TABLE_COMPLETION';
ALTER TYPE "QuestionType" ADD VALUE 'FLOW_CHART_COMPLETION';
ALTER TYPE "QuestionType" ADD VALUE 'FORM_COMPLETION';
ALTER TYPE "QuestionType" ADD VALUE 'TIMELINE_COMPLETION';
ALTER TYPE "QuestionType" ADD VALUE 'MAP_LABELLING';
ALTER TYPE "QuestionType" ADD VALUE 'PLAN_LABELLING';
ALTER TYPE "QuestionType" ADD VALUE 'LIST_SELECTION';
ALTER TYPE "QuestionType" ADD VALUE 'CLASSIFICATION';
ALTER TYPE "QuestionType" ADD VALUE 'CATEGORY_MATCHING';
