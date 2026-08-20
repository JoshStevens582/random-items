from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from random_items.db_models.task import Task
from random_items.models.task_create import TaskCreate
from random_items.models.task_update import TaskUpdate


class TaskRepository:
    def create(self, db: Session, payload: TaskCreate) -> Task:
        task = Task(title=payload.title, created_at=datetime.now(UTC))
        db.add(task)
        db.commit()
        db.refresh(task)
        return task

    def get_all(self, db: Session) -> list[Task]:
        statement = select(Task).order_by(Task.id)
        return list(db.scalars(statement).all())

    def get_by_id(self, db: Session, task_id: int) -> Task | None:
        return db.get(Task, task_id)

    def update(self, db: Session, task: Task, payload: TaskUpdate) -> Task:
        if payload.title is not None:
            task.title = payload.title
        db.commit()
        db.refresh(task)
        return task

    def delete(self, db: Session, task: Task) -> None:
        db.delete(task)
        db.commit()
