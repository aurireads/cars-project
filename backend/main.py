from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from database import SessionLocal, engine
from models import Base, Brand, Model, Car
from schemas import (
    BrandCreate, BrandResponse,
    ModelCreate, ModelResponse, 
    CarCreate, CarResponse,
    CarListResponse
)
import crud

# Criar as tabelas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WS Work Cars API",
    description="API para gerenciamento de carros, marcas e modelos",
    version="1.0.0"
)

# Configuração CORS para permitir frontend em outro domínio
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar domínios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency para sessão do banco
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint principal: listagem formatada para o frontend
@app.get("/cars.json", response_model=List[CarListResponse])
def get_cars_formatted(db: Session = Depends(get_db)):
    """
    Endpoint principal que retorna a listagem de carros formatada
    para consumo do frontend, conforme especificação.
    """
    return crud.get_cars_formatted(db)

# CRUD Endpoints para Marcas (Brands)
@app.post("/brands", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand(brand: BrandCreate, db: Session = Depends(get_db)):
    """Criar nova marca"""
    db_brand = crud.get_brand_by_name(db, name=brand.name)
    if db_brand:
        raise HTTPException(status_code=400, detail="Marca já existe")
    return crud.create_brand(db=db, brand=brand)

@app.get("/brands", response_model=List[BrandResponse])
def read_brands(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todas as marcas"""
    return crud.get_brands(db, skip=skip, limit=limit)

@app.get("/brands/{brand_id}", response_model=BrandResponse)
def read_brand(brand_id: int, db: Session = Depends(get_db)):
    """Obter marca por ID"""
    db_brand = crud.get_brand(db, brand_id=brand_id)
    if db_brand is None:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    return db_brand

@app.put("/brands/{brand_id}", response_model=BrandResponse)
def update_brand(brand_id: int, brand: BrandCreate, db: Session = Depends(get_db)):
    """Atualizar marca"""
    db_brand = crud.update_brand(db, brand_id=brand_id, brand=brand)
    if db_brand is None:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    return db_brand

@app.delete("/brands/{brand_id}")
def delete_brand(brand_id: int, db: Session = Depends(get_db)):
    """Deletar marca"""
    success = crud.delete_brand(db, brand_id=brand_id)
    if not success:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    return {"message": "Marca deletada com sucesso"}

# CRUD Endpoints para Modelos (Models)
@app.post("/models", response_model=ModelResponse, status_code=status.HTTP_201_CREATED)
def create_model(model: ModelCreate, db: Session = Depends(get_db)):
    """Criar novo modelo"""
    # Verificar se a marca existe
    brand = crud.get_brand(db, brand_id=model.brand_id)
    if not brand:
        raise HTTPException(status_code=400, detail="Marca não encontrada")
    
    return crud.create_model(db=db, model=model)

@app.get("/models", response_model=List[ModelResponse])
def read_models(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todos os modelos"""
    return crud.get_models(db, skip=skip, limit=limit)

@app.get("/models/{model_id}", response_model=ModelResponse)
def read_model(model_id: int, db: Session = Depends(get_db)):
    """Obter modelo por ID"""
    db_model = crud.get_model(db, model_id=model_id)
    if db_model is None:
        raise HTTPException(status_code=404, detail="Modelo não encontrado")
    return db_model

@app.put("/models/{model_id}", response_model=ModelResponse)
def update_model(model_id: int, model: ModelCreate, db: Session = Depends(get_db)):
    """Atualizar modelo"""
    db_model = crud.update_model(db, model_id=model_id, model=model)
    if db_model is None:
        raise HTTPException(status_code=404, detail="Modelo não encontrado")
    return db_model

@app.delete("/models/{model_id}")
def delete_model(model_id: int, db: Session = Depends(get_db)):
    """Deletar modelo"""
    success = crud.delete_model(db, model_id=model_id)
    if not success:
        raise HTTPException(status_code=404, detail="Modelo não encontrado")
    return {"message": "Modelo deletado com sucesso"}

# CRUD Endpoints para Carros (Cars)
@app.post("/cars", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
def create_car(car: CarCreate, db: Session = Depends(get_db)):
    """Criar novo carro"""
    # Verificar se o modelo existe
    model = crud.get_model(db, model_id=car.model_id)
    if not model:
        raise HTTPException(status_code=400, detail="Modelo não encontrado")
    
    return crud.create_car(db=db, car=car)

@app.get("/cars", response_model=List[CarResponse])
def read_cars(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Listar todos os carros"""
    return crud.get_cars(db, skip=skip, limit=limit)

@app.get("/cars/{car_id}", response_model=CarResponse)
def read_car(car_id: int, db: Session = Depends(get_db)):
    """Obter carro por ID"""
    db_car = crud.get_car(db, car_id=car_id)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Carro não encontrado")
    return db_car

@app.put("/cars/{car_id}", response_model=CarResponse)
def update_car(car_id: int, car: CarCreate, db: Session = Depends(get_db)):
    """Atualizar carro"""
    db_car = crud.update_car(db, car_id=car_id, car=car)
    if db_car is None:
        raise HTTPException(status_code=404, detail="Carro não encontrado")
    return db_car

@app.delete("/cars/{car_id}")
def delete_car(car_id: int, db: Session = Depends(get_db)):
    """Deletar carro"""
    success = crud.delete_car(db, car_id=car_id)
    if not success:
        raise HTTPException(status_code=404, detail="Carro não encontrado")
    return {"message": "Carro deletado com sucesso"}

@app.get("/")
def read_root():
    """Endpoint de teste"""
    return {"message": "WS Work Cars API funcionando!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)