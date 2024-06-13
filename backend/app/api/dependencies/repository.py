from typing import  Type
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from api.dependencies.session import get_async_session
from reposiories.base import BaseRepository

def get_repository(
    repo_type: Type[BaseRepository],
):
    def _get_repo(
        async_session: AsyncSession = Depends(get_async_session),
    ):
        return repo_type(async_session=async_session)

    return _get_repo
