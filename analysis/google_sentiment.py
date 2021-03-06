# import os
# import json

# # Imports the Google Cloud client library
# from google.cloud import language
# from google.cloud.language import enums
# from google.cloud.language import types
# from google.oauth2 import service_account

# # Read env data
# credentials_raw = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')

# # Generate credentials
# # skip if on localhost with no credentials
# if credentials_raw:
#   service_account_info = json.loads(credentials_raw)
#   creds = service_account.Credentials.from_service_account_info(service_account_info)

#   # Instantiates a client
#   client = language.LanguageServiceClient(
#     credentials=creds,
#   )

# def classify_text(text):
#   document = types.Document(
#       content=text,
#       type=enums.Document.Type.PLAIN_TEXT)

#   # Detects the sentiment of the text
#   # on localhost, we might not have client, so wrap it in try/except
#   try:
#     sentiment = client.analyze_sentiment(document=document).document_sentiment
#     return (sentiment.score, sentiment.magnitude)
#   except:
#     return (0, 0)
