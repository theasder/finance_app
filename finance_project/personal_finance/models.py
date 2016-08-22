# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Category(models.Model):
    name = models.CharField(max_length=200, default="")
    screenname = models.CharField(max_length=200, default="")


class Transaction(models.Model):
    CATEGORIES = [(elem['screenname'], elem['name']) for elem in Category.objects.values('name', 'screenname')]
    value = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField(max_length=200, default="")
    user = models.ForeignKey(User)
    pub_date = models.DateTimeField(default=timezone.now)
    category = models.CharField(default="", max_length=200, choices=CATEGORIES)

