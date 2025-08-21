import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Configuração do banco de dados
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Produção (Railway) - PostgreSQL
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    
    # Configurações para produção
    engine_kwargs = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
        "pool_timeout": 20,
        "max_overflow": 0,
        "echo": False
    }
else:
    # Desenvolvimento local - SQLite
    DATABASE_URL = "sqlite:///./cars.db"
    engine_kwargs = {
        "connect_args": {"check_same_thread": False},
        "echo": True
    }

print(f"🔗 Conectando ao banco: {DATABASE_URL.split('@')[0] if '@' in DATABASE_URL else DATABASE_URL}")

engine = create_engine(DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()