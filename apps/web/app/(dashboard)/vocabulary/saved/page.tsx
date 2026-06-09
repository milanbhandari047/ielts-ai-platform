"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SectionLoader } from "@/components/ui/spinner";
import { useVocabularyStore } from "@/store/vocabulary.store";

export default function SavedPage() {
  const { savedWords, fetchSavedWords, removeFromSaved, loadingSaved } =
    useVocabularyStore();

  useEffect(() => {
    fetchSavedWords();
  }, []);

  if (loadingSaved) return <SectionLoader />;

  const totalSaved = savedWords.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Vocabulary</h1>
          <p className="text-sm text-gray-500">
            Words you bookmarked for revision
          </p>
        </div>

        <Link
          href="/vocabulary"
          className="border px-3 py-1 rounded hover:bg-gray-50"
        >
          Back
        </Link>
      </div>

      {/* EMPTY */}
      {!totalSaved ? (
        <div className="border rounded-xl p-10 text-center bg-gray-50">
          No saved words yet 📚
        </div>
      ) : (
        <>
          {/* STATS BAR (MATCH MASTERED STYLE) */}
          <div className="flex items-center justify-between bg-white border rounded-xl px-4 py-3">
            <div className="text-sm text-gray-600">
              Total Saved:{" "}
              <span className="font-semibold text-gray-900">{totalSaved}</span>
            </div>

            <div className="text-xs font-medium text-blue-600">
              Personal Learning List
            </div>
          </div>

          {/* GRID */}
          <div className="grid gap-4">
            {savedWords.map((w) => (
              <div
                key={w.id}
                className="group border rounded-xl p-5 bg-white hover:shadow-md transition"
              >
                {/* WORD */}
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                    {w.word}
                  </h2>

                  <button
                    onClick={() => removeFromSaved(w.id)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>

                {/* TOPIC (NEW) */}
                {w.topic && (
                  <p className="text-xs text-blue-600 font-medium mt-1">
                    Topic: {w.topic}
                  </p>
                )}

                {/* MEANING */}
                <p className="text-sm text-gray-600 mt-2">{w.meaning}</p>

                {/* EXAMPLE (NEW) */}
                {w.example && (
                  <p className="text-xs text-gray-500 mt-2 italic border-l-2 border-blue-200 pl-2">
                    “{w.example}”
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
