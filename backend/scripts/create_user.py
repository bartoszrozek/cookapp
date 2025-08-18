#!/usr/bin/env python3
"""Small helper to create a user in the database for local development.

Usage:
  python backend/scripts/create_user.py --email user@example.com --password secret --username bob

This script uses the app.database SessionLocal and app.models.User so run it from the repo root where backend is accessible as a package (or run from backend/ with PYTHONPATH set).
"""
import argparse
from passlib.context import CryptContext

from app.database import SessionLocal, engine
from app import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_user(email: str, password: str, username: str | None = None):
    db = SessionLocal()
    try:
        hashed = pwd_context.hash(password)
        user = models.User(email=email, username=username or email.split("@")[0], hashed_password=hashed)
        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"Created user id={user.id} email={user.email}")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--email", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--username", required=False)
    args = parser.parse_args()
    create_user(args.email, args.password, args.username)
