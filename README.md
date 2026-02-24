# Stock Tracker

A machine learning pipeline that predicts the next day's closing price for stocks using XGBoost and technical indicators, with real-time sentiment analysis from financial news.

## Setup

1. Clone the repo
```bash
git clone https://github.com/aaritdua/stock-tracker.git
cd stock-tracker
```

2. Create and activate a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Create a `.env` file with your Alpaca API keys
```
API_KEY=your_key_here
API_SECRET=your_secret_here
```
You can get free API keys at [alpaca.markets](https://alpaca.markets).

## Usage
```bash
python3 main.py
```

## How It Works

Historical stock data is fetched from Alpaca Markets. A set of technical indicators are calculated from the raw price data and used as features for an XGBoost model, which predicts the next day's return. That return is then converted to a predicted closing price. Current news sentiment is also fetched and displayed alongside the prediction.

## Technical Indicators

- RSI (Relative Strength Index)
- MACD, Signal Line, and Histogram
- Simple Moving Averages (3, 5, 10, 20, 50 day)
- Bollinger Band Width
- ADX, +DI, -DI (Average Directional Index)

## Model

XGBoost Regressor trained on 15 years of historical daily data (2010-present). Predicts next day return which is converted to a closing price.

## Project Structure
```
stock-tracker/
├── src/
│   ├── fetcher.py      # fetches stock data from Alpaca
│   ├── features.py     # calculates technical indicators
│   ├── model.py        # trains XGBoost and makes predictions
│   └── sentiment.py    # fetches and scores news sentiment
├── config.py           # loads API keys from .env
├── main.py             # entry point
└── requirements.txt
```

## Supported Stocks

GOOG, AAPL, MSFT, AMZN, NVDA, META, TSLA, JPM, GS, JNJ, PFE, XOM, WMT, DIS, NFLX, BA, KO, NKE, GE, F