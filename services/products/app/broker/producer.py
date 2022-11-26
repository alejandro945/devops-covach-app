import logging

from contextlib import contextmanager
from typing import Union

from app.config import get_settings
from app.broker.broker import Broker
from app.broker.parse_utils import transform_dict_to_bytes

logger = logging.getLogger(__name__)
settings = get_settings()

class Producer(Broker):
    """
    Class that allows publishing messages to RabbitMQ
    Once the message is published, the connection is closed and the context manager exits
    Usage:
        with Producer() as producer:
            producer.publish(message='Hello World!', routing_key='backend')
    """

    @contextmanager
    def publish(self, body: Union[bytes, str, dict], exchange="", routing_key=settings.product_queue, properties=None):
        """
        Method that publishes messages to RabbitMQ
        """
        logger.info("Publishing to RabbitMQ with exchange: %s and routing_key: %s", exchange, routing_key)
        if isinstance(body, dict):
            body = transform_dict_to_bytes(body)
        try:
            self.connect()
            self.channel.basic_publish(exchange=exchange, routing_key=routing_key, body=body)
            logger.info("Published to RabbitMQ with exchange: %s and routing_key: %s", exchange, routing_key)
            yield
        finally:
            self.disconnect()
