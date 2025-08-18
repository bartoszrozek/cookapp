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
    """
    Create a new fridge item with the provided data.

    Parameters:
        fridge_item (schemas.FridgeItemCreate): The fridge item data to create (request body).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.FridgeItem: The created fridge item.
    """
    db_item = models.FridgeItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


@router.get("/fridge_items/", response_model=list[schemas.FridgeNamedItem])
def list_fridge_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of fridge items, paginated by skip and limit.

    Parameters:
        skip (int): Number of records to skip for pagination (query parameter, default 0).
        limit (int): Maximum number of records to return (query parameter, default 100).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        list[models.FridgeItem]: List of fridge items.
    """
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
    """
    Retrieve a single fridge item by its ID.

    Parameters:
        fridge_item_id (int): The ID of the fridge item to retrieve (path parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.FridgeItem: The fridge item with all fields.

    Raises:
        HTTPException: 404 error if the fridge item is not found.
    """
    item = db.query(models.FridgeItem).filter(models.FridgeItem.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Fridge item not found")
    return item


@router.delete("/fridge_items/{fridge_item_id}", response_model=schemas.FridgeItem)
def delete_fridge_item(
    fridge_item_id: int, db: Session = Depends(get_db)
) -> models.FridgeItem:
    """
    Delete a fridge item by its ID.

    Parameters:
        fridge_item_id (int): The ID of the fridge item to delete (path parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.FridgeItem: The deleted fridge item.

    Raises:
        HTTPException: 404 error if the fridge item is not found.
    """
    fridge_item = (
        db.query(models.FridgeItem)
        .filter(models.FridgeItem.id == fridge_item_id)
        .first()
    )
    if not fridge_item:
        raise HTTPException(status_code=404, detail="Fridge item not found")
    db.delete(fridge_item)
    db.commit()
    return fridge_item


@router.put("/fridge_items/{fridge_item_id}", response_model=schemas.FridgeItem)
def update_fridge_item(
    fridge_item_id: int,
    fridge_item: schemas.FridgeItemCreate,
    db: Session = Depends(get_db),
) -> models.FridgeItem:
    """
    Update an existing fridge item by its ID.

    Parameters:
        fridge_item_id (int): The ID of the fridge item to update (path parameter).
        fridge_item (schemas.FridgeItemCreate): The new fridge item data (request body).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.FridgeItem: The updated fridge item.

    Raises:
        HTTPException: 404 error if the fridge item is not found.
    """
    db_fridge_item = (
        db.query(models.FridgeItem)
        .filter(models.FridgeItem.id == fridge_item_id)
        .first()
    )
    if not db_fridge_item:
        raise HTTPException(status_code=404, detail="Fridge item not found")

    # Update the fridge item fields
    for key, value in fridge_item.model_dump().items():
        setattr(db_fridge_item, key, value)

    db.commit()
    db.refresh(db_fridge_item)
    return db_fridge_item
