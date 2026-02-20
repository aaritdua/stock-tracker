from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import pandas as pd

FEATURES = ["close", "volume", "volatility", "ma_3", "ma_5", "ma_10"]

def training_model(df: pd.DataFrame):
    """
    Train a Random Forest model on historical stock features.

    Parameters:
    df (pd.DataFrame): DataFrame containing feature columns and target_return column.

    Returns:
    tuple: (model, X_test, y_test)
        - model: Trained RandomForestRegressor
        - X_test: Test feature set
        - y_test: Actual target values for the test set
    """
    X = df[FEATURES]
    y = df["target_return"]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)
    model = RandomForestRegressor(n_estimators=300, max_depth=10, random_state=42)
    model.fit(X_train, y_train)

    return model, X_test, y_test

def predict_next_close(model, df):
    latest_features = df[FEATURES].iloc[-1:]
    predicted_return = model.predict(latest_features)
    current_close = df["close"].iloc[-1]

    return current_close * (1 + predicted_return[0])