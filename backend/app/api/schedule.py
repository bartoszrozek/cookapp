from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import SessionLocal
from ..users import current_active_user
from ..schemas import User as UserSchema
from typing import Optional
from datetime import date

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/schedule/", response_model=schemas.Schedule)
def create_schedule(
    schedule: schemas.ScheduleCreate,
    db: Session = Depends(get_db),
    current_user: UserSchema = Depends(current_active_user),
) -> models.Schedule:
    """
    Create a new schedule entry with the provided data.

    Parameters:
        schedule (schemas.ScheduleCreate): The schedule data to create (request body).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Schedule: The created schedule entry.
    """
    data = schedule.model_dump()
    data["user_id"] = current_user.id
    db_schedule = models.Schedule(**data)
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.get("/schedule/", response_model=list[schemas.ScheduleGet])
def list_schedule(
    skip: int = 0,
    limit: int = 100,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: UserSchema = Depends(current_active_user),
) -> list[schemas.ScheduleGet]:
    """
    Retrieve a list of schedule entries, optionally filtered by date range, paginated by skip and limit.

    Parameters:
        skip (int): Number of records to skip for pagination (query parameter, default 0).
        limit (int): Maximum number of records to return (query parameter, default 100).
        start_date (Optional[date]): Filter for schedules on or after this date (query parameter).
        end_date (Optional[date]): Filter for schedules on or before this date (query parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        list[schemas.ScheduleGet]: List of schedule entries with recipe names.
    """
    query = db.query(models.Schedule, models.Recipe.name.label("recipe_name")).join(
        models.Recipe, models.Schedule.recipe_id == models.Recipe.id
    )
    query = query.filter(models.Schedule.user_id == current_user.id)
    if start_date:
        query = query.filter(models.Schedule.date >= start_date)
    if end_date:
        query = query.filter(models.Schedule.date <= end_date)
    results = query.offset(skip).limit(limit).all()
    # Merge recipe_name into the Schedule object for response
    schedules: list[schemas.ScheduleGet] = []
    for schedule, recipe_name in results:
        schedule_dict = schedule.__dict__.copy()
        schedule_dict["recipe_name"] = recipe_name
        schedules.append(schedule_dict)
    return schedules

@router.get("/schedule/{schedule_id}", response_model=schemas.Schedule)
def get_schedule(schedule_id: int, db: Session = Depends(get_db)) -> models.Schedule:
    """
    Retrieve a single schedule entry by its ID.

    Parameters:
        schedule_id (int): The ID of the schedule entry to retrieve (path parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Schedule: The schedule entry with all fields.

    Raises:
        HTTPException: 404 error if the schedule entry is not found.
    """
    schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule

@router.put("/schedule/{schedule_id}", response_model=schemas.Schedule)
def update_schedule(schedule_id: int, schedule_update: schemas.ScheduleCreate, db: Session = Depends(get_db)) -> models.Schedule:
    """
    Update an existing schedule entry by its ID.

    Parameters:
        schedule_id (int): The ID of the schedule entry to update (path parameter).
        schedule_update (schemas.ScheduleCreate): The new schedule data (request body).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Schedule: The updated schedule entry.

    Raises:
        HTTPException: 404 error if the schedule entry is not found.
    """
    schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    for key, value in schedule_update.model_dump().items():
        setattr(schedule, key, value)
    db.commit()
    db.refresh(schedule)
    return schedule

@router.delete("/schedule/{schedule_id}", response_model=schemas.Schedule)
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)) -> models.Schedule:
    """
    Delete a schedule entry by its ID.

    Parameters:
        schedule_id (int): The ID of the schedule entry to delete (path parameter).
        db (Session): SQLAlchemy database session (provided by dependency injection).

    Returns:
        models.Schedule: The deleted schedule entry.

    Raises:
        HTTPException: 404 error if the schedule entry is not found.
    """
    schedule = db.query(models.Schedule).filter(models.Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(schedule)
    db.commit()
    return schedule

