from fastapi.testclient import TestClient


def test_create_item(client: TestClient) -> None:
    response = client.post("/items", json={"content": "apple"})
    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "apple"
    assert "id" in data
    assert "created_at" in data


def test_list_items_empty(client: TestClient) -> None:
    response = client.get("/items")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["count"] == 0


def test_list_items(client: TestClient) -> None:
    client.post("/items", json={"content": "apple"})
    client.post("/items", json={"content": "banana"})

    response = client.get("/items")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 2
    contents = [item["content"] for item in data["items"]]
    assert contents == ["apple", "banana"]


def test_get_item(client: TestClient) -> None:
    create_response = client.post("/items", json={"content": "apple"})
    item_id = create_response.json()["id"]

    response = client.get(f"/items/{item_id}")
    assert response.status_code == 200
    assert response.json()["content"] == "apple"


def test_get_item_not_found(client: TestClient) -> None:
    response = client.get("/items/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Item 999 not found"


def test_update_item(client: TestClient) -> None:
    create_response = client.post("/items", json={"content": "apple"})
    item_id = create_response.json()["id"]

    response = client.put(f"/items/{item_id}", json={"content": "orange"})
    assert response.status_code == 200
    assert response.json()["content"] == "orange"


def test_update_item_not_found(client: TestClient) -> None:
    response = client.put("/items/999", json={"content": "orange"})
    assert response.status_code == 404
    assert response.json()["detail"] == "Item 999 not found"


def test_delete_item(client: TestClient) -> None:
    create_response = client.post("/items", json={"content": "apple"})
    item_id = create_response.json()["id"]

    response = client.delete(f"/items/{item_id}")
    assert response.status_code == 204
    assert response.content == b""
    assert client.get(f"/items/{item_id}").status_code == 404


def test_delete_item_not_found(client: TestClient) -> None:
    response = client.delete("/items/999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Item 999 not found"


def test_create_item_empty_content(client: TestClient) -> None:
    response = client.post("/items", json={"content": ""})
    assert response.status_code == 422


def test_create_item_too_long_content(client: TestClient) -> None:
    response = client.post("/items", json={"content": "x" * 501})
    assert response.status_code == 422


def test_get_random_items(client: TestClient) -> None:
    client.post("/items", json={"content": "apple"})
    client.post("/items", json={"content": "banana"})
    client.post("/items", json={"content": "cherry"})

    response = client.get("/items/random")
    assert response.status_code == 200
    data = response.json()
    assert data["count"] == 3
    assert sorted(data["items"]) == ["apple", "banana", "cherry"]


def test_get_random_items_empty(client: TestClient) -> None:
    response = client.get("/items/random")
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["count"] == 0
