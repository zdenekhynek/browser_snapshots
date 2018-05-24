# Generated by Django 2.0.4 on 2018-05-23 20:21

from django.db import migrations, models


youtube_categories = [
  { "id": "1", "title": "Film & Animation" },
  { "id": "2", "title": "Autos & Vehicles" },
  { "id": "10", "title": "Music" },
  { "id": "15", "title": "Pets & Animals" },
  { "id": "17", "title": "Sports" },
  { "id": "18", "title": "Short Movies" },
  { "id": "19", "title": "Travel & Events" },
  { "id": "20", "title": "Gaming" },
  { "id": "21", "title": "Videoblogging" },
  { "id": "22", "title": "People & Blogs" },
  { "id": "23", "title": "Comedy" },
  { "id": "24", "title": "Entertainment" },
  { "id": "25", "title": "News & Politics" },
  { "id": "26", "title": "Howto & Style" },
  { "id": "27", "title": "Education" },
  { "id": "28", "title": "Science & Technology" },
  { "id": "30", "title": "Movies" },
  { "id": "31", "title": "Anime/Animation" },
  { "id": "32", "title": "Action/Adventure" },
  { "id": "33", "title": "Classics" },
  { "id": "34", "title": "Comedy" },
  { "id": "35", "title": "Documentary" },
  { "id": "36", "title": "Drama" },
  { "id": "37", "title": "Family" },
  { "id": "38", "title": "Foreign" },
  { "id": "39", "title": "Horror" },
  { "id": "40", "title": "Sci-Fi/Fantasy" },
  { "id": "41", "title": "Thriller" },
  { "id": "42", "title": "Shorts" },
  { "id": "43", "title": "Shows" },
  { "id": "44", "title": "Trailers" }
]


def load_yt_categories(apps, schema_editor):
    VideoCategory = apps.get_model('youtube', 'VideoCategory')

    for i, category in enumerate(youtube_categories):
      category = VideoCategory(id=i, category_id=category['id'], title=category['title'])
      category.save()


class Migration(migrations.Migration):

    dependencies = [
        ('youtube', '0011_videocategory_category_id'),
    ]

    operations = [
      migrations.RunPython(load_yt_categories)
    ]
