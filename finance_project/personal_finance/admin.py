from django.contrib import admin

# Register your models here.
from .models import Transaction, Category


class TransactionAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['value', 'description', 'category']}),
        ('Date', {'fields': ['pub_date'], 'classes': ['collapse']})
    ]

    list_display = ('value', 'description', 'pub_date', 'category')


class CategoryAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['name', 'screenname']})
    ]

    list_display = ('name', 'screenname')

admin.site.register(Transaction, TransactionAdmin)
admin.site.register(Category, CategoryAdmin)
