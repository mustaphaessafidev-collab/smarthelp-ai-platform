import os ,glob
from tqdm import tqdm
from pypdf import PdfReader
from db import get_conn
from openai_utils import embed_text, caption_image

# إعدادات تقسيم النص
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def chunk_text(text: str):
    """تقطيع النص إلى أجزاء صغيرة متداخلة"""
    chunks = []
    i = 0
    while i < len(text):
        chunks.append(text[i:i + CHUNK_SIZE])
        i += CHUNK_SIZE - CHUNK_OVERLAP
    return chunks


def ingest_pdf(path: str):
    """قراءة ملف PDF واستخراج النص"""
    reader = PdfReader(path)
    full_text = "\n".join(page.extract_text() or "" for page in reader.pages)
    return chunk_text(full_text)


def ingest_images(paths: list[str]):
    """تحويل الصور إلى أوصاف نصية"""
    image_chunks = []
    for p in tqdm(paths, desc="Image captioning"):
        cap = caption_image(p)
        image_chunks.append((p, cap))
    return image_chunks


def save_chunk(conn, source, chunk, modality, emb):
    """حفظ القطعة (chunk) والـ embedding في قاعدة البيانات"""
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO documents (source, chunk, modality, embedding)
            VALUES (%s, %s, %s, %s)
        """, (source, chunk, modality, emb))
    conn.commit()


def main(data_dir="data"):
    """الوظيفة الرئيسية: ingestion للـ PDF والصور"""
    conn = get_conn()

    # البحث عن جميع ملفات PDF والصور في المجلد
    pdfs = glob.glob(os.path.join(data_dir, "*.pdf"))
    imgs = glob.glob(os.path.join(data_dir, "*.png")) + glob.glob(os.path.join(data_dir, "*.jpg"))

    # 📄 معالجة ملفات PDF
    for pdf in tqdm(pdfs, desc="PDF ingestion"):
        for c in ingest_pdf(pdf):
            if c.strip():  # نتجنب النصوص الفارغة
                emb = embed_text(c)
                save_chunk(conn, pdf, c, "text", emb)

    # 🖼️ معالجة الصور
    for img_path, cap in ingest_images(imgs):
        emb = embed_text(cap)
        save_chunk(conn, img_path, cap, "image", emb)

    print("✅ Ingestion terminée avec succès !")
    conn.close()


if __name__ == "__main__":
    main()
