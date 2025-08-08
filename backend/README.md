# CookApp Backend

This is a FastAPI backend for a cooking and recipe management application. It uses PostgreSQL as the database and Uvicorn as the ASGI server.

## Features
- Store and manage recipes
- Manage ingredients and fridge inventory
- Track fridge logs and recipe tags

## Tech Stack
- Python 3.11+
- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic (migrations)
- Uvicorn

## Setup Instructions

### 1. Clone the repository
```
git clone <your-repo-url>
cd cookapp/backend
```

### 2. Create and activate a virtual environment
```
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies
```
pip install -r requirements.txt
```

### 4. Configure PostgreSQL
- Ensure PostgreSQL is running.
- Create a database (e.g., `cookapp_db`).
- Set your database URL in the `.env` file:

```
DATABASE_URL=postgresql+psycopg2://<user>:<password>@localhost:5432/cookapp_db
```

### 5. Run database migrations
```
alembic upgrade head
```

### 6. Start the server
```
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

## Project Structure
- `app/` - Main application code
- `app/models.py` - SQLAlchemy models
- `app/schemas.py` - Pydantic schemas
- `app/database.py` - Database connection
- `app/main.py` - FastAPI app entrypoint
- `alembic/` - Database migrations

## Development
- Use Alembic for migrations: `alembic revision --autogenerate -m "message"`
- TODO: Run tests (if available): `pytest`

## License
MIT
