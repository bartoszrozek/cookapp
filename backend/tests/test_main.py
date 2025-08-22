import os
import sys

import pytest
from app import models # ty: ignore
from app.database import TEST_DATABASE_URL, SessionLocal # ty: ignore
from app.main import app # ty: ignore
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

module_path = os.path.abspath(os.path.join(".."))
if module_path not in sys.path:
    sys.path.append(module_path)

if not TEST_DATABASE_URL:
    raise Exception(
        "TEST_DATABASE_URL is not set. Please configure your test database URL."
    )

# Use a separate test database
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

app.dependency_overrides[SessionLocal] = TestingSessionLocal

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

# Example test: check root endpoint
def test_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200

def clear_tables():
    db = TestingSessionLocal()
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


clear_tables()