from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Configuração do banco de dados
# O Render irá definir a variável DATABASE_URL em ambiente de produção
# Para desenvolvimento local, usa o SQLite (cars.db)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cars.db")

# A adaptação principal é remover o argumento 'check_same_thread'
# para bancos de dados que não sejam SQLite.
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()