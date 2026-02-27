from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import numpy as np

FEATURES = ["close", 
            "volume", 
            "rsi", 
            "macd", 
            "macd_signal", 
            "macd_histogram", 
            "ma_3", 
            "ma_5", 
            "ma_10", 
            "ma_20", 
            "ma_50", 
            "bb_width", 
            "adx", 
            "+di", 
            "-di",
            "atr",
            "roc",
            "stoch_k",
            "stoch_d",
            "vroc",
            "sentiment_score"
            ]

def training_model(df: pd.DataFrame):
    """
    Train an XGBoost model on historical stock features.

    Parameters:
    df (pd.DataFrame): DataFrame containing feature columns and target_return column.

    Returns:
    tuple: (model, X_test, y_test)
        - model: Trained XGBRegressor
        - X_test: Test feature set
        - y_test: Actual target values for the test set
    """
    X = df[FEATURES]
    y = df["target_return"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    model = XGBRegressor(n_estimators=1500, max_depth=1, learning_rate=0.005, subsample=0.8, colsample_bytree=0.8, random_state=42)
    model.fit(X_train, y_train)

    return model, X_test, y_test

def predict_next_close(model, df):
    latest_features = df[FEATURES].iloc[-1:]
    predicted_return = model.predict(latest_features)
    current_close = df["close"].iloc[-1]

    return current_close * (1 + predicted_return[0])

def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)   
    
    print(f"MAE: {mae}")
    print(f"RMSE: {rmse}")
    print(f"R²: {r2}")
    
    return mae, rmse, r2