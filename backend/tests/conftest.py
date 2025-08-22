import os

import pytest
from app import models  # ty: ignore
from app.api.fridge_items import get_db as get_fridge_db  # ty: ignore
from app.api.ingredients import get_db  # ty: ignore
from app.api.meal_types import get_db as get_meal_type_db  # ty: ignore
from app.api.recipes import get_db as get_recipe_db  # ty: ignore
from app.api.schedule import get_db as get_schedule_db  # ty: ignore
from app.api.shopping_list import get_db as get_shopping_list_db  # ty: ignore
from app.database import SessionLocal  # ty: ignore
from app.main import app  # ty: ignore
from app.users import get_db as get_user_db  # ty: ignore
from app.users import pwd_context  # ty: ignore
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from app.database import SessionLocal, engine


@pytest.fixture(scope="session")
def client():
    """Session-scoped TestClient available to all tests."""
    with TestClient(app) as c:
        yield c

def clear_tables():
    db = SessionLocal()
    model_classes = [
        v
        for v in models.__dict__.values()
        if isinstance(v, type) and hasattr(v, "__table__")
    ]
    model_classes_to_drop = model_classes.copy()
    while model_classes_to_drop:
        model = model_classes_to_drop.pop(0)
        try:
            db.query(model).delete()
            db.commit()
            print(f"Deleted all records from {model.__name__}.")
        except Exception as e:
            print(f"Error deleting {model.__name__}: {e}")
            db.rollback() 
            model_classes_to_drop.append(model)

@pytest.fixture(scope="session", autouse=True)
def cleanup_db():
    # run before tests
    clear_tables()
    yield
    # run after tests
    clear_tables()


def _create_user_in_db(db: Session, email: str = "testuser@example.com", password: str = "secret"):
    # remove existing with same email
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        return existing
    hashed = pwd_context.hash(password)
    user = models.User(email=email, username=email.split("@")[0], hashed_password=hashed, is_active=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture(scope="module")
def db_session():
    # use the testing session factory
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module")
def auth_headers(client: TestClient, db_session: Session):
    """Create a test user and log in, yielding Authorization headers with Bearer token."""
    # ensure user exists in the test DB
    _create_user_in_db(db_session)
    res = client.post("/auth/login", json={"username": "testuser@example.com", "password": "secret"})
    if res.status_code != 200:
        raise RuntimeError(f"Login failed in fixture: {res.status_code} {res.text}")
    body = res.json()
    token = body.get("access_token")
    if not token:
        raise RuntimeError("No access_token returned from login in fixture")

    yield {"Authorization": f"Bearer {token}"}
