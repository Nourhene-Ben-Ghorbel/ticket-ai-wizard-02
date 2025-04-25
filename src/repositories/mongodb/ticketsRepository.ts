
import { connectToMongoDB } from "@/api/mongodb";

export interface Ticket {
  _id: string;
  problem: string;
  solution: string;
  keywords: string[];
  created_at: Date;
  updated_at: Date;
}

export const ticketsRepository = {
  async findSimilarTickets(ticketText: string): Promise<Ticket[]> {
    const mongo = await connectToMongoDB();
    try {
      const collection = mongo.db().collection('tickets');
      return await collection.find().toArray() as Ticket[];
    } finally {
      await mongo.close();
    }
  },

  async saveTicket(ticket: Omit<Ticket, '_id' | 'created_at' | 'updated_at'>): Promise<Ticket> {
    const mongo = await connectToMongoDB();
    try {
      const collection = mongo.db().collection('tickets');
      const now = new Date();
      const newTicket = {
        ...ticket,
        created_at: now,
        updated_at: now
      };
      const result = await collection.insertOne(newTicket);
      return { ...newTicket, _id: result.insertedId } as Ticket;
    } finally {
      await mongo.close();
    }
  }
};

