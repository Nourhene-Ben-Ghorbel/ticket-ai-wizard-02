
"""
FastAPI server file for integration with the React frontend.
This file serves as a template for implementing the backend API.
To run this server, install FastAPI and uvicorn:
    pip install fastapi uvicorn python-multipart
Then run:
    uvicorn fastapi_server:app --reload
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import tempfile
import shutil
import sys
import time

# Import the ticket similarity search functionality
# sys.path.append('/path/to/your/python/scripts')
# from embeddings_ai_optimisé import RechercheTicketsEmbeddingsOptimized
# from main import process_file  # Import file processing function

app = FastAPI(
    title="Ticket AI API",
    description="API for processing and analyzing support tickets",
    version="1.0.0",
)

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TicketSearchRequest(BaseModel):
    ticket_text: str

class TicketResponse(BaseModel):
    ticket_id: str
    problem: str
    solution: str
    keywords: str
    similarity_score: float

class SearchResponse(BaseModel):
    status: str
    message: str
    tickets: Optional[List[TicketResponse]] = None
    temps_recherche: Optional[float] = None
    query: Optional[str] = None

@app.post("/search-tickets", response_model=SearchResponse)
async def search_tickets(request: TicketSearchRequest):
    """
    Search for tickets similar to the provided ticket text.
    Utilizes embedding-based similarity search to find relevant tickets.
    """
    try:
        start_time = time.time()
        
        # In production, uncomment and use the actual search implementation
        # search_engine = RechercheTicketsEmbeddingsOptimized()
        # result = search_engine.rechercher_tickets_similaires(request.ticket_text)
        # return result
        
        # Mock implementation for demonstration
        # Return a successful response with mock data
        elapsed_time = time.time() - start_time
        
        # Simulate finding a ticket
        return {
            "status": "success",
            "message": "1 ticket similaire trouvé",
            "tickets": [
                {
                    "ticket_id": "MOCK-123",
                    "problem": "Problème de connexion à la base de données",
                    "solution": "Vérifier les paramètres de connexion et redémarrer le service",
                    "keywords": "connexion, database, paramètres",
                    "similarity_score": 0.85
                }
            ],
            "temps_recherche": elapsed_time,
            "query": "Erreur lors de l'accès à la base de données"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Une erreur s'est produite: {str(e)}"
        }

@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and process an Excel file containing tickets.
    The file is saved temporarily and then processed using the main.py script.
    """
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.xlsx') as tmp:
            # Copy the uploaded file to the temporary file
            shutil.copyfileobj(file.file, tmp)
            temp_file_path = tmp.name
        
        # In production, uncomment and use the actual file processing
        # from main import main as process_excel_file
        # process_excel_file(temp_file_path)
        
        # Clean up the temporary file
        os.unlink(temp_file_path)
        
        # Return success response
        return {
            "status": "success",
            "message": f"Le fichier {file.filename} a été traité avec succès",
            "processed_tickets": 10,  # Mock number of processed tickets
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        # If the temporary file was created, clean it up
        if 'temp_file_path' in locals():
            try:
                os.unlink(temp_file_path)
            except:
                pass
        
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement du fichier: {str(e)}")

@app.get("/ticket-stats")
async def ticket_stats():
    """
    Get statistics about the tickets stored in MongoDB.
    """
    try:
        # In production, uncomment and use the actual function
        # from stockage import get_collection_stats
        # stats = get_collection_stats()
        # return stats
        
        # Mock implementation
        return {
            "count": 150,  # Mock number of tickets
            "status": "active",
            "resolved_count": 120,
            "unresolved_count": 30,
            "categories": {
                "login": 45,
                "database": 38,
                "ui": 25,
                "other": 42
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des statistiques: {str(e)}")

# Root endpoint for API health check
@app.get("/")
async def root():
    return {"status": "API is running", "version": "1.0.0"}
