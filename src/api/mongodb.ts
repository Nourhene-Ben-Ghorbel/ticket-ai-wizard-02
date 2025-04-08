
// Service de fausse base de données pour simuler les opérations MongoDB dans le navigateur
// Ceci est utilisé uniquement pour la démo, car MongoDB ne fonctionne pas directement dans le navigateur

// Stockage en mémoire pour simuler les collections
const inMemoryDb: Record<string, any[]> = {
  users: [
    { 
      _id: "1", 
      username: "admin", 
      email: "admin@example.com", 
      password: "admin123", 
      isAdmin: true 
    },
    { 
      _id: "2", 
      username: "user", 
      email: "user@example.com", 
      password: "user123", 
      isAdmin: false 
    }
  ],
  tickets: []
};

// Simule la connexion à MongoDB
export const connectToMongoDB = async () => {
  console.log("MongoDB simulation initialized");
  return {
    db: () => ({
      collection: (name: string) => getCollection(name)
    }),
    close: () => console.log("MongoDB connection closed")
  };
};

// Obtient une collection avec ses méthodes
const getCollection = (name: string) => {
  // Crée la collection si elle n'existe pas
  if (!inMemoryDb[name]) {
    inMemoryDb[name] = [];
  }

  return {
    // Implémentation de find
    find: (query = {}) => {
      console.log(`Finding in ${name} with query:`, query);
      
      // Filtre les documents qui correspondent à la requête
      const filteredDocs = inMemoryDb[name].filter(doc => {
        return Object.entries(query).every(([key, value]) => {
          return doc[key] === value;
        });
      });
      
      return {
        toArray: async () => {
          console.log(`Found ${filteredDocs.length} documents in ${name}`);
          return [...filteredDocs];
        }
      };
    },
    
    // Implémentation de findOne
    findOne: async (query = {}) => {
      console.log(`Finding one in ${name} with query:`, query);
      
      const doc = inMemoryDb[name].find(doc => {
        return Object.entries(query).every(([key, value]) => {
          return doc[key] === value;
        });
      });
      
      console.log(`Found document:`, doc || null);
      return doc || null;
    },
    
    // Implémentation de insertOne
    insertOne: async (document: any) => {
      console.log(`Inserting into ${name}:`, document);
      
      // Génére un ID si nécessaire
      const newDoc = { 
        ...document, 
        _id: document._id || String(Date.now())
      };
      
      inMemoryDb[name].push(newDoc);
      
      return {
        insertedId: newDoc._id,
        acknowledged: true
      };
    },
    
    // Implémentation de updateOne
    updateOne: async (filter: any, update: any) => {
      console.log(`Updating in ${name} with filter:`, filter, "and update:", update);
      
      const index = inMemoryDb[name].findIndex(doc => {
        return Object.entries(filter).every(([key, value]) => {
          return doc[key] === value;
        });
      });
      
      if (index !== -1) {
        const updateData = update.$set || update;
        inMemoryDb[name][index] = {
          ...inMemoryDb[name][index],
          ...updateData
        };
        
        return {
          matchedCount: 1,
          modifiedCount: 1,
          acknowledged: true
        };
      }
      
      return {
        matchedCount: 0,
        modifiedCount: 0,
        acknowledged: true
      };
    },
    
    // Implémentation de deleteOne
    deleteOne: async (filter: any) => {
      console.log(`Deleting in ${name} with filter:`, filter);
      
      const initialLength = inMemoryDb[name].length;
      
      inMemoryDb[name] = inMemoryDb[name].filter(doc => {
        return !Object.entries(filter).every(([key, value]) => {
          return doc[key] === value;
        });
      });
      
      const deleted = initialLength > inMemoryDb[name].length;
      
      return {
        deletedCount: deleted ? 1 : 0,
        acknowledged: true
      };
    },
    
    // Implémentation de countDocuments (sans paramètre)
    countDocuments: async () => {
      console.log(`Counting documents in ${name}`);
      return inMemoryDb[name].length;
    }
  };
};

// Export une fonction pour réinitialiser la base de données (utile pour les tests)
export const resetDatabase = () => {
  Object.keys(inMemoryDb).forEach(key => {
    if (key !== 'users') {
      inMemoryDb[key] = [];
    } else {
      // Garder les utilisateurs par défaut
      inMemoryDb[key] = [
        { 
          _id: "1", 
          username: "admin", 
          email: "admin@example.com", 
          password: "admin123", 
          isAdmin: true 
        },
        { 
          _id: "2", 
          username: "user", 
          email: "user@example.com", 
          password: "user123", 
          isAdmin: false 
        }
      ];
    }
  });
  
  console.log("Database reset to initial state");
};
