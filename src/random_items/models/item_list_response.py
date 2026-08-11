from pydantic import BaseModel

from random_items.models.item_response import ItemResponse


class ItemListResponse(BaseModel):
    items: list[ItemResponse]
    count: int
