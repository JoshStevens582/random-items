from pydantic import BaseModel

from random_items.models.task_response import TaskResponse


class TaskListResponse(BaseModel):
    tasks: list[TaskResponse]
    count: int
