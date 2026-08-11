from fastapi import APIRouter, HTTPException, Response, status

from random_items.dependencies import DbSession
from random_items.models.item_create import ItemCreate
from random_items.models.item_list_response import ItemListResponse
from random_items.models.item_response import ItemResponse
from random_items.models.item_update import ItemUpdate
from random_items.models.random_items_response import RandomItemsResponse
from random_items.services.item_service import ItemService

router = APIRouter()
item_service = ItemService()


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(payload: ItemCreate, db: DbSession) -> ItemResponse:
    return item_service.create(db, payload)


@router.get("", response_model=ItemListResponse)
def list_items(db: DbSession) -> ItemListResponse:
    return item_service.get_all(db)


@router.get("/random", response_model=RandomItemsResponse)
def get_random_items(db: DbSession) -> RandomItemsResponse:
    return item_service.get_randomized(db)


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: DbSession) -> ItemResponse:
    item = item_service.get_by_id(db, item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} not found",
        )
    return item


@router.put("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: int,
    payload: ItemUpdate,
    db: DbSession,
) -> ItemResponse:
    item = item_service.update(db, item_id, payload)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} not found",
        )
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: DbSession) -> Response:
    deleted = item_service.delete(db, item_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Item {item_id} not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
