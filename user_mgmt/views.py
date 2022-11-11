import json
from rest_framework.response import Response
from .serializers import GroupSerializer, PermissionSerializer, UserSerializer, SectionPermSerializer, \
                         SectionSerializer, ReportingOfficerSerializer, CustomTokenObtainPairSerializer, \
                         UserPermSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import Group, Section, User, Permission
from .datatable import DataTablesServer
from .utils import create_object, getuserperms, update_object, delete_object,getperms
from django.contrib.auth.hashers import make_password
from rest_framework.decorators import action
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist


# Create your views here.      
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
                            
class GroupAddUpdateDelete(ModelViewSet):    
    queryset = {}
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        columns = ["id", "name", "users_count"]
        model = self.serializer_class.Meta.model
        
        data = DataTablesServer(request, columns, model).output_result()
        return Response(data, status=status.HTTP_200_OK)
 
    def retrieve(self,request, pk=None):
        group = Group.objects.get(id=pk)
        return Response(self.serializer_class(group).data, status=status.HTTP_200_OK)
    
    def create(self,request,*args,**kwargs):
        try:
           newgroup =  create_object(self.serializer_class,request)
           
           if newgroup.errors:
              return Response(newgroup.errors,status=status.HTTP_400_BAD_REQUEST) 
           else:
              return Response("Role Created Successfully",status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
    def update(self,request,pk=None,*args,**kwargs):
        try:
            group = update_object(self,request,pk)
            
            if group.errors:
               return Response(group.errors,status=status.HTTP_400_BAD_REQUEST) 
            else:
               return Response("Role Updated Successfully",status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def destroy(self,request,pk=None,*args,**kwargs):
        if delete_object(self.serializer_class,pk) == "success":     
           return Response("Role Deleted Successfully.", status=status.HTTP_200_OK)
        else:
           return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(methods=['get'], detail=True,  url_path="get-sections")
    def get_section(self, request, pk=None, *args, **kwargs):
        
        sections= Section.objects.values()

        group = Group.objects.get(id=pk)
        group_sections = group.sections.values()
        
        for section in sections:
            section["allowed"] = next((True for grp_section in group_sections  if section["id"] == grp_section["id"]), False)

        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(methods=['put'], detail=True,  url_path="update-sections")
    def update_section(self, request, pk=None, *args, **kwargs):
        try:
            instance = Group.objects.get(id=pk)
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
    def get_permission(self, request, pk=None, *args, **kwargs):
        try:
            group = Group.objects.get(id=pk)
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
    def update_permission(self, request, pk=None, *args, **kwargs):
        try:
            instance = Group.objects.get(id=pk)
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
    
    queryset = {}
    serializer_class = UserSerializer
    # permission_classes = [IsAuthenticated]
    
    def list(self, request):
        columns = ["id", "username", "user_role", "last_login", "status"]
        model = self.serializer_class.Meta.model
        
        data = DataTablesServer(request, columns, model).output_result()
        return Response(data, status=status.HTTP_200_OK)
 
          
    def retrieve(self,request, pk=None):
        user = User.objects.get(id=pk)
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
            instance = User.objects.get(id=pk)
            
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
           instance = User.objects.get(id=pk)
           instance.delete()
           return Response("User Deleted Permanently.", status=status.HTTP_200_OK)  
        else:
           instance = User.objects.get(id=pk)
           context = {'status': 0}
           
           user = self.serializer_class(instance=instance,data=context,partial=True)
            
           if user.is_valid():
              user.save()
                    
           return Response("User status changed Successfully.",status=status.HTTP_200_OK)    
    
    
    @action(methods=['get'], detail=True,  url_path="get-permissions")
    def get_permission(self, request, pk=None, *args, **kwargs):
        try:
            permissions = getuserperms(User.objects.get(id=pk), "permissions")
            serializer = UserPermSerializer(permissions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(methods=['put'], detail=True,  url_path="update-permissions")
    def update_permission(self, request, pk=None, *args, **kwargs):
        try:
            instance = User.objects.get(id=pk)
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
    queryset = {}
    serializer_class = ReportingOfficerSerializer
    permission_classes = [IsAuthenticated]
    
    def retrieve(self,request, pk=None):
        
        reports_to_id = Group.objects.get(id=pk).reports_to_id
        if reports_to_id is None:
            users = []
        else:
            users = User.objects.filter(group_id=reports_to_id)
        return Response(self.serializer_class(users, many=True).data, status=status.HTTP_200_OK)
    
class UserPermsForSection(ModelViewSet):
    queryset = {}
    serializer_class = SectionPermSerializer
    permission_classes = [IsAuthenticated]
    
    def retrieve(self,request, pk=None):   
        data = json.loads(request.body.decode('utf-8'))
        user = User.objects.get(id=pk)
        group = user.group
        perms = []
        
        if group is not None:
            try:
                section = group.sections.get(id=data["section_id"])
                perms = Permission.objects.filter(section=section)
            except ObjectDoesNotExist:
                perms = getperms(user,data["section_id"])
        else:
            perms = getperms(user,data["section_id"])
                
        return Response(self.serializer_class(perms, many=True).data, status=status.HTTP_200_OK)
       
class SectionAddUpdateDelete(ModelViewSet):
    queryset = {}
    serializer_class = SectionSerializer
    permission_classes = [IsAuthenticated]
    
    def list(self, request):
        columns = ["id", "section_name", "section_desc"]
        model = self.serializer_class.Meta.model
        
        data = DataTablesServer(request, columns, model).output_result()
        return Response(data, status=status.HTTP_200_OK)
        
    def retrieve(self,request, pk=None):
        section = Section.objects.get(id=pk)
        return Response(self.serializer_class(section).data, status=status.HTTP_200_OK)
    
    def create(self,request,*args,**kwargs):
        try:
           newsection =  create_object(self.serializer_class,request)
           
           if newsection.errors:
              return Response(newsection.errors,status=status.HTTP_400_BAD_REQUEST) 
           else:
              return Response("Section Created Successfully",status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def update(self,request,pk=None,*args,**kwargs):
        try:
            section = update_object(self,request,pk)
            
            if section.errors:
               return Response(section.errors,status=status.HTTP_400_BAD_REQUEST) 
            else:
               return Response("Section Updated Successfully",status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def destroy(self,request,pk=None,*args,**kwargs):
        if delete_object(self.serializer_class,pk) == "success":     
           return Response("Section Deleted Successfully.", status=status.HTTP_200_OK)
        else:
           return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
       
    @action(methods=['get'], detail=True,  url_path="get-permissions")
    def get_permission(self, request, pk=None, *args, **kwargs):
        permissions= Permission.objects.filter(section_id=Section.objects.get(id=pk))
        serializer = PermissionSerializer(permissions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
               
class PermissionAddUpdateDelete(ModelViewSet):
    queryset = {}
    serializer_class = PermissionSerializer
    # permission_classes = [IsAuthenticated]
    
    def list(self, request):
        columns = ["id", "perm_section", "perms_title"]
        model = self.serializer_class.Meta.model
        
        data = DataTablesServer(request, columns, model).output_result()
        return Response(data, status=status.HTTP_200_OK)
        
    def retrieve(self,request, pk=None):
        permission = Permission.objects.get(id=pk)
        return Response(self.serializer_class(permission).data, status=status.HTTP_200_OK)
           
    def create(self,request,pk=None,*args,**kwargs):
        try:
            newperm =  create_object(self.serializer_class,request)
        
            if newperm.errors:
                return Response(newperm.errors,status=status.HTTP_400_BAD_REQUEST) 
            else:
                return Response("Permission Created Successfully",status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def update(self,request,pk=None,*args,**kwargs):
        try:
            perm = update_object(self,request,pk)
            
            if perm.errors:
               return Response(perm.errors,status=status.HTTP_400_BAD_REQUEST) 
            else:
               return Response("Permission Updated Successfully",status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def destroy(self,request,pk=None,*args,**kwargs):
        if delete_object(self.serializer_class,pk) == "success":     
           return Response("Permission Deleted Successfully.", status=status.HTTP_200_OK)
        else:
           return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       
       
    
    