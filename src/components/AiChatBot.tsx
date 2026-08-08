"use client";


import { useEffect, useRef, useState, useCallback, FormEvent, KeyboardEvent } from "react";
import { MessageCircle, X, Send, RotateCcw } from "lucide-react";
import { AiChat } from "@/app/api/ai.service";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Role = "user" | "bot";

interface ChatMessage {
  id: string;
  role: Role;
  text?: string;
  imageUrl?: string;
  status?: "sending" | "sent" | "error";
  timestamp: number;
}

interface ChatApiResponse {
  message: string;
  imageUrl?: string | null;
}

export interface RhaenyraChatProps {
  botName?: string;
  tagline?: string;
  greeting?: string;
  accentColor?: string;
  defaultOpen?: boolean;
}



const genId = () =>
(typeof crypto !== "undefined" && "randomUUID" in crypto
  ? crypto.randomUUID()
  : `${Date.now()}-${Math.random().toString(36).slice(2)}`);

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}


export function RhaenyraChat({
  botName = "Rhaenyra",
  tagline = "Yudo Products Assistant",
  greeting = "Hi, I'm Rhaenyra — how can I help you today?",
  accentColor = "#6D6AFB",
  defaultOpen = false,
}: RhaenyraChatProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(defaultOpen);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [unread, setUnread] = useState(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const inputBarRef = useRef<HTMLFormElement | null>(null);

  // Seed greeting once, the first time the user opens the widget.
  useEffect(() => {
    if (isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      setMessages([
        {
          id: genId(),
          role: "bot",
          text: greeting,
          status: "sent",
          timestamp: Date.now(),
        },
      ]);
    }
  }, [isOpen, hasOpenedOnce, greeting]);

  // Auto-scroll to bottom on new message / open.
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isOpen, isSending]);

  // Clear unread badge when opened.
  useEffect(() => {
    if (isOpen) setUnread(0);
  }, [isOpen]);

  // Auto-resize the textarea as the user types.
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [draft]);

  const pushMessage = useCallback((msg: ChatMessage) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const updateMessage = useCallback((id: string, patch: Partial<ChatMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      const userMsg: ChatMessage = {
        id: genId(),
        role: "user",
        text: trimmed,
        status: "sent",
        timestamp: Date.now(),
      };
      pushMessage(userMsg);
      setDraft("");
      setIsSending(true);

      const typingId = genId();
      pushMessage({
        id: typingId,
        role: "bot",
        status: "sending",
        timestamp: Date.now(),
      });

      try {
        const history = messages
          .filter((m) => m.text)
          .slice(-4) // previous 2 messages
          .map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text!,
          }));
        const res = await AiChat(trimmed, history)

        if (!res.success) {
          throw new Error(`Request failed with message ${res?.data?.message}`);
        }

        const data: ChatApiResponse = res.data

        updateMessage(typingId, {
          text: data.message ?? "",
          imageUrl: data.imageUrl || undefined,
          status: "sent",
          timestamp: Date.now(),
        });

        if (!isOpen) setUnread((u) => u + 1);
      } catch (err) {
        updateMessage(typingId, {
          text: "Something went wrong reaching the server. Please try again.",
          status: "error",
          timestamp: Date.now(),
        });
      } finally {
        setIsSending(false);
      }
    },
    [isOpen, isSending, pushMessage, updateMessage]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(draft);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(draft);
    }
  };

  const retryLast = () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser?.text) sendMessage(lastUser.text);
  };

  return (
    <div
      className="fixed inset-0 z-[2147483000] pointer-events-none font-sans"
      style={{ "--rhx-accent": accentColor } as React.CSSProperties}
    >
      {/* ---------------- Floating launcher ---------------- */}
      <button
        type="button"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((o) => !o)}
        className={[
          "absolute right-4 bottom-4 sm:right-5 sm:bottom-5",
          "w-[58px] h-[58px] rounded-full border-none cursor-pointer",
          "flex items-center justify-center text-white pointer-events-auto",
          "shadow-[0_10px_24px_rgba(109,106,251,0.45),0_2px_6px_rgba(0,0,0,0.08)]",
          "transition-transform duration-200 ease-[cubic-bezier(.34,1.56,.64,1)]",
          "hover:-translate-y-0.5 hover:scale-[1.04] active:scale-[0.94]",
        ].join(" ")}
        style={{
          background: isOpen
            ? "linear-gradient(145deg, #4b4a8f, #34335f)"
            : "linear-gradient(145deg, var(--rhx-accent), color-mix(in srgb, var(--rhx-accent) 80%, black))",
        }}
      >
        <span className="w-[26px] h-[26px] flex items-center justify-center">
          {isOpen ? <X size={26} /> : <MessageCircle size={26} />}
        </span>
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-[5px] rounded-full bg-[#ff5a5f] text-white text-[11px] font-bold flex items-center justify-center border-2 border-white">
            {unread}
          </span>
        )}
      </button>

      {/* ---------------- Chat panel ---------------- */}
      <div
        role="dialog"
        aria-label={`${botName} chat`}
        aria-hidden={!isOpen}
        className={[
          "absolute right-3 left-3 bottom-[88px] sm:right-5 sm:left-auto sm:bottom-[92px]",
          "w-auto sm:w-[min(384px,calc(100vw-32px))]",
          "h-[min(72vh,calc(100vh-112px))] sm:h-[min(620px,calc(100vh-140px))]",
          "bg-white rounded-[18px] flex flex-col overflow-hidden origin-bottom-right",
          "shadow-[0_24px_60px_rgba(20,20,50,0.22),0_4px_16px_rgba(20,20,50,0.08)]",
          "transition-all duration-200 ease-[cubic-bezier(.2,.9,.3,1)] motion-reduce:transition-none",
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-4 scale-[0.97] pointer-events-none",
        ].join(" ")}
      >
        <header
          className="flex items-center gap-3 px-4 py-3.5 text-white flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg, var(--rhx-accent), color-mix(in srgb, var(--rhx-accent) 80%, black))",
          }}
        >
          <div className="w-[38px] h-[38px] rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            <RhaenyraGlyph />
          </div>
          <div className="flex-1 min-w-0">
            <p className="m-0 text-[15px] font-bold tracking-[0.1px]">{botName}</p>
            <p className="mt-0.5 mb-0 text-xs text-white/85 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] inline-block shadow-[0_0_0_2px_rgba(255,255,255,0.25)]" />
              {tagline}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close chat"
            onClick={() => setIsOpen(false)}
            className="bg-white/15 hover:bg-white/30 border-none rounded-full w-[30px] h-[30px] flex items-center justify-center text-white cursor-pointer flex-shrink-0 transition-colors duration-150"
          >
            <X size={14} />
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5 bg-white scroll-smooth"
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} botName={botName} onRetry={retryLast} />
          ))}
        </div>

        <form
          ref={inputBarRef}
          onSubmit={handleSubmit}
          className="flex items-end gap-2 px-3 py-2.5 border-t border-[#e9e9f3] bg-white flex-shrink-0"
        >
          <textarea
            ref={textareaRef}
            placeholder={`Message ${botName}…`}
            rows={1}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            className={[
              "flex-1 resize-none border border-[#e9e9f3] bg-[#f3f3fb] rounded-[14px]",
              "px-3.5 py-2.5 text-sm text-[#1c1c28] max-h-[120px] outline-none",
              "transition-[border-color,box-shadow,background-color] duration-150",
              "focus:bg-white disabled:opacity-60",
            ].join(" ")}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--rhx-accent)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(109,106,251,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e9e9f3";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={isSending || !draft.trim()}
            className="w-[38px] h-[38px] rounded-full border-none text-white flex items-center justify-center cursor-pointer flex-shrink-0 transition-transform duration-150 hover:scale-[1.06] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--rhx-accent)" }}
          >
            <Send size={17} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------

function MessageBubble({
  message,
  botName,
  onRetry,
}: {
  message: ChatMessage;
  botName: string;
  onRetry: () => void;
}) {
  const isUser = message.role === "user";
  const isTyping = message.role === "bot" && message.status === "sending";
  const isError = message.status === "error";

  return (
    <div className={`flex gap-2 max-w-full ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          aria-hidden="true"
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "var(--rhx-accent)" }}
        >
          <RhaenyraGlyph small />
        </div>
      )}

      <div className={`flex flex-col max-w-[78%] ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={[
            "px-[13px] py-2.5 rounded-2xl text-sm leading-[1.45] break-words whitespace-pre-wrap",
            isUser
              ? "text-white rounded-br-[4px]"
              : isError
                ? "bg-[#fdeceb] text-[#b3261e] rounded-bl-[4px]"
                : "bg-[#f3f3fb] text-[#1c1c28] rounded-bl-[4px]",
          ].join(" ")}
          style={isUser ? { background: "var(--rhx-accent)" } : undefined}
        >
          {isTyping ? (
            <TypingDots />
          ) : (
            <>
              {message.text && (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="m-0">{children}</p>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              )}
              {message.imageUrl && (
                <a
                  href={message.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2"
                >
                  <img
                    src={message.imageUrl}
                    alt="Attachment from chat"
                    loading="lazy"
                    className="block max-w-full w-full max-h-[260px] object-cover rounded-xl border border-[#e9e9f3]"
                  />
                </a>
              )}
              {isError && (
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-2 inline-flex items-center gap-1.5 bg-white border border-[#f3c6c2] text-[#b3261e] text-xs font-semibold px-2.5 py-1 rounded-full cursor-pointer hover:bg-[#fdf3f2]"
                >
                  <RotateCcw size={14} /> Retry
                </button>
              )}
            </>
          )}
        </div>
        {!isTyping && (
          <span className="text-[11px] text-[#8a8a9a] mt-1 px-0.5">
            {isUser ? "You" : botName} · {formatTime(message.timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1 px-0.5" aria-label="Rhaenyra is typing">
      <span
        className="w-1.5 h-1.5 rounded-full opacity-50 motion-safe:animate-bounce"
        style={{ background: "var(--rhx-accent)", animationDelay: "0ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full opacity-50 motion-safe:animate-bounce"
        style={{ background: "var(--rhx-accent)", animationDelay: "150ms" }}
      />
      <span
        className="w-1.5 h-1.5 rounded-full opacity-50 motion-safe:animate-bounce"
        style={{ background: "var(--rhx-accent)", animationDelay: "300ms" }}
      />
    </span>
  );
}

/** Small dragon-egg / flame glyph used as the assistant's mark (no external image). */
function RhaenyraGlyph({ small = false }: { small?: boolean }) {


  return (
    <img
      src={'/rhaenyraDp.png'}
      alt="Rhaenyra"
      width={"100%"}
      height={"100%"}
      className="rounded-full object-cover"
    />
  );
}