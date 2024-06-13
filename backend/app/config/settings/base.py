import pathlib
import decouple
from pydantic_settings import BaseSettings

ROOT = pathlib.Path(__file__).parent.parent.parent.resolve()

class BackendBaseSettings(BaseSettings):
    POSTGRES_USER: str = decouple.config("POSTGRES_USER")
    POSTGRES_PASSWORD: str = decouple.config("POSTGRES_PASSWORD")
    POSTGRES_DATABASE: str = decouple.config("POSTGRES_DATABASE")
    POSTGRES_PORT: int = decouple.config("POSTGRES_PORT", cast=int)
    POSTGRES_HOST: str = decouple.config("POSTGRES_HOST")
    IS_ALLOWED_CREDENTIALS: bool = decouple.config("IS_ALLOWED_CREDENTIALS", cast=bool)
    FRONT_HOST: str = decouple.config("FRONT_HOST")
    FRONT_PORT: int = decouple.config("FRONT_PORT", cast=int)

    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:3000", 
        "http://0.0.0.0:3000",
    ]
    ALLOWED_METHODS: list[str] = ["*"]
    ALLOWED_HEADERS: list[str] = ["*"]

    class Config:
        env_file = f"{ROOT}/.env"

settings = BackendBaseSettings()
