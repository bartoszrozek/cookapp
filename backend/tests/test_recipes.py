from typing import Any

from app.main import app # ty: ignore
from fastapi.testclient import TestClient

client = TestClient(app)



def _make_payload(name: str = "Test Recipe") -> dict[str, Any]:
    return {
        "name": name,
        "description": "A tasty test",
        "instructions": "Mix",
        "ingredients": [
            {"name": "Salt", "quantity": 1.0, "unit": "tsp"},
            {"name": "Pepper", "quantity": 0.5, "unit": "tsp"},
        ],
    }


def _create_recipe(client: TestClient, name: str = "Test Recipe"):
    payload = _make_payload(name)
    return client.post("/recipes/", json=payload)


def test_create_recipe_returns_200():
    res = _create_recipe(client)
    assert res.status_code == 200


def test_create_recipe_returns_expected_name():
    payload = _make_payload("Specific Name")
    res = client.post("/recipes/", json=payload)
    body = res.json()
    assert body["name"] == "Specific Name"


def test_create_recipe_returns_id():
    res = _create_recipe(client)
    body = res.json()
    assert "id" in body


def test_list_includes_created_recipe():
    res = _create_recipe(client)
    recipe_id = res.json()["id"]
    res2 = client.get("/recipes/")
    ids = [r["id"] for r in res2.json()]
    assert recipe_id in ids


def test_get_recipe_by_id_returns_200():
    res = _create_recipe(client)
    recipe_id = res.json()["id"]
    res2 = client.get(f"/recipes/{recipe_id}/")
    assert res2.status_code == 200


def test_get_recipe_by_id_has_correct_fields():
    payload = _make_payload("Field Test")
    res = client.post("/recipes/", json=payload)
    body = res.json()
    recipe_id = body["id"]
    res2 = client.get(f"/recipes/{recipe_id}/")
    got = res2.json()
    assert got["name"] == "Field Test"


def test_update_recipe_changes_name():
    res = _create_recipe(client)
    recipe_id = res.json()["id"]
    update_payload = _make_payload("Updated Recipe")
    res2 = client.put(f"/recipes/{recipe_id}/", json=update_payload)
    assert res2.json()["name"] == "Updated Recipe"


def test_delete_recipe_returns_200():
    res = _create_recipe(client)
    recipe_id = res.json()["id"]
    res2 = client.delete(f"/recipes/{recipe_id}/")
    assert res2.status_code == 200


def test_deleted_recipe_returns_404():
    res = _create_recipe(client)
    recipe_id = res.json()["id"]
    client.delete(f"/recipes/{recipe_id}/")
    res2 = client.get(f"/recipes/{recipe_id}/")
    assert res2.status_code == 404


def test_get_nonexistent_recipe_returns_404():
    res = client.get("/recipes/999999/")
    assert res.status_code == 404
