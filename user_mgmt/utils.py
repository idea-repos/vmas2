import json
from .models import Section, Permission

def create_object(serializer_class,request):
    data = json.loads(request.body.decode('utf-8'))
    
    newobj = serializer_class(data=data)
    if newobj.is_valid():
        newobj.save()  
    return newobj
             
def update_object(self,request,pk):
    instance = self.serializer_class.Meta.model.objects.get(id=pk)     
    data = json.loads(request.body.decode('utf-8'))

    upd_obj = self.serializer_class(instance=instance,data=data)
    
    if upd_obj.is_valid():
        upd_obj.save()   
    return upd_obj     

def delete_object(serializer,pk):
    instance = serializer.Meta.model.objects.get(id=pk)
    instance.delete()
    return "success"

def getuserperms(user, level):
    
    user_perms = user.permissions.values()
    sections = Section.objects.all()
    
    if user.group is not None:
        user_sections = user.group.sections.values()
        group_perms = user.group.permissions.values()
    else:
        user_sections = []
        group_perms = []
                
                
    if level == "permissions":
        perms_list = []
        
        for section in sections:
            section_dict = {}
            section_dict["id"] = section.id
            section_dict["section_name"] = section.section_name
            section_dict["section_allowed"] = next((True for user_section in user_sections if section.id == user_section["id"]), False)   
            
            permissions = Permission.objects.filter(section=section).order_by('id')   
            perm_list = []
            if permissions is not None:
                for permission in permissions:
                    perm_dict = {}
                    perm_dict["id"] = permission.id
                    perm_dict["perm_section"] = permission.perm_section
                    perm_dict["perms_title"] = permission.perms_title
                    perm_dict["group_perm_allowed"] = next((True for group_perm in group_perms if permission.id == group_perm["id"]), False)                     
                    
                    if section_dict["section_allowed"]:
                        perm_dict["perm_allowed"] = True  
                        perm_dict["group_perm_allowed"] = True
                    elif perm_dict["group_perm_allowed"]:
                        perm_dict["perm_allowed"] = True
                    else:
                        perm_dict["perm_allowed"] = next((True for user_perm in user_perms if permission.id == user_perm["id"]), False)   
                    perm_list.append(perm_dict)
                
                section_dict["permissions"] = perm_list 
                perms_list.append(section_dict) 
              
        return perms_list       
    elif level == "sections":
        user_section_list = list(user_sections)
        
        for user_perm in user_perms:
            user_section_allowed = next(section for section in sections if section.id == user_perm["section_id"])
            section_dict = {}
            section_dict["id"] = user_section_allowed.id
            section_dict["section_name"] = user_section_allowed.section_name
            user_section_list.append(section_dict)

        return user_section_list
             
def getperms(user,section_id): 
    perms = []
    section = Section.objects.get(id=section_id)
    section_perms = Permission.objects.filter(section=section)
    user_perms = user.permissions.values()
    
    for user_perm in user_perms:
        for section_perm in section_perms:
            if user_perm["id"] == section_perm.id:
                perms.append(user_perm)  
    return perms
        