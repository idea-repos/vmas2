from django.urls import path, include
from rest_framework import routers
from .views import TargetAddUpdateDelete

router = routers.SimpleRouter()
router.register(r'targets', TargetAddUpdateDelete,basename="target")

urlpatterns = [
    path('api/', include(router.urls)),
]
