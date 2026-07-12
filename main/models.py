from django.db import models

# Create your models here.
from django.db import models
from django.conf import settings

class URLDeploymentLog(models.Model):
    # Tracks the user if logged in, otherwise leaves it blank (anonymous)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    custom_url = models.CharField(max_length=500)
    deployed_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ['-deployed_at']  # Newest deployments show first

    def __str__(self):
        return f"{self.custom_url} ({self.deployed_at.strftime('%Y-%m-%d %H:%M')})"