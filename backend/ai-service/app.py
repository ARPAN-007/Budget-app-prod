from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {
        "status": "AI Service Running"
    }

@app.get("/ai-insights")
def ai_insights():

    return {
        "insights": [
            "Food spending increased 20%",
            "Potential savings next month ₹5000",
            "Shopping expenses are high"
        ]
    }