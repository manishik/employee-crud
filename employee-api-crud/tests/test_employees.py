from fastapi.testclient import TestClient

from app.main import app
from app.services.employee_service import employee_service


client = TestClient(app)


def setup_function() -> None:
    employee_service.clear()


def employee_payload() -> dict[str, str]:
    return {
        "name": "Ada Lovelace",
        "department": "Engineering",
        "title": "Software Engineer",
    }


def test_create_and_list_employee() -> None:
    response = client.post("/api/v1/employees", json=employee_payload())

    assert response.status_code == 201
    assert response.json()["id"] == 1
    assert client.get("/api/v1/employees").json()[0]["name"] == "Ada Lovelace"


def test_get_update_and_delete_employee() -> None:
    created = client.post("/api/v1/employees", json=employee_payload()).json()

    fetched = client.get(f"/api/v1/employees/{created['id']}")
    assert fetched.status_code == 200

    updated = {**employee_payload(), "title": "Computer Scientist"}
    response = client.put(f"/api/v1/employees/{created['id']}", json=updated)
    assert response.status_code == 200
    assert response.json()["title"] == "Computer Scientist"

    response = client.delete(f"/api/v1/employees/{created['id']}")
    assert response.status_code == 204
    assert client.get(f"/api/v1/employees/{created['id']}").status_code == 404


def test_missing_employee_returns_not_found() -> None:
    assert client.get("/api/v1/employees/999").status_code == 404
    assert client.delete("/api/v1/employees/999").status_code == 404
