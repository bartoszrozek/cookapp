from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from . import users

from . import models
from .api import fridge_items, ingredients, meal_types, recipes, schedule, shopping_list
from .database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(ingredients.router)
app.include_router(recipes.router)
app.include_router(fridge_items.router)
app.include_router(meal_types.router)
app.include_router(schedule.router)
app.include_router(shopping_list.router)

# FastAPI Users routers (auth, register, users management)
app.include_router(users.router, prefix="/auth", tags=["auth"])
app.include_router(
    users.fastapi_users.get_register_router(users.UserCreate, users.UserDB),
    prefix="/auth",
    tags=["auth"],
)
app.include_router(
    users.fastapi_users.get_users_router(users.UserDB, users.UserRead),
    prefix="/users",
    tags=["users"],
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to CookApp API!"}

if __name__ == "__main__":
    from .database import SessionLocal
    db = SessionLocal()
    db.close()
