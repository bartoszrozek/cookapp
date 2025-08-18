from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date as datatime_date

class IngredientBase(BaseModel):
    """
    Base schema for Ingredient.
    """
    name: str = Field(..., description="Name of the ingredient.")
    category: Optional[str] = Field(None, description="Category of the ingredient.")
    default_unit: Optional[str] = Field(None, description="Default unit of measurement.")
    calories_per_unit: Optional[float] = Field(None, description="Calories per unit of the ingredient.")
    is_perishable: Optional[bool] = Field(True, description="Indicates if the ingredient is perishable.")
    shelf_life_days: Optional[int] = Field(None, description="Shelf life of the ingredient in days.")

class IngredientCreate(IngredientBase):
    """
    Schema for creating an Ingredient.
    Inherits all fields from IngredientBase.
    """
    pass

class Ingredient(IngredientBase):
    """
    Schema for reading an Ingredient from the database.
    Inherits all fields from IngredientBase and adds id, created_at, and updated_at.
    """
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class IngredientShort(BaseModel):
    """
    Short schema for Ingredient, used in RecipeIngredient.
    """
    id: int = Field(..., description="ID of the ingredient.")
    name: str = Field(..., description="Name of the ingredient.")
    class Config:
        orm_mode = True

class ShoppingListItem(BaseModel):
    """
    Schema for Shopping Ingredient, used in shopping list.
    Inherits all fields from IngredientShort and adds quantity and unit.
    """
    id: int = Field(..., description="ID of the ingredient.")
    ingredient_name: str = Field(..., description="Name of the ingredient.")
    quantity: float = Field(..., description="Quantity of the ingredient.")
    unit: str = Field(..., description="Unit of measurement.")
    
    class Config:
        orm_mode = True

class RecipeIngredientBase(BaseModel):
    """
    Base schema for RecipeIngredient association.
    """
    recipe_id: int = Field(..., description="ID of the recipe.")
    ingredient_id: int = Field(..., description="ID of the ingredient.")
    quantity: float = Field(..., description="Quantity of the ingredient.")
    unit: str = Field(..., description="Unit of measurement.")
    optional: Optional[bool] = Field(False, description="Indicates if the ingredient is optional.")

class RecipeIngredientCreate(RecipeIngredientBase):
    """
    Schema for creating a RecipeIngredient association.
    Inherits all fields from RecipeIngredientBase.
    """
    pass

class RecipeIngredient(RecipeIngredientBase):
    """
    Schema for reading a RecipeIngredient association from the database.
    Inherits all fields from RecipeIngredientBase and adds id and ingredient details.
    """
    id: int
    ingredient: IngredientShort
    class Config:
        orm_mode = True

class RecipeBase(BaseModel):
    """
    Base schema for Recipe.
    """
    name: str = Field(..., description="Name of the recipe.")
    description: Optional[str] = Field(None, description="Description of the recipe.")
    instructions: Optional[str] = Field(None, description="Cooking instructions.")
    instruction_link: Optional[str] = Field(None, description="Optional link to recipe instructions.")
    servings: Optional[int] = Field(None, description="Number of servings.")
    prep_time_min: Optional[int] = Field(None, description="Preparation time in minutes.")
    cook_time_min: Optional[int] = Field(None, description="Cooking time in minutes.")
    difficulty: Optional[str] = Field(None, description="Difficulty level of the recipe.")
    image_url: Optional[str] = Field(None, description="URL of the recipe image.")

class IngredientInRecipe(BaseModel):
    """
    Schema for Ingredient in the context of a Recipe.
    """
    name: str = Field(..., description="Name of the ingredient.")
    quantity: float = Field(..., description="Quantity of the ingredient.")
    unit: str = Field(..., description="Unit of measurement.")

class RecipeCreate(RecipeBase):
    """
    Schema for creating a Recipe.
    Inherits all fields from RecipeBase and adds ingredients.
    """
    ingredients: list[IngredientInRecipe] = Field(..., description="List of ingredients for the recipe.")

class Recipe(RecipeBase):
    """
    Schema for reading a Recipe from the database.
    Inherits all fields from RecipeBase and adds id, created_at, updated_at, and recipe_ingredients.
    """
    id: int
    created_at: datetime
    updated_at: datetime
    recipe_ingredients: list[RecipeIngredient] = []
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    """
    Base schema for User.
    """
    username: str = Field(..., description="Username of the user.")
    email: str = Field(..., description="Email address of the user.")

class UserCreate(UserBase):
    """
    Schema for creating a User.
    Inherits all fields from UserBase and adds password.
    """
    password: str = Field(..., description="Password for the user.")

class User(UserBase):
    """
    Schema for reading a User from the database.
    Inherits all fields from UserBase and adds id, created_at.
    """
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class FridgeItemBase(BaseModel):
    """
    Base schema for FridgeItem.
    """
    user_id: int = Field(..., description="ID of the user.")
    ingredient_id: int = Field(..., description="ID of the ingredient.")
    quantity: float = Field(..., description="Quantity of the ingredient.")
    unit: str = Field(..., description="Unit of measurement.")
    expiration_date: Optional[datatime_date] = Field(None, description="Expiration date of the item.")

class FridgeItemCreate(FridgeItemBase):
    """
    Schema for creating a FridgeItem.
    Inherits all fields from FridgeItemBase.
    """
    pass

class FridgeItem(FridgeItemBase):
    """
    Schema for reading a FridgeItem from the database.
    Inherits all fields from FridgeItemBase and adds id, added_at, and updated_at.
    """
    id: int
    added_at: datetime
    updated_at: datetime
    class Config:
        orm_mode = True

class FridgeNamedItem(FridgeItem):
    """
    Schema for FridgeItem with ingredient name.
    """
    name: str = Field(..., description="Name of the ingredient.")

class FridgeLogBase(BaseModel):
    """
    Base schema for FridgeLog.
    """
    user_id: int = Field(..., description="ID of the user.")
    ingredient_id: int = Field(..., description="ID of the ingredient.")
    change_amount: float = Field(..., description="Change in quantity.")
    action_type: str = Field(..., description="Type of action (e.g., 'add', 'remove').")

class FridgeLogCreate(FridgeLogBase):
    """
    Schema for creating a FridgeLog.
    Inherits all fields from FridgeLogBase.
    """
    pass

class FridgeLog(FridgeLogBase):
    """
    Schema for reading a FridgeLog from the database.
    Inherits all fields from FridgeLogBase and adds id and timestamp.
    """
    id: int
    timestamp: datetime
    class Config:
        orm_mode = True

class ScheduleBase(BaseModel):
    """
    Base schema for Schedule.
    """
    recipe_id: int = Field(..., description="ID of the recipe.")
    user_id: int = Field(..., description="ID of the user.")
    date: datatime_date = Field(..., description="Date of the scheduled meal.")
    meal_type: int = Field(..., description="ID of the meal type.")

class ScheduleCreate(ScheduleBase):
    """
    Schema for creating a Schedule entry.
    Inherits all fields from ScheduleBase.
    """
    pass

class Schedule(ScheduleBase):
    """
    Schema for reading a Schedule entry from the database.
    Inherits all fields from ScheduleBase and adds id.
    """
    id: int
    class Config:
        orm_mode = True

class ScheduleGet(Schedule):
    """
    Schema for reading a Schedule entry with recipe name.
    Inherits all fields from Schedule and adds recipe_name.
    """
    recipe_name: Optional[str] = None


class MealTypeBase(BaseModel):
    """
    Base schema for MealType.
    """
    name: str = Field(..., description="Name of the meal type.")

class MealTypeCreate(MealTypeBase):
    """
    Schema for creating a MealType.
    Inherits all fields from MealTypeBase.
    """
    pass

class MealType(MealTypeBase):
    """
    Schema for reading a MealType from the database.
    Inherits all fields from MealTypeBase and adds id.
    """
    id: int
    class Config:
        orm_mode = True
