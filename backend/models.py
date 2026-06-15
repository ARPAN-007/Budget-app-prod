from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, Integer, Float, String

Base = declarative_base()

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    category = Column(String)