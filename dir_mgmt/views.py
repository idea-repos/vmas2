from rest_framework.response import Response
from .serializers import TargetSerializer, TargetTagsSerializer
from rest_framework.viewsets import ModelViewSet
from .models import TargetTags
from rest_framework import status
from rest_framework.decorators import action
from .utils import create_object, delete_object,update_object
from bson.objectid import ObjectId
from rest_framework.permissions import IsAuthenticated
from .datatable import DataTablesServer

# Create your views here.
                   
class TargetAddUpdateDelete(ModelViewSet):    
    queryset = TargetTags.objects.all()  
    serializer_class = TargetSerializer
    permission_classes = [IsAuthenticated]
       
    def list(self, request):
        columns = ["_id", "name", "created_on"]
        index_column = "_id"
        collection = "Target_tags"
        
        data = DataTablesServer(request, columns, index_column, collection).output_result()
        return Response(data, status=status.HTTP_200_OK)
 
    def retrieve(self,request, pk=None):
        target = TargetTags.objects.get(_id=ObjectId(pk))
        jsondata = TargetTagsSerializer(target).data
        jsondata['tags'] = target.tags
        return Response(jsondata, status=status.HTTP_200_OK)
    
    def create(self,request,*args,**kwargs):
        
        try:  
           newtarget = create_object(TargetTagsSerializer, request)
           
           if newtarget.errors:
              return Response(newtarget.errors,status=status.HTTP_400_BAD_REQUEST) 
           else:
              return Response("Target Created Successfully",status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
    def update(self,request,pk=None,*args,**kwargs):
        try:
            target = update_object(TargetTagsSerializer,request,pk)
            
            if target.errors:
               return Response(target.errors,status=status.HTTP_400_BAD_REQUEST) 
            else:
               return Response("Target Updated Successfully",status=status.HTTP_201_CREATED)
        except Exception as e:
            print(e)
            return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def destroy(self,request,pk=None,*args,**kwargs):
        if delete_object(pk) == "success":     
           return Response("Target Deleted Successfully.", status=status.HTTP_200_OK)
        else:
           return Response("Exception Occured!!!",status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    
   