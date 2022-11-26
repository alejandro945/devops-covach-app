from rest_framework import viewsets, mixins
from rest_framework.response import Response
from core.models import User
from core.serializers import ExternalAuthSerializer


class ExternalAuthViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = ExternalAuthSerializer
    queryset = User.objects.all()
    http_method_names: list[str] = ["get"]

    def get_queryset(self):
        return super().get_queryset()

    def list(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return Response({"detail": "User not found"}, status=404)
        return Response(
            ExternalAuthSerializer(
                instance=user,
                many=False,
            ).data
        )
