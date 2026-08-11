from pydantic import BaseModel


class RandomItemsResponse(BaseModel):
    items: list[str]
    count: int
