from src.fetcher import get_stock_data
from src.features import build_features
from src.model import training_model, evaluate_model, predict_next_close

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
        stock_data = build_features(stock_data)
        model, X_test, y_test = training_model(stock_data)
        mae, rmse, r2 = evaluate_model(model, X_test, y_test)
        prediction = predict_next_close(model, stock_data)
        print(f"Predicted next close for {SYMBOL}: ${prediction:.2f}")


if __name__ == "__main__":
    main()