from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import URLDeploymentLog

@admin.register(URLDeploymentLog)
class URLDeploymentLogAdmin(admin.ModelAdmin):
    # Columns that will display in your list view
    list_display = ('custom_url', 'user', 'deployed_at', 'ip_address')
    
    # Sidebar filters to drill down into dates or specific users
    list_filter = ('deployed_at', 'user')
    
    # Search bar functionality
    search_fields = ('custom_url', 'user__username', 'ip_address')