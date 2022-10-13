
class DatabaseRouter(object):
    
    def db_for_read(self, model, **hints):
        if model._meta.app_label in ['user_mgmt', 'token_blacklist']:
            return 'default'
        else:
            return 'mongodb'

    def db_for_write(self, model, **hints):
        if model._meta.app_label in ['user_mgmt', 'token_blacklist']:
            return 'default'
        else:
            return 'mongodb'
        
    def allow_relation(self, obj1, obj2, **hints):
        mongo_apps = ['dir_mgmt']
        
        if  mongo_apps in [obj1._meta.app_label, obj2._meta.app_label]: 
           return False
        else:
           return True 

    
    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if db == 'default':
            if app_label in ['auth','admin','sessions','contenttypes','user_mgmt', 'token_blacklist']:
                return True            
            else:
                return False          
        elif db == 'mongodb':
            if app_label in ['auth','admin','sessions','contenttypes', 'user_mgmt', 'token_blacklist']:
                return False
            else:
                return True
       
        