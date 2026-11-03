import os
from pathlib import Path
from sqlalchemy.engine import URL
from pydantic_settings import BaseSettings, SettingsConfigDict

# Look for .env in backend/ or root directory
ENV_FILE_PATH = Path(__file__).resolve().parent / ".env"
ROOT_ENV_FILE_PATH = Path(__file__).resolve().parent.parent / ".env"

env_to_use = str(ENV_FILE_PATH if ENV_FILE_PATH.exists() else ROOT_ENV_FILE_PATH)

class Settings(BaseSettings):
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "business_dashboard"
    BACKEND_PORT: int = 8000
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000"

    model_config = SettingsConfigDict(
        env_file=env_to_use,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def get_url(self, database: str | None = None) -> URL:
        return URL.create(
            drivername="mysql+pymysql",
            username=self.DB_USER,
            password=self.DB_PASSWORD,
            host=self.DB_HOST,
            port=self.DB_PORT,
            database=self.DB_NAME if database is None else database,
            query={"charset": "utf8mb4"}
        )

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
