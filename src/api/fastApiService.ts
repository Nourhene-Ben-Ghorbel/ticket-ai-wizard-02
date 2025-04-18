
import axios from 'axios';

// Base URL for our FastAPI backend
const API_BASE_URL = 'http://localhost:8000';

// Interface for the ticket search response
interface TicketSearchResponse {
  status: 'success' | 'not_found' | 'error';
  message: string;
  tickets?: {
    ticket_id: string;
    problem: string;
    solution: string;
    keywords: string;
    similarity_score: number;
  }[];
  temps_recherche?: number;
  query?: string;
}

// Interface for the file upload response
interface FileUploadResponse {
  status: 'success' | 'error';
  message: string;
  processed_tickets?: number;
  timestamp?: string;
}

/**
 * Search for similar tickets using the embeddings AI
 * @param ticketText The text content of the ticket to search
 */
export async function searchSimilarTickets(ticketText: string): Promise<TicketSearchResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/search-tickets`, {
      ticket_text: ticketText
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching for similar tickets:', error);
    return {
      status: 'error',
      message: 'Une erreur est survenue lors de la recherche de tickets similaires.'
    };
  }
}

/**
 * Upload an Excel file to be processed by the backend
 * @param file The Excel file to upload
 */
export async function uploadExcelFile(file: File): Promise<FileUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/upload-file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // You could use this to show upload progress
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
        console.log(`Upload progress: ${percentCompleted}%`);
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      status: 'error',
      message: 'Une erreur est survenue lors du téléchargement du fichier.'
    };
  }
}

/**
 * Get statistics about the tickets in MongoDB
 */
export async function getTicketStats() {
  try {
    const response = await axios.get(`${API_BASE_URL}/ticket-stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching ticket statistics:', error);
    return {
      status: 'error',
      message: 'Une erreur est survenue lors de la récupération des statistiques.'
    };
  }
}
