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

### Auth setup

The project now uses fastapi-users for authentication. Add these environment variables to your `.env` before running the app or migrations:

```
JWT_SECRET=replace_this_with_a_strong_secret
ACCESS_TOKEN_EXPIRE_MINUTES=15
FRONTEND_ORIGIN=http://localhost:5173

# Auth endpoints
The backend exposes these auth endpoints (under `/auth`):

- `POST /auth/register` - register a new user (fastapi-users)
- `POST /auth/login` - login with email (username) and password; returns short-lived access token and sets an httpOnly `refresh_token` cookie
- `POST /auth/refresh` - exchanges refresh cookie for a new access token (and rotates refresh cookie)
- `POST /auth/logout` - clears refresh cookie

Frontend must call the refresh endpoint with `credentials: 'include'` so the browser sends the httpOnly cookie. In `frontend/src/api.ts` our helper uses `credentials: 'include'`.
```

If your `users` table needs new columns (`hashed_password`, `is_active`, `is_superuser`, `is_verified`) create a migration with alembic or run the provided migration template in `alembic/versions/zz_fastapi_users_add_fields.py`.

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
