import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, SessionLocal, TEST_DATABASE_URL

if not TEST_DATABASE_URL:
    raise Exception("TEST_DATABASE_URL is not set. Please configure your test database URL.")

# Use a separate test database
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all tables for the test DB
Base.metadata.create_all(bind=engine)

app.dependency_overrides[SessionLocal] = TestingSessionLocal

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

# Example test: check root endpoint

def test_root(client):
    response = client.get("/")
    assert response.status_code == 200

# Add more tests for your API endpoints as needed
