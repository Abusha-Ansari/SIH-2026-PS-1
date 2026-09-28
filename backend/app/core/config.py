import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "THUNDER-X"
    APP_ENV: str = "development"
    DEBUG: bool = True
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    PREDICTION_PROVIDER: str = "mock"  # "mock" or "ml"
    ML_SERVICE_URL: str = "http://localhost:8001"
    DEFAULT_SCENARIO: str = "scenario-developing"
    MOCK_DATA_DIR: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../../data/mock")
    )
    REPLAY_DATA_DIR: str = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../../data/replay")
    )

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()
