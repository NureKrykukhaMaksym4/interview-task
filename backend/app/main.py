from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.settings.base import settings
from api.routes.tasks import task_router
import models.database.task as start

@asynccontextmanager
async def lifespan(app: FastAPI):
    await start.init_database()
    yield
    await start.dispose_database()
    
app = FastAPI(title="Test app", lifespan=lifespan)

app.include_router(task_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=settings.IS_ALLOWED_CREDENTIALS,
    allow_methods=settings.ALLOWED_METHODS,
    allow_headers=settings.ALLOWED_HEADERS,
)
