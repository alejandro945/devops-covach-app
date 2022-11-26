import logging

from fastapi import FastAPI, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.product_model import Product
from app.schemas.product_schema import ProductSchema, ProductCreateSchema
from app.db import get_session
from app.broker.producer import Producer
from app.auth import auth_wrapper

app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

log = logging.getLogger(__name__)


def publish_product(product: Product):
    product_schema = ProductSchema(
        product_id=product.id,
        name=product.name,
        description=product.description,
        price=product.price,
        image=product.image,
    )
    producer = Producer()
    with producer.publish(body=product_schema.dict(), routing_key='products_search') as _:
        log.info("Published to RabbitMQ")


@app.post('/products', status_code=201)
async def create_product(
    product: ProductCreateSchema,
    background_tasks: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
    user=Depends(auth_wrapper)
):
    user_id = user.id
    if not user_id:
        return {'message': 'User not found'}
    print("user_id", user_id)

    product_obj = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        image=product.image,
        user_id=user_id
    )

    if not product_obj.user_id:
        return {'message': 'user id is null??'}
    session.add(product_obj)
    await session.commit()
    background_tasks.add_task(publish_product, product_obj)
    return product_obj


@app.get('/products')
async def get_products(session: AsyncSession = Depends(get_session)):
    stmt = select(Product).order_by(Product.id)
    products = await session.execute(stmt)
    return products.scalars().all()
