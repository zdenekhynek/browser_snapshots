# Generated by Django 2.0 on 2018-03-23 08:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analysis', '0003_auto_20180312_0806'),
    ]

    operations = [
        migrations.AddField(
            model_name='sentiment',
            name='description',
            field=models.TextField(blank=True, max_length=10009, null=True),
        ),
        migrations.AlterField(
            model_name='sentiment',
            name='sentiment',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='sentiment',
            name='watson_raw_tone',
            field=models.CharField(blank=True, max_length=10000, null=True),
        ),
    ]
