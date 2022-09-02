from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('users/', views.GetUsers.as_view(), name='get-users'),
    path('roles/', views.GetRoles.as_view(), name='get-roles'),
    path('create-new-user/', views.create_user, name='create-user'),
    path('users/<int:id>/edit/', views.update_user, name='edit-user')
]