import json
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import LoginSerializer, GroupSerializer, UserSerializer, PermissionSerializer, ReportingOfficerSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import Group, User, Permission
from rest_framework import status
from django.contrib.auth.hashers import make_password
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
                return Response("User Authenticated", status=status.HTTP_202_ACCEPTED) 
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
            
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.save()
                                                
                return Response("Role Created Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
        
    def update(self,request,pk=None,*args,**kwargs):
        try:
            instance = self.get_object()       
            data = json.loads(request.body.decode('utf-8'))

            serializer = self.serializer_class(instance=instance,data=data)
            
            if serializer.is_valid():
                serializer.save()   
                return Response("Role Updated Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def destroy(self,request,pk=None,*args,**kwargs):
        super(GroupAddUpdateDelete, self).destroy(request,pk,*args,**kwargs)
        return Response("Role Deleted Successfully.", status=status.HTTP_200_OK)


class UserAddUpdate(ModelViewSet):    
    
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
            
            serializer = self.serializer_class(data=data)
            
            if serializer.is_valid():
                password = make_password(serializer.validated_data.get('password'))
                serializer.save(password=password)                                      
                return Response("User Created Successfully.",status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST) 
            
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
           
        
    def update(self,request,pk=None,*args,**kwargs):
        try:
            instance = self.get_object()
            
            data = json.loads(request.body.decode('utf-8'))

            serializer = self.serializer_class(instance=instance,data=data,partial=True)
            
            if serializer.is_valid():
                if serializer.validated_data.get('password'):
                    password = make_password(serializer.validated_data.get('password'))
                    serializer.save(password=password)
                else:
                    serializer.save()
                    
                return Response("User updated Successfully",status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST) 
            
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
       
