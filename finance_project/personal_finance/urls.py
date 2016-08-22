from django.conf.urls import url

from . import views

app_name = 'interview_questions'
urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^add/$', views.AddTransaction.as_view(), name='add'),
]