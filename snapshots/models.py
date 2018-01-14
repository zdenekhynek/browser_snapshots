from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.utils.safestring import mark_safe
from rest_framework.authtoken.models import Token

from agents.models import Agent


class Session(models.Model):
    """This class represents the session model."""
    owner = models.ForeignKey('auth.User',
                              related_name='sessions',
                              on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    start = models.DateTimeField(auto_now_add=True)
    end = models.DateTimeField(blank=True, null=True)
    lat = models.DecimalField(max_digits=9, decimal_places=6,
                              blank=True, null=True)
    lng = models.DecimalField(max_digits=9, decimal_places=6,
                              blank=True, null=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "{}".format(self.start.strftime("%Y-%m-%dT%H:%M:%S"))


class Snapshot(models.Model):
    """This class represents the snaphost model."""
    owner = models.ForeignKey('auth.User',
                              related_name='snapshots',
                              on_delete=models.CASCADE)
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, blank=True,
                                null=True)
    url = models.CharField(max_length=255, blank=False)
    title = models.CharField(max_length=1000, blank=False)
    source_code = models.TextField()
    image = models.ImageField(upload_to='uploads', max_length=254, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def image_tag(self):
        return mark_safe('<img src="/%s" style="max-width:800px;height:auto;" />' % self.image)

    image_tag.short_description = 'Image'

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "{}".format(self.title)


@receiver(post_save, sender=User)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
