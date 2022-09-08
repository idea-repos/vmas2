from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import LoginView, GroupAddUpdateDelete, UserAddUpdate, ReportingOfficersGetUpdate
 
router = routers.SimpleRouter()
router.register(r'roles', GroupAddUpdateDelete,basename="group")
router.register(r'users', UserAddUpdate, basename="users")
router.register(r'reportofficer', ReportingOfficersGetUpdate, basename="reportsto")

urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('api/', include(router.urls)),
]

