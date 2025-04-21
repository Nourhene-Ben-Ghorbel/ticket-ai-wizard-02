
from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
import json
import sys

# Importer les modules Python spécifiques à votre projet
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from backend.embeddings_ai_optimisé import RechercheTicketsEmbeddingsOptimized

app = FastAPI(title="MegSupport API")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration email
EMAIL_SERVER = os.environ.get("EMAIL_SERVER", "smtp.gmail.com")
EMAIL_PORT = int(os.environ.get("EMAIL_PORT", 587))
EMAIL_SENDER = os.environ.get("EMAIL_SENDER", "votre-email@gmail.com")
EMAIL_PASSWORD = os.environ.get("EMAIL_PASSWORD", "mot-de-passe-app")

# Classes pour les modèles de données
class TicketSearchRequest(BaseModel):
    ticket_text: str

class UserCreationRequest(BaseModel):
    username: str
    email: str

# Fonction pour générer un mot de passe aléatoire
def generate_password(length=12):
    characters = string.ascii_letters + string.digits + "!@#$%^&*()"
    return ''.join(random.choice(characters) for i in range(length))

# Fonction pour envoyer un email
async def send_email(background_tasks: BackgroundTasks, recipient: str, subject: str, html_content: str):
    def _send_email_task():
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = EMAIL_SENDER
            message["To"] = recipient
            
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            with smtplib.SMTP(EMAIL_SERVER, EMAIL_PORT) as server:
                server.starttls()
                server.login(EMAIL_SENDER, EMAIL_PASSWORD)
                server.sendmail(EMAIL_SENDER, recipient, message.as_string())
                
            print(f"Email envoyé à {recipient}")
            return True
        except Exception as e:
            print(f"Erreur lors de l'envoi de l'email: {e}")
            return False
    
    background_tasks.add_task(_send_email_task)

# Endpoint pour valider le format d'un fichier Excel
@app.post("/validate-excel")
async def validate_excel(file: UploadFile = File(...)):
    try:
        # Vérifier l'extension du fichier
        if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
            return {"isValid": False, "message": "Format de fichier non supporté. Utilisez .xlsx, .xls ou .csv"}
        
        # Lire le fichier
        contents = await file.read()
        with open("temp_file", "wb") as f:
            f.write(contents)
        
        # Analyser le fichier avec pandas
        if file.filename.endswith('.csv'):
            df = pd.read_csv("temp_file")
        else:
            df = pd.read_excel("temp_file")
        
        # Vérifier que le fichier a un en-tête et une seule ligne de données
        if len(df) != 1:
            return {"isValid": False, "message": "Le fichier doit contenir exactement une ligne de données (plus l'en-tête)"}
        
        # Nettoyer le fichier temporaire
        os.remove("temp_file")
        
        return {"isValid": True, "message": "Format valide"}
    except Exception as e:
        if os.path.exists("temp_file"):
            os.remove("temp_file")
        return {"isValid": False, "message": f"Erreur lors de la validation du fichier: {str(e)}"}

# Endpoint pour rechercher des tickets similaires
@app.post("/search-tickets")
async def search_tickets(request: TicketSearchRequest):
    try:
        # Initialiser le moteur de recherche
        recherche = RechercheTicketsEmbeddingsOptimized()
        
        # Effectuer la recherche de similarité
        resultats = recherche.rechercher_tickets_similaires(request.ticket_text)
        
        return resultats
    except Exception as e:
        print(f"Erreur lors de la recherche de tickets: {e}")
        return {
            "status": "error",
            "message": f"Une erreur est survenue lors de la recherche: {str(e)}"
        }

# Endpoint pour l'upload de fichier Excel
@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Vérifier l'extension du fichier
        if not file.filename.endswith(('.xlsx', '.xls')):
            raise HTTPException(status_code=400, detail="Format de fichier non supporté. Utilisez .xlsx ou .xls")
        
        # Sauvegarder temporairement le fichier
        temp_file = f"temp_{file.filename}"
        with open(temp_file, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Simuler le traitement du fichier
        # En production, vous appelleriez ici votre script main.py
        # Exemple: subprocess.run(["python", "main.py", temp_file])
        time.sleep(2)  # Simuler un temps de traitement
        
        # Nettoyage
        os.remove(temp_file)
        
        return {
            "status": "success",
            "message": f"Fichier {file.filename} traité avec succès",
            "processed_tickets": 10,  # Exemple, à remplacer par le vrai nombre
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        if 'temp_file' in locals() and os.path.exists(temp_file):
            os.remove(temp_file)
        return {
            "status": "error",
            "message": f"Erreur lors du traitement du fichier: {str(e)}"
        }

# Endpoint pour la création d'un utilisateur (admin only)
@app.post("/create-user")
async def create_user(request: UserCreationRequest, background_tasks: BackgroundTasks):
    try:
        # Générer un mot de passe
        password = generate_password()
        
        # Ici, implémenter la création de l'utilisateur dans votre base de données
        # user_id = create_user_in_db(request.username, request.email, password)
        user_id = f"user_{int(time.time())}"  # Ceci est juste un exemple
        
        # Préparer l'email
        subject = "Vos informations de connexion MegSupport"
        html_content = f"""
        <html>
            <body>
                <h1>Bienvenue sur MegSupport!</h1>
                <p>Votre compte a été créé avec succès.</p>
                <p><strong>Nom d'utilisateur:</strong> {request.username}</p>
                <p><strong>Mot de passe temporaire:</strong> {password}</p>
                <p>Veuillez vous connecter à <a href="http://localhost:3000/login">notre application</a> et changer votre mot de passe dès que possible.</p>
            </body>
        </html>
        """
        
        # Envoyer l'email en arrière-plan
        await send_email(background_tasks, request.email, subject, html_content)
        
        return {
            "status": "success",
            "message": "Utilisateur créé avec succès. Un email a été envoyé avec les informations de connexion.",
            "user": {
                "id": user_id,
                "username": request.username,
                "email": request.email,
                "isAdmin": False
            }
        }
    except Exception as e:
        print(f"Erreur lors de la création de l'utilisateur: {e}")
        return {
            "status": "error",
            "message": f"Erreur lors de la création de l'utilisateur: {str(e)}"
        }

# Endpoint pour obtenir des statistiques sur les tickets
@app.get("/ticket-stats")
async def get_ticket_stats():
    try:
        # Ici, implémenter la logique pour obtenir les statistiques depuis MongoDB
        # En exemple, retournons des statistiques simulées
        return {
            "status": "success",
            "total_tickets": 256,
            "processed_tickets": 245,
            "success_rate": 95.7,
            "average_similarity": 0.78,
            "last_update": time.strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        print(f"Erreur lors de la récupération des statistiques: {e}")
        return {
            "status": "error",
            "message": f"Erreur lors de la récupération des statistiques: {str(e)}"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fastapi_server:app", host="0.0.0.0", port=8000, reload=True)
