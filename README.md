# Browser Snapshots

https://www.googleapis.com/youtube/v3/commentThreads?videoId=m4Jtj2lCMAA&key=<KEY>&part=snippet,replies


## Sample commands

python manage.py sentiment --race_id=96
python manage.py parsesnapshots --race_id=96

greenfell:

python manage.py face_sentiment --race_id=101 --override=True --limit=10 --offset=10
python manage.py gcp_sentiment --race_id=101 --override=True
python manage.py watson_tone --race_id=101 --override=True
