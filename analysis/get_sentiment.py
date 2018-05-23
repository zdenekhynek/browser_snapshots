from analysis.models import Sentiment
from analysis.google_sentiment import classify_text as gcp_classify_text
from analysis.caps_sentiment import classify_text as caps_classify_text
from analysis.punctuation_sentiment import classify_text as punc_classify_text

def get_sentiment(snapshot):
  title = snapshot.title

  s, created = Sentiment.objects.get_or_create(snapshot=snapshot)

  s.title = title

  # get google sentiment
  gcp_sentiment = gcp_classify_text(title)
  s.gcp_sentiment_score = gcp_sentiment[0]
  s.gcp_sentiment_magnitude = gcp_sentiment[1]

  # get caps sentiment
  s.caps_sentiment = caps_classify_text(title)

  # get punctuation sentiment
  s.punctuation_sentiment = punc_classify_text(title)

  # get comments sentiment
  # comments = snapshot.video.comments.all().values('text')


  s.save()

  return s
