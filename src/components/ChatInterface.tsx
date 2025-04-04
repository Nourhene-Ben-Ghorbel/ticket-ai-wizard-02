
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, RefreshCw, ThumbsUp, ThumbsDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
      // In a real app, you would send the message to your Django backend:
      // const response = await fetch('YOUR_API_URL/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: input }),
      // });
      // const data = await response.json();
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate mock response based on input
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
            "flex max-w-[80%] rounded-2xl p-4",
            isUser
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          )}
        >
          <div className={cn("mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", 
            isUser ? "bg-blue-700" : "bg-blue-100"
          )}>
            {isUser ? 
              <User size={16} className="text-white" /> : 
              <Bot size={16} className="text-blue-600" />
            }
          </div>
          <div className="flex-1">
            <div className="mb-1">
              <p className="text-sm font-medium">
                {isUser ? "Vous" : "Ticket AI Wizard"}
              </p>
              <p className="text-xs opacity-70">
                {formatTime(message.timestamp)}
              </p>
            </div>
            <p className="whitespace-pre-wrap text-sm">
              {message.content}
            </p>
            
            {!isUser && (
              <div className="flex items-center justify-end gap-1 mt-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-6 w-6", feedback === "like" && "text-green-500")}
                  onClick={() => setFeedback("like")}
                >
                  <ThumbsUp size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("h-6 w-6", feedback === "dislike" && "text-red-500")}
                  onClick={() => setFeedback("dislike")}
                >
                  <ThumbsDown size={14} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-13rem)] max-h-[800px] bg-white rounded-xl shadow-md border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <Bot size={18} className="text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-800">Ticket AI Wizard</h3>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
          <RefreshCw size={16} />
        </Button>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="flex flex-col">
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex w-full mb-4 justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 max-w-[80%] text-gray-800">
                <div className="flex items-center">
                  <div className="mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Bot size={16} className="text-blue-600" />
                  </div>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="ml-2 text-sm">Génération de la réponse...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez une question sur votre ticket..."
            className="flex-1 border-gray-300 focus:border-blue-400"
            disabled={loading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={loading || !input.trim()}
            className={cn(
              "bg-blue-600 hover:bg-blue-700",
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
