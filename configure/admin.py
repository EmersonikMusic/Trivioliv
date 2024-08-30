from django.contrib import admin
from django.http import HttpResponse

from .models import *

import csv

# Register your models here.

class ExportCsvMixin:
    def export_as_csv(self, request, queryset):

        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)
        for obj in queryset:
            row = writer.writerow([getattr(obj, field) for field in field_names])

        return response

    export_as_csv.short_description = "Export Selected"

class QuestionAdmin(admin.ModelAdmin, ExportCsvMixin):
    list_display = ('text', 'answer', 'category','subcategory','get_eras','difficulty','author')
    list_filter = ('text', 'answer', 'category','subcategory','get_eras','difficulty','author')
    actions = ["export_as_csv"]


admin.site.register(Category)
admin.site.register(Subcategory)
admin.site.register(Difficulty)
admin.site.register(Era)
admin.site.register(Tags)
admin.site.register(Question, QuestionAdmin)