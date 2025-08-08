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


@router.post("/fridge_items/", response_model=schemas.FridgeItem)
def create_fridge_item(item: schemas.FridgeItemCreate, db: Session = Depends(get_db)):
    db_item = models.FridgeItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.get("/fridge_items/", response_model=list[schemas.FridgeNamedItem])
def list_fridge_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    results = (
        db.query(
            models.FridgeItem,
            models.Ingredient.name.label("name"),
        )
        .join(
            models.Ingredient, models.FridgeItem.ingredient_id == models.Ingredient.id
        )
        .offset(skip)
        .limit(limit)
        .all()
    )

    response = [
        {
            **{
                field: getattr(fridge_item, field)
                for field in schemas.FridgeNamedItem.model_fields
                if field != "name"
            },
            "name": name,
        }
        for fridge_item, name in results
    ]
    return response


@router.get("/fridge_items/{item_id}", response_model=schemas.FridgeItem)
def get_fridge_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.FridgeItem).filter(models.FridgeItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Fridge item not found")
    return item
