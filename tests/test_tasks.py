from fastapi.testclient import TestClient


def test_create_task(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": "apple"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "apple"
    assert data["status"] == "todo"
    assert data["priority"] == "medium"
    assert data["due_date"] is None
    assert "id" in data
    assert "created_at" in data


def test_list_tasks_empty(client: TestClient) -> None:
    response = client.get("/tasks")
    assert response.status_code == 200
    data = response.json()
    assert data["tasks"] == []
    assert data["count"] == 0


def test_list_tasks(client: TestClient) -> None:
    client.post("/tasks", json={"title": "apple"})
    client.post("/tasks", json={"title": "banana"})

    response = client.get("/tasks")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 2
    titles = [task["title"] for task in data["tasks"]]
    assert titles == ["apple", "banana"]


def test_get_task(client: TestClient) -> None:
    create_response = client.post("/tasks", json={"title": "apple"})
    task_id = create_response.json()["id"]

    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["title"] == "apple"
    assert response.json()["priority"] == "medium"
    assert response.json()["due_date"] is None


def test_get_task_not_found(client: TestClient) -> None:
    response = client.get("/tasks/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task 999 not found"


def test_update_task(client: TestClient) -> None:
    create_response = client.post("/tasks", json={"title": "apple"})
    task_id = create_response.json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"title": "orange"})
    assert response.status_code == 200
    assert response.json()["title"] == "orange"


def test_update_task_not_found(client: TestClient) -> None:
    response = client.put("/tasks/999", json={"title": "orange"})
    assert response.status_code == 404
    assert response.json()["detail"] == "Task 999 not found"


def test_delete_task(client: TestClient) -> None:
    create_response = client.post("/tasks", json={"title": "apple"})
    task_id = create_response.json()["id"]

    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 204
    assert response.content == b""
    assert client.get(f"/tasks/{task_id}").status_code == 404


def test_delete_task_not_found(client: TestClient) -> None:
    response = client.delete("/tasks/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Task 999 not found"


def test_create_task_empty_title(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": ""})
    assert response.status_code == 422


def test_create_task_too_long_title(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": "x" * 501})
    assert response.status_code == 422


def test_create_task_with_status(client: TestClient) -> None:
    response = client.post(
        "/tasks",
        json={"title": "apple", "status": "in_progress"},
    )
    assert response.status_code == 201
    assert response.json()["status"] == "in_progress"


def test_create_task_invalid_status(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": "apple", "status": "blocked"})
    assert response.status_code == 422


def test_create_task_with_priority_and_due_date(client: TestClient) -> None:
    response = client.post(
        "/tasks",
        json={
            "title": "buy milk",
            "priority": "high",
            "due_date": "2026-09-01",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "buy milk"
    assert data["priority"] == "high"
    assert data["due_date"] == "2026-09-01"


def test_create_task_invalid_priority(client: TestClient) -> None:
    response = client.post(
        "/tasks",
        json={"title": "buy milk", "priority": "urgent"},
    )
    assert response.status_code == 422


def test_update_task_status(client: TestClient) -> None:
    create_response = client.post("/tasks", json={"title": "apple"})
    task_id = create_response.json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"status": "done"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "done"
    assert data["title"] == "apple"


def test_update_task_invalid_status(client: TestClient) -> None:
    create_response = client.post("/tasks", json={"title": "apple"})
    task_id = create_response.json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"status": "blocked"})
    assert response.status_code == 422


def test_update_task_priority_and_due_date(client: TestClient) -> None:
    create_response = client.post("/tasks", json={"title": "apple"})
    task_id = create_response.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={"priority": "low", "due_date": "2026-10-15"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["priority"] == "low"
    assert data["due_date"] == "2026-10-15"


def test_update_task_clear_due_date(client: TestClient) -> None:
    create_response = client.post(
        "/tasks",
        json={"title": "apple", "due_date": "2026-10-15"},
    )
    task_id = create_response.json()["id"]
    assert create_response.json()["due_date"] == "2026-10-15"

    response = client.put(
        f"/tasks/{task_id}",
        json={"due_date": None},
    )
    assert response.status_code == 200
    assert response.json()["due_date"] is None


def test_update_task_invalid_priority(client: TestClient) -> None:
    create_response = client.post("/tasks", json={"title": "apple"})
    task_id = create_response.json()["id"]

    response = client.put(f"/tasks/{task_id}", json={"priority": "critical"})
    assert response.status_code == 422
