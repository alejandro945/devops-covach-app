from functools import lru_cache
from os import environ
from pydantic import BaseSettings

class Settings(BaseSettings):
    rabbitmq_url: str = environ.get("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
    product_queue: str = environ.get("PRODUCT_QUEUE", "product_queue")
    database_url: str = environ.get("DATABASE_URL")
    auth_service_base_url: str = environ.get("AUTH_SERVICE_BASE_URL", "http://localhost:8000")

@lru_cache()
def get_settings():
    return Settings()