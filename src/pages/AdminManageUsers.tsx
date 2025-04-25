
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import StarfieldBackground from "@/components/StarfieldBackground";
import { CosmicElements, GlowingOrb } from "@/components/CosmicElements";
import { 
  UserPlus, 
  Loader, 
  CheckCircle,
  Trash2,
  Users,
  AlertCircle,
  Mail
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { connectToMongoDB } from "@/api/mongodb";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

const AdminManageUsers = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { toast } = useToast();

  // États pour le formulaire de création d'utilisateur
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // États pour la liste des utilisateurs
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{open: boolean, userId: string | null, username: string | null}>({
    open: false,
    userId: null,
    username: null
  });

  // Charger les utilisateurs au chargement de la page
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fonction pour récupérer la liste des utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulation de récupération des utilisateurs depuis MongoDB
      setTimeout(() => {
        const mockUsers = [
          {
            _id: "1",
            username: "admin",
            email: "admin@example.com",
            isAdmin: true,
            createdAt: new Date("2025-01-15")
          },
          {
            _id: "2",
            username: "user1",
            email: "user1@example.com",
            isAdmin: false,
            createdAt: new Date("2025-02-10")
          },
          {
            _id: "3",
            username: "user2",
            email: "user2@example.com",
            isAdmin: false,
            createdAt: new Date("2025-03-05")
          }
        ];
        setUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des utilisateurs",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  // Fonction pour créer un nouvel utilisateur
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    
    try {
      // Simulation de création d'utilisateur
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        _id: `user_${Date.now()}`,
        username,
        email,
        isAdmin: false,
        createdAt: new Date()
      };
      
      setUsers(prev => [...prev, newUser]);
      
      toast({
        title: "Utilisateur créé",
        description: `Un email a été envoyé à ${email} avec les informations de connexion.`,
      });
      
      setIsSuccess(true);
      setUsername("");
      setEmail("");
      
      // Réinitialiser le statut de succès après quelques secondes
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async () => {
    if (!deleteConfirmation.userId) return;
    
    try {
      // Simulation de suppression d'utilisateur
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUsers(prev => prev.filter(user => user._id !== deleteConfirmation.userId));
      
      toast({
        title: "Utilisateur supprimé",
        description: `L'utilisateur ${deleteConfirmation.username} a été supprimé avec succès.`,
      });
      
      setDeleteConfirmation({ open: false, userId: null, username: null });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur.",
        variant: "destructive"
      });
    }
  };

  // Fonction pour ouvrir la boîte de dialogue de confirmation de suppression
  const openDeleteConfirmation = (userId: string, username: string) => {
    setDeleteConfirmation({
      open: true,
      userId,
      username
    });
  };

  return (
    <div className={cn(
      "min-h-screen relative overflow-hidden",
      isDark ? "text-white bg-[#0a1535]" : "bg-white text-gray-800"
    )}>
      {isDark && <StarfieldBackground />}
      {isDark && <CosmicElements />}
      <Navbar />
      
      <main className="container mx-auto pt-24 pb-16 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <div>
              <h1 className={cn(
                "text-4xl md:text-5xl font-bold text-gradient mb-2",
                isDark ? "text-white" : "text-gray-800"
              )}>
                Gestion des utilisateurs
              </h1>
              
              <p className={cn(
                "text-lg",
                isDark ? "text-blue-200/90" : "text-blue-700/90"
              )}>
                Créez et gérez les comptes utilisateurs pour l'application
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire de création d'utilisateur */}
            <Card className={cn(
              "p-8 relative",
              isDark ? "bg-card/70 border-white/10" : "bg-white border-gray-200"
            )}>
              <div className="flex items-center mb-6">
                <div className={cn(
                  "p-2 rounded-lg mr-3",
                  isDark ? "bg-blue-900/50" : "bg-blue-100" 
                )}>
                  <UserPlus size={24} className={isDark ? "text-blue-400" : "text-blue-600"} />
                </div>
                <h2 className="text-xl font-medium">Ajouter un utilisateur</h2>
              </div>
              
              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nom d'utilisateur"
                    required
                    className={cn(
                      isDark ? "bg-slate-800/70 border-slate-700" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse email"
                    required
                    className={cn(
                      isDark ? "bg-slate-800/70 border-slate-700" : "bg-white border-gray-300"
                    )}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader size={18} className="mr-2 animate-spin" />
                        Création en cours...
                      </>
                    ) : isSuccess ? (
                      <>
                        <CheckCircle size={18} className="mr-2" />
                        Utilisateur créé avec succès
                      </>
                    ) : (
                      <>
                        <UserPlus size={18} className="mr-2" />
                        Créer l'utilisateur
                      </>
                    )}
                  </Button>
                </div>
                
                <div className={cn(
                  "bg-blue-50 p-4 rounded-lg mt-6",
                  isDark ? "bg-blue-900/20 border border-blue-900/50" : "border border-blue-200"
                )}>
                  <p className={cn(
                    "text-sm",
                    isDark ? "text-blue-300" : "text-blue-800"
                  )}>
                    <strong>Note:</strong> Un mot de passe sera généré automatiquement et envoyé 
                    par email à l'utilisateur avec ses informations de connexion.
                  </p>
                </div>
              </form>
            </Card>
            
            {/* Liste des utilisateurs */}
            <Card className={cn(
              "p-8 relative overflow-hidden",
              isDark ? "bg-card/70 border-white/10" : "bg-white border-gray-200"
            )}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className={cn(
                    "p-2 rounded-lg mr-3",
                    isDark ? "bg-blue-900/50" : "bg-blue-100" 
                  )}>
                    <Users size={24} className={isDark ? "text-blue-400" : "text-blue-600"} />
                  </div>
                  <h2 className="text-xl font-medium">Utilisateurs existants</h2>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    "Actualiser"
                  )}
                </Button>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader size={32} className="animate-spin text-blue-500 mb-4" />
                  <p className="text-muted-foreground">Chargement des utilisateurs...</p>
                </div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilisateur</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Rôle</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-semibold",
                                isDark ? "bg-purple-900/50 text-purple-300" : "bg-purple-100 text-purple-800"
                              )}>
                                Admin
                              </span>
                            ) : (
                              <span className={cn(
                                "px-2 py-1 rounded-full text-xs font-semibold",
                                isDark ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
                              )}>
                                Utilisateur
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  isDark ? "hover:bg-blue-900/30" : "hover:bg-blue-50"
                                )}
                                onClick={() => {
                                  toast({
                                    title: "Email envoyé",
                                    description: `Un email a été envoyé à ${user.email} avec un nouveau lien de connexion.`,
                                  });
                                }}
                              >
                                <Mail size={16} />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  isDark ? "hover:bg-red-900/30" : "hover:bg-red-50"
                                )}
                                onClick={() => openDeleteConfirmation(user._id, user.username)}
                                disabled={user.isAdmin} // Empêcher la suppression des administrateurs
                              >
                                <Trash2 size={16} className={user.isAdmin ? "text-gray-400" : "text-red-500"} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className={cn(
                    "p-3 rounded-full mb-4",
                    isDark ? "bg-gray-800" : "bg-gray-100"
                  )}>
                    <AlertCircle size={32} className="text-gray-400" />
                  </div>
                  <p className="text-muted-foreground text-center">Aucun utilisateur trouvé.</p>
                  <p className="text-muted-foreground text-center text-sm mt-1">
                    Utilisez le formulaire pour ajouter de nouveaux utilisateurs.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
      
      {/* Dialogue de confirmation de suppression */}
      <Dialog 
        open={deleteConfirmation.open} 
        onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{deleteConfirmation.username}</strong> ? Cette action ne peut pas être annulée.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmation({ open: false, userId: null, username: null })}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteUser}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {isDark && (
        <>
          <GlowingOrb className="fixed top-1/4 left-1/5 -z-10" size={250} color="rgba(79, 70, 229, 0.08)" />
          <GlowingOrb className="fixed bottom-1/4 right-1/5 -z-10" size={300} color="rgba(124, 58, 237, 0.06)" />
        </>
      )}
    </div>
  );
};

export default AdminManageUsers;
