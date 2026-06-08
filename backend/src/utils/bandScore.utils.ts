// IELTS Reading / Listening raw score → band mapping
// Academic Reading: 40 questions
const READING_BAND: [number, number][] = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [33, 7.5],
  [30, 7],
  [27, 6.5],
  [23, 6],
  [19, 5.5],
  [15, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
];

// Listening: 40 questions
const LISTENING_BAND: [number, number][] = [
  [39, 9],
  [37, 8.5],
  [35, 8],
  [32, 7.5],
  [30, 7],
  [26, 6.5],
  [23, 6],
  [18, 5.5],
  [16, 5],
  [13, 4.5],
  [10, 4],
  [8, 3.5],
  [6, 3],
  [4, 2.5],
];

function lookupBand(score: number, table: [number, number][]): number {
  for (const [threshold, band] of table) {
    if (score >= threshold) return band;
  }
  return 2;
}

export function readingScoreToBand(correctAnswers: number): number {
  return lookupBand(correctAnswers, READING_BAND);
}

export function listeningScoreToBand(correctAnswers: number): number {
  return lookupBand(correctAnswers, LISTENING_BAND);
}

// Overall band: average of 4 skills, rounded to nearest 0.5
export function calculateOverallBand(
  reading: number | null,
  listening: number | null,
  writing: number | null,
  speaking: number | null
): number | null {
  const scores = [reading, listening, writing, speaking].filter(
    (s): s is number => s !== null
  );
  if (scores.length === 0) return null;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  // Round to nearest 0.5
  return Math.round(avg * 2) / 2;
}
