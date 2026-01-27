"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, LoaderPinwheel } from "lucide-react";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { chatService } from "../service/service";
import { ChatMessage as ChatMessageType } from "../types";

interface ChatModalProps {
  projectId: string;
  projectName?: string;
  onClose: () => void;
}

export function ChatModal({ projectId, projectName, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `Olá! Sou a Atinha, sua assistente de reuniões. Como posso ajudar você com o projeto${projectName ? ` "${projectName}"` : ""}?`,
      },
    ]);
  }, [projectId, projectName]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setError(null);

    const userMessage: ChatMessageType = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage({
        projectId,
        message: content,
        conversationId: conversationId || undefined,
      });

      //salva o conversationId para novas msgs 
      if (!conversationId) {
        setConversationId(response.conversationId);
      }

      const aiMessage: ChatMessageType = {
        role: "assistant",
        content: response.response,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setError("Erro ao enviar mensagem. Tente novamente.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-lg rounded-xl">
      <div className="flex items-center justify-between p-4 border-b border-violet-600">
        <div>
          <h2 className="text-xl font-bold text-violet-900">Chat com Atinha</h2>
          {projectName && (
            <p className="text-sm text-slate-600 truncate max-w-[250px]">{projectName}</p>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-violet-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-chat-ai-bg border-2 border-violet-800 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="mb-1 text-xs font-bold text-violet-800">Atinha</div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <LoaderPinwheel className="w-4 h-4 animate-spin" />
                Pensando...
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-sm text-red-600 bg-red-50 rounded-lg p-2">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-violet-600 p-4">
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}
