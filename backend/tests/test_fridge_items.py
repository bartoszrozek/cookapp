from typing import Any

from app.main import app  # ty: ignore
from fastapi.testclient import TestClient

Json = dict[str, Any]
client = TestClient(app)


def _create_ingredient(client: TestClient, name: str = "Tomato") -> int:
    payload = {"name": name}
    res = client.post("/ingredients/", json=payload)
    return res.json().get("id")


def test_create_fridge_item_requires_auth(client: TestClient):
    ing_id = _create_ingredient(client)
    payload: Json = {"ingredient_id": ing_id, "quantity": 2.0, "unit": "pcs"}
    res = client.post("/fridge_items/", json=payload)
    assert res.status_code in (401, 403)


def test_create_fridge_item_with_auth(client: TestClient, auth_headers: dict[str, str]):
    ing_id = _create_ingredient(client)
    payload: Json = {"ingredient_id": ing_id, "quantity": 2.0, "unit": "pcs"}
    res = client.post("/fridge_items/", json=payload, headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert body["ingredient_id"] == ing_id


def test_list_fridge_items_returns_list(client: TestClient, auth_headers: dict[str, str]):
    ing_id = _create_ingredient(client)
    payload: Json = {"ingredient_id": ing_id, "quantity": 1.0, "unit": "pcs"}
    client.post("/fridge_items/", json=payload, headers=auth_headers)
    res = client.get("/fridge_items/", headers=auth_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_update_and_delete_fridge_item(client: TestClient, auth_headers: dict[str, str]):
    ing_id = _create_ingredient(client)
    payload: Json = {"ingredient_id": ing_id, "quantity": 1.0, "unit": "pcs"}
    res = client.post("/fridge_items/", json=payload, headers=auth_headers)
    assert res.status_code == 200
    item_id = res.json()["id"]

    # update
    update: Json = {"ingredient_id": ing_id, "quantity": 3.5, "unit": "pcs"}
    res2 = client.put(f"/fridge_items/{item_id}", json=update, headers=auth_headers)
    assert res2.status_code == 200
    assert res2.json()["quantity"] == 3.5

    # delete
    res3 = client.delete(f"/fridge_items/{item_id}", headers=auth_headers)
    assert res3.status_code == 200
    res4 = client.get(f"/fridge_items/{item_id}")
    assert res4.status_code == 404
