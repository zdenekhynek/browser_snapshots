from bs4 import BeautifulSoup


def create_doc(markup):
    return BeautifulSoup(markup, 'html.parser')


def find_all(markup, elTagName, elClassName=''):
    doc = create_doc(markup)
    return doc.find_all(elTagName, class_=elClassName)


def get_first_match_text(markup, elTagName, elClassName):
    matches = find_all(markup, elTagName, elClassName)

    if (len(matches)):
        return matches[0].contents[0]

    return ''


def get_youtube_title(markup):
    title = get_first_match_text(markup, 'h1', 'title')
    return title
