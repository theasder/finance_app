# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2016-08-13 11:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('personal_finance', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(default='', max_length=200)),
                ('screenname', models.TextField(default='', max_length=200)),
            ],
        ),
        migrations.AlterField(
            model_name='transaction',
            name='description',
            field=models.TextField(default='', max_length=200),
        ),
    ]