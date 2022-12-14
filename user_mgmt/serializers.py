from rest_framework import exceptions, serializers
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate
from .models import Section, User, Group, Permission
from .utils import getuserperms 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        data = super(CustomTokenObtainPairSerializer, self).validate(attrs)
        
        if not self.user.status:
            raise exceptions.AuthenticationFailed(
                self.error_messages["no_active_account"],
                "no_active_account",
            )
            
        user = {'user': UserSerializer(self.user).data}
        
        del user['user']['last_login']
        del user['user']['is_active']
        del user['user']['reporting_officer']
        del user['user']['status']
        
        data.update(user)
        
        sections = getuserperms(self.user, "sections")
        data.update({'sections': LoginSerializer(sections, many=True).data})
        data.update({'message': "User Authenticated."})
        return data
 
class LoginSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Section
        fields = ["id", "section_name"]
           
class SectionSerializer(serializers.ModelSerializer):
    allowed = serializers.BooleanField(required=False)
    
    class Meta:
        model = Section
        fields = ["id", "section_name", "section_desc", "allowed"]
                
class PermissionSerializer(serializers.ModelSerializer):
    
    section_allowed = serializers.BooleanField(required=False)
    group_perm_allowed = serializers.BooleanField(required=False)
    perm_allowed = serializers.BooleanField(required=False)
    section_name = serializers.CharField(required=False)
        
    class Meta:
        model = Permission
        fields = ["id", "perm_section", "perms_title", "section_name", "section", "section_allowed", "group_perm_allowed","perm_allowed"]
        extra_kwargs = {
            'section': {'write_only': True}
        }
        
class SectionPermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "perms_title"]

class UserPermSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True)
    section_allowed = serializers.BooleanField()
    
    class Meta:
        model = Section
        fields = ["id", "section_name", "section_allowed", "permissions"]
        
class GroupSerializer(serializers.ModelSerializer):
    
    users_count = serializers.SerializerMethodField('get_users_count')
    sections_allowed = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), write_only=True, required=False, many=True)
    sections_notallowed = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), write_only=True, required=False, many=True)
    permissions_allowed = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), write_only=True, required=False, many=True)
    permissions_notallowed = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), write_only=True, required=False, many=True)
 
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
        fields = ["id", "name", "reports_to", "users_count", "sections_allowed", "sections_notallowed", "permissions_allowed", "permissions_notallowed"]
        extra_kwargs = {
            'name': {'required': False}
        }
        
    def update(self, instance, validated_data):
        
        if 'name' in validated_data:
            return super(GroupSerializer, self).update(instance, validated_data)
        
        if 'sections_allowed' in validated_data:
            sections = validated_data.pop('sections_allowed')
            for section in sections:
                section = Section.objects.get(id=section.id)
                instance.sections.add(section)
                
                perms = Permission.objects.filter(section=section.id)
                for perm in perms:
                    instance.permissions.remove(perm)
                              
        if 'sections_notallowed' in validated_data:
                sections = validated_data.pop('sections_notallowed')
                for section in sections:
                    section = Section.objects.get(id=section.id)
                    instance.sections.remove(section)  
                       
        if 'permissions_allowed' in validated_data:
            permissions = validated_data.pop('permissions_allowed')
            for permission in permissions:
                permission = Permission.objects.get(id=permission.id)
                instance.permissions.add(permission)
               
        if 'permissions_notallowed' in validated_data:
                permissions = validated_data.pop('permissions_notallowed')
                for permission in permissions:
                    permission = Permission.objects.get(id=permission.id)
                    instance.permissions.remove(permission)  
        
        return instance  

class UserSerializer(serializers.ModelSerializer):
    
    user_role = serializers.SerializerMethodField('get_user_role')
    last_login = serializers.SerializerMethodField('get_last_login')
    permissions_allowed = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), write_only=True, required=False, many=True)
    permissions_notallowed = serializers.PrimaryKeyRelatedField(queryset=Permission.objects.all(), write_only=True, required=False, many=True)
 
        
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
        fields = ["id", "username", "password", "group", "last_login", "is_active", 
                "status", "reporting_officer", "user_role", "permissions_allowed", 
                "permissions_notallowed"]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }
   
     
    def update(self, instance, validated_data):
        if 'permissions_allowed' in validated_data:
            permissions = validated_data.pop('permissions_allowed')
            for permission in permissions:
                permission = Permission.objects.get(id=permission.id)
                instance.permissions.add(permission)
               
            if 'permissions_notallowed' in validated_data:
                permissions = validated_data.pop('permissions_notallowed')
                for permission in permissions:
                    permission = Permission.objects.get(id=permission.id)
                    instance.permissions.remove(permission)     
        else:
            return super(UserSerializer, self).update(instance, validated_data)
        
        return instance
    
class ReportingOfficerSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User     
        fields = ["id", "username"]
        
