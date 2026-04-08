from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from rag_core import answer  # utilise la fonction RAG existante

app = FastAPI()

# Autoriser les appels depuis l'application mobile
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # pour un TP : ouvert à toutes les origines
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/rag-chat")
async def rag_chat(request: Request):
    # Récupérer le JSON envoyé par Flutter : {"question": "..."}
    body = await request.json()
    question = body.get("question", "")
    
    # Appeler la fonction RAG (réponse et contexte)
    resp_text, _ = answer(question)
    
    # Retourner seulement la réponse
    return {"answer": resp_text}
