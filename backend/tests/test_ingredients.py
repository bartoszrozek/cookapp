from typing import Any

from app.main import app  # ty: ignore
from fastapi.testclient import TestClient

client = TestClient(app)



def _make_payload(name: str = "Tomato") -> dict[str, Any]:
    return {
        "name": name,
        "category": "Vegetable",
        "default_unit": "pcs",
        "calories_per_unit": 18.0,
        "is_perishable": True,
        "shelf_life_days": 7,
    }


def _create_ingredient(client: TestClient, name: str = "Tomato"):
    payload = _make_payload(name)
    return client.post("/ingredients/", json=payload)


def test_create_ingredient_returns_200():
    res = _create_ingredient(client)
    assert res.status_code == 200


def test_create_ingredient_returns_expected_name():
    payload = _make_payload("Cherry Tomato")
    res = client.post("/ingredients/", json=payload)
    body = res.json()
    assert body["name"] == "Cherry Tomato"


def test_create_ingredient_returns_id():
    res = _create_ingredient(client)
    body = res.json()
    assert "id" in body


def test_list_includes_created_ingredient():
    res = _create_ingredient(client)
    ingredient_id = res.json()["id"]
    res2 = client.get("/ingredients/")
    ids = [i["id"] for i in res2.json()]
    assert ingredient_id in ids


def test_get_ingredient_by_id_returns_200():
    res = _create_ingredient(client)
    ingredient_id = res.json()["id"]
    res2 = client.get(f"/ingredients/{ingredient_id}")
    assert res2.status_code == 200


def test_get_ingredient_by_id_has_correct_fields():
    payload = _make_payload("Cucumber")
    res = client.post("/ingredients/", json=payload)
    body = res.json()
    ingredient_id = body["id"]
    res2 = client.get(f"/ingredients/{ingredient_id}")
    got = res2.json()
    assert got["name"] == "Cucumber"
    assert "created_at" in got


def test_delete_ingredient_returns_200():
    res = _create_ingredient(client)
    ingredient_id = res.json()["id"]
    res2 = client.delete(f"/ingredients/{ingredient_id}")
    assert res2.status_code == 200


def test_deleted_ingredient_returns_404():
    res = _create_ingredient(client)
    ingredient_id = res.json()["id"]
    client.delete(f"/ingredients/{ingredient_id}")
    res2 = client.get(f"/ingredients/{ingredient_id}")
    assert res2.status_code == 404


def test_get_nonexistent_ingredient_returns_404():
    res = client.get("/ingredients/999999")
    assert res.status_code == 404
