import json
from .models import TargetTags
from bson import ObjectId

def create_object(serializer_class,request):
    data = json.loads(request.body.decode('utf-8'))
    
    newobj = serializer_class(data=data)
    if newobj.is_valid():
        newobj.save()  
    return newobj
             
def update_object(self,request,pk):
    instance = TargetTags.objects.get(_id=ObjectId(pk))
    data = json.loads(request.body.decode('utf-8'))

    upd_obj = self.serializer_class(instance=instance,data=data)
    
    if upd_obj.is_valid():
        upd_obj.save()   
    return upd_obj     

def delete_object(pk):
    instance = TargetTags.objects.get(_id=ObjectId(pk))
    instance.delete()
    return "success"
