def get_words(text):
    return [w for w in text.split() if len(w) > 2]

def get_upper_case_words(text):
    words = get_words(text)
    upper_words = [w for w in words if w.isupper()]

    return upper_words

def classify_text(text):
    words = get_words(text)
    upper_words = get_upper_case_words(text)

    return len(upper_words) / len(words)

