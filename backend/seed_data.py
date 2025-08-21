from database import SessionLocal
from models import Brand, Model, Car

def seed_database():
    db = SessionLocal()
    
    try:
        # Verificar se já existem dados
        if db.query(Brand).count() > 0:
            print("Banco já possui dados!")
            return
        
        # Criar marcas
        toyota = Brand(name="Toyota")
        honda = Brand(name="Honda") 
        ford = Brand(name="Ford")
        volkswagen = Brand(name="Volkswagen")
        
        db.add_all([toyota, honda, ford, volkswagen])
        db.commit()
        
        # Criar modelos
        corolla = Model(name="Corolla", brand_id=toyota.id)
        camry = Model(name="Camry", brand_id=toyota.id)
        civic = Model(name="Civic", brand_id=honda.id)
        accord = Model(name="Accord", brand_id=honda.id)
        focus = Model(name="Focus", brand_id=ford.id)
        mustang = Model(name="Mustang", brand_id=ford.id)
        golf = Model(name="Golf", brand_id=volkswagen.id)
        jetta = Model(name="Jetta", brand_id=volkswagen.id)
        
        db.add_all([corolla, camry, civic, accord, focus, mustang, golf, jetta])
        db.commit()
        
        # Criar alguns carros de exemplo
        cars = [
            Car(name="Corolla XEI", model_id=corolla.id, year=2023, color="Branco", price=950000, description="Sedan confortável"),
            Car(name="Corolla GLI", model_id=corolla.id, year=2022, color="Prata", price=8500000, description="Versão intermediária"),
            Car(name="Civic Sport", model_id=civic.id, year=2023, color="Preto", price=1200000, description="Esportivo e elegante"),
            Car(name="Focus Titanium", model_id=focus.id, year=2021, color="Azul", price=750000, description="Compacto premium"),
            Car(name="Golf GTI", model_id=golf.id, year=2023, color="Vermelho", price=1500000, description="Hot hatch alemão"),
        ]
        
        db.add_all(cars)
        db.commit()
        
        print("Dados de exemplo inseridos com sucesso!")
        
    except Exception as e:
        print(f"Erro ao inserir dados: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()