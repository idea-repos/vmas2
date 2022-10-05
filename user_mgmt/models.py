from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.utils import timezone

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

class Section(models.Model):
    section_name = models.CharField(max_length=200,null=False,blank=False,unique=True)
    section_desc = models.CharField(max_length=300,null=True,blank=True)
    status =  models.BooleanField(default=True)
    
    class Meta:
        db_table = 'Sections'
           
class Permission(models.Model):
    perm_section = models.CharField(max_length=150,null=False,blank=False,unique=True)
    perms_title = models.CharField(max_length=300,null=False,blank=False)
    section = models.ForeignKey(Section,on_delete=models.CASCADE,null=True,blank=True,unique=False)
    status = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'Permissions'

        
class Group(models.Model):
    name = models.CharField(max_length=150, unique=True)
    reports_to = models.ForeignKey('self',on_delete= models.SET_NULL,null=True,blank=True)
    status = models.BooleanField(default=True)
    
    permissions = models.ManyToManyField(
        Permission,
        verbose_name= ("permissions"),
        db_table = "group_permissions",
        blank=True,
    )
    sections = models.ManyToManyField(
        Section,
        verbose_name= ("sections"),
        db_table = "group_sections",
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
    group   = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, unique=False)
    reporting_officer   = models.ForeignKey('self', on_delete=models.SET_NULL,blank=True, null=True, unique=False)
    is_del = models.BooleanField(default=False)
    status = models.BooleanField(default=True)
    last_session_updated = models.DateTimeField(default=timezone.now)
    permissions = models.ManyToManyField(
        Permission,
        verbose_name= ("permissions"),
        db_table = "user_permissions",
        blank=True,
    )

    objects = MyUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    class Meta:
        db_table = 'Users'

