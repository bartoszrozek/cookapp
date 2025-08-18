from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
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
