
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TicketUpload } from "@/components/TicketUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Upload } from "lucide-react";

const Dashboard = () => {
  const [initialMessage, setInitialMessage] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("upload");
  
  const handleFileUploaded = (message: string) => {
    setInitialMessage(message);
    setActiveTab("chat");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Navbar />
      
      <main className="container mx-auto pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-blue-600">Ticket AI Wizard</span>
            </h1>
            <p className="text-gray-600 max-w-lg mx-auto">
              Automatisez l'analyse de vos tickets grâce à l'intelligence artificielle. Importez votre fichier et obtenez des réponses instantanées.
            </p>
          </div>
          
          <div className="bg-white rounded-xl card-shadow mb-6">
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4 text-gray-800">
                Importez votre fichier de tickets
              </h2>
              <TicketUpload onFileUploaded={handleFileUploaded} />
            </div>
          </div>
          
          {initialMessage && (
            <ChatInterface initialMessage={initialMessage} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
