from datetime import date
from typing import Optional

import sqlalchemy as sa
from fastapi import APIRouter, Depends
from sqlalchemy import and_, func
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


@router.get("/shopping_list/", response_model=list[schemas.ShoppingListItem])
def list_shopping_list(
    start_date: date,
    end_date: date,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[schemas.ShoppingListItem]:
    """
    Retrieve a list of shopping list items, optionally filtered by date range, paginated by skip and limit.

    Parameters:
        skip (int): Number of records to skip for pagination (query parameter, default 0).
        limit (int): Maximum number of records to return (query parameter, default 100).
        start_date (Optional[date]): Filter for items on or after this date (query parameter).
        end_date (Optional[date]): Filter for items on or before this date (query parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        list[schemas.ShoppingListItem]: List of shopping list items.
    """

    # Get all ingredients needed for scheduled recipes in the given period
    stmt = (
        sa.select(
            models.Ingredient.id,
            models.Ingredient.name.label("ingredient_name"),
            func.sum(
                models.RecipeIngredient.quantity
                - func.coalesce(models.FridgeItem.quantity, 0)
            ).label("quantity"),
            models.RecipeIngredient.unit,
        )
        .select_from(models.Schedule)
        .join(models.Recipe, models.Schedule.recipe_id == models.Recipe.id)
        .join(
            models.RecipeIngredient,
            models.Recipe.id == models.RecipeIngredient.recipe_id,
        )
        .join(
            models.Ingredient,
            models.RecipeIngredient.ingredient_id == models.Ingredient.id,
        )
        .outerjoin(
            models.FridgeItem,
            and_(
                models.RecipeIngredient.ingredient_id
                == models.FridgeItem.ingredient_id,
                models.RecipeIngredient.unit == models.FridgeItem.unit,
                models.FridgeItem.expiration_date > start_date,
            ),
        )
        .group_by(
            models.Ingredient.id, models.Ingredient.name, models.RecipeIngredient.unit
        )
    )
    if start_date:
        stmt = stmt.where(models.Schedule.date >= start_date)
    if end_date:
        stmt = stmt.where(models.Schedule.date <= end_date)

    return db.execute(stmt).all()  # type: ignore
