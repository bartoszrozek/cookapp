from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas
from ..database import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/recipes/", response_model=schemas.Recipe)
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)):
    breakpoint()
    recipe_dict = recipe.model_dump()
    # TODO: Handle adding ingredients to ingredient-recipe table
    ingredients = recipe_dict.pop("ingredients", None)
    ingredients = [
        schemas.IngredientInRecipe(**ing.model_dump()) for ing in ingredients
    ]
    db_recipe = models.Recipe(**recipe_dict)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe


@router.get("/recipes/", response_model=list[schemas.Recipe])
def list_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    recipes = (
        db.query(models.Recipe)
        .options(
            joinedload(models.Recipe.recipe_ingredients).joinedload(
                models.RecipeIngredient.ingredient
            )
        )
        .offset(skip)
        .limit(limit)
        .all()
    )
    return recipes


@router.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = (
        db.query(models.Recipe)
        .options(
            joinedload(models.Recipe.recipe_ingredients).joinedload(
                models.RecipeIngredient.ingredient
            )
        )
        .filter(models.Recipe.id == recipe_id)
        .first()
    )
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe
