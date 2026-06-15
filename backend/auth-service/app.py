from fastapi import FastAPI, Depends, HTTPException
from prometheus_fastapi_instrumentator import Instrumentator
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import jwt
from pydantic import BaseModel
from datetime import datetime, timedelta

DATABASE_URL = "postgresql://postgres:postgres@postgres:5432/finops"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

SECRET_KEY = "SUPER_SECRET_KEY"
ALGORITHM = "HS256"

app = FastAPI(
    root_path="/auth"
)
Instrumentator().instrument(app).expose(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

class User(Base):

    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)


Base.metadata.create_all(bind=engine)


class UserCreate(BaseModel):
    email: str
    password: str


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def hash_password(password):
    return pwd_context.hash(password)
def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


def create_token(user_id):

    expire = datetime.utcnow() + timedelta(hours=12)

    payload = {
        "user_id": user_id,
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing:
        raise HTTPException(400, "User exists")

    new_user = User(
        email=user.email,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User created"
    }
@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing:
        raise HTTPException(401, "Invalid credentials")

    if not verify_password(
        user.password,
        existing.password
    ):
        raise HTTPException(401, "Invalid credentials")

    token = create_token(existing.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }
