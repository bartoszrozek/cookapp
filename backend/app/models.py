from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Date, CheckConstraint
from sqlalchemy.orm import relationship
from .database import Base, engine
from .helpers import time_now


class Ingredient(Base):
    """
    SQLAlchemy model for an ingredient.

    Fields:
        id (int): Primary key.
        name (str): Name of the ingredient.
        category (str): Category of the ingredient.
        default_unit (str): Default unit of measurement.
        calories_per_unit (float): Calories per unit of the ingredient.
        is_perishable (bool): Indicates if the ingredient is perishable.
        shelf_life_days (int): Shelf life of the ingredient in days.
        created_at (datetime): Timestamp when the ingredient was created.
        updated_at (datetime): Timestamp when the ingredient was last updated.

    Relationships:
        recipe_ingredients: List of RecipeIngredient associations.
        fridge_items: List of FridgeItem associations.
    """

    __tablename__ = "ingredients"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String)
    default_unit = Column(String)
    calories_per_unit: Column[float] = Column(Float) # explicit type needed because of pylance bug
    is_perishable = Column(Boolean, default=True)
    shelf_life_days = Column(Integer)
    created_at = Column(DateTime, default=time_now)
    updated_at = Column(DateTime, default=time_now, onupdate=time_now)


class Recipe(Base):
    """
    SQLAlchemy model for a recipe.

    Fields:
        id (int): Primary key.
        name (str): Name of the recipe.
        description (str): Description of the recipe.
        instructions (str): Cooking instructions for the recipe.
        instruction_link (str): Optional link to recipe instructions.
        servings (int): Number of servings the recipe makes.
        prep_time_min (int): Preparation time in minutes.
        cook_time_min (int): Cooking time in minutes.
        difficulty (str): Difficulty level of the recipe.
        image_url (str): URL of the recipe's image.
        created_at (datetime): Timestamp when the recipe was created.
        updated_at (datetime): Timestamp when the recipe was last updated.

    Relationships:
        recipe_ingredients: List of RecipeIngredient associations.
    """

    __tablename__ = "recipes"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    instructions = Column(Text)
    instruction_link = Column(String)
    servings = Column(Integer)
    prep_time_min = Column(Integer)
    cook_time_min = Column(Integer)
    difficulty = Column(String)
    image_url = Column(String)
    created_at = Column(DateTime, default=time_now)
    updated_at = Column(DateTime, default=time_now, onupdate=time_now)
    recipe_ingredients = relationship(
        "RecipeIngredient", back_populates="recipe", cascade="all, delete-orphan"
    )


class RecipeIngredient(Base):
    """
    Association table for many-to-many relationship between recipes and ingredients.

    Fields:
        id (int): Primary key.
        recipe_id (int): Foreign key to Recipe.
        ingredient_id (int): Foreign key to Ingredient.
        quantity (float): Quantity of the ingredient in the recipe.
        unit (str): Unit of measurement for the ingredient in the recipe.
        optional (bool): Indicates if the ingredient is optional.

    Relationships:
        recipe: The associated Recipe.
        ingredient: The associated Ingredient.
    """

    __tablename__ = "recipe_ingredients"
    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity: Column[float] = Column(Float, nullable=False) # explicit type needed because of pylance bug
    __table_args__ = (
        CheckConstraint('quantity > 0', name='check_quantity_positive'),
    )
    unit = Column(String, nullable=False)
    optional = Column(Boolean, default=False)
    recipe = relationship("Recipe", back_populates="recipe_ingredients")
    ingredient = relationship("Ingredient")


class RecipeTag(Base):
    """
    SQLAlchemy model for a tag associated with a recipe.

    Fields:
        id (int): Primary key.
        recipe_id (int): Foreign key to Recipe.
        tag (str): The tag associated with the recipe.
    """

    __tablename__ = "recipe_tags"
    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    tag = Column(String, nullable=False)


class User(Base):
    """
    SQLAlchemy model for a user.

    Fields:
        id (int): Primary key.
        username (str): Unique username for the user.
        email (str): Unique email address for the user.
        password_hash (str): Hashed password for the user.
        created_at (datetime): Timestamp when the user was created.
    """

    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    # fastapi-users expects `hashed_password` column name
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=time_now)


class FridgeItem(Base):
    """
    SQLAlchemy model for an item in the fridge.

    Fields:
        id (int): Primary key.
        user_id (int): Foreign key to User.
        ingredient_id (int): Foreign key to Ingredient.
        quantity (float): Quantity of the ingredient in the fridge.
        unit (str): Unit of measurement for the ingredient.
        expiration_date (date): Expiration date of the item.
        added_at (datetime): Timestamp when the item was added to the fridge.
        updated_at (datetime): Timestamp when the item was last updated.

    Relationships:
        ingredient: The associated Ingredient.
    """

    __tablename__ = "fridge_items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    quantity: Column[float] = Column(Float, nullable=False) # explicit type needed because of pylance bug
    unit = Column(String, nullable=False)
    expiration_date = Column(Date)
    added_at = Column(DateTime, default=time_now)
    updated_at = Column(DateTime, default=time_now, onupdate=time_now)


class FridgeLog(Base):
    """
    SQLAlchemy model for a log entry for changes to fridge items.

    Fields:
        id (int): Primary key.
        user_id (int): Foreign key to User.
        ingredient_id (int): Foreign key to Ingredient.
        change_amount (float): Amount of change in quantity.
        action_type (str): Type of action (e.g., "add", "remove").
        timestamp (datetime): Timestamp when the change was made.
    """

    __tablename__ = "fridge_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    ingredient_id = Column(Integer, ForeignKey("ingredients.id"), nullable=False)
    change_amount: Column[float] = Column(Float) # explicit type needed because of pylance bug
    action_type = Column(String)
    timestamp = Column(DateTime, default=time_now)


class Schedule(Base):
    """
    SQLAlchemy model for a schedule entry.

    Fields:
        id (int): Primary key.
        recipe_id (int): Foreign key to Recipe.
        user_id (int): Foreign key to User.
        date (date): Date of the scheduled meal.
        meal_type (int): Foreign key to MealType.

    Relationships:
        meal_type: The associated MealType.
        recipe: The associated Recipe.
    """

    __tablename__ = "schedule"
    id = Column(Integer, primary_key=True)
    recipe_id = Column(Integer, ForeignKey("recipes.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    meal_type = Column(Integer, ForeignKey("meal_types.id"), nullable=False)


class MealType(Base):
    """
    SQLAlchemy model for a meal type.

    Fields:
        id (int): Primary key.
        name (str): Name of the meal type.
    """

    __tablename__ = "meal_types"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)

Base.metadata.create_all(bind=engine)