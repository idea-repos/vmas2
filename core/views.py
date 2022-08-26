from os import stat
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_401_UNAUTHORIZED
import json

valid = True    

@api_view(['GET', 'POST'])
def login(request):
    if request.method == "POST":
            data = json.loads(request.body.decode('utf-8'))
            print(data)
            if data['username'] == 'elastic' and data['password'] == 'password':
                response = {'roles' : ['read', 'write'], 'user_id': 10, 'user_details' : {'fullname':'Azhar uddin'}}
                return Response(response)
            else:
                return Response('Unauthorized', status=HTTP_401_UNAUTHORIZED)
    return redirect('http://localhost:3000/login')