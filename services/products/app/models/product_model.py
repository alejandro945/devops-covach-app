from typing import Optional
from sqlmodel import Field, SQLModel

class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    price: float
    image: str
    user_id: int

product = Product(name="Foo", description="A very nice Product", price=42.0, image="http://example.com/foo.jpg", user_id=1)
