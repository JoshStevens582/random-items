from pydantic import BaseModel, Field

from random_items.models.task_status import TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    status: TaskStatus = TaskStatus.TODO
