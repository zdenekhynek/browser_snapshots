import time

from bs4 import BeautifulSoup

from youtube.models import Video, VideoComment
from youtube.get_id_from_url import get_id_from_url
from youtube.get_yt_meta import get_yt_meta, amend_video

# def amend_video(code, url, title):
#     video, _ = Video.objects.get_or_create(url=url)
#     video.code = code
#     video.title = title

#     # print('Saving %s' % (url))
#     video.save()

#     return video


def validate_snaphost(snapshot):
    """check if youtube url"""
    youtube_snapshot = snapshot.url.find('youtube.com') > -1
    return youtube_snapshot


def get_video_code(url):
    code = ''
    delimeter = 'watch?v='
    url_parts = url.split(delimeter)

    if len(url_parts) > 1:
        code = url_parts[1]

    return code


def get_video_title(html):
    title = ''
    title_els = html.select('h1.ytd-video-primary-info-renderer')

    if len(title_els) > 0:
        title = title_els[0].get_text()

    return title


def get_video_description(html):
    title = ''
    title_els = html.select('#description')

    if len(title_els) > 0:
        title = title_els[0].get_text()

    return title


def parse_thumbnail(thumbnail):
    title = ''
    title_els = thumbnail.select('#video-title')

    if len(title_els) > 0:
        title = title_els[0].get_text()

    url = ''
    url_els = thumbnail.select('a')
    if len(url_els) > 0:
        url = url_els[0]['href']

        # add youtube domain
        url = 'https://www.youtube.com/' + url

    code = get_video_code(url)

    return (code, url, title)


def parse_next_up_video(html):
    next_up_els = html.select(
        'ytd-compact-autoplay-renderer ytd-compact-video-renderer'
    )

    if len(next_up_els) > 0:
        next_up_el = next_up_els[0]
        (code, url, title) = parse_thumbnail(next_up_el)
        return amend_video(code, url, title)


def extract_number(string):
    # split to words and remove thousand separators
    words = [s.replace(',', '') for s in string.split()]

    # get numbers
    numbers = [int(word) for word in words if word.isdigit()]
    return numbers


def parse_video_views(html):
    views_els = html.select(
        'yt-view-count-renderer .view-count'
    )

    views = None

    if len(views_els) > 0:
        numbers = extract_number(views_els[0].get_text())
        if len(numbers) > 0:
            views = numbers[0]

    return views


def parse_likes_number(html):
    els = html.select('yt-formatted-string')

    if len(els) > 0:
        el = els[0]

        try:
            likes_string = el['aria-label']
            likes_int = extract_number(likes_string)
            return likes_int
        except KeyError:
            # TODO - figure out why some videos don't have likes/dislikes
            # numbers
            pass

    return


def parse_likes_dislikes(html):
    # #info #top-level-buttons ytd-toggle-button-renderer
    like_dislike_buttons = html.select(
        '#info #top-level-buttons ytd-toggle-button-renderer'
    )

    likes = None
    dislikes = None

    if len(like_dislike_buttons) > 0:
        likes_nums = parse_likes_number(like_dislike_buttons[0])
        if likes_nums and len(likes_nums) > 0:
            likes = likes_nums[0]

        dislikes_nums = parse_likes_number(like_dislike_buttons[1])
        if dislikes_nums and len(dislikes_nums) > 0:
            dislikes = dislikes_nums[0]

    return (likes, dislikes)


def get_length_in_seconds(length_string):
    try:
        t_struct = time.strptime(length_string, '%M:%S')
    except ValueError:
        t_struct = time.strptime(length_string, '%H:%M:%S')

    return (t_struct.tm_min * 60) + t_struct.tm_sec


def parse_video_length(html):
    duration_els = html.select(
        '.ytp-time-display .ytp-time-duration'
    )

    length = None

    if len(duration_els) > 0:
        length = get_length_in_seconds(duration_els[0].get_text())

    return length


def parse_related_videos(html):
    related_els = html.select(
        'ytd-watch-next-secondary-results-renderer ytd-compact-video-renderer'
    )

    videos = []
    if len(related_els) > 0:
        for related_el in related_els:
            (code, url, title) = parse_thumbnail(related_el)

            print('storing related video', code, url, title)
            videos.append(amend_video(code, url, title))

    return videos

def amend_comment(video, text):
    comment, _ = VideoComment.objects.get_or_create(video=video, text=text)
    comment.video = video
    comment.text = text
    comment.save()

    return comment

def parse_comments(html):
    comments_els = html.select(
        'ytd-comment-renderer #content-text'
    )

    comments = []
    if len(comments_els) > 0:
        for comments_el in comments_els:
            comment = comments_el.get_text()

            print('getting comment', comment)
            comments.append(comment)

    return comments


def parse_snapshot(snapshot):
    #   validate snapshot
    if (not validate_snaphost(snapshot)):
        return

    url = snapshot.url
    source = snapshot.source_code

    # html = BeautifulSoup(source, 'html.parser')

    url = snapshot.url


    # get video meta
    # make sure you get only one video
    video, created = Video.objects.get_or_create(url=url)

    yt_id = get_id_from_url(url)
    meta = get_yt_meta(yt_id)

    amend_video(yt_id, url, video, meta)

    snapshot.video = video
    snapshot.description = video.description # get_video_description(html)

    snapshot.video.save()
    snapshot.save()

    # title = get_video_title(html)
    # code = get_video_code(url)

    # print('geting video', title, code)
    # print('description')
    # print(snapshot.description)

    # snapshot.video = amend_video(code, url, title)

    # get views
    # views = parse_video_views(html)
    # snapshot.video.views = views
    # # print('views')
    # # print(views)

    # # get likes
    # (likes, dislikes) = parse_likes_dislikes(html)
    # # print('likes, dislikes')
    # # print(likes, dislikes)
    # snapshot.video.likes = likes
    # snapshot.video.dislikes = dislikes

    # # get length
    # # print('snapshot.video.length')
    # length = parse_video_length(html)
    # # print(length)
    # snapshot.video.length = length

    # get next up video
    # print('parsing next up videos')
    # snapshot.next_up_video = parse_next_up_video(html)

    # get related videos
    # print('parsing related videos')
    # snapshot.related_videos.set(parse_related_videos(html))

    # get comments
    # if snapshot.video:
    #     comments = parse_comments(html)
    #     for comment in comments:
    #         amend_comment(snapshot.video, comment)
