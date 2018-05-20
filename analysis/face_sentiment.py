import requests

from django.conf import settings

subscription_key = settings.FACE_API_KEY
face_api_url = settings.FACE_API_ENDPOINT

headers = { 'Ocp-Apim-Subscription-Key': subscription_key }

params = {
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'emotion',
}

def get_face_sentiment(image_url):
    response = requests.post(face_api_url, params=params, headers=headers, json={"url": image_url})
    faces = response.json()

    return faces
