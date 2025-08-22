import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from . import models
from .database import SessionLocal


# Use integer IDs for this project
class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


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


class UserSent(BaseModel):
    id: int
    email: EmailStr
    username: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False


class TokenPack(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserSent


# Simple HTTP bearer security for decoding JWT from Authorization header
security = HTTPBearer()

# Utilities for tokens and password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(user_id), "exp": expire, "type": "access"}
    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)


def create_refresh_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "sub": str(user_id),
        "exp": expire,
        "type": "refresh",
        "rand": secrets.token_urlsafe(8),
    }
    return jwt.encode(to_encode, SECRET, algorithm=ALGORITHM)


# JWT configuration (env overrides)
SECRET = os.getenv("JWT_SECRET", "CHANGE_ME_IN_PROD")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Decode JWT from Authorization header and return the DB user."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET, algorithms=[ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = int(payload.get("sub"))
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    finally:
        db.close()


def current_active_user(user=Depends(get_current_user)):
    if not getattr(user, "is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return user


router = APIRouter()


@router.post("/login")
def login(
    payload: LoginRequest, response: Response, db: Session = Depends(get_db)
) -> TokenPack:
    try:
        user = (
            db.query(models.User).filter(models.User.email == payload.username).first()
        )
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

        return TokenPack(
            access_token=access_token,
            user=UserSent(
                id=user.id,
                email=user.email,
                username=user.username,
                is_active=user.is_active,
                is_superuser=user.is_superuser,
            ),
        )
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
