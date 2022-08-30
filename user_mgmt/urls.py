from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import GroupAddUpdateDelete, LoginView
 
router = routers.SimpleRouter()
router.register(r'', GroupAddUpdateDelete,basename="group")

urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('api/', include(router.urls)),
]

