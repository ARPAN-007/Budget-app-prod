from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    root_path="/expense"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

expenses = []
@app.get("/")
def home():
    return {
        "service": "expense-service"
    }


@app.post("/expense")
def add_expense(data: dict):

    expenses.append(data)

    return {
        "message": "Expense added",
        "data": data
    }


@app.get("/expenses")
def get_expenses():

    return {
        "expenses": expenses
    }