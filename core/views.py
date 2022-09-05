from datetime import datetime
import json
from os import stat
from pickle import TRUE
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_409_CONFLICT, HTTP_201_CREATED, HTTP_202_ACCEPTED
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
                    {'_id':1, 'username':'user_1', 'roles':"1", 'lastlogin':datetime.today(), 'isactive':False, 'role_name':'CDSO', 'reportingTo': '', 'officer_name':''},
                    {'_id':2, 'username':'user_2', 'roles':"2", 'lastlogin':datetime.today(), 'isactive':TRUE, 'role_name':'System Admin', 'reportingTo': '1', 'officer_name':'user_1'},
                    {'_id':3, 'username':'user_3', 'roles':"3", 'lastlogin':datetime.today(), 'isactive':TRUE, 'role_name':'Tester', 'reportingTo': '2', 'officer_name':'user_2'},
                    {'_id':4, 'username':'user_4', 'roles':"1", 'lastlogin':datetime.today(), 'isactive':False, 'role_name':'CDSO', 'reportingTo': '', 'officer_name':''},
                    {'_id':5, 'username':'user_5', 'roles':"3", 'lastlogin':datetime.today(), 'isactive':TRUE, 'role_name':'Tester', 'reportingTo': '2', 'officer_name':'user_2'},
                    {'_id':6, 'username':'user_6', 'roles':"4", 'lastlogin':datetime.today(), 'isactive':TRUE, 'role_name':'Operator 1', 'reportingTo': '', 'officer_name':''},
                    {'_id':7, 'username':'user_7', 'roles':"4", 'lastlogin':datetime.today(), 'isactive':TRUE, 'role_name':'Operator 1', 'reportingTo': '3', 'officer_name':'user_3'},
                    {'_id':8, 'username':'user_8', 'roles':"5", 'lastlogin':datetime.today(), 'isactive':False, 'role_name':'Operator 2', 'reportingTo': '7', 'officer_name':'user_7'},
                    {'_id':9, 'username':'user_9', 'roles':"5", 'lastlogin':datetime.today(), 'isactive':TRUE, 'role_name':'Operator 2', 'reportingTo': '6', 'officer_name':'user_6'},
                  {'_id':10, 'username':'user_10', 'roles':"5", 'lastlogin':datetime.today(), 'isactive':TRUE, 'role_name':'Operator 2', 'reportingTo': '11', 'officer_name':'user_11'},
                   {'_id':11, 'username':'user_11', 'roles':"4", 'lastlogin':datetime.today(), 'isactive':False, 'role_name':'Operator 1', 'reportingTo': '3', 'officer_name':'user_3'}
                ]


roles_object = [
    {'id':1, 'name':'CDSO', 'reportingTo':None},
    {'id':2, 'name':'System Admin', 'reportingTo':'1'},
    {'id':3, 'name':'Tester', 'reportingTo':'2'},
    {'id':4, 'name':'Operator 1', 'reportingTo':'2'},
    {'id':5, 'name':'Operator 2', 'reportingTo':'4'},
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


class GetReportingOfficer(APIView):
    def get(self, request, id):
        if id == 1:
            return Response([], status=HTTP_200_OK)

        def get_role_by_id(id):
            for role in roles_object:
                if role['id'] == id:
                    return role['reportingTo']

        user_reporting_to = get_role_by_id(id)
        available_reporting_users = [user for user in user_objects if user['roles'] == user_reporting_to]

        return Response(available_reporting_users, status=HTTP_202_ACCEPTED)

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
        data['isActive'] = data['isActive'] != False
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