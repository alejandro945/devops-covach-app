import json


def transform_dict_to_bytes(data: dict) -> bytes:
    """
    Transform a dict to bytes
    """
    try:
        return bytes(json.dumps(data), encoding="utf-8")
    except Exception as e:
        raise Exception(f"Error transforming dict to bytes: {e}")
