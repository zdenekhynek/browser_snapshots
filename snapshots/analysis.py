import nltk.classify.util
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

    def __init__(self):
        self.classifier = False


    def train(self):
        neg_reviews = []
        for fileid in movie_reviews.fileids('neg'):
          words = movie_reviews.words(fileid)
          neg_reviews.append((create_word_features(words), "negative"))

        pos_reviews = []
        for fileid in movie_reviews.fileids('pos'):
            words = movie_reviews.words(fileid)
            pos_reviews.append((create_word_features(words), "positive"))

        train_set = neg_reviews[:750] + pos_reviews[:750]

        self.classifier = NaiveBayesClassifier.train(train_set)

        words = []
        for fileid in movie_reviews.fileids('pos'):
            words = movie_reviews.words(fileid)

        print(self.classifier.classify(create_word_features(words)))
        pass


    def classify(self, texts):
        if not self.classifier:
            self.train()

        words = []
        for text in texts:
            words.append(text.split(' '))

        print('words')
        print(words)
        classified = []
        for text_words in words:
            features = create_word_features(text_words)
            classified.append(self.classifier.classify(features))

        print('classified')
        print(classified)
        pass


def train():
    neg_reviews = []
    for fileid in movie_reviews.fileids('neg'):
      words = movie_reviews.words(fileid)
      neg_reviews.append((create_word_features(words), "negative"))

    print(neg_reviews[0])
    print(len(neg_reviews))

    pos_reviews = []
    for fileid in movie_reviews.fileids('pos'):
        words = movie_reviews.words(fileid)
        pos_reviews.append((create_word_features(words), "positive"))

    print(len(pos_reviews))

    train_set = neg_reviews[:750] + pos_reviews[:750]

    global classifier
    classifier = NaiveBayesClassifier.train(train_set)

    words = []
    for fileid in movie_reviews.fileids('pos'):
        words = movie_reviews.words(fileid)

    print(classifier.classify(create_word_features(words)))



def classify(texts):
    # make sure we have trained data
    if not classifier:
      train()

    test_set =  neg_reviews[750:] + pos_reviews[750:]
    # print(len(train_set),  len(test_set))

    accuracy = nltk.classify.util.accuracy(classifier, test_set)
    # print(accuracy * 100)

