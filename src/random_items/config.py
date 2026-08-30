from pathlib import Path
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
_DEFAULT_DATABASE_URL = f"sqlite:///{PROJECT_ROOT / 'items.db'}"
_DEFAULT_CORS_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
]


def _parse_cors_origins(value: object) -> list[str]:
    if isinstance(value, list):
        origins = [str(item).strip() for item in value]
    elif isinstance(value, str):
        origins = [part.strip() for part in value.split(",")]
    else:
        raise ValueError("CORS_ORIGINS must be a string or list")

    origins = [origin for origin in origins if origin]
    if not origins:
        raise ValueError("CORS_ORIGINS must not be empty")
    return origins


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_title: str = "Task Manager API"
    database_url: str = _DEFAULT_DATABASE_URL
    cors_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=lambda: list(_DEFAULT_CORS_ORIGINS)
    )
    host: str = "127.0.0.1"
    port: int = 8000
    env: str = "development"

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: object) -> list[str]:
        return _parse_cors_origins(value)

    @property
    def reload(self) -> bool:
        return self.env.strip().lower() in {"development", "dev", "local"}


settings = Settings()
