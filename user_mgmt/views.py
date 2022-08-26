from ast import Add
from xmlrpc.client import ResponseError
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.renderers import TemplateHTMLRenderer
from .serializers import GroupSerializer, LoginSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import Group, GroupExtended
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login,logout


# Create your views here.
class LoginView(APIView):

    @method_decorator(csrf_exempt)
    def post(self, request, format=None):
        print("inside post method")
        serializer = LoginSerializer(data=self.request.data,
            context={ 'request': self.request })
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        print(("User Authenticated."))
        login(request, user)
        print("After login request.")
        return Response("User Autenticated", status=status.HTTP_202_ACCEPTED)
      
    def get(self, request, format=None):
        print(request.method)
        return Response("Get Request", status=status.HTTP_200_OK)                
                        
class GroupAddUpdateDelete(ModelViewSet):    
    serializer_class = GroupSerializer
    
    def get_queryset(self):
        print("Inside query set")
        print((self.request.method))
        groups = Group.objects.all()
        return(groups)
    
    def retrieve(self,request, pk=None):
        print("Inside Retrieve")
        group = self.get_object()
        
        group_extended = groupextended.objects.get
        return Response(self.serializer_class(group).data, status=status.HTTP_200_OK)
    
    def create(self,request,*args,**kwargs):
        print("inside create")
        #data = {"name" : "test5", "reports_to": 2}
        serializer = self.serializer_class(data=self.request.data)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            print(self.request.data)
            group_id = serializer.data['id']
            # group = get_object_or_404(Group, pk=group_id)
            group_extended, created = GroupExtended.objects.get_or_create(group_id=group_id)
            
            if created:
               group_extended.ofc_reports_to = self.request.data['reports_to'] 
               group_extended.save()
            else:
                return ResponseError("Something went wrong!!!")    
                        
            return Response(data=serializer.data,status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(data=serializer.data,status=status.HTTP_400_BAD_REQUEST) 
        
    def update(self,request,pk=None,*args,**kwargs):
        print("inside update")
        instance = self.get_object()
        
        data = {"id": 7, "name" : "test", "reports_to": 2}
        serializer = self.serializer_class(instance=instance,data=data)
        
        if serializer.is_valid():
            serializer.save()
            group_extended = get_object_or_404(GroupExtended, group_id=pk)
            group_extended.ofc_reports_to = data['reports_to']
            group_extended.save()       
            return Response(data=serializer.data,status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.data,status=status.HTTP_400_BAD_REQUEST) 
        
    def destroy(self,request,pk=None,*args,**kwargs):
        instance = self.get_object()
        
        return super(GroupAddUpdateDelete, self).destroy(request,pk,*args,**kwargs)







    