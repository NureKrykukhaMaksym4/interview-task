from fastapi import APIRouter, Depends
from api.dependencies.services import get_tasks_service
from models.schemas.task import (
    TaskBaseSchema,
    TaskCreateResponse,
    TaskSchema,
    TaskUpdateSchema,
)
from services.task import TaskService

task_router = APIRouter(prefix="/tasks")

@task_router.get("/get_all/", response_model=list[TaskSchema])
async def get_tasks(
    search: str = "",
    sort: str = "desc",
    filter: str = "all",
    tasks_service: TaskService = Depends(get_tasks_service),
):
    return await tasks_service.get_tasks(search, sort, filter)

@task_router.post("/add/", response_model=TaskCreateResponse, status_code=201)
async def add_task(
    task_data: TaskBaseSchema, tasks_service: TaskService = Depends(get_tasks_service)
):
    return await tasks_service.add_task(task_data)


@task_router.patch("/{task_id}/update/", response_model=TaskSchema)
async def update_task(
    task_id: int,
    task_data: TaskUpdateSchema,
    tasks_service: TaskService = Depends(get_tasks_service),
):
    return await tasks_service.update_task(task_id, task_data)


@task_router.delete("/{task_id}/delete/", response_model=None, status_code=204)
async def delete_task(
    task_id: int, tasks_service: TaskService = Depends(get_tasks_service)
):
    await tasks_service.delete_task(task_id)
