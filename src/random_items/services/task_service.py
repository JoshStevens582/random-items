from sqlalchemy.orm import Session

from random_items.models.task_create import TaskCreate
from random_items.models.task_list_response import TaskListResponse
from random_items.models.task_priority import TaskPriority
from random_items.models.task_response import TaskResponse
from random_items.models.task_status import TaskStatus
from random_items.models.task_update import TaskUpdate
from random_items.repositories.task_repository import TaskRepository


class TaskService:
    def __init__(self, repository: TaskRepository | None = None) -> None:
        self._repository = repository or TaskRepository()

    def create(self, db: Session, payload: TaskCreate) -> TaskResponse:
        task = self._repository.create(db, payload)
        return TaskResponse.model_validate(task)

    def get_all(
        self,
        db: Session,
        status: TaskStatus | None = None,
        priority: TaskPriority | None = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> TaskListResponse:
        tasks = self._repository.get_all(
            db,
            status=status,
            priority=priority,
            sort_by=sort_by,
            sort_order=sort_order,
        )
        responses = [TaskResponse.model_validate(task) for task in tasks]
        return TaskListResponse(tasks=responses, count=len(responses))

    def get_by_id(self, db: Session, task_id: int) -> TaskResponse | None:
        task = self._repository.get_by_id(db, task_id)
        if task is None:
            return None
        return TaskResponse.model_validate(task)

    def update(
        self,
        db: Session,
        task_id: int,
        payload: TaskUpdate,
    ) -> TaskResponse | None:
        task = self._repository.get_by_id(db, task_id)
        if task is None:
            return None
        updated_task = self._repository.update(db, task, payload)
        return TaskResponse.model_validate(updated_task)

    def delete(self, db: Session, task_id: int) -> bool:
        task = self._repository.get_by_id(db, task_id)
        if task is None:
            return False
        self._repository.delete(db, task)
        return True
