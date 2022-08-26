from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import Group, Myuser

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name"]
       # read_only_fields = ["created_by"]

    def create(self,validated_data):
        return Group.objects.create(**validated_data)
    

class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * username
      * password.
    It will try to authenticate the user with when validated.
    """
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        # Take username and password from request
        print("Inside Validate method")
        username = attrs.get('username')
        password = attrs.get('password')

        print(username, password)
        if username and password:
            try:
                 user = Myuser.objects.get(username=username,password=password)         
            # user = authenticate(request=self.context.get('request'),
            #                     username=username, password=password)
            except ObjectDoesNotExist:
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
            # if not user:
            #     # If we don't have a regular user, raise a ValidationError
            #     msg = 'Access denied: wrong username or password.'
            #     raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs