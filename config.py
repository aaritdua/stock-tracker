import os
from dotenv import load_dotenv

load_dotenv()

ALPACA_API_KEY = os.getenv("API_KEY")
ALPACA_API_SECRET = os.getenv("API_SECRET")
ALPACA_BASE_URL = "https://paper-api.alpaca.markets/v2"