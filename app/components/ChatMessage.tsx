

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === "user";
    return (
 <div
      className={
        "flex w-full animate-fade-in-up" +
        (isUser ? " justify-end" : " justify-start")
      }
    >
      <div
        className={
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-soft " +
          (isUser
            ? " bg-chat-user-bg border-2 border-violet-200 rounded-br-md"
            : " bg-chat-ai-bg text-chat-ai-fg border-2 border-violet-800 rounded-bl-md")
        }
      >
        {!isUser && (
          <div className="mb-1 text-xs font-bold text-violet-800">
            atazinha
          </div>
        )}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{content}</p>
      </div>
    </div>
    );
}
