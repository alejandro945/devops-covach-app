from rest_framework.serializers import ModelSerializer

from core.models import User


class ExternalAuthSerializer(ModelSerializer):
    """
    Serializer for external authentication.
    It is used to retrieve the user id based on a jwt token.
    """

    class Meta:
        model = User
        fields = ["id", "user_permissions", "groups"]
