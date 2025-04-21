
import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { recordMessage } from "../api/mongodb";
import { useTheme } from "@/hooks/useTheme";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  ticketIds?: string[];
}

interface ChatInterfaceProps {
  initialMessage?: string;
  ticketIds?: string[];
}

export const ChatInterface = ({ initialMessage, ticketIds }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Add system greeting and initial message if provided
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "system-1",
        content: "Bonjour ! Je suis Ticket AI Wizard, votre assistant pour l'analyse des tickets. Veuillez importer un fichier pour commencer.",
        role: "assistant",
        timestamp: new Date(),
      },
    ];

    if (initialMessage) {
      initialMessages.push({
        id: "system-2",
        content: initialMessage,
        role: "assistant",
        timestamp: new Date(),
        ticketIds: ticketIds
      });
      
      // Record the assistant message in MongoDB if user is logged in
      if (user?.id) {
        recordMessage(user.id, initialMessage, "assistant").catch(error => {
          console.error("Error recording message:", error);
        });
      }
    }

    setMessages(initialMessages);
  }, [initialMessage, ticketIds, user?.id]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Message component with improved display
  const MessageComponent = ({ message }: { message: Message }) => {
    return (
      <div className="flex w-full mb-4 justify-start">
        <div className={cn(
          "flex max-w-[90%] rounded-2xl p-4 space-x-3 items-start",
          isDark
            ? "bg-slate-800/90 text-blue-100 rounded-tl-none"
            : "bg-white text-slate-900 rounded-tl-none border border-gray-200"
        )}>
          <div className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full mt-1",
            isDark ? "bg-slate-700" : "bg-blue-100"
          )}>
            <Bot size={16} className={isDark ? "text-blue-300" : "text-blue-600"} />
          </div>
          <div className="flex-1 leading-relaxed space-y-1">
            <div className={cn(
              "text-sm",
              isDark ? "text-blue-50" : "text-slate-900"
            )}>
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(
      "flex flex-col h-[500px] rounded-xl overflow-hidden border",
      isDark 
        ? "bg-slate-900/95 border-slate-800" 
        : "bg-gray-50 border-gray-200"
    )}>
      <div className={cn(
        "p-3 border-b flex items-center justify-between",
        isDark ? "border-slate-800" : "border-gray-200"
      )}>
        <div className="flex items-center gap-2">
          <Bot size={18} className={isDark ? "text-blue-400" : "text-blue-500"} />
          <h3 className={cn("font-medium text-sm", isDark ? "text-white" : "text-slate-900")}>
            Assistant IA
          </h3>
        </div>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
      </ScrollArea>
    </div>
  );
};
