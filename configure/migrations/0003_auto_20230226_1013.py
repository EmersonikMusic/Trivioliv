# Generated by Django 3.2.12 on 2023-02-26 15:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('configure', '0002_auto_20230226_1004'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='subcategory',
        ),
        migrations.AddField(
            model_name='question',
            name='category',
            field=models.ForeignKey(default=True, on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='configure.category'),
            preserve_default=False,
        ),
    ]
