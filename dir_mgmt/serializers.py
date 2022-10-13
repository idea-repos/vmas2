from rest_framework import serializers
from .models import TargetTags
from bson.objectid import ObjectId
from bson.errors import InvalidId
from django.utils.encoding import smart_str as smart_text

class TargetSerializer(serializers.ModelSerializer):
    created_on = serializers.SerializerMethodField('get_created_on')
      
    class Meta:
        model = TargetTags
        fields = ["_id", "name", "description", "tags", "created_on"]
        
    def get_created_on(self, objTarget):
        global created_on
        
        if hasattr(objTarget,"created_on"):
            if objTarget.created_on is not None:
                return objTarget.created_on.strftime("%Y/%m/%d %H:%M")
            else:
                return " "      