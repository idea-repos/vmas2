from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('users/', views.GetUsers.as_view(), name='get-users')
]