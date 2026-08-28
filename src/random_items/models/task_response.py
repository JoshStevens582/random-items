from datetime import date, datetime

from pydantic import BaseModel, ConfigDict

from random_items.models.task_priority import TaskPriority
from random_items.models.task_status import TaskStatus


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    status: TaskStatus
    priority: TaskPriority
    due_date: date | None
    created_at: datetime
