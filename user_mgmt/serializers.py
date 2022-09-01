from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from .models import GroupExtended

class GroupSerializer(serializers.ModelSerializer):
    
    reports_to = serializers.SerializerMethodField('get_reports_to')
    
    def get_reports_to(self, objGroup):
        global reports_to
        
        try:
            reports_to_id = GroupExtended.objects.get(group_id=objGroup.id).ofc_reports_to
        except ObjectDoesNotExist:
            return ""
    
        if reports_to_id is None:
            return ""
        else:
            reports_to = Group.objects.get(id=reports_to_id).name
            return reports_to
        
    class Meta:
        model = Group
        fields = ["id", "name", "reports_to"]

    # def create(self,validated_data):
    #     print("Inside Create method of serializer.")
    #     return Group.objects.create(**validated_data)
    

class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * username
      * password.
    It will try to authenticate the user with when validated.
    """
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        # Take username and password from request
        print("Inside Validate method")
        username = attrs.get('username')
        password = attrs.get('password')

        print(username, password)
        if username and password:        
                user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
                if not user:
                    # If we don't have a regular user, raise a ValidationError
                    msg = 'Access denied: wrong username or password.'
                    raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='Invalid input')
        attrs['user'] = user
        return attrs