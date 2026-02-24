# Stock Tracker

A machine learning model that predicts the next day's closing price for a given stock using XGBoost and technical indicators.

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

## Usage
```bash
python3 main.py
```

## How It Works

Historical stock data is fetched from Yahoo Finance using `yfinance`. A set of technical indicators are calculated from the raw price data and used as features for an XGBoost model, which predicts the next day's return. That return is then used to calculate the predicted closing price.

## Features

- RSI (Relative Strength Index)
- MACD, Signal Line, and Histogram
- Simple Moving Averages (3, 5, 10, 20, 50 day)
- Bollinger Band Width
- ADX, +DI, -DI (Average Directional Index)

## Model

XGBoost Regressor trained on 15 years of historical data (2010-present). The model predicts next day return, which is converted to a closing price prediction.

## Project Structure
```
stock-tracker/
├── src/
│   ├── fetcher.py      # fetches stock data from Yahoo Finance
│   ├── features.py     # calculates technical indicators
│   └── model.py        # trains XGBoost model and makes predictions
├── main.py             # entry point
└── requirements.txt
```