from youtube.get_id_from_url import get_id_from_url

def get_video_thumb(url):
  video_id = get_id_from_url(url)
  return 'https://img.youtube.com/vi/%s/0.jpg' % (video_id)
