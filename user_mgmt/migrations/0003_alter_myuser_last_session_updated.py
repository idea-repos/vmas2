# Generated by Django 4.0.1 on 2022-08-31 10:39

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_mgmt', '0002_alter_myuser_last_session_updated'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='last_session_updated',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 31, 16, 9, 8, 443244), verbose_name='last session updated'),
        ),
    ]
