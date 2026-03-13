from src.fetcher import get_stock_data
from src.features import build_features
from src.model import training_model, evaluate_model, predict_next_close, load_model, save_model
from src.sentiment import get_sentiment_score, create_sentiment_df

SYMBOLS = [
        "GOOG",   # Google - Tech
        "AAPL",   # Apple - Tech
        "MSFT",   # Microsoft - Tech
        "AMZN",   # Amazon - Tech/Retail
        "NVDA",   # Nvidia - Semiconductors
        "META",   # Meta - Social Media
        "TSLA",   # Tesla - EV/Tech
        "JPM",    # JPMorgan - Banking
        "GS",     # Goldman Sachs - Banking
        "JNJ",    # Johnson & Johnson - Healthcare
        "PFE",    # Pfizer - Pharma
        "XOM",    # Exxon - Energy
        "WMT",    # Walmart - Retail
        "DIS",    # Disney - Entertainment
        "NFLX",   # Netflix - Streaming
        "BA",     # Boeing - Aerospace
        "KO",     # Coca-Cola - Consumer Goods
        "NKE",    # Nike - Consumer Goods
        "GE",     # General Electric - Industrial
        "F"       # Ford - Auto
    ]

START_DATE = "2010-01-01"
END_DATE = "2026-02-20"

def main():
    for SYMBOL in SYMBOLS:
        stock_data = get_stock_data(SYMBOL, START_DATE, END_DATE)
        sentiment_df = create_sentiment_df(SYMBOL, START_DATE, END_DATE)
        stock_data = build_features(stock_data, sentiment_df)
        
        model = load_model(SYMBOL)
        if model is None:
            model, X_test, y_test = training_model(stock_data)
            mae, rmse, r2 = evaluate_model(model, X_test, y_test)
            save_model(model, SYMBOL)
            prediction = predict_next_close(model, stock_data)
        else:
            prediction = predict_next_close(model, stock_data)
        
        print(f"Predicted next close for {SYMBOL}: ${prediction:.2f}")
        sentiment = get_sentiment_score(SYMBOL)
        print(f"Sentiment score for {SYMBOL}: {sentiment:.2f}")


if __name__ == "__main__":
    main()