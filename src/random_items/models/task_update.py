from pydantic import BaseModel, Field


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=500)
