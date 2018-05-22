def classify_text(text):
    MAX_OCCURANCE = 5

    exclamations = text.count('!')
    clamped_exclamations = min(MAX_OCCURANCE, exclamations)

    return clamped_exclamations / MAX_OCCURANCE
