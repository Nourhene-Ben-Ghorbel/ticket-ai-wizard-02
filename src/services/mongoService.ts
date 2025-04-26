
import { MongoClient, ObjectId, Document } from 'mongodb';

export interface Ticket {
  _id?: ObjectId;
  title: string;
  description: string;
  solution: string;
  keywords: string[];
  preprocessedContent?: string;
  createdAt: Date;
}

export class MongoService {
  private client: MongoClient;
  private uri: string;

  constructor(uri: string) {
    this.uri = uri;
    this.client = new MongoClient(uri);
  }

  async connect() {
    try {
      await this.client.connect();
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    }
  }

  async findSimilarTickets(query: string, preprocessedQuery: string): Promise<Ticket[]> {
    try {
      const db = this.client.db('ticketdb');
      const collection = db.collection<Ticket>('tickets');
      
      // Utiliser l'index de recherche en texte pour trouver les tickets similaires
      const documents = await collection
        .find({
          $text: {
            $search: preprocessedQuery,
            $caseSensitive: false,
            $diacriticSensitive: false
          }
        })
        .project({ score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .limit(5)
        .toArray();
      
      // Ensure the documents are properly typed as Tickets
      const tickets: Ticket[] = documents.map(doc => ({
        _id: doc._id,
        title: doc.title as string,
        description: doc.description as string,
        solution: doc.solution as string,
        keywords: doc.keywords as string[],
        preprocessedContent: doc.preprocessedContent as string | undefined,
        createdAt: doc.createdAt as Date
      }));

      return tickets;
    } catch (error) {
      console.error('Error finding similar tickets:', error);
      throw error;
    }
  }

  async insertTicket(ticket: Omit<Ticket, '_id'>) {
    try {
      const db = this.client.db('ticketdb');
      const collection = db.collection<Ticket>('tickets');
      const result = await collection.insertOne(ticket);
      return result;
    } catch (error) {
      console.error('Error inserting ticket:', error);
      throw error;
    }
  }

  async close() {
    await this.client.close();
    console.log('Disconnected from MongoDB');
  }
}

export const mongoService = new MongoService(process.env.MONGODB_URI || '');
