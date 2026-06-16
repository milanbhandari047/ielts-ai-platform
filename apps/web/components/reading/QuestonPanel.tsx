"use client";

import { useReadingStore } from "@/store/reading.store";
import type { ReadingPassage, ReadingQuestion, QuestionType } from "@/types";
import { InstructionCard } from "./shared";
import { QuestionRenderer } from "./questions";

interface QuestionPanelProps {
  passages: ReadingPassage[];
}

interface QuestionBlock {
  passageTitle: string;
  questionType: QuestionType;
  questions: { question: ReadingQuestion; globalNum: number }[];
  options: string[];
}

function buildBlocks(passages: ReadingPassage[]): QuestionBlock[] {
  const blocks: QuestionBlock[] = [];
  let globalNum = 0;

  for (const passage of passages) {
    let current: QuestionBlock | null = null;

    for (const question of passage.questions) {
      globalNum++;
      const type = question.questionType;
      const opts = question.options ?? [];

      const sameBlock =
        current &&
        current.questionType === type &&
        current.passageTitle === passage.title;

      if (sameBlock && current) {
        current.questions.push({ question, globalNum });
        if (current.options.length === 0 && opts.length > 0) {
          current.options = opts;
        }
      } else {
        current = {
          passageTitle: passage.title,
          questionType: type,
          questions: [{ question, globalNum }],
          options: opts,
        };
        blocks.push(current);
      }
    }
  }

  return blocks;
}

function resolveOptions(type: QuestionType, raw: string[]): string[] {
  if (raw.length > 0) return raw;
  if (type === "MATCH_INFORMATION") return ["A", "B", "C", "D", "E", "F", "G"];
  if (type === "CLASSIFICATION") return ["A", "B", "C"];
  return [];
}

export function QuestionPanel({ passages }: QuestionPanelProps) {
  const { answers, setAnswer } = useReadingStore();
  const blocks = buildBlocks(passages);

  return (
    <div className="p-6 space-y-10">
      {blocks.map((block, bi) => {
        const first = block.questions[0].globalNum;
        const last = block.questions[block.questions.length - 1].globalNum;
        const rangeLabel =
          first === last ? `Question ${first}` : `Questions ${first}–${last}`;

        const options = resolveOptions(block.questionType, block.options);

        return (
          <div key={bi}>
            <h2 className="mb-3 text-base font-bold text-gray-900">
              {rangeLabel}
            </h2>
            <InstructionCard type={block.questionType} />

            <div className="space-y-4">
              {block.questions.map(({ question, globalNum }, index) => (
                <QuestionRenderer
                  key={question.id}
                  questionType={block.questionType}
                  options={options}
                  question={question}
                  globalNum={globalNum}
                  answer={answers[question.id] ?? ""}
                  onAnswer={setAnswer}
                  showOptions={index === 0}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
