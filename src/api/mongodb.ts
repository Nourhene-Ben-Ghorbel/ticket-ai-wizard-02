
import { MongoClient, ServerApiVersion } from 'mongodb';

// URI de connexion à MongoDB (à remplacer par votre URI réelle)
const uri = "mongodb://localhost:27017";

// Créez un MongoClient avec les options par défaut
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Fonction pour se connecter à MongoDB
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connecté à MongoDB avec succès");
    return client.db("Access");
  } catch (error) {
    console.error("Erreur de connexion à MongoDB:", error);
    throw error;
  }
}

// Fonction pour enregistrer un nouvel utilisateur
export async function registerUser(username: string, email: string, password: string) {
  try {
    const db = await connectToMongoDB();
    const usersCollection = db.collection("Users");
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error("Cet email est déjà utilisé");
    }
    
    // Créer un nouvel utilisateur
    const newUser = {
      username,
      email,
      password, // Note: Dans une application réelle, le mot de passe devrait être haché
      isAdmin: false,
      createdAt: new Date()
    };
    
    const result = await usersCollection.insertOne(newUser);
    console.log("Utilisateur enregistré avec l'ID:", result.insertedId);
    
    // Enregistrer l'historique de connexion
    await recordSignIn(email, "signup");
    
    return { id: result.insertedId, username, email, isAdmin: false };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// Fonction pour authentifier un utilisateur
export async function authenticateUser(email: string, password: string) {
  try {
    const db = await connectToMongoDB();
    const usersCollection = db.collection("Users");
    
    // Rechercher l'utilisateur
    const user = await usersCollection.findOne({ email, password });
    
    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }
    
    // Enregistrer l'historique de connexion
    await recordSignIn(email, "login");
    
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false
    };
  } catch (error) {
    console.error("Erreur lors de l'authentification:", error);
    throw error;
  } finally {
    await client.close();
  }
}

// Fonction pour enregistrer l'historique de connexion
export async function recordSignIn(email: string, type: "login" | "signup") {
  try {
    const db = await connectToMongoDB();
    const historyCollection = db.collection("Historique_SignIn");
    
    await historyCollection.insertOne({
      email,
      type,
      timestamp: new Date()
    });
    
    console.log(`Historique de ${type} enregistré pour ${email}`);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de l'historique:", error);
  }
}

// Fonction pour enregistrer un message
export async function recordMessage(userId: string, content: string, role: "user" | "assistant") {
  try {
    const db = await connectToMongoDB();
    const messagesCollection = db.collection("Historique_Messages");
    
    await messagesCollection.insertOne({
      userId,
      content,
      role,
      timestamp: new Date()
    });
    
    console.log("Message enregistré pour l'utilisateur:", userId);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message:", error);
  } finally {
    await client.close();
  }
}

// Fonction pour récupérer l'historique des messages d'un utilisateur
export async function getUserMessages(userId: string) {
  try {
    const db = await connectToMongoDB();
    const messagesCollection = db.collection("Historique_Messages");
    
    const messages = await messagesCollection
      .find({ userId })
      .sort({ timestamp: 1 })
      .toArray();
    
    return messages;
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error);
    return [];
  } finally {
    await client.close();
  }
}
