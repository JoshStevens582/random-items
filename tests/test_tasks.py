from fastapi.testclient import TestClient


def test_create_task(client: TestClient) -> None:
    response = client.post("/tasks", json={"title": "apple"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "apple"
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


def test_get_random_tasks(client: TestClient) -> None:
    client.post("/tasks", json={"title": "apple"})
    client.post("/tasks", json={"title": "banana"})
    client.post("/tasks", json={"title": "cherry"})

    response = client.get("/tasks/random")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 3
    assert sorted(data["tasks"]) == ["apple", "banana", "cherry"]


def test_get_random_tasks_empty(client: TestClient) -> None:
    response = client.get("/tasks/random")
    assert response.status_code == 200
    data = response.json()
    assert data["tasks"] == []
    assert data["count"] == 0
