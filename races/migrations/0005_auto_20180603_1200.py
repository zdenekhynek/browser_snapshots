# Generated by Django 2.0.4 on 2018-06-03 12:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('races', '0004_auto_20180528_1050'),
    ]

    operations = [
        migrations.AddField(
            model_name='race',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='race',
            name='is_highlighted',
            field=models.BooleanField(default=False),
        ),
    ]
