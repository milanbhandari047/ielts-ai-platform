"use client";

import { useRef, useCallback } from "react";
import { useSpeakingStore } from "@/store/speaking.store";

export function useVoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const prepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recTimerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    currentCueCard,
    recordingState,
    setRecordingState,
    setAudioBlob,
    setPrepTimeLeft,
    setRecordTimeLeft,
    setError,
    prepTimeLeft,
    recordTimeLeft,
  } = useSpeakingStore();

  const stopTimers = useCallback(() => {
    if (prepTimerRef.current) clearInterval(prepTimerRef.current);
    if (recTimerRef.current) clearInterval(recTimerRef.current);
  }, []);

  const startPrepTimer = useCallback((duration: number, onDone: () => void) => {
    let remaining = duration;
    setPrepTimeLeft(remaining);
    prepTimerRef.current = setInterval(() => {
      remaining -= 1;
      setPrepTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(prepTimerRef.current!);
        onDone();
      }
    }, 1000);
  }, []);

  const startRecordTimer = useCallback(
    (duration: number, onDone: () => void) => {
      let remaining = duration;
      setRecordTimeLeft(remaining);
      recTimerRef.current = setInterval(() => {
        remaining -= 1;
        setRecordTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(recTimerRef.current!);
          onDone();
        }
      }, 1000);
    },
    []
  );

  const startActualRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob, url);
        setRecordingState("recorded");
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start(1000);
      setRecordingState("recording");

      const maxTime = currentCueCard
        ? { PART1: 240, PART2: 120, PART3: 300 }[currentCueCard.part] ?? 120
        : 120;

      startRecordTimer(maxTime, () => stopRecording());
    } catch {
      setError(
        "Microphone access denied. Please allow microphone in browser settings."
      );
      setRecordingState("idle");
    }
  }, [currentCueCard]);

  const startRecording = useCallback(async () => {
    if (!currentCueCard) return;
    stopTimers();

    const prepTime =
      { PART1: 0, PART2: 60, PART3: 0 }[currentCueCard.part] ?? 0;

    if (prepTime > 0) {
      setRecordingState("preparing");
      startPrepTimer(prepTime, () => startActualRecording());
    } else {
      await startActualRecording();
    }
  }, [currentCueCard, startPrepTimer, startActualRecording]);

  const stopRecording = useCallback(() => {
    stopTimers();
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, []);

  return { startRecording, stopRecording };
}
