"use client";

import type { QuestionType } from "@/types";
import type { QuestionProps } from "./types";
import { MultipleChoiceQuestion } from "./MultipleChoiceQuestion";
import { MultipleChoiceMultiQuestion } from "./MultipleChoiceMultiQuestion";
import { TrueFalseQuestion } from "./TrueFalseQuestion";
import { MatchingQuestion } from "./MatchingQuestion";
import { CompletionQuestion } from "./CompletionQuestion";
import { DiagramLabelQuestion } from "./DiagramLabelQuestion";
import { MapLabelQuestion } from "./MapLabelQuestion";
import { PlanLabelQuestion } from "./PlanLabelQuestion";
import { ShortAnswerQuestion } from "./ShortAnswerQuestion";

interface QuestionRendererProps extends QuestionProps {
  questionType: QuestionType;
  options: string[];
  showOptions?: boolean;
}

export function QuestionRenderer({
  questionType,
  options,
  showOptions,
  ...props
}: QuestionRendererProps) {
  switch (questionType) {
    // ── Multiple Choice ───────────────────────────────────────────
    case "MULTIPLE_CHOICE":
      return <MultipleChoiceQuestion {...props} options={options} />;

    case "MULTIPLE_CHOICE_MULTI":
    case "LIST_SELECTION":
      return <MultipleChoiceMultiQuestion {...props} options={options} />;

    // ── True / False / Yes / No ───────────────────────────────────
    case "TRUE_FALSE_NOT_GIVEN":
    case "YES_NO_NOT_GIVEN":
      return <TrueFalseQuestion {...props} questionType={questionType} />;

    // ── Matching ──────────────────────────────────────────────────
    case "MATCH_HEADINGS":
    case "MATCH_INFORMATION":
    case "MATCH_FEATURES":
    case "MATCH_SENTENCE_ENDINGS":
    case "CLASSIFICATION":
    case "CATEGORY_MATCHING":
      return (
        <MatchingQuestion
          {...props}
          options={options}
          questionType={questionType}
          showOptions={showOptions}
        />
      );

    // ── Labelling ─────────────────────────────────────────────────
    case "DIAGRAM_LABELLING":
      return <DiagramLabelQuestion {...props} />;

    case "MAP_LABELLING":
      return <MapLabelQuestion {...props} />;

    case "PLAN_LABELLING":
      return <PlanLabelQuestion {...props} />;

    // ── Short Answer ──────────────────────────────────────────────
    case "SHORT_ANSWER":
      return <ShortAnswerQuestion {...props} />;

    // ── Completion (all word-from-passage types) ──────────────────
    case "FILL_IN_THE_BLANK":
    case "SENTENCE_COMPLETION":
    case "SUMMARY_COMPLETION":
    case "SUMMARY_COMPLETION_BANK":
    case "NOTE_COMPLETION":
    case "TABLE_COMPLETION":
    case "FLOW_CHART_COMPLETION":
    case "FORM_COMPLETION":
    case "TIMELINE_COMPLETION":
      return <CompletionQuestion {...props} />;

    default:
      return null;
  }
}
