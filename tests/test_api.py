from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_help_health():
    response = client.get('/health')
    assert response.status_code == 200
    assert response.json() == {'status': 'ok'}
    
def test_help_predictions_GOOG():
    # predictions endpoint test
    response = client.get('/predictions/GOOG')
    assert isinstance(response.json(), list)
    
def test_help_predictions_false_ticker():
    # predictions endpoint test
    response = client.get('/predictions/ABC123')
    assert response.json() == []
    
# def test_help_predict():
    