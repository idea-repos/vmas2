from django.db import models
    
class Myuser(models.Model):
    password = models.CharField(max_length=128,null=False)
    last_login = models.DateTimeField(default=None)
    is_superuser = models.BooleanField(null=False)
    username = models.CharField(max_length=200,null=False)
    email = models.EmailField(max_length=254, null=False)
    is_staff = models.BooleanField(null=False)
    is_active = models.BooleanField(null=False)
    date_joined = models.DateTimeField(null=False)
    name = models.CharField(max_length=100,null=False)
    is_del = models.BooleanField(null=False)
    reporting_officer = models.IntegerField(default=None)
    role = models.IntegerField(default=None)
       
class Permissions(models.Model):
    perms_alias = models.CharField(max_length=150)
    perms_title = models.CharField(max_length=150)
    section_alias = models.CharField(max_length=150)
    section = models.CharField(max_length=150)
    status = models.IntegerField()


class Group(models.Model):
    name = models.CharField(max_length=150, unique=True)
    permissions = models.ManyToManyField(
        Permissions,
        verbose_name= ("permissions"),
        blank=True,
    )

    class Meta:
        verbose_name = ("group")
        verbose_name_plural = ("groups")

    def __str__(self):
        return self.name

class GroupExtended(models.Model):
   # ofc_leads = models.ForeignKey(Group,on_delete=models.CASCADE,default=None) 
   ofc_reports_to = models.IntegerField(blank=True, null=True)
   group = models.ForeignKey(Group,on_delete=models.CASCADE) 

    
class Myuser_groups(models.Model):
    user_id = models.ForeignKey(Myuser,on_delete=models.CASCADE)
    group_id = models.ForeignKey(Group, on_delete=models.CASCADE)   