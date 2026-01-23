import { X } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

export function ChatModal() {
  return (
    <div className="flex flex-col h-150 w-full max-w-lg rounded-xl">
      
        <div className="flex items-center justify-between p-4 border-b border-violet-600">
        <h2 className="text-xl font-bold text-violet-900">Ata da Reunião</h2>
        <button type="button" className="text-slate-400 hover:text-violet-900">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <ChatMessage role="assistant" content="Olá! Como posso ajudar?" />
      </div>

      <div className="border-t border-violet-600 p-4">
        <ChatInput />
      </div>
    </div>
  );
}
