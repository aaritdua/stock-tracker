import yfinance as yf
import pandas as pd

def get_stock_data(symbol: str, start: str, end: str) -> pd.DataFrame:
    """
    Fetch historical stock data for a given symbol and date range.

    Parameters:
    symbol (str): The stock ticker symbol (e.g., 'AAPL').
    start (str): The start date in 'YYYY-MM-DD' format.
    end (str): The end date in 'YYYY-MM-DD' format.

    Returns:
    pandas.DataFrame: A DataFrame containing the historical stock data.
    """
    try:
        stock_data = yf.download(symbol, start=start, end=end)
        stock_data = stock_data.reset_index()
        return stock_data
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None