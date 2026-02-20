from src.fetcher import get_stock_data
from src.features import build_features
from src.model import training_model, evaluate_model, predict_next_close

SYMBOL = "GOOG"
START_DATE = "2022-01-01"
END_DATE = "2026-02-20"

def main():
    stock_data = get_stock_data(SYMBOL, START_DATE, END_DATE)
    stock_data = build_features(stock_data)
    model, X_test, y_test = training_model(stock_data)
    mae, rmse, r2 = evaluate_model(model, X_test, y_test)
    prediction = predict_next_close(model, stock_data)
    print(f"Predicted next close for {SYMBOL}: ${prediction:.2f}")
    print(f"Mean Absolute Error: {mae}")
    print(f"Root Mean Squared Erro: {rmse}")
    print(f"R^2: {r2}")

if __name__ == "__main__":
    main()