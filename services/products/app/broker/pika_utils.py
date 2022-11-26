import logging

logger = logging.getLogger(__name__)


def aknowledge_message(ch, delivery_tag):
    """
        Acknowledge a message from Rabbitmq
    """
    if ch.is_open:
        ch.basic_ack(delivery_tag)
    else:
        logger.warning('Error trying to acknowledge message. Channel is closed')
        logger.warning(f'Channel: {ch}')
        logger.warning(f'Delivery tag: {delivery_tag}')


def reject_message(ch, delivery_tag):
    """
        Reject a message from Rabbitmq
    """
    if ch.is_open:
        ch.basic_reject(delivery_tag)
    else:
        logger.warning('Error trying to reject message. Channel is closed')
        logger.warning(f'Channel: {ch}')
        logger.warning(f'Delivery tag: {delivery_tag}')
