import pandas as pd
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from config import ALPACA_API_KEY, ALPACA_API_SECRET

def get_stock_data(symbol: str, start: str, end: str) -> pd.DataFrame:
    """
    Fetch historical daily stock data from Alpaca Markets.
    
    Parameters:
    symbol (str): Stock ticker symbol (e.g., 'GOOG', 'AAPL').
    start (str): Start date in 'YYYY-MM-DD' format.
    end (str): End date in 'YYYY-MM-DD' format.

    Returns:
    pd.DataFrame: Raw OHLCV data with columns: timestamp, symbol, open, high, low, close, volume, trade_count, vwap.
    Returns None if an error occurs.
    """
    try:
        client = StockHistoricalDataClient(ALPACA_API_KEY, ALPACA_API_SECRET)
        
        request_params = StockBarsRequest(
            symbol_or_symbols=symbol,
            timeframe=TimeFrame.Day,
            start=start,
            end=end
        )
        
        bars = client.get_stock_bars(request_params)
        df = bars.df.reset_index()
        df = df[df["symbol"] == symbol]
        
        df.columns = [col.lower() for col in df.columns]
        
        return df
        
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        return None