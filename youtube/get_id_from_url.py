def get_id_from_url(url):
  videoId = ''

  try:
    videoId = url.split('v=')[1];

    ampersandPosition = videoId.find('&')
    if ampersandPosition != -1:
      videoId = videoId[0:ampersandPosition]

  except:
    pass

  return videoId

