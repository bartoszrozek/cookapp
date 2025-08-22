import pytest
from app import models  # ty: ignore
from app.api.ingredients import get_db  # ty: ignore
from app.api.meal_types import get_db as get_meal_type_db  # ty: ignore
from app.api.recipes import get_db as get_recipe_db  # ty: ignore
from app.api.schedule import get_db as get_schedule_db  # ty: ignore
from app.database import TEST_DATABASE_URL, Base, SessionLocal  # ty: ignore
from app.main import app  # ty: ignore
from app.users import get_db as get_user_db  # ty: ignore
from app.users import pwd_context  # ty: ignore
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

# Setup test database engine and session factory using TEST_DATABASE_URL
if not TEST_DATABASE_URL:
    raise Exception("TEST_DATABASE_URL is not set. Please configure your test database URL for tests.")

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# create tables in test DB
Base.metadata.create_all(bind=engine)

# override app SessionLocal to use the testing session
app.dependency_overrides[SessionLocal] = TestingSessionLocal


def db_session_func():
    # use the testing session factory
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = db_session_func
app.dependency_overrides[get_recipe_db] = db_session_func
app.dependency_overrides[get_schedule_db] = db_session_func
app.dependency_overrides[get_user_db] = db_session_func
app.dependency_overrides[get_meal_type_db] = db_session_func


@pytest.fixture(scope="session")
def client():
    """Session-scoped TestClient available to all tests."""
    with TestClient(app) as c:
        yield c



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
    db = TestingSessionLocal()
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
