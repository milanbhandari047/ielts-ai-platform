"use client";

import { useRef } from "react";
import { useSpeakingStore } from "@/store/speaking.store";
import { useVoiceRecorder } from "@/hooks/useSpeechRecorder";
import { cn } from "@/lib/utils";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function VoiceRecorder() {
  const { recordingState, prepTimeLeft, recordTimeLeft, audioUrl, error } =
    useSpeakingStore();

  const { startRecording, stopRecording } = useVoiceRecorder();
  const audioRef = useRef<HTMLAudioElement>(null);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-700">
        Your Recording
      </h3>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* State machine UI */}
      {recordingState === "idle" && (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <button
            onClick={startRecording}
            className="rounded-xl bg-orange-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Start Recording
          </button>
          <p className="text-xs text-gray-400">
            Microphone access will be requested
          </p>
        </div>
      )}

      {recordingState === "preparing" && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="text-5xl font-black text-indigo-600">
            {prepTimeLeft}
          </div>
          <p className="text-sm font-medium text-gray-600">Preparation time</p>
          <p className="text-xs text-gray-400">
            Recording starts automatically
          </p>
        </div>
      )}

      {recordingState === "recording" && (
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Pulsing mic */}
          <div className="relative flex h-16 w-16 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-500 text-white">
              <svg
                className="h-7 w-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </div>
          </div>
          <div className="font-mono text-3xl font-bold text-red-600">
            {formatTime(recordTimeLeft)}
          </div>
          <p className="text-xs text-gray-500">Recording in progress…</p>
          <button
            onClick={stopRecording}
            className="rounded-xl border border-red-200 bg-red-50 px-6 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            Stop Recording
          </button>
        </div>
      )}

      {recordingState === "recorded" && audioUrl && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Recording complete
          </div>
          <audio ref={audioRef} controls src={audioUrl} className="w-full" />
          <button
            onClick={startRecording}
            className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Re-record
          </button>
        </div>
      )}

      {recordingState === "uploading" && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-gray-500">
            Uploading audio for AI evaluation…
          </p>
        </div>
      )}
    </div>
  );
}
