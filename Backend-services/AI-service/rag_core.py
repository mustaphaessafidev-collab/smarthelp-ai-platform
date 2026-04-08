import os
from db import get_conn
from openai_utils import embed_text
from openai import OpenAI

# إنشاء عميل OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def retrieve(query: str, k=5):
    """البحث عن أقرب المقاطع (chunks) في قاعدة البيانات بناءً على معنى السؤال"""
    q_emb = embed_text(query)
    conn = get_conn()

    with conn.cursor() as cur:
        cur.execute("""
            SELECT source, chunk, modality,
                   1 - (embedding <=> %s::vector) AS score
            FROM documents
            ORDER BY embedding <=> %s::vector
            LIMIT %s
        """, (q_emb, q_emb, k))
        rows = cur.fetchall()

    conn.close()
    return rows


def answer(query: str, k=5):
    """توليد الجواب بناءً على النتائج المسترجعة من قاعدة البيانات"""
    rows = retrieve(query, k=k)

    # تجميع السياق من المقاطع
    context = "\n\n".join([f"[{m}] {c}" for _, c, m, _ in rows])

    # إنشاء prompt للذكاء الاصطناعي
    prompt = f"""
Tu es un assistant RAG multimodal.
Utilise STRICTEMENT le contexte pour répondre.

Contexte:
{context}

Question:
{query}

Réponse:
"""

    # إرسال الطلب إلى GPT-5
    resp = client.responses.create(
        model="gpt-5",
        input=prompt
    )

    return resp.output_text, rows
