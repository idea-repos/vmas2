from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from .models import MyUser, MyGroup, Permissions

class GroupSerializer(serializers.ModelSerializer):
    
    users_count = serializers.SerializerMethodField('get_users_count')
        
    def get_users_count(self, objGroup):
        global users_count
        print(objGroup)
        
        if hasattr(objGroup,"id"):
            try:
                users_count = MyUser.objects.filter(group_id=objGroup.id).count()
                return users_count
            except ObjectDoesNotExist:
                return 0
        else:
            return 0
        
    class Meta:
        model = MyGroup
        fields = ["id", "name", "reports_to", "users_count"]
   

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
    
    
class PermissionsSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Permissions
        fields = ["id", "perms_title", "section"]