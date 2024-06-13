from sqlalchemy import SmallInteger
from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base
from config.settings.base import settings
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] 
    is_done: Mapped[bool] = mapped_column(default=False)
    priority: Mapped[int] = mapped_column(SmallInteger, default=1)

engine = create_async_engine(f"postgresql+asyncpg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DATABASE}", echo=True)
async_session = async_sessionmaker(engine, expire_on_commit=False)

async def init_database() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def dispose_database():
    await engine.dispose()