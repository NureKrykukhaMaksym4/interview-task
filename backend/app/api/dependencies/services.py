from fastapi import Depends
from reposiories.task import TaskRepository
from services.task import TaskService
from api.dependencies.repository import get_repository

def get_tasks_service(
    task_repository=Depends(get_repository(TaskRepository)),
):
    service = TaskService(task_repository)
    return service
