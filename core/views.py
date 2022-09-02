from datetime import datetime
import json
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_409_CONFLICT, HTTP_201_CREATED
from rest_framework.views import APIView

@api_view(['GET', 'POST'])
def login(request):
    if request.method == "POST":
            data = json.loads(request.body.decode('utf-8'))
            if data['username'] == 'elastic' and data['password'] == 'password':
                response = {'roles' : ['read', 'write', 'all', 'delete', 'update'], 'user_id': 10, 'user_details' : {'fullname':'Azhar uddin'}}
                return Response(response)
            else:
                return Response('Unauthorized', status=HTTP_401_UNAUTHORIZED)
    return redirect('http://localhost:3000/login')

user_objects = [
                    {'_id':1, 'username':'user_1', 'roles':"1", 'lastlogin':datetime.today(), 'status':'inactive', 'role_name':'CDSO' },
                    {'_id':2, 'username':'user_2', 'roles':"2", 'lastlogin':datetime.today(), 'status':'active', 'role_name':'System Admin' },
                    {'_id':3, 'username':'user_3', 'roles':"3", 'lastlogin':datetime.today(), 'status':'active', 'role_name':'Tester' },
                    {'_id':4, 'username':'user_4', 'roles':"1", 'lastlogin':datetime.today(), 'status':'inactive', 'role_name':'CDSO' },
                    {'_id':5, 'username':'user_5', 'roles':"3", 'lastlogin':datetime.today(), 'status':'active', 'role_name':'Tester' },
                    {'_id':6, 'username':'user_6', 'roles':"4", 'lastlogin':datetime.today(), 'status':'active', 'role_name':'Operator 1' },
                    {'_id':7, 'username':'user_7', 'roles':"4", 'lastlogin':datetime.today(), 'status':'active', 'role_name':'Operator 1' },
                    {'_id':8, 'username':'user_8', 'roles':"5", 'lastlogin':datetime.today(), 'status':'inactive', 'role_name':'Operator 2' },
                    {'_id':9, 'username':'user_9', 'roles':"5", 'lastlogin':datetime.today(), 'status':'active', 'role_name':'Operator 2' },
                  {'_id':10, 'username':'user_10', 'roles':"5", 'lastlogin':datetime.today(), 'status':'active', 'role_name':'Operator 2' },
                   {'_id':11, 'username':'user_11', 'roles':"4", 'lastlogin':datetime.today(), 'status':'active', 'role_name':'Operator 1' }
                ]


roles_object = [
    {'id':1, 'name':'CDSO'},
    {'id':2, 'name':'System Admin'},
    {'id':3, 'name':'Tester'},
    {'id':4, 'name':'Operator 1'},
    {'id':5, 'name':'Operator 2'},
]

class GetUsers(APIView):
    def get(self, request):
        if user_objects:
            return Response(user_objects)
        return Response('Not Found Please Create The User First', status=HTTP_404_NOT_FOUND)

class GetRoles(APIView):
    def get(self, request):
        if roles_object:
            return Response(roles_object)
        return Response('No Roles Create the role first', status=HTTP_404_NOT_FOUND)

@api_view(['GET', 'POST'])
def update_user(request, id):
    def get_user_by_id(id):
        for user in user_objects:
            if user['_id'] == id:
                return user

    user = get_user_by_id(id)

    if not user:
        return Response({'message':'No User Found'}, status=HTTP_404_NOT_FOUND)
    
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        return Response({'message':'User Updated', 'data':data}, status=HTTP_200_OK)
    

    return Response(user, status=HTTP_200_OK) 



@api_view(['GET', 'POST'])
def create_user(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        print(data)
        if data['username'] in [x['username'] for x in user_objects]:
            return Response({'message':'Username already exists'}, status=HTTP_409_CONFLICT)
        return Response({'message':'User Created Sucessfully', 'data':data}, status=HTTP_201_CREATED)

    return redirect('http://localhost:3000/users/create')