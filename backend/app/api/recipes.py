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
def create_recipe(recipe: schemas.RecipeCreate, db: Session = Depends(get_db)) -> models.Recipe:
    """
    Create a new recipe with the provided data.

    Parameters:
        recipe (schemas.RecipeCreate): The recipe data to create (request body).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Recipe: The created recipe including all fields and relationships.
    """
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
def list_recipes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)) -> list[models.Recipe]:
    """
    Retrieve a list of recipes, paginated by skip and limit.

    Parameters:
        skip (int): Number of records to skip for pagination (query parameter, default 0).
        limit (int): Maximum number of records to return (query parameter, default 100).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        list[models.Recipe]: List of recipes, each including related ingredients (name, quantity, unit).
    """
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


@router.get("/recipes/{recipe_id}/", response_model=schemas.Recipe)
def get_recipe(recipe_id: int, db: Session = Depends(get_db)) -> models.Recipe:
    """
    Retrieve a single recipe by its ID.

    Parameters:
        recipe_id (int): The ID of the recipe to retrieve (path parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Recipe: The recipe with all fields and related ingredients (name, quantity, unit).

    Raises:
        HTTPException: 404 error if the recipe is not found.
    """
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

@router.put("/recipes/{recipe_id}/", response_model=schemas.Recipe)
def update_recipe(recipe_id: int, recipe: schemas.RecipeCreate, db: Session = Depends(get_db)) -> models.Recipe:
    """
    Update an existing recipe by its ID.

    Parameters:
        recipe_id (int): The ID of the recipe to update (path parameter).
        recipe (schemas.RecipeCreate): The new recipe data (request body).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Recipe: The updated recipe including all fields and relationships.

    Raises:
        HTTPException: 404 error if the recipe is not found.
    """
    db_recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not db_recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    
    # Update the recipe fields
    for key, value in recipe.model_dump().items():
        setattr(db_recipe, key, value)
    
    db.commit()
    db.refresh(db_recipe)
    return db_recipe