"use client";

import { useEffect, useMemo, useState } from "react";
import type { VocabularyWord } from "@/types/vocabulary";
import { vocabularyService } from "@/services/vocabulary.service";

const TOPICS = [
  "All",
  "Education",
  "Economy",
  "Environment",
  "Technology",
  "Health",
  "Society",
  "Science",
];

export default function TopicExplorer() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    const loadWords = async () => {
      try {
        const res = await vocabularyService.getAllWords(1, 500);
        setWords(res.items ?? []); // ✅ PaginatedResponse uses .items
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWords();
  }, []);

  const filtered = useMemo(() => {
    if (selected === "All") return words;
    return words.filter(
      (w) => (w.topic ?? "").toLowerCase() === selected.toLowerCase()
    );
  }, [words, selected]);

  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
        Loading vocabulary...
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 space-y-4">
      <h2 className="text-lg font-bold text-gray-900">IELTS Topic Explorer</h2>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setSelected(t)}
            className={`px-3 py-1 rounded-full text-xs border ${
              selected === t
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* WORDS */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w) => (
          <div
            key={w.id}
            className="rounded-xl border p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-900">{w.word}</p>

              {w.topic && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-50 text-indigo-600 border">
                  {w.topic}
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-gray-600">{w.meaning}</p>

            {w.example && (
              <p className="mt-2 text-xs italic text-gray-500">
                &quot;{w.example}&quot;
              </p>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-sm text-gray-500">No vocabulary found</p>
      )}
    </div>
  );
}
