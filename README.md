# Browser Snapshots

## Youtube Data API

https://www.googleapis.com/youtube/v3/commentThreads?videoId=m4Jtj2lCMAA&key=<KEY>&part=snippet,replies
https://www.googleapis.com/youtube/v3/videos?id=7lCDEYXw3mM&key=

## Sample commands

python manage.py sentiment --race_id=96
python manage.py parsesnapshots --race_id=96

greenfell:

python manage.py face_sentiment --race_id=101 --override=True --limit=10 --offset=10
python manage.py gcp_sentiment --race_id=101 --override=True
python manage.py watson_tone --race_id=101 --override=True
python manage.py get_yt_meta --race_id=96 --override=True

python manage.py delete_duplicates --race_id=96 --override=True


## Run Redis locally

# https://channels.readthedocs.io/en/latest/tutorial/part_2.html
```docker run -p 6379:6379 -d redis:2.8```


## Run MachineBox locally
docker run -p 8081:8080 -e "MB_KEY=$MB_KEY" machinebox/fakebox

## Routes

/viz

/viz/landing
/viz/races/<race_id>/
/viz/races/<race_id/results
/viz/highlights/<race_id>/
/viz/highlights/<race_id/results


/viz/ipad/landing
/viz/ipad/races/<race_id>/
/viz/ipad/races/<race_id>/results
/viz/ipad/highlights/
/viz/ipad/highlights/<race_id/
