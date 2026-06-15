from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from prometheus_fastapi_instrumentator import Instrumentator
from fastapi.middleware.cors import CORSMiddleware
from kafka import KafkaProducer

from database import get_db
from database import SessionLocal, engine
from models import Base, Expense

import json
import os

Base.metadata.create_all(bind=engine)

app = FastAPI()

Instrumentator().instrument(app).expose(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

producer = KafkaProducer(
    bootstrap_servers=os.getenv(
        "KAFKA_BOOTSTRAP_SERVERS",
        "kafka.kafka.svc.cluster.local:9092"
    ),
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

@app.get("/")
def home():
    return {
        "service": "expense-service"
    }

@app.post("/expense")
def add_expense(
    data: dict,
    db: Session = Depends(get_db)
):

    expense = Expense(
        amount=data["amount"],
        category=data["category"]
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    event = {
        "eventType": "EXPENSE_CREATED",
        "expense": data
    }

    producer.send("expenses", event)
    producer.flush()

    return {
        "message": "Expense added",
        "id": expense.id
    }

@app.get("/expenses")
def get_expenses(
    db: Session = Depends(get_db)
):

    expenses = db.query(Expense).all()

    return [
        {
            "id": e.id,
            "amount": e.amount,
            "category": e.category
        }
        for e in expenses
    ]