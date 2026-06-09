"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAiTutorStore } from "@/store/ai-tutor.store";
import { aiTutorService } from "@/services/ai-tutor.service";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

// ─── Suggested prompts ────────────────────────────────────────────────────────
const SUGGESTED = [
  "Explain the difference between coherence and cohesion in IELTS writing.",
  "What are the most common grammar mistakes in IELTS Speaking Part 2?",
  "Help me brainstorm ideas for an essay about technology replacing jobs.",
  "How can I improve my reading speed for IELTS?",
  "What vocabulary should I use for an Academic Task 1 pie chart?",
  "Give me a Band 7 example answer for Speaking Part 1 about hobbies.",
];

// ─── Markdown-lite renderer ───────────────────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(
      /`(.*?)`/g,
      "<code class='bg-gray-100 px-1 rounded text-sm font-mono'>$1</code>"
    )
    .replace(
      /^### (.*$)/gm,
      "<h3 class='font-bold text-base mt-3 mb-1'>$1</h3>"
    )
    .replace(/^## (.*$)/gm, "<h2 class='font-bold text-lg mt-4 mb-1'>$1</h2>")
    .replace(/^- (.*$)/gm, "<li class='ml-4 list-disc'>$1</li>")
    .replace(/^(\d+)\. (.*$)/gm, "<li class='ml-4 list-decimal'>$2</li>")
    .replace(/\n\n/g, "</p><p class='mt-2'>")
    .replace(/\n/g, "<br/>");
}

// ─── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({
  role,
  content,
  isStreaming = false,
}: {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}) {
  const isUser = role === "user";
  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
        )}
      >
        {isUser ? "U" : "AI"}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "rounded-tr-sm bg-indigo-600 text-white"
            : "rounded-tl-sm bg-white text-gray-800 shadow-sm ring-1 ring-gray-100"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            className="prose-sm"
          />
        )}
        {isStreaming && (
          <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-current opacity-70" />
        )}
      </div>
    </div>
  );
}

// ─── Sessions sidebar ─────────────────────────────────────────────────────────
function SessionsSidebar() {
  const {
    sessions,
    currentSessionId,
    isLoadingSessions,
    setCurrentSession,
    setMessages,
    removeSession,
  } = useAiTutorStore();

  const handleSelect = async (sessionId: string) => {
    setCurrentSession(sessionId);
    try {
      const session = await aiTutorService.getSession(sessionId);
      setMessages(session.messages);
    } catch {}
  };

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    await aiTutorService.deleteSession(sessionId);
    removeSession(sessionId);
  };

  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-100 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Chat History
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {isLoadingSessions ? (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        ) : sessions.length === 0 ? (
          <p className="p-3 text-xs text-gray-400">
            No sessions yet. Start a conversation!
          </p>
        ) : (
          <ul className="space-y-1">
            {sessions.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => handleSelect(s.id)}
                  className={cn(
                    "group flex w-full items-start gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition",
                    s.id === currentSessionId
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  <svg
                    className="mt-0.5 h-4 w-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {s.title ?? "New conversation"}
                    </p>
                    {s.lastMessage && (
                      <p className="truncate text-xs text-gray-400">
                        {s.lastMessage}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, s.id)}
                    className="ml-1 hidden rounded p-0.5 text-gray-400 hover:text-red-500 group-hover:block"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── Main Chat Component ───────────────────────────────────────────────────────
export function AiTutorChat() {
  const {
    currentSessionId,
    messages,
    isStreaming,
    streamingContent,
    isLoadingMessages,
    setSessions,
    addSession,
    setCurrentSession,
    setMessages,
    addMessage,
    setStreaming,
    appendStreamChunk,
    commitStreamedMessage,
    setLoadingSessions,
    setLoadingMessages,
  } = useAiTutorStore();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load sessions on mount
  useEffect(() => {
    setLoadingSessions(true);
    aiTutorService
      .getSessions()
      .then((data) => setSessions(data.items))
      .finally(() => setLoadingSessions(false));
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;
      setInput("");

      const userMsg: import("@/types").AiTutorMessage = {
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      let activeSessionId = currentSessionId;

      // Create new session if none active
      if (!activeSessionId) {
        try {
          const session = await aiTutorService.createSession(trimmed);
          activeSessionId = session.id;
          setCurrentSession(session.id);
          addSession({
            id: session.id,
            title: session.title,
            lastMessage: trimmed,
            createdAt: session.createdAt,
          });
          setMessages(session.messages);
          return; // messages already set from createSession response
        } catch {
          return;
        }
      }

      addMessage(userMsg);
      setStreaming(true);

      try {
        const response = await aiTutorService.sendMessageStream(
          activeSessionId,
          trimmed
        );

        if (!response.ok || !response.body) {
          throw new Error("Stream failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // SSE format: "data: <text>\n\n"
          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) appendStreamChunk(parsed.content);
              } catch {
                // plain text chunk
                appendStreamChunk(data);
              }
            }
          }
        }

        commitStreamedMessage();
      } catch {
        commitStreamedMessage();
      }
    },
    [currentSessionId, isStreaming]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const showWelcome = !currentSessionId && messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <SessionsSidebar />

      <div className="flex flex-1 flex-col bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white">
              AI
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                IELTS AI Tutor
              </p>
              <p className="text-xs text-gray-400">
                {isStreaming ? "Typing…" : "Online"}
              </p>
            </div>
          </div>
          {currentSessionId && (
            <button
              onClick={() => {
                setCurrentSession(null);
                setMessages([]);
              }}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              + New Chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {showWelcome ? (
            <div className="flex h-full flex-col items-center justify-center gap-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-3xl">
                  🎓
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Your IELTS AI Tutor
                </h2>
                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Ask anything about IELTS — grammar, vocabulary, strategies,
                  essay feedback, or practice questions.
                </p>
              </div>
              <div className="grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {SUGGESTED.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-xs text-gray-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {isLoadingMessages ? (
                <div className="flex justify-center py-12">
                  <Spinner />
                </div>
              ) : (
                <>
                  {messages.map((msg, i) => (
                    <MessageBubble
                      key={i}
                      role={msg.role}
                      content={msg.content}
                    />
                  ))}
                  {isStreaming && streamingContent && (
                    <MessageBubble
                      role="assistant"
                      content={streamingContent}
                      isStreaming
                    />
                  )}
                  {isStreaming && !streamingContent && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-sm font-bold text-white">
                        AI
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white px-4 py-3 shadow-sm ring-1 ring-gray-100">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                            style={{ animationDelay: `${i * 150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-end gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about IELTS… (Enter to send, Shift+Enter for new line)"
                disabled={isStreaming}
                rows={1}
                className="flex-1 resize-none bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:opacity-40"
              >
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
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-center text-xs text-gray-400">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
