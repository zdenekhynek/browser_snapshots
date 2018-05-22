from django.test import TestCase

from analysis.caps_sentiment import get_words, get_upper_case_words, classify_text

class CapSentimentTestCase(TestCase):

  def test_get_words(self):
    """split get words"""
    text = 'sentiment test words'
    split = get_words(text)
    self.assertEqual(len(split), 3)

    # remove one/two letter phrases
    text = 'sentiment ta words a'
    split = get_words(text)
    self.assertEqual(len(split), 2)

  def test_get_upper_case_words(self):
    text = 'sentiment UPPER words AB'
    split = get_upper_case_words(text)
    self.assertEqual(len(split), 1)

  def test_classify_text(self):
    text = 'no caps whatsoever'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, 0)

    text = 'ALL CAPS ALL THE TIME'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, 1)

    text = 'sentiment UPPER get_words AB ABC'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, 0.5)
