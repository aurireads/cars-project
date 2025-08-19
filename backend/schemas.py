from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Schemas para Brand
class BrandBase(BaseModel):
    name: str

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Schemas para Model
class ModelBase(BaseModel):
    name: str
    brand_id: int

class ModelCreate(ModelBase):
    pass

class ModelResponse(ModelBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    brand: BrandResponse

    class Config:
        from_attributes = True

# Schemas para Car
class CarBase(BaseModel):
    name: str
    model_id: int
    year: int
    color: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None

class CarCreate(CarBase):
    pass

class CarResponse(CarBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    model: ModelResponse

    class Config:
        from_attributes = True

# Schema especial para o endpoint /cars.json (formato para frontend)
class CarListResponse(BaseModel):
    id: int
    name: str
    brand: str
    model: str
    year: int
    color: Optional[str] = None
    price: Optional[int] = None
    description: Optional[str] = None

    class Config:
        from_attributes = True