from datetime import date, timedelta
from typing import Any

from fastapi.testclient import TestClient

Json = dict[str, Any]

def _create_recipe(client: TestClient, name: str = "Sched Recipe") -> int:
    payload: Json = {"name": name, "ingredients": [{"name": "Salt", "quantity": 1.0, "unit": "tsp"}]}
    res = client.post("/recipes/", json=payload)
    return res.json()["id"]


def create_meal_type(client: TestClient, name: str = "MealType") -> int:
    res = client.post("/meal_types/", json={"name": name})
    if res.status_code == 200:
        return res.json().get("id")
    # fall back to 1 if API for meal types isn't available in test DB
    return 1


def test_create_schedule_unauthenticated(client: TestClient):
    recipe_id = _create_recipe(client)
    meal_type_id = create_meal_type(client)
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload: Json = {"recipe_id": recipe_id, "date": tomorrow, "meal_type": meal_type_id}
    res = client.post("/schedule/", json=payload)
    assert res.status_code in (401, 403)


def test_create_schedule_with_auth_returns_200(client: TestClient, auth_headers: dict[str, str]):
    recipe_id = _create_recipe(client)
    meal_type_id = create_meal_type(client, "TestMealType2")
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload: Json = {"recipe_id": recipe_id, "date": tomorrow, "meal_type": meal_type_id}
    res = client.post("/schedule/", json=payload, headers=auth_headers)
    assert res.status_code == 200


def test_created_schedule_has_expected_recipe(client: TestClient, auth_headers: dict[str, str]):
    recipe_id = _create_recipe(client)
    meal_type_id = create_meal_type(client, "TestMealType3")
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload: Json = {"recipe_id": recipe_id, "date": tomorrow, "meal_type": meal_type_id}
    res = client.post("/schedule/", json=payload, headers=auth_headers)
    body = res.json()
    assert body["recipe_id"] == recipe_id


def test_list_schedule_returns_list(client: TestClient, auth_headers: dict[str, str]):
    recipe_id = _create_recipe(client)
    meal_type_id = create_meal_type(client, "TestMealType4")
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload: Json = {"recipe_id": recipe_id, "date": tomorrow, "meal_type": meal_type_id}
    client.post("/schedule/", json=payload, headers=auth_headers)
    res = client.get("/schedule/", headers=auth_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)


def test_update_schedule_changes_date(client:TestClient, auth_headers: dict[str, str]):
    recipe_id = _create_recipe(client)
    meal_type_id = create_meal_type(client, "TestMealType5")
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload: Json = {"recipe_id": recipe_id, "date": tomorrow, "meal_type": meal_type_id}
    res = client.post("/schedule/", json=payload, headers=auth_headers)
    schedule_id = res.json()["id"]

    new_date = (date.today() + timedelta(days=2)).isoformat()
    update: Json = {"recipe_id": recipe_id, "date": new_date, "meal_type": meal_type_id}
    res2 = client.put(f"/schedule/{schedule_id}", json=update, headers=auth_headers)
    assert res2.status_code == 200
    assert res2.json()["date"] == new_date


def test_delete_schedule_and_then_404(client: TestClient, auth_headers: dict[str, str]):
    recipe_id = _create_recipe(client)
    meal_type_id = create_meal_type(client, "TestMealType6")
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    payload: Json = {"recipe_id": recipe_id, "date": tomorrow, "meal_type": meal_type_id}
    res = client.post("/schedule/", json=payload, headers=auth_headers)
    schedule_id = res.json()["id"]

    res2 = client.delete(f"/schedule/{schedule_id}", headers=auth_headers)
    assert res2.status_code == 200

    res3 = client.get(f"/schedule/{schedule_id}")
    assert res3.status_code == 404
