MYSQL_USER = 'root'
MYSQL_PASS = 'admin'
SECRET_KEY = 'django-insecure-7hox85g48$1sp0vefm%kpfnx4vb)=m)hvo739()b4%!kedx_#5'
HOST_AT = 'localhost'
DB_NAME = 'vmasdatabase'
ENGINE = 'django.db.backends.mysql'
PORT = '3306'
MONGO_ENGINE = "djongo"
MONGO_DB = "VMAS"
MONGO_USER = "root"
MONGO_PASS = "admin"
MONGO_HOST_AT = "localhost"
MONGO_PORT = "27017"

DATABASE_CONFIGURATION = {
     'default': {
        'ENGINE': ENGINE,
        'NAME': DB_NAME,
        'USER': MYSQL_USER,
        'PASSWORD': MYSQL_PASS,
        'HOST': HOST_AT,  
        'PORT': PORT,
    },
     'mongodb': {
        'ENGINE': MONGO_ENGINE,
        'NAME': MONGO_DB,
        'USER' : MONGO_USER,
        'PASSWORD' : MONGO_PASS,
    }
}