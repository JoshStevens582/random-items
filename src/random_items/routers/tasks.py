from typing import Literal

from fastapi import APIRouter, HTTPException, Query, Response, status

from random_items.dependencies import DbSession
from random_items.models.task_create import TaskCreate
from random_items.models.task_list_response import TaskListResponse
from random_items.models.task_priority import TaskPriority
from random_items.models.task_response import TaskResponse
from random_items.models.task_status import TaskStatus
from random_items.models.task_update import TaskUpdate
from random_items.services.task_service import TaskService

router = APIRouter()
task_service = TaskService()


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: DbSession) -> TaskResponse:
    return task_service.create(db, payload)


@router.get("", response_model=TaskListResponse)
def list_tasks(
    db: DbSession,
    status: TaskStatus | None = Query(default=None, description="Filter tasks by status"),
    priority: TaskPriority | None = Query(default=None, description="Filter tasks by priority"),
    sort_by: Literal["created_at", "due_date", "priority", "id"] = Query(
        default="created_at",
        description="Field to sort tasks by",
    ),
    sort_order: Literal["asc", "desc"] = Query(
        default="desc",
        description="Sort direction (asc or desc)",
    ),
) -> TaskListResponse:
    return task_service.get_all(
        db,
        status=status,
        priority=priority,
        sort_by=sort_by,
        sort_order=sort_order,
    )


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: DbSession) -> TaskResponse:
    task = task_service.get_by_id(db, task_id)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )
    return task


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: DbSession,
) -> TaskResponse:
    task = task_service.update(db, task_id, payload)
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: DbSession) -> Response:
    deleted = task_service.delete(db, task_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task {task_id} not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
