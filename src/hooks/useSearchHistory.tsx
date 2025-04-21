
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface SearchHistoryItem {
  id: string;
  timestamp: number;
  queryText: string;
  result: string;
  ticketIds?: string[];
}

interface SearchHistoryContextType {
  history: SearchHistoryItem[];
  addToHistory: (item: Omit<SearchHistoryItem, "id" | "timestamp">) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextType | undefined>(undefined);

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const { user } = useAuth();

  // Charger l'historique depuis le localStorage au démarrage
  useEffect(() => {
    if (user?.id) {
      try {
        const savedHistory = localStorage.getItem(`searchHistory-${user.id}`);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
      }
    }
  }, [user?.id]);

  // Sauvegarder l'historique dans le localStorage à chaque modification
  useEffect(() => {
    if (user?.id && history.length > 0) {
      localStorage.setItem(`searchHistory-${user.id}`, JSON.stringify(history));
    }
  }, [history, user?.id]);

  // Ajouter un élément à l'historique
  const addToHistory = (item: Omit<SearchHistoryItem, "id" | "timestamp">) => {
    if (!user?.id) return;
    
    const newItem: SearchHistoryItem = {
      ...item,
      id: `search-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
    };
    
    setHistory(prev => [newItem, ...prev]);
  };

  // Supprimer un élément de l'historique
  const deleteFromHistory = (id: string) => {
    if (!user?.id) return;
    
    setHistory(prev => {
      const newHistory = prev.filter(item => item.id !== id);
      toast({
        title: "Élément supprimé",
        description: "L'élément a été retiré de l'historique.",
      });
      return newHistory;
    });
  };

  // Effacer tout l'historique
  const clearHistory = () => {
    if (!user?.id) return;
    
    setHistory([]);
    localStorage.removeItem(`searchHistory-${user.id}`);
    toast({
      title: "Historique effacé",
      description: "Votre historique de recherche a été effacé.",
    });
  };

  return (
    <SearchHistoryContext.Provider value={{ history, addToHistory, deleteFromHistory, clearHistory }}>
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error("useSearchHistory doit être utilisé à l'intérieur d'un SearchHistoryProvider");
  }
  return context;
}
