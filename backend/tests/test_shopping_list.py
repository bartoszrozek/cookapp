from datetime import date, timedelta
from typing import Any

from app.main import app  # ty: ignore
from fastapi.testclient import TestClient
from .test_schedule import create_meal_type

Json = dict[str, Any]
client = TestClient(app)


def _create_recipe(client: TestClient, name: str = "SL Recipe") -> int:
    payload: Json = {"name": name, "ingredients": [{"name": "Salt", "quantity": 2.0, "unit": "tsp"}]}
    res = client.post("/recipes/", json=payload)
    return res.json()["id"]


def _create_schedule_for_recipe(client: TestClient, recipe_id: int, user_headers: dict[str,str] | None = None) -> int:
    d = (date.today() + timedelta(days=1)).isoformat()
    meal_type_id = create_meal_type(client, name="ShoppingListMealType")
    payload: Json = {"recipe_id": recipe_id, "date": d, "meal_type": meal_type_id}
    if user_headers:
        res = client.post("/schedule/", json=payload, headers=user_headers)
    else:
        res = client.post("/schedule/", json=payload)
    return res.json().get("id")


def test_shopping_list_requires_auth(client: TestClient):
    # create recipe and schedule without auth should fail to create schedule
    _create_recipe(client)
    res = client.get(f"/shopping_list/?start_date={(date.today()).isoformat()}&end_date={(date.today()+timedelta(days=3)).isoformat()}")
    assert res.status_code in (401,403)


def test_shopping_list_returns_items_with_auth(client: TestClient, auth_headers: dict[str,str]):
    recipe_id = _create_recipe(client)
    # need a schedule owned by the authenticated user
    _create_schedule_for_recipe(client, recipe_id, user_headers=auth_headers)
    start = date.today().isoformat()
    end = (date.today() + timedelta(days=7)).isoformat()
    res = client.get(f"/shopping_list/?start_date={start}&end_date={end}", headers=auth_headers)
    assert res.status_code == 200
    assert isinstance(res.json(), list)
