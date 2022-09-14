from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import LoginView, GroupAddUpdateDelete, SectionAddUpdateDelete, \
                   PermissionUpdateDelete, UserAddUpdateDelete, ReportingOfficers
 
router = routers.SimpleRouter()
router.register(r'roles', GroupAddUpdateDelete,basename="group")
router.register(r'users', UserAddUpdateDelete, basename="users")
router.register(r'reportofficer', ReportingOfficers, basename="reportsto")
router.register(r'sections',SectionAddUpdateDelete, basename="sections")
router.register(r'permissions',PermissionUpdateDelete, basename="permissions")

urlpatterns = [
    path('login/', LoginView.as_view(), name="login"),
    path('api/', include(router.urls)),
]

