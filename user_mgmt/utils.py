import json
from .models import Section, Permission

def create_object(serializer_class,request):
    data = json.loads(request.body.decode('utf-8'))
    
    newobj = serializer_class(data=data)
    if newobj.is_valid():
        newobj.save()  
    return newobj
             
def update_object(self,request):
    instance = self.get_object()       
    data = json.loads(request.body.decode('utf-8'))

    upd_obj = self.serializer_class(instance=instance,data=data)
    
    if upd_obj.is_valid():
        upd_obj.save()   
    return upd_obj     
        
def getuserperms(user):
    user_perms = user.permissions.values()
    user_sections = user.group.sections.values()
    group_perms = user.group.permissions.values()
                
    permissions = Permission.objects.all()
    
    for permission in permissions:
        permission.section_allowed = next((True for user_section in user_sections if permission.section.id == user_section["id"]), False)   
        permission.group_perm_allowed = next((True for group_perm in group_perms if permission.id == group_perm["id"]), False)                         
        permission.section_name = Section.objects.get(id=permission.section.id).section_name
        if permission.section_allowed:
            permission.perm_allowed = True  
            permission.group_perm_allowed = True
        elif permission.group_perm_allowed:
            permission.perm_allowed = True
        else:
            permission.perm_allowed = next((True for user_perm in user_perms if permission.id == user_perm["id"]), False)   
            
    return permissions            
        