import base64
import os
from openai import OpenAI

# إنشاء العميل باستعمال المفتاح من .env
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# نموذج التضمين (embedding)
EMBED_MODEL = "text-embedding-3-small"

def embed_text(text: str) -> list[float]:
    """إنشاء embedding من نص"""
    resp = client.embeddings.create(
        model=EMBED_MODEL,
        input=text
    )
    return resp.data[0].embedding


def image_to_base64(path: str) -> str:
    """تحويل صورة إلى base64"""
    with open(path, "rb") as f:
        return base64.b64encode(f.read()).decode()


def caption_image(path: str) -> str:
    """إرسال الصورة إلى GPT-5 للحصول على وصف"""
    b64 = image_to_base64(path)
    
    resp = client.responses.create(
        model="gpt-5",
        input=[{
            "role": "user",
            "content": [
                {
                    "type": "input_text",
                    "text": "Décris clairement cette image en 2-3 phrases utiles pour la recherche."
                },
                {
                    "type": "input_image",
                    "image_url": f"data:image/png;base64,{b64}"
                }
            ]
        }]
    )
    # إرجاع الوصف الناتج
    return resp.output[0].content[0].text
