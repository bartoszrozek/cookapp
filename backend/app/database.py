import os

import sqlalchemy
from dotenv import load_dotenv
from sqlalchemy import create_engine, engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()


if "GITHUB_WORKFLOW" in os.environ:

    # In GitHub Actions, use a local SQLite database for testing
    engine = create_engine("sqlite:///./test.db", connect_args={"check_same_thread": False})

elif (os.getenv("ENV") == "development") or (os.getenv("ENV") is None):

    db_host = os.environ["INSTANCE_HOST"]
    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASSWORD"]
    db_name = os.environ["DB_NAME"]
    db_port = int(os.environ["DB_PORT"])

    engine = create_engine(
        sqlalchemy.engine.url.URL.create( # type: ignore
            drivername="postgresql+psycopg2",
            username=db_user,
            password=db_pass,
            host=db_host,
            port=db_port,
            database=db_name,
        ),
    )

else:
    
    from google.cloud.sql.connector import Connector, IPTypes
    import pg8000

    instance_connection_name = os.environ[
        "INSTANCE_CONNECTION_NAME"
    ]  # e.g. 'project:region:instance'
    db_user = os.environ["DB_USER"]  # e.g. 'my-db-user'
    db_pass = os.environ["DB_PASSWORD"]  # e.g. 'my-db-password'
    db_name = os.environ["DB_NAME"]  # e.g. 'my-database'

    ip_type = IPTypes.PRIVATE if os.environ.get("PRIVATE_IP") else IPTypes.PUBLIC

    # initialize Cloud SQL Python Connector object
    connector = Connector(refresh_strategy="LAZY")

    def getconn() -> pg8000.dbapi.Connection: # type: ignore
        conn: pg8000.dbapi.Connection = connector.connect( # type: ignore
            instance_connection_name,
            "pg8000",
            user=db_user,
            password=db_pass,
            db=db_name,
            ip_type=ip_type,
        )
        return conn

    # The Cloud SQL Python Connector can be used with SQLAlchemy
    # using the 'creator' argument to 'create_engine'
    engine = sqlalchemy.create_engine(
        "postgresql+pg8000://",
        creator=getconn,
        # ...
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()