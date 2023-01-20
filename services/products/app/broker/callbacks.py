import logging
import json

from pika.channel import Channel
from pika.spec import Basic, BasicProperties


logger = logging.getLogger(__name__)


def consumer_callback(
    ch: Channel, method: Basic.Deliver, properties: BasicProperties, body: bytes
):
    """
    Callback for consuming messages from the broker
    For now, just print the message body
    All the logic should that handles the message should be implemented here
    Finally, the message is acknowledged, which means that it is deleted from the queue
    In the real world, this should be done only if the message was processed successfully
    If the message was not processed successfully, it should be rejected
    """
    print(f"Consumed message: {body}")
    logger.debug(f"Channel: {ch}")
    logger.debug(f"Method: {method}")
    logger.debug(f"Properties: {properties}")
    logger.debug(f"Received message in transactions: {body}")

    # You can do stuff with the method and properties here
    # For example, you can check the routing key and do something based on that
    # if method.routing_key == 'backend':
    #     print('Routing key is backend')
    # if method.redelivered:
    #   print('Message was redelivered, meaning it probably failed before, so you can do something special here')

    # consumer_tag is the consumer tag that was specified when the consumer was created
    # method.consumer_tag

    # Properties can be used to pass application or header exchange specific properties, which may be used by the server
    # to implement additional functionality
    # properties.app_id
    # properties.content_type
    # properties.correlation_id

    # Here is the most important part
    # Process the message, do something with it and then acknowledge, or reject it
    # Parse the message body as a dict
    try:
        message = json.loads(body)
    except json.JSONDecodeError:
        logger.error("Error parsing message body as json")
        message = None

    if isinstance(message, dict):
        action = message.get("action")
        # This is some example logic that handles the message
        if action == "new-booking":
            # Do something with the message
            print("New booking")
            print(message.get("data"))
            # from core.models import Booking
            # booking = Booking.objects.create(
            #     user_id=message['data']['user_id'],
            #     room_id=message['data']['room_id'],
            #     start_date=message['data']['start_date'],
            #     end_date=message['data']['end_date'],
            # )
            print("I was able to create a booking")
            print("I will acknowledge the message")
            # Acknowledge the message by sending a Basic.Ack RPC method to the broker
            # This means that the message will be marked as successfull and be deleted from the queue
            # The delivery_tag is used to identify the message
            ch.basic_ack(delivery_tag=method.delivery_tag)
        else:
            # Do something else
            print("Other action, I don't know what to do")
            print("I will reject the message using basic_reject")
            # Reject the message by sending a Basic.Reject RPC method to the broker
            # This means that the message will be marked as failed and be deleted from the queue
            # The delivery_tag is used to identify the message
            ch.basic_reject(delivery_tag=method.delivery_tag, requeue=False)
    else:
        # This means the message is not a dict
        print('Body is not a dict, I don\'t know what to do, so I will simply print it')
        print('I will acknowledge the message, but mark it as failed')
        ch.basic_reject(delivery_tag=method.delivery_tag, requeue=False)

    """
    Positive acknowledgements simply instruct RabbitMQ to record a message as delivered
    and can be discarded.
    Negative acknowledgements with basic.reject have the same effect.
    The difference is primarily in the semantics: positive acknowledgements assume a message
    was successfully processed while their negative counterpart suggests that a
    delivery wasn't processed but still should be deleted.

    So it's important we use basic.ack or basic.reject to acknowledge the message only if we
    want to remove it from the queue.
    An alternative is to use basic.nack, which will requeue the message.
    Ex: ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
    https://www.rabbitmq.com/nack.html
    """
