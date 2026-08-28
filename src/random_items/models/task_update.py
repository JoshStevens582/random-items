from datetime import date

from pydantic import BaseModel, Field

from random_items.models.task_priority import TaskPriority
from random_items.models.task_status import TaskStatus


class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=500)
    status: TaskStatus | None = None
    priority: TaskPriority | None = None
    due_date: date | None = None
