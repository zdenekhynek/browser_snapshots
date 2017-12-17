from django.test import TestCase
from bs4 import BeautifulSoup

from snapshots.parser import create_doc, find_all, get_first_match_text, get_youtube_title


class ParserTestCase(TestCase):
    def test_create_doc(self):
        markup = '<html></html>'
        doc = create_doc(markup)
        self.assertEqual(isinstance(doc, BeautifulSoup), True)

    def test_find_all(self):
        markup = '<html><title>Title</title></html>'
        results = find_all(markup, 'title')
        self.assertEqual(len(results), 1)

        markup = '<body><div class="head">Head</div></body>'
        results = find_all(markup, 'div', 'head')
        self.assertEqual(len(results), 1)

        markup = '<head></head><body><title>Title</title></body>'
        results = find_all(markup, 'title')
        self.assertEqual(len(results), 1)

    def get_first_match_text(self):
        markup = '<html><div class="head">Head</div></html>'
        results = get_first_match_text(markup, 'div', 'head')
        self.assertEqual(results, 'Head')

    def test_get_youtube_title(self):
        markup = '<html><h1 class="title">title</h1></html>'
        results = get_youtube_title(markup)
        self.assertEqual(results, 'title')
