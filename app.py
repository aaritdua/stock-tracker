from fastapi import FastAPI, Depends
from db.database import SessionLocal, get_db
from src.model import load_model, training_model, evaluate_model, save_model, predict_next_close
from src.sentiment import create_sentiment_df
from src.fetcher import get_stock_data
from src.features import build_features
from datetime import datetime, timedelta
from db.models import Predictions

app = FastAPI()

@app.get('/health')
def get_health():
    return {'status': 'ok'}

@app.get('/predict/{ticker}')
def predict(ticker, db = Depends(get_db)):
    
    END_DATE = datetime.today().strftime('%Y-%m-%d')
    START_DATE  = (datetime.today() - timedelta(days=365*15)).strftime('%Y-%m-%d')
    
    model = load_model(ticker)
    
    stock_data = get_stock_data(ticker, START_DATE, END_DATE)
    sentiment_df = create_sentiment_df(ticker, START_DATE, END_DATE)
    stock_data = build_features(stock_data, sentiment_df)
    
    if model is None:
        model, X_test, y_test = training_model(stock_data)
        mae, rmse, r2 = evaluate_model(model, X_test, y_test)
        save_model(model, ticker)
        prediction = predict_next_close(model, stock_data)
    else:
        prediction = predict_next_close(model, stock_data)
    
    record_prediction = Predictions(ticker=ticker, predicted_price=float(prediction))
    db.add(record_prediction)
    db.commit()
    
    return {"ticker": ticker, "predicted_price": float(prediction)}

@app.get('/predictions/{ticker}')
def predictions(ticker):
    # return past predictions on ticker
    pass

@app.post('/train/{ticker}')
def train(ticker):
    # train the model and save in joblib
    pass
