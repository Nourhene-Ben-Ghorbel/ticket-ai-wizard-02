
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ParticleBackground } from "@/components/ParticleBackground";
import { StatsCard } from "@/components/StatsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  TicketCheck, 
  Clock, 
  Layers, 
  Activity,
  BarChart2,
  PieChart,
  LineChart
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState("week");

  // Mock data for charts
  const ticketStatusData = [
    { name: "Résolus", value: 65, color: "#3B82F6" },
    { name: "En cours", value: 25, color: "#F59E0B" },
    { name: "Nouveaux", value: 10, color: "#10B981" },
  ];

  const ticketActivityData = [
    { day: "Lun", tickets: 23, resolved: 18 },
    { day: "Mar", tickets: 35, resolved: 28 },
    { day: "Mer", tickets: 18, resolved: 15 },
    { day: "Jeu", tickets: 27, resolved: 21 },
    { day: "Ven", tickets: 32, resolved: 25 },
    { day: "Sam", tickets: 15, resolved: 12 },
    { day: "Dim", tickets: 9, resolved: 7 },
  ];

  const responseTimeData = [
    { category: "< 1h", value: 35 },
    { category: "1-4h", value: 25 },
    { category: "4-24h", value: 20 },
    { category: "> 24h", value: 20 },
  ];

  return (
    <div className="min-h-screen bg-darkblue-950 text-white">
      <ParticleBackground />
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Tableau de bord administrateur
            </h1>
            <p className="text-gray-400">
              Visualisez les performances du système et suivez l'état des tickets.
            </p>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total des tickets" 
              value="1,284" 
              description="Tous les tickets traités" 
              icon={<Layers size={20} />}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard 
              title="Tickets résolus" 
              value="876" 
              description="68% du total" 
              icon={<TicketCheck size={20} />}
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard 
              title="Temps de réponse moyen" 
              value="2h 14min" 
              description="Amélioration de 15%" 
              icon={<Clock size={20} />}
              trend={{ value: 15, isPositive: true }}
            />
            <StatsCard 
              title="Précision des réponses" 
              value="93%" 
              description="Basé sur les retours utilisateurs" 
              icon={<Activity size={20} />}
              trend={{ value: 5, isPositive: true }}
            />
          </div>
          
          {/* Charts section */}
          <Tabs defaultValue="activity" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className="glass-card">
                <TabsTrigger value="activity" className="data-[state=active]:bg-blue-600">
                  <BarChart2 size={16} className="mr-2" />
                  Activité
                </TabsTrigger>
                <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
                  <LineChart size={16} className="mr-2" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="distribution" className="data-[state=active]:bg-blue-600">
                  <PieChart size={16} className="mr-2" />
                  Distribution
                </TabsTrigger>
              </TabsList>
              
              <div className="glass-card p-1 rounded-md">
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="bg-transparent text-sm px-2 py-1 outline-none"
                >
                  <option value="day">Aujourd'hui</option>
                  <option value="week">Cette semaine</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                </select>
              </div>
            </div>
            
            <TabsContent value="activity" className="space-y-6">
              <Card className="p-6 glass-card border-none">
                <h3 className="text-lg font-medium mb-6">Activité des tickets par jour</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ticketActivityData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                    >
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1E293B", 
                          borderColor: "#334155",
                          borderRadius: "0.5rem" 
                        }}
                      />
                      <Legend />
                      <Bar dataKey="tickets" name="Tickets créés" fill="#3B82F6" />
                      <Bar dataKey="resolved" name="Tickets résolus" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="performance" className="space-y-6">
              <Card className="p-6 glass-card border-none">
                <h3 className="text-lg font-medium mb-6">Temps de réponse (en heures)</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        { date: "1 Avril", time: 4.2 },
                        { date: "2 Avril", time: 3.8 },
                        { date: "3 Avril", time: 3.5 },
                        { date: "4 Avril", time: 2.9 },
                        { date: "5 Avril", time: 2.5 },
                        { date: "6 Avril", time: 2.3 },
                        { date: "7 Avril", time: 2.1 },
                      ]}
                      margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                    >
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1E293B", 
                          borderColor: "#334155",
                          borderRadius: "0.5rem" 
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="time" 
                        name="Temps de réponse" 
                        stroke="#3B82F6" 
                        strokeWidth={2} 
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 glass-card border-none">
                <h3 className="text-lg font-medium mb-6">État des tickets</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={ticketStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {ticketStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1E293B", 
                          borderColor: "#334155",
                          borderRadius: "0.5rem" 
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              
              <Card className="p-6 glass-card border-none">
                <h3 className="text-lg font-medium mb-6">Temps de réponse</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={responseTimeData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 40, bottom: 10 }}
                    >
                      <XAxis type="number" />
                      <YAxis dataKey="category" type="category" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#1E293B", 
                          borderColor: "#334155",
                          borderRadius: "0.5rem" 
                        }}
                      />
                      <Bar dataKey="value" name="% de tickets" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
