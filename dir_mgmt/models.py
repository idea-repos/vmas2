from djongo import models
from django.utils import timezone


# Create your models here.
class TargetAbstract(models.Model):
    attribute = models.CharField(max_length=100,primary_key=True)
    condition = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    
    class Meta:
      managed = False

class TargetTags(models.Model):
    _id = models.ObjectIdField()
    name = models.CharField(max_length=200,unique=True,null=False)
    description = models.CharField(max_length=500,null=True)
    tags = models.ArrayField(model_container=TargetAbstract)
    created_on = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'Target_tags'
        
    objects = models.DjongoManager()