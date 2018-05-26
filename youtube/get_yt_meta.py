import requests

from django.conf import settings
from youtube.get_id_from_url import get_id_from_url
from youtube.models import VideoCategory


def get_yt_data_api_url(id):
  """https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=<key>&part=snippet,contentDetails,statistics"""
  endpoint = 'https://www.googleapis.com/youtube/v3/videos'
  video_id = 'id=%s' % (id)
  key = 'key=%s' % (settings.GOOGLE_API_KEY)
  part = 'part=snippet,contentDetails,statistics'
  return '%s?%s&%s&%s' % (endpoint, video_id, key, part)


def fetch_metadata(id):
  api_url = get_yt_data_api_url(id)
  print('Fetching from YT Data API:', api_url)
  r = requests.get(api_url)

  metadata = {}

  if r.status_code == 200:
    metadata = r.json()

  return metadata


def get_yt_meta(id):
  metadata = fetch_metadata(id)
  return metadata


def amend_video(yt_id, url, video, metadata):
  # title + description
  if 'items' in metadata and len(metadata['items']) > 0:
    item = metadata['items'][0]

    if 'snippet' in item:
      snippet = item['snippet']
      video.title = snippet['title']
      video.description = snippet['description']
      video.channel = snippet['channelTitle']

      if 'statistics' in item:
        statistics = item['statistics']
        video.views = statistics['viewCount'] if 'viewCount' in statistics else 0
        video.likes = statistics['likeCount'] if 'likeCount' in statistics else 0
        video.dislikes = statistics['dislikeCount'] if 'dislikeCount' in statistics else 0
        video.favorites = statistics['favoriteCount'] if 'favoriteCount' in statistics else 0
        video.comment_count = statistics['commentCount'] if 'commentCount' in statistics else 0

      # try getting category
      try:
        category = VideoCategory.objects.get(category_id=snippet['categoryId'])
        video.category = category
      except VideoCategory.DoesNotExist:
        # couldn't find category
        pass

  video.code = yt_id
  video.url = url

  video.raw_response = metadata

  video.save()

  pass

