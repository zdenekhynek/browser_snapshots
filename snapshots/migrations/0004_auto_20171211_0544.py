# Generated by Django 2.0 on 2017-12-11 05:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('snapshots', '0003_snapshot_title'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='snapshot',
            name='image_url',
        ),
        migrations.AddField(
            model_name='snapshot',
            name='image',
            field=models.ImageField(blank=True, max_length=254, upload_to='uploads'),
        ),
    ]
