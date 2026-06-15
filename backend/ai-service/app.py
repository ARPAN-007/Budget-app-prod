from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator
from fastapi.middleware.cors import CORSMiddleware
from kafka import KafkaConsumer
import json
import threading
import os

app = FastAPI()


Instrumentator().instrument(app).expose(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

latest_insights = []

def kafka_consumer():
    consumer = KafkaConsumer(
        "expenses",
        bootstrap_servers=os.getenv(
            "KAFKA_BOOTSTRAP_SERVERS",
            "kafka.kafka.svc.cluster.local:9092"
        ),
        auto_offset_reset="earliest",
        value_deserializer=lambda x: json.loads(x.decode("utf-8"))
    )

    for message in consumer:
        expense = message.value

        amount = expense.get("amount", 0)
        category = expense.get("category", "Unknown")

        insight = f"Expense received: ₹{amount} in {category}"

        if amount > 5000:
            insight += " | Recommendation: Review high spending"

        latest_insights.append(insight)

        if len(latest_insights) > 20:
            latest_insights.pop(0)

@app.on_event("startup")
def startup_event():
    threading.Thread(
        target=kafka_consumer,
        daemon=True
    ).start()

@app.get("/")
def home():
    return {
        "status": "AI Service Running"
    }

@app.get("/ai-insights")
def ai_insights():
    return {
        "insights": latest_insights
    }