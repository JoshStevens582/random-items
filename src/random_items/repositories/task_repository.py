from datetime import UTC, datetime

from sqlalchemy import asc, desc, nulls_last, select
from sqlalchemy.orm import Session

from random_items.db_models.task import Task
from random_items.models.task_create import TaskCreate
from random_items.models.task_priority import TaskPriority
from random_items.models.task_status import TaskStatus
from random_items.models.task_update import TaskUpdate


class TaskRepository:
    def create(self, db: Session, payload: TaskCreate) -> Task:
        task = Task(
            title=payload.title,
            status=payload.status.value,
            priority=payload.priority.value,
            due_date=payload.due_date,
            created_at=datetime.now(UTC),
        )
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    def get_all(
        self,
        db: Session,
        status: TaskStatus | None = None,
        priority: TaskPriority | None = None,
        sort_by: str = "created_at",
        sort_order: str = "desc",
    ) -> list[Task]:
        statement = select(Task)
        if status is not None:
            statement = statement.where(Task.status == status.value)
        if priority is not None:
            statement = statement.where(Task.priority == priority.value)

        if sort_by == "due_date":
            order_col = Task.due_date
            if sort_order == "desc":
                statement = statement.order_by(nulls_last(desc(order_col)), Task.id.desc())
            else:
                statement = statement.order_by(nulls_last(asc(order_col)), Task.id.asc())
        elif sort_by == "priority":
            # high > medium > low when sorting
            if sort_order == "desc":
                statement = statement.order_by(Task.priority.desc(), Task.id.desc())
            else:
                statement = statement.order_by(Task.priority.asc(), Task.id.asc())
        elif sort_by == "id":
            if sort_order == "asc":
                statement = statement.order_by(Task.id.asc())
            else:
                statement = statement.order_by(Task.id.desc())
        else:
            # default: created_at
            if sort_order == "asc":
                statement = statement.order_by(Task.created_at.asc(), Task.id.asc())
            else:
                statement = statement.order_by(Task.created_at.desc(), Task.id.desc())

        return list(db.scalars(statement).all())

    def get_by_id(self, db: Session, task_id: int) -> Task | None:
        return db.get(Task, task_id)

    def update(self, db: Session, task: Task, payload: TaskUpdate) -> Task:
        if payload.title is not None:
            task.title = payload.title
        if payload.status is not None:
            task.status = payload.status.value
        if payload.priority is not None:
            task.priority = payload.priority.value
        if "due_date" in payload.model_fields_set:
            task.due_date = payload.due_date
        elif payload.due_date is not None:
            task.due_date = payload.due_date
        db.commit()
        db.refresh(task)
        return task

    def delete(self, db: Session, task: Task) -> None:
        db.delete(task)
        db.commit()
