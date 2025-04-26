
export interface TicketData {
  id?: string;
  title: string;
  description: string;
  solution: string;
  keywords: string[];
  preprocessedContent?: string;
  createdAt: Date;
}

export interface SimilaritySearchResult {
  ticket: TicketData;
  score: number;
}
