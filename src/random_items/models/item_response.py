from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    content: str
    created_at: datetime
