-- Activer l'extension pgvector (si non déjà activée)
CREATE EXTENSION IF NOT EXISTS vector;

-- Supprimer la table existante pour recréer une propre
DROP TABLE IF EXISTS documents CASCADE;

-- Créer la table principale pour stocker les chunks et embeddings
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    source TEXT,              -- Nom ou chemin du fichier source (PDF / image)
    chunk TEXT,               -- Le texte du chunk ou la légende (caption)
    modality TEXT,            -- "text" ou "image"
    embedding VECTOR(1536)    -- Embedding vector (dimension du modèle text-embedding-3-small)
);
