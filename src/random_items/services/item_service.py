import random

from sqlalchemy.orm import Session

from random_items.models.item_create import ItemCreate
from random_items.models.item_list_response import ItemListResponse
from random_items.models.item_response import ItemResponse
from random_items.models.item_update import ItemUpdate
from random_items.models.random_items_response import RandomItemsResponse
from random_items.repositories.item_repository import ItemRepository


class ItemService:
    def __init__(self, repository: ItemRepository | None = None) -> None:
        self._repository = repository or ItemRepository()

    def create(self, db: Session, payload: ItemCreate) -> ItemResponse:
        item = self._repository.create(db, payload)
        return ItemResponse.model_validate(item)

    def get_all(self, db: Session) -> ItemListResponse:
        items = self._repository.get_all(db)
        responses = [ItemResponse.model_validate(item) for item in items]
        return ItemListResponse(items=responses, count=len(responses))

    def get_by_id(self, db: Session, item_id: int) -> ItemResponse | None:
        item = self._repository.get_by_id(db, item_id)
        if item is None:
            return None
        return ItemResponse.model_validate(item)

    def update(
        self,
        db: Session,
        item_id: int,
        payload: ItemUpdate,
    ) -> ItemResponse | None:
        item = self._repository.get_by_id(db, item_id)
        if item is None:
            return None
        updated_item = self._repository.update(db, item, payload)
        return ItemResponse.model_validate(updated_item)

    def delete(self, db: Session, item_id: int) -> bool:
        item = self._repository.get_by_id(db, item_id)
        if item is None:
            return False
        self._repository.delete(db, item)
        return True

    def get_randomized(self, db: Session) -> RandomItemsResponse:
        items = self._repository.get_all(db)
        contents = [item.content for item in items]
        random.shuffle(contents)
        return RandomItemsResponse(items=contents, count=len(contents))
