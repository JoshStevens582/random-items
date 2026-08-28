from datetime import date

from pydantic import BaseModel, Field

from random_items.models.task_priority import TaskPriority
from random_items.models.task_status import TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    status: TaskStatus = TaskStatus.TODO
    priority: TaskPriority = TaskPriority.MEDIUM
    due_date: date | None = None
