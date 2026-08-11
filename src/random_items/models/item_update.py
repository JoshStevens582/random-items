from pydantic import BaseModel, Field


class ItemUpdate(BaseModel):
    content: str | None = Field(default=None, min_length=1, max_length=500)
