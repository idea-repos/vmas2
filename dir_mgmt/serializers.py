from rest_framework import serializers
from .models import TargetTags

class TargetSerializer(serializers.ModelSerializer):
    created_on = serializers.SerializerMethodField('get_created_on')
      
    class Meta:
        model = TargetTags
        fields = ["_id", "name", "created_on"]
        
    def get_created_on(self, objTarget):
        global created_on
        
        if hasattr(objTarget,"created_on"):
            if objTarget.created_on is not None:
                return objTarget.created_on.strftime("%Y/%m/%d %H:%M")
            else:
                return " "      
            
            
class TargetTagsSerializer(serializers.ModelSerializer):
      
    class Meta:
        model = TargetTags
        fields = ["_id", "name", "description", "tags"]
        