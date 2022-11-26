import logging

import pika

from app.config import get_settings
from app.broker.broker import Broker
from app.broker.callbacks import consumer_callback

logger = logging.getLogger(__name__)
settings = get_settings()


class Consumer(Broker):
    """
        Class that handles the consumer
        Once the consumer is started, it will consume messages from RabbitMQ
        Usage:
            consumer = Consumer()
            consumer.consume()
    """

    def consume(self):
        """
        Method that consumes messages from RabbitMQ.
        No need to use a context manager here, since 'start_consuming' is a blocking method.
        """
        logger.info("About to start consuming messages from RabbitMQ")
        self.connect()
        self.channel.queue_declare(queue=settings.product_queue, durable=True)
        self.channel.basic_consume(
            queue=settings.product_queue, on_message_callback=consumer_callback, auto_ack=False
        )
        logger.info(f"Connected to Rabbit, on the queue '{settings.product_queue}'")
        try:
            # Start consuming (blocks) and wait for messages
            # It will not advance to the next line until the consumer is cancelled
            # The consumer can be cancelled by interrupting the program via CTRL+C,
            # or by calling the stopping the docker container where the consumer is running
            # In case RabbitMQ is stopped, the consumer will not be able to connect and will raise an exception
            self.channel.start_consuming()
        except KeyboardInterrupt as e:
            logger.info("Stopping consumer by keyboard interrupt")
            logger.error(e)
        except pika.exceptions.AMQPConnectionError as e:
            logger.info("Stopping consumer by RabbitMQ connection error")
            logger.error(e)
        except pika.exceptions.ChannelClosed as e:
            logger.info("Stopping consumer by RabbitMQ channel closed")
            logger.error(e)
        except pika.exceptions.StreamLostError as e:
            logger.info("Stopping consumer by RabbitMQ stream lost")
            logger.error(e)
        except pika.exceptions.ConnectionClosed as e:
            logger.info("Stopping consumer by RabbitMQ connection closed")
            logger.error(e)
        finally:
            self.disconnect()
