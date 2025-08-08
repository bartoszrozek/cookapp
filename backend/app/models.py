from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Date
from .database import Base
from .helpers import time_now


class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String)
    default_unit = Column(String)
    calories_per_unit = Column(Float)
    is_perishable = Column(Boolean, default=True)
    shelf_life_days = Column(Integer)
    created_at = Column(DateTime, default=time_now)
    updated_at = Column(DateTime, default=time_now, onupdate=time_now)

class Recipe(Base):
    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    instructions = Column(Text)
    instruction_link = Column(String)  # NEW FIELD
    servings = Column(Integer)
    prep_time_min = Column(Integer)
    cook_time_min = Column(Integer)
    difficulty = Column(String)
    image_url = Column(String)
    created_at = Column(DateTime, default=time_now)
    updated_at = Column(DateTime, default=time_now, onupdate=time_now)

class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    optional = Column(Boolean, default=False)

class RecipeTag(Base):
    __tablename__ = "recipe_tags"
    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    tag = Column(String, nullable=False)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=time_now)

class FridgeItem(Base):
    __tablename__ = "fridge_items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    expiration_date = Column(Date)
    added_at = Column(DateTime, default=time_now)
    updated_at = Column(DateTime, default=time_now, onupdate=time_now)

class FridgeLog(Base):
    __tablename__ = "fridge_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    change_amount = Column(Float)
    action_type = Column(String)
    timestamp = Column(DateTime, default=time_now)
