from django.contrib import admin
from .models import *

# Register your models here.

class QuestionAdmin(admin.ModelAdmin):
    list_display = ('text', 'category','subcategory','eras','difficulty','author')


admin.site.register(Category)
admin.site.register(Subcategory)
admin.site.register(Difficulty)
admin.site.register(Era)
admin.site.register(Tags)
admin.site.register(Question, QuestionAdmin)
