import os
import sys

import pytest
from app.main import app  # ty: ignore
from fastapi.testclient import TestClient

module_path = os.path.abspath(os.path.join(".."))
if module_path not in sys.path:
    sys.path.append(module_path)

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c

# Example test: check root endpoint
def test_root(client: TestClient):
    response = client.get("/")
    assert response.status_code == 200