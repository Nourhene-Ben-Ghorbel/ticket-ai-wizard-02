import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { recordMessage } from "../api/mongodb";
import { useTheme } from "@/hooks/useTheme";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ChatInterfaceProps {
  initialMessage?: string;
}

export const ChatInterface = ({ initialMessage }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Add system greeting and initial message if provided
  useEffect(() => {
    const initialMessages: Message[] = [
      {
        id: "system-1",
        content: "Bonjour ! Je suis Ticket AI Wizard, votre assistant pour l'analyse des tickets. Comment puis-je vous aider aujourd'hui ?",
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
      });
    }

    setMessages(initialMessages);
  }, [initialMessage]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Focus input on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      // Enregistrer le message dans MongoDB
      if (user?.id) {
        await recordMessage(user.id, input, "user");
      }
      
      // Simuler un délai d'API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Générer une réponse en fonction de l'entrée
      let responseContent = "";
      
      if (input.toLowerCase().includes("doubl") || input.toLowerCase().includes("dupliqu")) {
        responseContent = "J'ai analysé votre ticket et j'ai détecté qu'il s'agit probablement d'un doublon. Il existe déjà un ticket similaire avec l'ID JIRA-4289 créé il y a 3 jours. Je suggère de fusionner ces tickets pour éviter la duplication du travail.";
      } else if (input.toLowerCase().includes("erreur") || input.toLowerCase().includes("bug")) {
        responseContent = "D'après mon analyse, cette erreur a déjà été résolue dans d'autres tickets. La solution appliquée consistait à mettre à jour la dépendance X vers la version 2.3.4 et à modifier la configuration dans le fichier config.json. Temps de résolution moyen pour ce type de problème : 1,5 jour.";
      } else if (input.toLowerCase().includes("install") || input.toLowerCase().includes("setup")) {
        responseContent = "Pour ce problème d'installation, j'ai identifié une solution documentée dans notre base de connaissances. Je recommande de suivre le guide de résolution PR-328 qui a résolu des problèmes similaires dans 94% des cas.";
      } else {
        responseContent = "J'ai analysé votre ticket et j'ai trouvé quelques informations pertinentes. Basé sur notre historique, ce type de problème est généralement résolu en modifiant la configuration système. Voulez-vous que je vous fournisse plus de détails sur les étapes spécifiques à suivre ?";
      }
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        content: responseContent,
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      
      // Enregistrer la réponse dans MongoDB
      if (user?.id) {
        await recordMessage(user.id, responseContent, "assistant");
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        content: "Désolé, une erreur s'est produite lors de la communication avec le serveur. Veuillez réessayer.",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const MessageComponent = ({ message }: { message: Message }) => {
    const isUser = message.role === "user";
    const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

    return (
      <div className={cn("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
        <div
          className={cn(
            "flex max-w-[80%] rounded-2xl p-3 space-x-3 items-center",
            isUser
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-slate-800 text-white rounded-tl-none"
          )}
        >
          <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", 
            isUser ? "bg-blue-700" : "bg-slate-700"
          )}>
            {isUser ? 
              <User size={16} className="text-white" /> : 
              <Bot size={16} className="text-white" />
            }
          </div>
          <p className="text-sm flex-1">{message.content}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-blue-400" />
          <h3 className="font-medium text-white">MegSupport</h3>
        </div>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4 bg-slate-900">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}
        {loading && (
          <div className="flex w-full justify-start">
            <div className="flex items-center bg-slate-800 text-white p-3 rounded-2xl rounded-tl-none space-x-3">
              <Bot size={16} className="text-white" />
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Génération de la réponse...</span>
            </div>
          </div>
        )}
      </ScrollArea>
      
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Décrivez votre problème en détail..."
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500"
            disabled={loading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={loading || !input.trim()}
            className={cn(
              "bg-blue-600 hover:bg-blue-700 text-white",
              !input.trim() && "opacity-50 cursor-not-allowed"
            )}
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};
