from sqlalchemy.orm import Session, joinedload
from models import Brand, Model, Car
from schemas import BrandCreate, ModelCreate, CarCreate, CarListResponse
from typing import List

# CRUD para Brand
def get_brand(db: Session, brand_id: int):
    return db.query(Brand).filter(Brand.id == brand_id).first()

def get_brand_by_name(db: Session, name: str):
    return db.query(Brand).filter(Brand.name == name).first()

def get_brands(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Brand).offset(skip).limit(limit).all()

def create_brand(db: Session, brand: BrandCreate):
    db_brand = Brand(name=brand.name)
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    return db_brand

def update_brand(db: Session, brand_id: int, brand: BrandCreate):
    db_brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if db_brand:
        db_brand.name = brand.name
        db.commit()
        db.refresh(db_brand)
    return db_brand

def delete_brand(db: Session, brand_id: int):
    db_brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if db_brand:
        db.delete(db_brand)
        db.commit()
        return True
    return False

# CRUD para Model
def get_model(db: Session, model_id: int):
    return db.query(Model).options(joinedload(Model.brand)).filter(Model.id == model_id).first()

def get_models(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Model).options(joinedload(Model.brand)).offset(skip).limit(limit).all()

def create_model(db: Session, model: ModelCreate):
    db_model = Model(name=model.name, brand_id=model.brand_id)
    db.add(db_model)
    db.commit()
    db.refresh(db_model)
    # Recarregar com o relacionamento
    return db.query(Model).options(joinedload(Model.brand)).filter(Model.id == db_model.id).first()

def update_model(db: Session, model_id: int, model: ModelCreate):
    db_model = db.query(Model).filter(Model.id == model_id).first()
    if db_model:
        db_model.name = model.name
        db_model.brand_id = model.brand_id
        db.commit()
        db.refresh(db_model)
        # Recarregar com o relacionamento
        return db.query(Model).options(joinedload(Model.brand)).filter(Model.id == db_model.id).first()
    return None

def delete_model(db: Session, model_id: int):
    db_model = db.query(Model).filter(Model.id == model_id).first()
    if db_model:
        db.delete(db_model)
        db.commit()
        return True
    return False

# CRUD para Car
def get_car(db: Session, car_id: int):
    return db.query(Car).options(
        joinedload(Car.model).joinedload(Model.brand)
    ).filter(Car.id == car_id).first()

def get_cars(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Car).options(
        joinedload(Car.model).joinedload(Model.brand)
    ).offset(skip).limit(limit).all()

def create_car(db: Session, car: CarCreate):
    db_car = Car(**car.dict())
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    # Recarregar com os relacionamentos
    return db.query(Car).options(
        joinedload(Car.model).joinedload(Model.brand)
    ).filter(Car.id == db_car.id).first()

def update_car(db: Session, car_id: int, car: CarCreate):
    db_car = db.query(Car).filter(Car.id == car_id).first()
    if db_car:
        for field, value in car.dict().items():
            setattr(db_car, field, value)
        db.commit()
        db.refresh(db_car)
        # Recarregar com os relacionamentos
        return db.query(Car).options(
            joinedload(Car.model).joinedload(Model.brand)
        ).filter(Car.id == db_car.id).first()
    return None

def delete_car(db: Session, car_id: int):
    db_car = db.query(Car).filter(Car.id == car_id).first()
    if db_car:
        db.delete(db_car)
        db.commit()
        return True
    return False

# Função especial para o endpoint /cars.json
def get_cars_formatted(db: Session) -> List[CarListResponse]:
    """
    Retorna os carros no formato específico solicitado para o frontend
    """
    cars = db.query(Car).options(
        joinedload(Car.model).joinedload(Model.brand)
    ).all()
    
    formatted_cars = []
    for car in cars:
        formatted_cars.append(CarListResponse(
            id=car.id,
            name=car.name,
            brand=car.model.brand.name,
            model=car.model.name,
            year=car.year,
            color=car.color,
            price=car.price,
            description=car.description
        ))
    
    return formatted_cars