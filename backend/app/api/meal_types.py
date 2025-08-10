from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/meal_types/", response_model=schemas.MealType)
def create_meal_type(meal_type: schemas.MealTypeCreate, db: Session = Depends(get_db)):
    db_meal_type = models.MealType(**meal_type.model_dump())
    db.add(db_meal_type)
    db.commit()
    db.refresh(db_meal_type)
    return db_meal_type

@router.get("/meal_types/", response_model=list[schemas.MealType])
def list_meal_types(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return db.query(models.MealType).offset(skip).limit(limit).all()

@router.get("/meal_types/{meal_type_id}", response_model=schemas.MealType)
def get_meal_type(meal_type_id: int, db: Session = Depends(get_db)):
    meal_type = db.query(models.MealType).filter(models.MealType.id == meal_type_id).first()
    if not meal_type:
        raise HTTPException(status_code=404, detail="Meal type not found")
    return meal_type

@router.put("/meal_types/{meal_type_id}", response_model=schemas.MealType)
def update_meal_type(meal_type_id: int, meal_type: schemas.MealTypeCreate, db: Session = Depends(get_db)):
    db_meal_type = db.query(models.MealType).filter(models.MealType.id == meal_type_id).first()
    if not db_meal_type:
        raise HTTPException(status_code=404, detail="Meal type not found")
    for key, value in meal_type.model_dump().items():
        setattr(db_meal_type, key, value)
    db.commit()
    db.refresh(db_meal_type)
    return db_meal_type

@router.delete("/meal_types/{meal_type_id}", response_model=schemas.MealType)
def delete_meal_type(meal_type_id: int, db: Session = Depends(get_db)):
    db_meal_type = db.query(models.MealType).filter(models.MealType.id == meal_type_id).first()
    if not db_meal_type:
        raise HTTPException(status_code=404, detail="Meal type not found")
    db.delete(db_meal_type)
    db.commit()
    return db_meal_type