from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from .models import User, Group, Permission

class GroupSerializer(serializers.ModelSerializer):
    
    users_count = serializers.SerializerMethodField('get_users_count')
        
    def get_users_count(self, objGroup):
        global users_count
        print(objGroup)
        
        if hasattr(objGroup,"id"):
            try:
                users_count = User.objects.filter(group_id=objGroup.id).count()
                return users_count
            except ObjectDoesNotExist:
                return 0
        else:
            return 0
        
    class Meta:
        model = Group
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
    

class UserSerializer(serializers.ModelSerializer):
    
    user_role = serializers.SerializerMethodField('get_user_role')
    last_login = serializers.SerializerMethodField('get_last_login')
    is_active = serializers.SerializerMethodField('get_status')
        
    def get_user_role(self, objUser):
        global user_role
        
        if hasattr(objUser,"group_id"):
            try:
                user_role = Group.objects.get(id=objUser.group_id).name
                return user_role
            except ObjectDoesNotExist:
                return ""
        else:
            return ""
    
    def get_last_login(self, objUser):
        global last_login
        
        if hasattr(objUser,"last_login"):
            if objUser.last_login is not None:
                return objUser.last_login.strftime("%m/%d/%Y %I:%M %p")
            else:
                return "new account"
    
    def get_status(self, objUser):
        global is_active
        
        if hasattr(objUser,"is_active"):
            if objUser.is_active ==  1:
                return True
            else:
                return False
        
    class Meta:
        model = User
        fields = ["id", "username", "password", "group_id", "last_login", "is_active", "reporting_officer", "user_role"]
   
     
class ReportingOfficerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User     
        fields = ["id", "username"]
        
class PermissionSerializer(serializers.ModelSerializer):
    
    allowed = serializers.CharField()
    
    class Meta:
        model = Permission
        fields = ["id", "perms_title", "section", "allowed"]