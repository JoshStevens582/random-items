from datetime import datetime

from pydantic import BaseModel, ConfigDict

from random_items.models.task_status import TaskStatus


class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    status: TaskStatus
    created_at: datetime
