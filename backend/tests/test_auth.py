from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_fridge_items_unauthenticated():
    res = client.get('/fridge_items/')
    assert res.status_code == 401 or res.status_code == 403
