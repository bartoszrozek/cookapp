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

@router.post("/ingredients/", response_model=schemas.Ingredient)
def create_ingredient(ingredient: schemas.IngredientCreate, db: Session = Depends(get_db)) -> models.Ingredient:
    """
    Create a new ingredient with the provided data.

    Parameters:
        ingredient (schemas.IngredientCreate): The ingredient data to create (request body).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Ingredient: The created ingredient including all fields.
    """
    db_ingredient = models.Ingredient(**ingredient.model_dump())
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

@router.get("/ingredients/", response_model=list[schemas.Ingredient])
def list_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> list[models.Ingredient]:
    """
    Retrieve a list of ingredients, paginated by skip and limit.

    Parameters:
        skip (int): Number of records to skip for pagination (query parameter, default 0).
        limit (int): Maximum number of records to return (query parameter, default 100).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        list[models.Ingredient]: List of ingredients.
    """
    return db.query(models.Ingredient).offset(skip).limit(limit).all()

@router.get("/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)) -> models.Ingredient:
    """
    Retrieve a single ingredient by its ID.

    Parameters:
        ingredient_id (int): The ID of the ingredient to retrieve (path parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Ingredient: The ingredient with all fields.

    Raises:
        HTTPException: 404 error if the ingredient is not found.
    """
    ingredient = db.query(models.Ingredient).filter(models.Ingredient.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ingredient

@router.delete("/ingredients/{ingredient_id}", response_model=schemas.Ingredient)
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)) -> models.Ingredient:
    """
    Delete an ingredient by its ID.

    Parameters:
        ingredient_id (int): The ID of the ingredient to delete (path parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Ingredient: The deleted ingredient.

    Raises:
        HTTPException: 404 error if the ingredient is not found.
    """
    ingredient = db.query(models.Ingredient).filter(models.Ingredient.id == ingredient_id).first()
    if not ingredient:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    db.delete(ingredient)
    db.commit()
    return ingredient