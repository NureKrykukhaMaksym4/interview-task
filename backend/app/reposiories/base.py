from typing import Any, Type, Iterable
from itertools import chain
from pydantic import BaseModel
from sqlalchemy import delete, update, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import Select

class BaseRepository:
    model: Any = None

    def __init__(self, 
                 async_session: AsyncSession):
        self.async_session = async_session

    def unpack(self, 
               collection: Iterable):
        return list(chain.from_iterable(collection))

    async def exists(self, 
                     query: Select):
        query = query.with_only_columns(self.model.id)
        response = await self.async_session.execute(query)
        result = response.first()
        return bool(result)

    async def exists_by_id(self, 
                           instance_id: int):
        query = select(self.model).where(self.model.id == instance_id)
        return await self.exists(query)

    async def create(self, 
                     model_data: Type[BaseModel]):
        new_instance = self.model(**model_data.model_dump())
        self.async_session.add(new_instance)
        await self.async_session.commit()
        return new_instance

    async def get_many(self,
                        query: Select):
        response = await self.async_session.execute(query)
        result = response.unique().all()
        return result

    async def get_instance(self, 
                           query: Select):
        response = await self.async_session.execute(query)
        result = response.unique().scalar_one_or_none()
        return result

    async def update(self, 
                     instance_id: int, 
                     model_data: Type[BaseModel]):
        query = (update(self.model).where(self.model.id == instance_id).values(
                {
                    key: value
                    for key, value in model_data.model_dump().items()
                    if value is not None
                }
            )
            .returning(self.model)
        )
        res = await self.async_session.execute(query)
        await self.async_session.commit()
        return res.unique().scalar_one()

    async def delete(self, instance_id: int):
        query = (delete(self.model).where(self.model.id == instance_id)
            .returning(self.model.id)
        )

        result = (await self.async_session.execute(query)).scalar_one()
        await self.async_session.commit()
        return result

    async def save(self, obj: Any):
        self.async_session.add(obj)
        await self.async_session.commit()
