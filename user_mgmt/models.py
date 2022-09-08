from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.utils import timezone
from django.contrib.auth.models import PermissionsMixin
from datetime import datetime

class MyUserManager(BaseUserManager):

    def create_user(self, username=None, email=None, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        now = timezone.now()
        if not email:
            raise ValueError('The given email must be set')
        email = MyUserManager.normalize_email(email)

        if not username:
            raise ValueError('The given username must be set')

        user = self.model(username=username,email=email,
                          is_staff=True, is_active=True, is_superuser=False,date_joined=now, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):

        u = self.create_user(
            username,
            password=password,
            email=email,
        )
        u.is_staff = True
        u.is_active = True
        u.is_superuser = True
        u.save(using=self._db)
        return u

    
class Permission(models.Model):
    perms_alias = models.CharField(max_length=150)
    perms_title = models.CharField(max_length=300)
    status = models.IntegerField()
    
    class Meta:
        db_table = 'Permissions'


class Section(models.Model):
    section_name = models.CharField(max_length=200)
    section_desc = models.CharField(max_length=300)
    permissions = models.ManyToManyField(
        Permission,
        verbose_name= ("permissions"),
        blank=True,
    )
    
    class Meta:
        db_table = 'Sections'
        
class Group(models.Model):
    name = models.CharField(max_length=150, unique=True)
    reports_to = models.ForeignKey('self',on_delete= models.SET_NULL,null=True,blank=True)
    permissions = models.ManyToManyField(
        Permission,
        verbose_name= ("permissions"),
        blank=True,
    )
    sections = models.ManyToManyField(
        Section,
        verbose_name= ("sections"),
        blank=True,
    )
    

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'Groups'

class User(AbstractBaseUser):
    is_superuser = models.BooleanField(default=False)
    username = models.CharField(max_length=200, unique=True, blank=True)
    email = models.EmailField()
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    group   = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True)
    reporting_officer   = models.IntegerField(blank=True, null=True)
    is_del = models.BooleanField(default=False)
    last_session_updated = models.DateTimeField(default=datetime.now)
    permissions = models.ManyToManyField(
        Permission,
        verbose_name= ("permissions"),
        blank=True,
    )

    objects = MyUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'Users'

