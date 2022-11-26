import logging
import pika
from pika.connection import Connection
from pika.channel import Channel

from app.config import get_settings

logger = logging.getLogger(__name__)


class Broker:
    """
    Base class to handle connecting and disconnecting from RabbitMQ
    Please do not use this class directly, use the Consumer or Producer classes instead
    """

    def __init__(self):
        self.connection_parameters: pika.ConnectionParameters = pika.URLParameters(get_settings().rabbitmq_url)
        self.connection: Connection = None
        self.channel: Channel = None

    def connect(self):
        """
        Connect to RabbitMQ
        """
        logger.info("Connecting to RabbitMQ")
        self.connection = pika.BlockingConnection(
            self.connection_parameters
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(get_settings().product_queue, durable=True)
        logger.info("Connected to RabbitMQ")

    def disconnect(self):
        """
        Disconnect from RabbitMQ
        """
        logger.info("Disconnecting from RabbitMQ")
        self.channel.close()
        self.connection.close()
        logger.info("Disconnected from RabbitMQ")
