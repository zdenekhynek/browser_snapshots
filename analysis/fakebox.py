# {
#     "success": true,
#     "title": {
#         "decision": "bias",
#         "score": 0.3567107617855072,
#         "entities": [
#             {
#                 "text": "Donald Trump",
#                 "start": 42,
#                 "end": 53,
#                 "type": "person"
#             },
#             {
#                 "text": "MSNBC",
#                 "start": 66,
#                 "end": 70,
#                 "type": "organization"
#             }
#         ]
#     },
#     "content": {
#         "keywords": []
#     },
#     "domain": {}
# }

import requests
import json

from requests.auth import HTTPBasicAuth
from django.conf import settings

from analysis.models import Sentiment

mb_key = settings.MB_KEY
mb_api_url = settings.MB_API_URL
mb_username = settings.MB_USERNAME
mb_password = settings.MB_PASSWORD
fakebox_endpoint = 'fakebox/check'

def fetch_results(title):
    payload = {'title': title}

    url = '%s/%s' % (mb_api_url, fakebox_endpoint)
    response = requests.post(url, data=payload, auth=HTTPBasicAuth(mb_username, mb_password))

    if response.status_code == requests.codes.ok:
        return response.json()
    else:
        return {}


def parse_results(response_json):
    results = {}

    # default values
    fakebox_title_decision = ''
    fakebox_title_score = 0

    results['fakebox_raw'] = json.dumps(response_json)

    if response_json and 'success' in response_json:
        if 'title' in response_json:
            title = response_json['title']

            if 'decision' in title:
                fakebox_title_decision = title['decision']

            if 'score' in title:
                fakebox_title_score = title['score']

    results['fakebox_title_decision'] = fakebox_title_decision
    results['fakebox_title_score'] = fakebox_title_score

    return results


def get_fakebox(title):
    payload = {'title': title}
    json = fetch_results(title)

    results = parse_results(json)
    return results


def store_fakebox(snapshot):
    print('store_fakebox !!')
    s, created = Sentiment.objects.get_or_create(snapshot=snapshot)

    # get fakebox sentiment
    fakebox = get_fakebox(snapshot.title)

    s.fakebox_raw = fakebox['fakebox_raw']
    s.fakebox_title_decision = fakebox['fakebox_title_decision']
    s.fakebox_title_score = fakebox['fakebox_title_score']

    s.save()

    return s
