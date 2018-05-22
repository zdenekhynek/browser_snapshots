from django.test import TestCase

from analysis.punctuation_sentiment import classify_text

class PunctuationSentimentTestCase(TestCase):

  def test_classify_text(self):
    text = 'no caps whatsoever'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, 0)

    text = 'little text!'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, .2)

    text = 'little text!!'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, .4)

    text = 'little text!!!'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, .6)

    text = 'little text!!!!'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, .8)

    text = 'little text!!!!!'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, 1)

    text = 'little text!!!!!!!!!'
    sentiment = classify_text(text)
    self.assertEqual(sentiment, 1)
