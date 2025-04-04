
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { TicketUpload } from "@/components/TicketUpload";
import { ChatInterface } from "@/components/ChatInterface";
import { ParticleBackground } from "@/components/ParticleBackground";
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
    <div className="min-h-screen bg-darkblue-950 text-white">
      <ParticleBackground />
      <Navbar />
      
      <main className="container mx-auto pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Ticket AI Wizard</span>
            </h1>
            <p className="text-gray-400 max-w-lg mx-auto">
              Automatisez l'analyse de vos tickets grâce à l'intelligence artificielle. Importez votre fichier et obtenez des réponses instantanées.
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto glass-card">
              <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600">
                <Upload size={16} className="mr-2" />
                Importer un ticket
              </TabsTrigger>
              <TabsTrigger value="chat" className="data-[state=active]:bg-blue-600">
                <MessageCircle size={16} className="mr-2" />
                Discuter avec l'IA
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-8 mt-6">
              <div className="glass-card p-6 rounded-xl">
                <h2 className="text-xl font-medium mb-4 text-center">
                  Importez votre fichier de tickets
                </h2>
                <TicketUpload onFileUploaded={handleFileUploaded} />
              </div>
            </TabsContent>
            
            <TabsContent value="chat" className="mt-6">
              <ChatInterface initialMessage={initialMessage} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
