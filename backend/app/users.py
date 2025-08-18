
import os
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi_users import FastAPIUsers
from pydantic import BaseModel, EmailStr
from typing import Optional
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from fastapi_users import BaseUserManager
from fastapi_users import exceptions as fa_exceptions
from jose import JWTError, jwt
from passlib.context import CryptContext

from . import models
from .database import SessionLocal


# Use integer IDs for this project
class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    is_verified: bool = False


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    username: Optional[str] = None


class UserUpdate(BaseModel):
    password: Optional[str] = None
    username: Optional[str] = None
    is_active: Optional[bool] = None


class UserDB(UserRead):
    hashed_password: str



class LoginRequest(BaseModel):
    username: str
    password: str


def get_user_db():
    db = SessionLocal()
    try:
        yield SQLAlchemyUserDatabase(UserDB, db, models.User)
    finally:
        db.close()


# Auth backend configuration
SECRET = os.getenv("JWT_SECRET", "CHANGE_ME_IN_PROD")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

bearer_transport = BearerTransport(tokenUrl="/auth/login")


def get_jwt_strategy():
    return JWTStrategy(secret=SECRET, lifetime_seconds=ACCESS_TOKEN_EXPIRE_MINUTES * 60)


auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)


class UserManager(BaseUserManager[UserDB, int]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def validate_password(self, password: str, user: UserDB) -> None:
        if len(password) < 6:
            raise fa_exceptions.InvalidPasswordException(
                reason="Password should be at least 6 characters"
            )

    async def on_after_register(self, user: UserDB, request=None):
        # hook after registration
        return


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


fastapi_users = FastAPIUsers(
    get_user_manager,
    [auth_backend],
)


current_active_user = fastapi_users.current_user(active=True)


# Utilities for tokens and password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(user_id), "exp": expire, "type": "access"}
    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)


def create_refresh_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {"sub": str(user_id), "exp": expire, "type": "refresh", "rand": secrets.token_urlsafe(8)}
    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)


router = APIRouter()


@router.post("/login")
def login(payload: LoginRequest, response: Response):
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == payload.username).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        if not verify_password(payload.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")

        
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        # set httpOnly refresh cookie
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,
            samesite="lax",
            secure=False,  # set True in production over HTTPS
            max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
            path="/",
        )

        return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "username": user.username}}
    finally:
        db.close()


@router.post("/refresh")
def refresh(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Missing refresh token")
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # issue new tokens
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token(user_id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        samesite="lax",
        secure=False,  # set True in production
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/",
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("refresh_token", path="/")
    return {"status": "ok"}
