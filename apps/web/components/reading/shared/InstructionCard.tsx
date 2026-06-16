import type { QuestionType } from "@/types";

const INSTRUCTIONS: Record<QuestionType, string> = {
  // Multiple Choice
  MULTIPLE_CHOICE:
    "Choose the correct letter, A, B, C or D.\n\nWrite the correct letter in boxes on your answer sheet.",
  MULTIPLE_CHOICE_MULTI:
    "Choose TWO letters, A–E.\n\nWrite the correct letters in boxes on your answer sheet.",

  // True/False
  TRUE_FALSE_NOT_GIVEN:
    "Do the following statements agree with the information given in Reading Passage?\n\nIn boxes on your answer sheet, write\n\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this",
  YES_NO_NOT_GIVEN:
    "Do the following statements agree with the views of the writer?\n\nIn boxes on your answer sheet, write\n\nYES if the statement agrees with the views of the writer\nNO if the statement contradicts the views of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this",

  // Matching
  MATCH_HEADINGS:
    "Reading Passage has several paragraphs, A–G.\n\nChoose the correct heading for each paragraph from the list of headings below.\n\nWrite the correct number, i–x, in boxes on your answer sheet.",
  MATCH_INFORMATION:
    "Reading Passage has several paragraphs.\n\nWhich paragraph contains the following information?\n\nWrite the correct letter, A–G, in boxes on your answer sheet.\n\nNB You may use any letter more than once.",
  MATCH_FEATURES:
    "Look at the following statements and the list below.\n\nMatch each statement with the correct answer.\n\nWrite the correct letter, A–E, in boxes on your answer sheet.\n\nNB You may use any letter more than once.",
  MATCH_SENTENCE_ENDINGS:
    "Complete each sentence with the correct ending, A–F, below.\n\nWrite the correct letter, A–F, in boxes on your answer sheet.",

  // Completion
  FILL_IN_THE_BLANK:
    "Complete the notes below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  SENTENCE_COMPLETION:
    "Complete the sentences below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  SUMMARY_COMPLETION:
    "Complete the summary below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  SUMMARY_COMPLETION_BANK:
    "Complete the summary below.\n\nChoose ONE WORD from the box for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  NOTE_COMPLETION:
    "Complete the notes below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  TABLE_COMPLETION:
    "Complete the table below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  FLOW_CHART_COMPLETION:
    "Complete the flow-chart below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  FORM_COMPLETION:
    "Complete the form below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  TIMELINE_COMPLETION:
    "Complete the timeline below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",

  // Labelling
  DIAGRAM_LABELLING:
    "Label the diagram below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  MAP_LABELLING:
    "Label the map below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",
  PLAN_LABELLING:
    "Label the plan below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",

  // Short Answer
  SHORT_ANSWER:
    "Answer the questions below.\n\nChoose NO MORE THAN THREE WORDS AND/OR A NUMBER from the passage for each answer.\n\nWrite your answers in boxes on your answer sheet.",

  // Selection
  LIST_SELECTION:
    "Choose TWO letters, A–E.\n\nWrite the correct letters in boxes on your answer sheet.",

  // Classification
  CLASSIFICATION:
    "Classify the following according to the information in the reading passage.\n\nWrite the correct letter, A, B or C, in boxes on your answer sheet.",

  // Category Matching
  CATEGORY_MATCHING:
    "Match each item with the correct category.\n\nWrite the correct letter in boxes on your answer sheet.",
};

const BOLD_PREFIXES = ["TRUE", "FALSE", "NOT GIVEN", "YES", "NO "];

interface InstructionCardProps {
  type: QuestionType;
}

export function InstructionCard({ type }: InstructionCardProps) {
  const text = INSTRUCTIONS[type] ?? "";

  return (
    <div className="mb-5 border border-gray-300 bg-white p-4 text-sm text-gray-800 leading-relaxed">
      {text.split("\n").map((line, i) => {
        if (line === "") return <div key={i} className="h-2" />;

        const isBold = BOLD_PREFIXES.some((prefix) => line.startsWith(prefix));
        if (isBold) {
          const spaceIdx = line.indexOf(" ");
          const keyword = line.slice(0, spaceIdx);
          const rest = line.slice(spaceIdx + 1);
          return (
            <p key={i} className="mt-1">
              <strong>{keyword}</strong> {rest}
            </p>
          );
        }

        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}
