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

class Permissions(models.Model):
    perms_alias = models.CharField(max_length=150)
    perms_title = models.CharField(max_length=150)
    section_alias = models.CharField(max_length=150)
    section = models.CharField(max_length=150)
    status = models.IntegerField()

class MyGroup(models.Model):
    name = models.CharField(max_length=150, unique=True)
    reports_to = models.ForeignKey('self',on_delete= models.SET_NULL,null=True,blank=True)
    permissions = models.ManyToManyField(
        Permissions,
        verbose_name= ("permissions"),
        blank=True,
    )

    def __str__(self):
        return self.name
    
class listings:
    try:
        listingRough = list(MyGroup.objects.all().values_list('id', 'name'))
        listing = {}
        for i,j in listingRough:
            listing[i] = j
    except:
        listing = {}

class MyUser(AbstractBaseUser,PermissionsMixin,listings):
    username = models.CharField(max_length=200, unique=True, blank=True)
    email = models.EmailField()
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    group   = models.OneToOneField(MyGroup, on_delete=models.SET_NULL, null=True)
    reporting_officer   = models.IntegerField(blank=True, null=True)
    is_del = models.BooleanField(default=False)
    last_session_updated = models.DateTimeField(default=datetime.now)

    objects = MyUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def Meta(self):
        verbose_name = ('MyUser')
        verbose_name_plural = ('MyUser')

    def get_full_name(self):
        """
        Returns the first_name plus the last_name, with a space in between.
        """
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def get_short_name(self):
        "Returns the short name for the user."
        return self.username


# class GroupExtended(models.Model):
#     #ofc_leads = models.IntegerField(blank=True, null=True)
#     ofc_reports_to = models.IntegerField(blank=True, null=True)
#     group = models.ForeignKey(Group,on_delete=models.CASCADE)

class UserPermssions(models.Model):
    user = models.ForeignKey(MyUser,on_delete=models.CASCADE)
    permission = models.ForeignKey(Permissions,on_delete=models.CASCADE)


# # All permissions models
# # Reports : Group & Permissions
# class ReportsManagement(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('reports_label', 'Show Reports (Menu Label)'),
#             ('arc_reports', 'Show Archive Report (Menu Label)'),
#             ('opr_reports', 'Show Operative Report (Menu Label)')
#         )

# # Search : Group & Permissions
# class SearchManagement(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('search_label', 'Show Search (Menu Label)'),
#             ('arc_search', 'Show Archive Search (Menu Label)'),
#             ('opr_search', 'Show Operative Search (Menu Label)')
#         )

# # CommonMenuItems : Group & Permissions
# class CommonMenuItemsManagement(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('vsat_label', 'Show Vsat (Menu Label)'),
#             ('dcme_label', 'Show DCME (Menu Label)'),
#             ('general_settings_label', 'General Settings (Menu Label)')
#         )

# # Rules : Group & Permissions
# class RulesManagement(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('rules_label', 'Show Rules (Menu Label)'),
#             ('add_rules', 'Can add rule'),
#             ('edit_rules', 'Can edit rule'),
#             ('view_rules', 'Can view rule'),
#             ('delete_rules', 'Can delete rule')
#         )

# # Target : Group & Permissions
# class TargetManagement(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('tgt_label', 'Show Targets (Menu Label)'),
#             ('add_tgt', 'Can add target'),
#             ('edit_tgt', 'Can edit target'),
#             ('view_tgt', 'Can view target'),
#             ('delete_tgt', 'Can delete target')
#         )

# # User : Group & Permissions
# class UserManagement(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('user_label', 'Show Users (Menu Label)'),
#             ('add_user', 'Can add user'),
#             ('edit_user', 'Can edit user'),
#             ('view_user', 'Can view user'),
#             ('delete_user', 'Can delete user')
#         )

# # Search : Group & Permissions
# class RolesManagement(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('roles_label', 'Show Users (Menu Label)'),
#             ('add_role', 'Can add role'),
#             ('edit_role', 'Can edit role'),
#             ('view_role', 'Can view role'),
#             ('delete_role', 'Can delete role')
#         )

# # Search : Group & Permissions
# class DictionaryManagement(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('dict_label', 'Show Dictionaries (Menu Label)'),
#             ('add_dict', 'Can add dict'),
#             ('edit_dict', 'Can edit dict'),
#             ('view_dict', 'Can view dict'),
#             ('delete_dict', 'Can delete dict')
#         )

# # Reports : Processing Log
# class ProcessingLog(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('log_label', 'Process Log (Menu Label)'),
#             ('indv_log_label', 'Individual Process Log (Menu Label)')
#         )

# # Reports : Server Usage
# class ServerUsageLog(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('server_label', 'Server Usage (Menu Label)'),
#         )

# # ISUM DISUM
# class IsumDisum(models.Model):
#     class Meta:
#         managed = False  # No database table creation or deletion operations \
#                          # will be performed for this model.
#         permissions = (
#             ('generate_isum_disum', 'Generate Isum Disum'),
#         )


# class LimitUsers(models.Model):
#     user_id = models.CharField(max_length=150)
#     group_id = models.CharField(max_length=50)
#     username = models.CharField(max_length=250)
#     session_id = models.CharField(max_length=250)
#     activity_datetime = models.DateTimeField()