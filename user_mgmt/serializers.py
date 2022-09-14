from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from .models import Section, User, Group, Permission

class GroupSerializer(serializers.ModelSerializer):
    
    users_count = serializers.SerializerMethodField('get_users_count')
        
    def get_users_count(self, objGroup):
        global users_count
        
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
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:        
                user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
                if not user or not user.is_active or not user.status:
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
        
    class Meta:
        model = User
        fields = ["id", "username", "password", "group", "last_login", "is_active", "status", "reporting_officer", "user_role"]
   
     
class ReportingOfficerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User     
        fields = ["id", "username"]
        
class SectionSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Section
        fields = "__all__"
        
class PermissionSerializer(serializers.ModelSerializer):
    
    allowed = serializers.CharField(read_only=True)
    
    class Meta:
        model = Permission
        fields = ["id", "perm_section", "perms_title", "section", "allowed"]