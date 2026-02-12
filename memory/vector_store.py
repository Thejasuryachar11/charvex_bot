from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()

def store_memory(texts):
    db = FAISS.from_texts(texts, embeddings)
    db.save_local("memory_store")
