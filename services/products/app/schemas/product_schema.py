# Product schema to be sent to RabbitMQ

from pydantic import BaseModel

class ProductSchema(BaseModel):
    product_id: int
    name: str
    description: str
    price: float
    image: str

class ProductCreateSchema(BaseModel):
    name: str
    description: str
    price: float
    image: str
