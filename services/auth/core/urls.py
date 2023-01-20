from rest_framework import routers
from core.views import ExternalAuthViewSet

router = routers.DefaultRouter()
router.register(r"externalauth", ExternalAuthViewSet)
