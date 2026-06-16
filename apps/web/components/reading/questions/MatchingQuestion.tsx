// "use client";

// import { NumCircle, RadioDot } from "../shared";
// import type { QuestionProps } from "./types";
// import type { QuestionType } from "@/types";

// interface MatchingQuestionProps extends QuestionProps {
//   options: string[];
//   questionType: QuestionType;
//   // For block-level rendering, pass all questions in the block
//   // so the radio grid table can be built. For single rendering,
//   // only this question is shown.
// }

// const HEADING_LABEL: Partial<Record<QuestionType, string>> = {
//   MATCH_HEADINGS: "List of Headings",
//   MATCH_FEATURES: "List of Options",
//   MATCH_SENTENCE_ENDINGS: "List of Endings",
//   CLASSIFICATION: "Categories",
//   CATEGORY_MATCHING: "Categories",
// };

// export function MatchingQuestion({
//   question,
//   globalNum,
//   answer,
//   onAnswer,
//   options,
//   questionType,
// }: MatchingQuestionProps) {
//   const isShortLabels =
//     options.length > 0 && options.every((o) => o.length <= 4);

//   // ── Radio grid for short labels (A–G, i–x, A–C) ──────────────────────────
//   if (isShortLabels) {
//     return (
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse text-sm">
//           <thead>
//             <tr>
//               <th className="border border-gray-200 bg-gray-50 px-3 py-2 w-full" />
//               {options.map((col) => (
//                 <th
//                   key={col}
//                   className="border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs font-bold text-gray-800 min-w-[2.75rem]"
//                 >
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td className="border border-gray-200 px-3 py-3 text-gray-800 align-top">
//                 <div className="flex items-start gap-2">
//                   <NumCircle n={globalNum} />
//                   <span className="text-sm">{question.questionText}</span>
//                 </div>
//               </td>
//               {options.map((opt) => {
//                 const selected = answer === opt;
//                 return (
//                   <td
//                     key={opt}
//                     className="border border-gray-200 px-2 py-3 text-center align-middle"
//                   >
//                     <label
//                       onClick={() => onAnswer(question.id, opt)}
//                       className="inline-flex cursor-pointer items-center justify-center"
//                     >
//                       <RadioDot selected={selected} />
//                     </label>
//                   </td>
//                 );
//               })}
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     );
//   }

//   // ── Long options → dropdown ───────────────────────────────────────────────
//   const letterLabels = options.map((_, i) => String.fromCharCode(65 + i));
//   const headingLabel = HEADING_LABEL[questionType] ?? "List of Options";

//   return (
//     <div className="space-y-3">
//       {/* Options list shown once per question when rendered individually */}
//       {options.length > 0 && (
//         <div className="rounded-lg border border-gray-200 bg-white p-4">
//           <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
//             {headingLabel}
//           </p>
//           <div className="space-y-1.5">
//             {options.map((opt, oi) => (
//               <p key={oi} className="text-sm text-gray-800">
//                 <span className="mr-2 font-bold text-gray-900">
//                   {letterLabels[oi]}
//                 </span>
//                 {opt}
//               </p>
//             ))}
//           </div>
//         </div>
//       )}

//       <div className="flex items-start gap-3">
//         <NumCircle n={globalNum} />
//         <div className="flex-1">
//           <p className="mb-1.5 text-sm text-gray-800">
//             {question.questionText}
//           </p>
//           <select
//             value={answer}
//             onChange={(e) => onAnswer(question.id, e.target.value)}
//             className="w-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
//           >
//             <option value="">Select an option…</option>
//             {options.map((opt, oi) => (
//               <option key={oi} value={opt}>
//                 {letterLabels[oi]} – {opt}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { NumCircle, RadioDot } from "../shared";
import type { QuestionProps } from "./types";
import type { QuestionType } from "@/types";

interface MatchingQuestionProps extends QuestionProps {
  options: string[];
  questionType: QuestionType;
  showOptions?: boolean; // ← new: only the first question in a block passes true
}

const HEADING_LABEL: Partial<Record<QuestionType, string>> = {
  MATCH_HEADINGS: "List of Headings",
  MATCH_FEATURES: "List of Options",
  MATCH_SENTENCE_ENDINGS: "List of Endings",
  CLASSIFICATION: "Categories",
  CATEGORY_MATCHING: "Categories",
};

export function MatchingQuestion({
  question,
  globalNum,
  answer,
  onAnswer,
  options,
  questionType,
  showOptions = false,
}: MatchingQuestionProps) {
  const isShortLabels =
    options.length > 0 && options.every((o) => o.length <= 4);

  // ── Radio grid for short labels (A–G, i–x, A–C) ──────────────────────────
  if (isShortLabels) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-gray-200 bg-gray-50 px-3 py-2 w-full" />
              {options.map((col) => (
                <th
                  key={col}
                  className="border border-gray-200 bg-gray-50 px-3 py-2 text-center text-xs font-bold text-gray-800 min-w-[2.75rem]"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 px-3 py-3 text-gray-800 align-top">
                <div className="flex items-start gap-2">
                  <NumCircle n={globalNum} />
                  <span className="text-sm">{question.questionText}</span>
                </div>
              </td>
              {options.map((opt) => {
                const selected = answer === opt;
                return (
                  <td
                    key={opt}
                    className="border border-gray-200 px-2 py-3 text-center align-middle"
                  >
                    <label
                      onClick={() => onAnswer(question.id, opt)}
                      className="inline-flex cursor-pointer items-center justify-center"
                    >
                      <RadioDot selected={selected} />
                    </label>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // ── Long options → dropdown ───────────────────────────────────────────────
  const letterLabels = options.map((_, i) => String.fromCharCode(65 + i));
  const headingLabel = HEADING_LABEL[questionType] ?? "List of Options";

  return (
    <div className="space-y-3">
      {/* Options list shown only once — controlled by the parent via showOptions */}
      {showOptions && options.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
            {headingLabel}
          </p>
          <div className="space-y-1.5">
            {options.map((opt, oi) => (
              <p key={oi} className="text-sm text-gray-800">
                <span className="mr-2 font-bold text-gray-900">
                  {letterLabels[oi]}
                </span>
                {opt}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <NumCircle n={globalNum} />
        <div className="flex-1">
          <p className="mb-1.5 text-sm text-gray-800">
            {question.questionText}
          </p>
          <select
            value={answer}
            onChange={(e) => onAnswer(question.id, e.target.value)}
            className="w-full border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-100"
          >
            <option value="">Select an option…</option>
            {options.map((opt, oi) => (
              <option key={oi} value={opt}>
                {letterLabels[oi]} – {opt}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
