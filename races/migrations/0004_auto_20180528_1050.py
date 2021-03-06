# Generated by Django 2.0.4 on 2018-05-28 10:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('races', '0003_auto_20180526_2022'),
    ]

    operations = [
        migrations.AlterField(
            model_name='raceagent',
            name='agent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='agents', to='agents.Agent'),
        ),
        migrations.AlterField(
            model_name='racetask',
            name='task',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='tasks.Task'),
        ),
    ]
