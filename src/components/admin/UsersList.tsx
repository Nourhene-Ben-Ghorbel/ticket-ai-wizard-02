
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Mail, Trash2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

interface User {
  _id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
}

interface UsersListProps {
  users: User[];
  onUserDeleted: (userId: string) => void;
}

export const UsersList = ({ users, onUserDeleted }: UsersListProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { toast } = useToast();
  
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    userId: string | null;
    username: string | null;
  }>({
    open: false,
    userId: null,
    username: null
  });

  const handleDeleteUser = async () => {
    if (!deleteConfirmation.userId) return;
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUserDeleted(deleteConfirmation.userId);
      
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

  return (
    <>
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
                      onClick={() => setDeleteConfirmation({
                        open: true,
                        userId: user._id,
                        username: user.username
                      })}
                      disabled={user.isAdmin}
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
    </>
  );
};
