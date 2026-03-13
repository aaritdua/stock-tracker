from sqlalchemy import Integer, String, Float, DateTime, Column
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime, timezone

class Base(DeclarativeBase):
    pass

class Predictions(Base):
    
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True)
    ticker = Column(String)
    predicted_price = Column(Float)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))