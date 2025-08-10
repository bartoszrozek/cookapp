from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class IngredientBase(BaseModel):
    name: str
    category: Optional[str] = None
    default_unit: Optional[str] = None
    calories_per_unit: Optional[float] = None
    is_perishable: Optional[bool] = True
    shelf_life_days: Optional[int] = None

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class RecipeBase(BaseModel):
    name: str
    description: Optional[str] = None
    instructions: Optional[str] = None
    instruction_link: Optional[str] = None
    servings: Optional[int] = None
    prep_time_min: Optional[int] = None
    cook_time_min: Optional[int] = None
    difficulty: Optional[str] = None
    image_url: Optional[str] = None

class RecipeCreate(RecipeBase):
    pass

class Recipe(RecipeBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class RecipeIngredientBase(BaseModel):
    recipe_id: int
    ingredient_id: int
    quantity: float
    unit: str
    optional: Optional[bool] = False

class RecipeIngredientCreate(RecipeIngredientBase):
    pass

class RecipeIngredient(RecipeIngredientBase):
    id: int
    class Config:
        orm_mode = True

class RecipeTagBase(BaseModel):
    recipe_id: int
    tag: str

class RecipeTagCreate(RecipeTagBase):
    pass

class RecipeTag(RecipeTagBase):
    id: int
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class FridgeItemBase(BaseModel):
    user_id: int
    ingredient_id: int
    quantity: float
    unit: str
    expiration_date: Optional[date] = None

class FridgeItemCreate(FridgeItemBase):
    pass

class FridgeItem(FridgeItemBase):
    id: int
    added_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class FridgeNamedItem(FridgeItem):
    name: str

class FridgeLogBase(BaseModel):
    user_id: int
    ingredient_id: int
    change_amount: float
    action_type: str

class FridgeLogCreate(FridgeLogBase):
    pass

class FridgeLog(FridgeLogBase):
    id: int
    timestamp: datetime
    class Config:
        orm_mode = True

class ScheduleBase(BaseModel):
    recipe_id: int
    user_id: int
    date: date
    meal_type: int

class ScheduleCreate(ScheduleBase):
    pass

class Schedule(ScheduleBase):
    id: int
    class Config:
        orm_mode = True

class MealTypeBase(BaseModel):
    name: str

class MealTypeCreate(MealTypeBase):
    pass

class MealType(MealTypeBase):
    id: int
    class Config:
        orm_mode = True
