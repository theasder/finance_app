# -*- coding: utf-8 -*-
import datetime

from django.shortcuts import get_object_or_404, render, redirect
from django.views.generic import View
from django.utils import timezone
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Sum

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import static
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Transaction, Category
from .serializers import TransactionSerializer


class TransactionList(APIView):
    authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

# main view


class IndexView(View):
    template_name = 'personal_finance/index.html'

    def get(self, request):
        if request.user.is_authenticated():
            transaction_list = Transaction.objects.filter(user=request.user).order_by('-pub_date')
            balance = Transaction.objects.filter(user=request.user).aggregate(Sum('value')).get('value__sum')
            paginator = Paginator(transaction_list, 5)

            page = request.GET.get('page')
            try:
                transactions = paginator.page(page)
            except PageNotAnInteger:
                transactions = paginator.page(1)
            except EmptyPage:
                transactions = paginator.page(paginator.num_pages)

            categories = Category.objects.values('name', 'screenname')

            return render(request, self.template_name, {'transactions': transactions, 'balance': balance,
                                                        'categories': categories})
        else:
            return render(request, self.template_name, {})


class AddTransaction(View):
    template_name = 'personal_finance/index.html'

    def post(self, request):
        money = float(request.POST['money'])
        action = request.POST['action']
        description = request.POST['description']
        category = request.POST['category']
        if action == "spent":
            money = - money

        if money != 0 and category != 'default' and request.user.is_authenticated():
            transaction = Transaction.objects.create(
                value=money,
                pub_date=timezone.now(),
                user=request.user,
                description=description,
                category=category
            )
            transaction.save()
            return redirect('interview_questions:index')
        return redirect('interview_questions:index')


