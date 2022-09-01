from datetime import datetime
import json
from django.shortcuts import redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED, HTTP_302_FOUND, HTTP_404_NOT_FOUND
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


class GetUsers(APIView):
    user_objects = [
                    {'_id':1, 'username':'user_1', 'roles':'Level 1 Operator', 'lastlogin':datetime.today(), 'status':'active'},
                    {'_id':2, 'username':'user_2', 'roles':'Level 2 Operator', 'lastlogin':datetime.today(), 'status':'active'},
                    {'_id':3, 'username':'user_3', 'roles':'Level 3 Operator', 'lastlogin':datetime.today(), 'status':'inactive'},
                    {'_id':4, 'username':'user_4', 'roles':'Level 4 Operator', 'lastlogin':datetime.today(), 'status':'inactive'},
                    {'_id':5, 'username':'user_5', 'roles':'Level 5 Operator', 'lastlogin':datetime.today(), 'status':'inactive'},
                    {'_id':6, 'username':'user_6', 'roles':'Level 6 Operator', 'lastlogin':datetime.today(), 'status':'inactive'},
                    {'_id':7, 'username':'user_7', 'roles':'Level 7 Operator', 'lastlogin':datetime.today(), 'status':'inactive'},
                    {'_id':8, 'username':'user_8', 'roles':'Level 8 Operator', 'lastlogin':datetime.today(), 'status':'inactive'},
                    {'_id':9, 'username':'user_9', 'roles':'Level 9 Operator', 'lastlogin':datetime.today(), 'status':'inactive'},
                    {'_id':10, 'username':'user_10', 'roles':'Level 10 Operator', 'lastlogin':datetime.today(), 'status':'inactive'},
                    {'_id':11, 'username':'user_11', 'roles':'Level 11 Operator', 'lastlogin':datetime.today(), 'status':'inactive'}
                ]
    
    def get(self, request):
        if self.user_objects:
            return Response(self.user_objects)
        return Response('Not Found Please Create The User First', status=HTTP_404_NOT_FOUND)