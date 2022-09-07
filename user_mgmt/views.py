import json
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import LoginSerializer, GroupSerializer, PermissionsSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from .models import MyGroup, Permissions
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
        groups = MyGroup.objects.all()
        return(groups)
        
    def list(self, request):
        print("Inside list")
        groups = MyGroup.objects.all()
        print(groups)
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
                                                
                return Response(serializer.data ,status=status.HTTP_201_CREATED)
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
            return Response(serializer.data ,status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response("Invalid data. Please check the input.",status=status.HTTP_400_BAD_REQUEST) 
        
    def destroy(self,request,pk=None,*args,**kwargs):
        super(GroupAddUpdateDelete, self).destroy(request,pk,*args,**kwargs)
        return Response("Role Deleted Successfully.", status=status.HTTP_200_OK)

class PermissionsGetUpdate(ModelViewSet):
    serializer_class = PermissionsSerializer

    def get_queryset(self):
        print("Inside get_queryset")
        permissions = Permissions.objects.all()
        return(permissions)
        
    def list(self, request):
        print("Inside list")
        permissions = Permissions.objects.filter(status=1)
        return Response(self.serializer_class(permissions, many=True).data,
                        status=status.HTTP_200_OK)


    def retrieve(self,request, pk=None):
        print("Inside Retrieve")
        all_perms = Permissions.objects.filter(status=1).order_by('id').values()
        print(all_perms)
        perm_id_list = []
        group_perm_list = []
        group_perms = {}
        
        groupObj = MyGroup.objects.get(id=pk)
        groupPerm = groupObj.permissions.all().order_by('id').values()
        print(groupPerm)
        for perms in groupPerm:
            perm_id_list.append(perms['id'])
            
        print(perm_id_list)
        for perm_id in perm_id_list:
            grp_perms = Permissions.objects.get(id=perm_id) 
            group_perms['perms_title'] = grp_perms.perms_title
            group_perms['section'] = grp_perms.section
        #   print(group_perms.perms_title)
        # group_perms = self.get_object()
        return Response(self.serializer_class(group_perms).data, status=status.HTTP_200_OK)
        # return Response("testing in progress", status=status.HTTP_200_OK)
    