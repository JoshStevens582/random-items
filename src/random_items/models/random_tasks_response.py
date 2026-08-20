from pydantic import BaseModel


class RandomTasksResponse(BaseModel):
    tasks: list[str]
    count: int
