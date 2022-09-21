import json
from django.http import HttpResponse
from rest_framework.response import Response
from .serializers import LoginSerializer, GroupSerializer, PermissionSerializer, UserSerializer, \
                         SectionSerializer, ReportingOfficerSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import Group, Section, User, Permission
from .utils import getuserperms
from rest_framework import status
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import action
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login,logout


# Create your views here.
class LoginView(APIView):

    def post(self, request, format=None):
        try:
            data = json.loads(request.body.decode('utf-8'))
            serializer = LoginSerializer(data=data,
                context={ 'request': self.request })
            serializer.is_valid(raise_exception=False)
            if serializer.errors:
                return Response("Access denied: wrong username or password",status=status.HTTP_401_UNAUTHORIZED)
            else:
                user = serializer.validated_data['user']
                login(request, user)
                permissions = getuserperms(user)
                data = {"user": UserSerializer(user).data, "perms": PermissionSerializer(permissions, many=True).data, "message": "User Authenticated."}
                return Response(data,status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)              
                        
class GroupAddUpdateDelete(ModelViewSet):    
    serializer_class = GroupSerializer
    
    def get_queryset(self):
        groups = Group.objects.all()
        return(groups)
        
    def list(self, request):
        groups = Group.objects.all()
        return Response(self.serializer_class(groups, many=True).data,
                        status=status.HTTP_200_OK)
        
    def retrieve(self,request, pk=None):
        group = self.get_object()
        return Response(self.serializer_class(group).data, status=status.HTTP_200_OK)
    
    def create(self,request,*args,**kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            newgroup = self.serializer_class(data=data)
            if newgroup.is_valid():
                newgroup.save()
                                                
                return Response("Role Created Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(newgroup.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
        
    def update(self,request,pk=None,*args,**kwargs):
        try:
            instance = self.get_object()       
            data = json.loads(request.body.decode('utf-8'))

            group = self.serializer_class(instance=instance,data=data)
            
            if group.is_valid():
                group.save()   
                return Response("Role Updated Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(group.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def destroy(self,request,pk=None,*args,**kwargs):
        super(GroupAddUpdateDelete, self).destroy(request,pk,*args,**kwargs)
        return Response("Role Deleted Successfully.", status=status.HTTP_200_OK)

    
    @action(methods=['get'], detail=True,  url_path="get-sections")
    def get_section(self, request, *args, **kwargs):
        
        sections= Section.objects.values()

        group = self.get_object()
        group_sections = group.sections.values()
        
        for section in sections:
            section["allowed"] = next((True for grp_section in group_sections  if section["id"] == grp_section["id"]), False)

        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=['put'], detail=True,  url_path="update-sections")
    def update_section(self, request, pk=None, *args, **kwargs):
        try:
            instance = self.get_object()
            data = json.loads(request.body.decode('utf-8'))
                
            section = self.serializer_class(instance=instance,data=data)
        
            if section.is_valid():
                section.save()                        
                return Response("Sections updated for group successfully.",status=status.HTTP_201_CREATED)
            else:
                return Response(section.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['get'], detail=True,  url_path="get-permissions")
    def get_permission(self, request,*args, **kwargs):
        try:
            group = self.get_object()
            group_sections = group.sections.values()
            group_perms = group.permissions.values()
            
            permissions = Permission.objects.all()
            
            for permission in permissions:
                permission.section_allowed = next((True for grp_section in group_sections if permission.section.id == grp_section["id"]), False)
                permission.section_name = Section.objects.get(id=permission.section.id).section_name
                if permission.section_allowed:
                    permission.perm_allowed = True  
                else:
                    permission.perm_allowed = next((True for grp_perm in group_perms if permission.id == grp_perm["id"]), False)               
                
            serializer = PermissionSerializer(permissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    @action(methods=['put'], detail=True,  url_path="update-permissions")
    def update_permission(self, request,*args, **kwargs):
        try:
            instance = self.get_object()
            data = json.loads(request.body.decode('utf-8'))
                
            permission = self.serializer_class(instance=instance,data=data)
        
            if permission.is_valid():
                permission.save()                                
                return Response("Permissions updated for group successfully.",status=status.HTTP_201_CREATED)
            else:
                return Response(permission.errors,status=status.HTTP_400_BAD_REQUEST) 
            
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserAddUpdateDelete(ModelViewSet):    
    
    serializer_class = UserSerializer
    
    def get_queryset(self):
        users = User.objects.all()
        return(users)
        
    def list(self, request):
        users = User.objects.all()
        return Response(self.serializer_class(users, many=True).data,
                        status=status.HTTP_200_OK)
        
    def retrieve(self,request, pk=None):
        user = self.get_object()
        return Response(self.serializer_class(user).data, status=status.HTTP_200_OK)
    
    def create(self,request,*args,**kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            newuser = self.serializer_class(data=data)
            
            if newuser.is_valid():
                password = make_password(newuser.validated_data.get('password'))
                newuser.save(password=password)                                     
                return Response({'user_data': newuser.data, 'message': "User Created Successfully."},status=status.HTTP_201_CREATED)
            else:
                return Response(newuser.errors,status=status.HTTP_400_BAD_REQUEST) 
            
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
        
    def update(self,request,pk=None,*args,**kwargs):
        try:
            instance = self.get_object()
            
            data = json.loads(request.body.decode('utf-8'))

            user = self.serializer_class(instance=instance,data=data,partial=True)
            
            if user.is_valid():
                if user.validated_data.get('password'):
                    password = make_password(user.validated_data.get('password'))
                    user.save(password=password)
                else:
                    user.save()
                    
                return Response({'user_data': user.data, 'message': "User updated Successfully."},status=status.HTTP_201_CREATED)
            else:
                return Response(user.errors,status=status.HTTP_400_BAD_REQUEST) 
            
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def destroy(self,request,pk=None,*args,**kwargs):
        
        data = json.loads(request.body.decode('utf-8'))

        if data["hard_delete"]:
           super(UserAddUpdateDelete, self).destroy(request,pk,*args,**kwargs)
           return Response("User Deleted Permanently.", status=status.HTTP_200_OK)  
        else:
           instance = self.get_object()
           context = {'status': 0}
           
           user = self.serializer_class(instance=instance,data=context,partial=True)
            
           if user.is_valid():
              user.save()
                    
           return Response("User status changed Successfully.",status=status.HTTP_200_OK)    
    
    
    @action(methods=['get'], detail=True,  url_path="get-permissions")
    def get_permission(self, request,*args, **kwargs):
        try:
            permissions = getuserperms(self.get_object())
            serializer = PermissionSerializer(permissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(methods=['put'], detail=True,  url_path="update-permissions")
    def update_permission(self, request,*args, **kwargs):
        try:
            instance = self.get_object()
            data = json.loads(request.body.decode('utf-8'))
                
            permission = self.serializer_class(instance=instance,data=data)
        
            if permission.is_valid():
                permission.save()                                
                return Response("Permissions updated for user successfully.",status=status.HTTP_201_CREATED)
            else:
                return Response(permission.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
           
class ReportingOfficers(ModelViewSet):
    serializer_class = ReportingOfficerSerializer
    
    def get_queryset(self):
        users = User.objects.all()
        return(users)
    
    def retrieve(self,request, pk=None):
        
        reports_to_id = Group.objects.get(id=pk).reports_to_id
        if reports_to_id is None:
            users = []
        else:
            users = User.objects.filter(group_id=reports_to_id)
        return Response(self.serializer_class(users, many=True).data, status=status.HTTP_200_OK)
       
class SectionAddUpdateDelete(ModelViewSet):
    serializer_class = SectionSerializer
    
    def get_queryset(self):
        sections = Section.objects.all()
        return(sections)
        
    def list(self, request):
        sections = Section.objects.all()
        return Response(self.serializer_class(sections, many=True).data,
                        status=status.HTTP_200_OK)
        
    def retrieve(self,request, pk=None):
        section = self.get_object()
        return Response(self.serializer_class(section).data, status=status.HTTP_200_OK)
    
    def create(self,request,*args,**kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            
            newsection = self.serializer_class(data=data)
            if newsection.is_valid():
                newsection.save()
                                                
                return Response("Section Created Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(newsection.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
        
    def update(self,request,pk=None,*args,**kwargs):
        try:
            instance = self.get_object()       
            data = json.loads(request.body.decode('utf-8'))

            section = self.serializer_class(instance=instance,data=data)
            
            if section.is_valid():
                section.save()   
                return Response("Section Updated Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(section.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def destroy(self,request,pk=None,*args,**kwargs):
        super(SectionAddUpdateDelete, self).destroy(request,pk,*args,**kwargs)
        return Response("Section Deleted Successfully.", status=status.HTTP_200_OK)
    
    @action(methods=['get'], detail=True,  url_path="get-permissions")
    def get_permission(self, request, *args, **kwargs):
        permissions= Permission.objects.filter(section_id=self.get_object())
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=['post'], detail=True,  url_path="add-permission")
    def add_permission(self,request,pk=None,*args,**kwargs):
        try:
            data = json.loads(request.body.decode('utf-8'))
            data["section"] = pk
                
            newperm = PermissionSerializer(data=data)
        
            if newperm.is_valid():
                newperm.save()
                                                
                return Response("Permission Created Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(newperm.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
        
class PermissionUpdateDelete(ModelViewSet):
    serializer_class = PermissionSerializer
    
    def get_queryset(self):
        permissions = Permission.objects.all()
        return(permissions)
        
    def list(self, request):
        permissions = Permission.objects.all()
        return Response(self.serializer_class(permissions, many=True).data,
                        status=status.HTTP_200_OK)
        
    def retrieve(self,request, pk=None):
        permission = self.get_object()
        return Response(self.serializer_class(permission).data, status=status.HTTP_200_OK)
           
        
    def update(self,request,pk=None,*args,**kwargs):
        try:
            instance = self.get_object()       
            data = json.loads(request.body.decode('utf-8'))

            permission = self.serializer_class(instance=instance,data=data)
            
            if permission.is_valid():
                permission.save()   
                return Response("Permission Updated Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(permission.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    def destroy(self,request,pk=None,*args,**kwargs):
        super(PermissionUpdateDelete, self).destroy(request,pk,*args,**kwargs)
        return Response("Permission Deleted Successfully.", status=status.HTTP_200_OK)
    
    