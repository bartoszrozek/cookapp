import os

import sqlalchemy
from dotenv import load_dotenv
from sqlalchemy import create_engine, engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

if "GITHUB_WORKFLOW" not in os.environ:

    db_host = os.environ["INSTANCE_HOST"]
    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASSWORD"]
    db_name = os.environ["DB_NAME"]
    db_port = int(os.environ["DB_PORT"])

    engine = create_engine(
        sqlalchemy.engine.url.URL.create(
            drivername="postgresql+psycopg2",
            username=db_user,
            password=db_pass,
            host=db_host,
            port=db_port,
            database=db_name,
        ),
    )
    

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()

else:
    # In GitHub Actions, use a local SQLite database for testing
    engine = create_engine("sqlite:///./test.db", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base = declarative_base()
