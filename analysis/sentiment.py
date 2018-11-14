import os.path
import pickle

from django.conf import settings
import nltk.classify.util

nltk.data.path = [settings.NLTK_DATA_DIR]

from nltk.classify import NaiveBayesClassifier
from nltk.corpus import movie_reviews
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize


# This is how the Naive Bayes classifier expects the input
def create_word_features(words):
    useful_words = [word for word in words if word not in stopwords.words("english")]
    my_dict = dict([(word, True) for word in useful_words])
    return my_dict


class SentimentClassifier():
    CACHE_FILE_NAME = 'naive_bayes_classifier_movie_reviews.pickle'
    CACHE_FILE_URL = os.path.join(settings.BASE_DIR, CACHE_FILE_NAME)

    def __init__(self):
        pass


    def train(self):
        # do we have something cached
        url = SentimentClassifier.CACHE_FILE_URL

        if not os.path.exists(url):
            # do training
            neg_reviews = []
            for fileid in movie_reviews.fileids('neg'):
              words = movie_reviews.words(fileid)
              neg_reviews.append((create_word_features(words), "negative"))

            pos_reviews = []
            for fileid in movie_reviews.fileids('pos'):
                words = movie_reviews.words(fileid)
                pos_reviews.append((create_word_features(words), "positive"))

            train_set = neg_reviews + pos_reviews

            # train
            self.classifier = NaiveBayesClassifier.train(train_set)

            # cache result
            file = open(SentimentClassifier.CACHE_FILE_URL, 'wb')
            pickle.dump(self.classifier, file)
            file.close()
        else:
            classifier_f = open(url, "rb")
            self.classifier = pickle.load(classifier_f)
            classifier_f.close()


    def classify(self, texts):
        words = []
        for text in texts:
            words.append(text.split(' '))

        print('words')
        print(words)
        classified = []
        for text_words in words:
            features = create_word_features(text_words)
            classified.append(self.classifier.classify(features))

        return classified



