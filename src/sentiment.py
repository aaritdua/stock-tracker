from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from alpaca.data.historical import NewsClient
from alpaca.data.requests import NewsRequest
from config import ALPACA_API_KEY, ALPACA_API_SECRET
import numpy as np
import pandas as pd

client = NewsClient(ALPACA_API_KEY, ALPACA_API_SECRET)

def get_sentiment_score(symbol):
    request = NewsRequest(symbols=symbol, limit=50)
    news = client.get_news(request)
    if not news:
        return 0.0
    analyzer = SentimentIntensityAnalyzer()
    scores = np.array([
        analyzer.polarity_scores(n.headline)["compound"]
        for n in news.data["news"]
    ])
    return scores.mean()

def create_sentiment_df(symbol, start, end):
    analyzer = SentimentIntensityAnalyzer()
    records = []
    next_page_token = None
    while True:
        request = NewsRequest(
            symbols=symbol,
            start=start,
            end=end,
            limit=50,
            page_token=next_page_token
        )
        news = client.get_news(request)

        for n in news.data["news"]:
            score = analyzer.polarity_scores(n.headline)["compound"]
            date = n.created_at.date()
            t = (date, score)
            records.append(t)
    
        next_page_token = news.next_page_token
        if not next_page_token:
            break

    recs = pd.DataFrame(records, columns=["date", "sentiment_score"])
    recs = recs.groupby("date").mean().reset_index()

    return recs