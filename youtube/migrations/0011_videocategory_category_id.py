# Generated by Django 2.0.4 on 2018-05-23 20:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0009_videocategory'),
    ]

    operations = [
        migrations.AddField(
            model_name='videocategory',
            name='category_id',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
