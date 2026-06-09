"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useWritingStore } from "@/store/writing.store";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  minWords: number;
  placeholder?: string;
  onAutoSave?: (text: string) => void;
}

export function RichTextEditor({
  minWords,
  placeholder,
  onAutoSave,
}: RichTextEditorProps) {
  const { essay, isSaving, lastSaved, setEssay, setSaving, setLastSaved } =
    useWritingStore();

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ---------------- Word Count (reliable) ---------------- */
  const wordCount = useMemo(() => {
    return essay.trim().split(/\s+/).filter(Boolean).length;
  }, [essay]);

  /* ---------------- Auto resize textarea ---------------- */
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [essay]);

  /* ---------------- Cleanup timer ---------------- */
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  /* ---------------- Autosave ---------------- */
  const triggerSave = useCallback(
    (text: string) => {
      if (!onAutoSave) return;

      if (timerRef.current) clearTimeout(timerRef.current);

      setSaving(true);

      timerRef.current = setTimeout(() => {
        onAutoSave(text);

        setSaving(false);
        setLastSaved(new Date());
      }, 1200);
    },
    [onAutoSave, setSaving, setLastSaved]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssay(e.target.value);
    triggerSave(e.target.value);
  };

  const isUnderMin = wordCount < minWords;

  const pct = Math.min((wordCount / minWords) * 100, 120);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative rounded-xl border border-gray-200 bg-white focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
        <textarea
          ref={textareaRef}
          value={essay}
          onChange={handleChange}
          placeholder={placeholder ?? "Start writing your response here…"}
          className="min-h-[360px] w-full resize-none rounded-xl bg-transparent px-5 py-4 text-sm leading-relaxed text-gray-800 outline-none placeholder:text-gray-400"
          spellCheck
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-4">
        {/* Progress */}
        <div className="flex items-center gap-3">
          <div className="h-1.5 w-32 overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isUnderMin ? "bg-orange-400" : "bg-emerald-500"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>

          <span
            className={cn(
              "text-xs font-medium",
              isUnderMin ? "text-orange-600" : "text-emerald-600"
            )}
          >
            {wordCount} / {minWords} words
            {isUnderMin && ` (need ${minWords - wordCount} more)`}
          </span>
        </div>

        {/* Save status */}
        <div className="text-xs text-gray-400">
          {isSaving ? (
            <span className="flex items-center gap-1">
              <svg
                className="h-3 w-3 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0115-4M20 15a9 9 0 01-15 4"
                />
              </svg>
              Saving…
            </span>
          ) : lastSaved ? (
            `Saved ${lastSaved.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`
          ) : null}
        </div>
      </div>
    </div>
  );
}
