
// Browser-compatible mock MongoDB service
// This simulates MongoDB functionality without using Node.js specific APIs

// In-memory database for development
const inMemoryDb = {
  users: [
    {
      id: "admin123",
      username: "admin",
      email: "admin@example.com",
      password: "admin123",
      isAdmin: true,
      createdAt: new Date()
    }
  ],
  signin_history: [],
  messages: []
};

// Generate a simple UUID for IDs
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Function to simulate connecting to MongoDB
export async function connectToMongoDB() {
  console.log("Simulating connection to MongoDB...");
  return {
    collection: (name: string) => {
      // Return mock collection methods
      return {
        findOne: async (query: any) => {
          console.log(`Searching in collection ${name} with query:`, query);
          
          if (name === "Users") {
            return inMemoryDb.users.find(user => 
              (query.email && user.email === query.email) &&
              (query.password === undefined || user.password === query.password)
            );
          }
          
          return null;
        },
        insertOne: async (doc: any) => {
          console.log(`Inserting in collection ${name}:`, doc);
          const id = generateId();
          
          if (name === "Users") {
            inMemoryDb.users.push({ ...doc, id });
            return { insertedId: id };
          } else if (name === "Historique_SignIn") {
            inMemoryDb.signin_history.push({ ...doc, id });
            return { insertedId: id };
          } else if (name === "Historique_Messages") {
            inMemoryDb.messages.push({ ...doc, id });
            return { insertedId: id };
          }
          
          return { insertedId: id };
        },
        find: (query: any) => {
          console.log(`Finding in collection ${name} with query:`, query);
          
          // Mock for find().sort().toArray()
          return {
            sort: () => {
              return {
                toArray: async () => {
                  if (name === "Historique_Messages" && query.userId) {
                    return inMemoryDb.messages.filter(msg => msg.userId === query.userId);
                  }
                  return [];
                }
              };
            }
          };
        }
      };
    }
  };
}

// Mock client close function
const client = {
  close: async () => {
    console.log("Simulating closing MongoDB connection");
  }
};

// Function to register a new user
export async function registerUser(username: string, email: string, password: string) {
  try {
    const db = await connectToMongoDB();
    const usersCollection = db.collection("Users");
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      throw new Error("Cet email est déjà utilisé");
    }
    
    // Create new user
    const newUser = {
      username,
      email,
      password,
      isAdmin: false,
      createdAt: new Date()
    };
    
    const result = await usersCollection.insertOne(newUser);
    console.log("User registered with ID:", result.insertedId);
    
    // Record sign-in history
    await recordSignIn(email, "signup");
    
    return { 
      id: result.insertedId, 
      username, 
      email, 
      isAdmin: false 
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// Function to authenticate a user
export async function authenticateUser(email: string, password: string) {
  try {
    const db = await connectToMongoDB();
    const usersCollection = db.collection("Users");
    
    // Find user
    const user = await usersCollection.findOne({ email, password });
    
    if (!user) {
      throw new Error("Email ou mot de passe incorrect");
    }
    
    // Record sign-in history
    await recordSignIn(email, "login");
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false
    };
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
}

// Function to record sign-in history
export async function recordSignIn(email: string, type: "login" | "signup") {
  try {
    const db = await connectToMongoDB();
    const historyCollection = db.collection("Historique_SignIn");
    
    await historyCollection.insertOne({
      email,
      type,
      timestamp: new Date()
    });
    
    console.log(`Sign-in history recorded for ${email} (${type})`);
  } catch (error) {
    console.error("Error recording sign-in history:", error);
  }
}

// Function to record a message
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
    
    console.log("Message recorded for user:", userId);
  } catch (error) {
    console.error("Error recording message:", error);
  }
}

// Function to get user messages
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
    console.error("Error fetching user messages:", error);
    return [];
  }
}
