import json
from xmlrpc.client import ResponseError
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.renderers import TemplateHTMLRenderer
from .serializers import LoginSerializer, GroupSerializer
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
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        serializer = LoginSerializer(data=data,
            context={ 'request': self.request })
        serializer.is_valid(raise_exception=False)
        if serializer.errors:
           return Response("Access denied: wrong username or password",status=status.HTTP_401_UNAUTHORIZED)
        else:
            user = serializer.validated_data['user']
            print(("User Authenticated."))
            login(request, user)
            return Response("User Autenticated", status=status.HTTP_202_ACCEPTED)               
                        
class GroupAddUpdateDelete(ModelViewSet):    
    serializer_class = GroupSerializer
    
    def get_queryset(self):
        groups = Group.objects.all()
        return(groups)
        
    def list(self, request):
        print("Inside list")
        groups = Group.objects.all()
        return Response(self.serializer_class(groups, many=True).data,
                        status=status.HTTP_200_OK)
        
    def retrieve(self,request, pk=None):
        print("Inside Retrieve")
        group = self.get_object()
        return Response(self.serializer_class(group).data, status=status.HTTP_200_OK)
    
    def create(self,request,*args,**kwargs):
        print("inside create")
        try:
            data = json.loads(request.body.decode('utf-8'))
            print(data)
            
            serializer = self.serializer_class(data=data)
            if serializer.is_valid():
                serializer.save()
                print(serializer.data)
                group_id = serializer.data['id']
                # group = get_object_or_404(Group, pk=group_id)
                group_extended, created = GroupExtended.objects.get_or_create(group_id=group_id)
            
                if created:
                    # reports_to_id = Group.objects.get(name=data['reports_to']).id
                    # group_extended.ofc_reports_to = reports_to_id
                    group_extended.ofc_reports_to = data['reports_to']
                    group_extended.save()
                else:
                    return ResponseError("Something went wrong!!!")    
                                
                return Response("Role Created Successfully.",status=status.HTTP_201_CREATED)
            else:
                print(serializer.errors)
                return Response("Data not valid. Please check the input.",status=status.HTTP_400_BAD_REQUEST) 
        except Exception as e:
            print(e)
            return Response("Exception occured!!!")
           
        
    def update(self,request,pk=None,*args,**kwargs):
        print("inside update")
        instance = self.get_object()
        
        data = json.loads(request.body.decode('utf-8'))
        print(data)

        serializer = self.serializer_class(instance=instance,data=data)
        
        if serializer.is_valid():
            serializer.save()
            group_extended = get_object_or_404(GroupExtended, group_id=pk)
            group_extended.ofc_reports_to = data['reports_to']
            group_extended.save()       
            return Response("Role updated Succesfully",status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response("Invalid data. Please check the input.",status=status.HTTP_400_BAD_REQUEST) 
        
    def destroy(self,request,pk=None,*args,**kwargs):
        # instance = self.get_object()
        super(GroupAddUpdateDelete, self).destroy(request,pk,*args,**kwargs)
        return Response("Role Deleted Successfully.", status=status.HTTP_200_OK)







    