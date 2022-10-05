from django.urls import path, include
from rest_framework import routers
from .views import GroupAddUpdateDelete, SectionAddUpdateDelete, \
                   PermissionAddUpdateDelete, UserAddUpdateDelete, ReportingOfficers, \
                   CustomTokenObtainPairView
                   
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
 
router = routers.SimpleRouter()
router.register(r'roles', GroupAddUpdateDelete,basename="group")
router.register(r'users', UserAddUpdateDelete, basename="users")
router.register(r'reportofficer', ReportingOfficers, basename="reportsto")
router.register(r'sections',SectionAddUpdateDelete, basename="sections")
router.register(r'permissions',PermissionAddUpdateDelete, basename="permissions")

urlpatterns = [
    path('api/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/', include(router.urls)),
]

