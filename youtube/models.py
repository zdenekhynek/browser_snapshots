from django.db import models


class VideoCategory(models.Model):
    category_id = models.CharField(max_length=1000, blank=True, null=True)
    title = models.TextField(blank=True, null=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.title)

class Video(models.Model):
    """This class represents the session model."""
    raw_response = models.TextField(max_length=10000, blank=True, null=True)

    code = models.CharField(max_length=255, blank=False)
    url = models.CharField(max_length=255, blank=False)
    title = models.CharField(max_length=1000, blank=False)
    description = models.TextField(max_length=10000, blank=True, null=True)

    views = models.IntegerField(blank=True, null=True)
    likes = models.IntegerField(blank=True, null=True)
    dislikes = models.IntegerField(blank=True, null=True)
    favorites = models.IntegerField(blank=True, null=True)
    comment_count = models.IntegerField(blank=True, null=True)
    length = models.FloatField(blank=True, null=True)
    length_raw = models.CharField(max_length=1000, blank=True, null=True)

    category = models.ForeignKey(VideoCategory, on_delete=models.SET_NULL, null=True)
    channel = models.CharField(max_length=1000, blank=True, null=True)
    license = models.CharField(max_length=1000, blank=True, null=True)

    author = models.CharField(max_length=500, blank=True, null=True)
    published = models.DateTimeField(blank=True, null=True)

    meta = models.TextField(max_length=10000, blank=True, null=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.title)


class VideoComment(models.Model):
    video = models.ForeignKey(Video, related_name='comments',
        on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)

    def __str__(self):
        """Return a human readable representation of the model instance."""
        return "%s" % (self.text)

