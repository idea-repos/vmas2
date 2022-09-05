from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import LoginView, GroupAddUpdateDelete, PermissionsGetUpdate
 
router = routers.SimpleRouter()
router.register(r'roles', GroupAddUpdateDelete,basename="group")
router.register(r'permissions', PermissionsGetUpdate, basename="permissions")

urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('api/', include(router.urls)),
]

