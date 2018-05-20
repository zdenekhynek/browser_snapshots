from races.models import RaceTask
from snapshots.models import Snapshot

def add_arguments(parser):
    parser.add_argument('--limit', type=int)
    parser.add_argument('--offset', type=int)
    parser.add_argument('--override', type=bool)
    parser.add_argument('--pk', type=int)
    parser.add_argument('--race_id', type=int)

def get_snapshots_for_race(race_id):
    sessions = RaceTask.objects.filter(race_id=race_id).values('task__session_id')
    session_ids = [session['task__session_id'] for session in sessions]
    return Snapshot.objects.filter(session_id__in=session_ids)

def get_snapshots(pk=False, race_id=False, limit=False, offset=False):
    if pk:
        snapshots = Snapshot.objects.filter(pk=pk)
    elif race_id:
        snapshots = get_snapshots_for_race(race_id)
    else:
        snapshots = Snapshot.objects.all()

    if limit and offset:
        snapshots = snapshots[offset:offset+limit]
    elif limit:
        snapshots = snapshots[:limit]
    elif offset:
        snapshots = snapshots[offset:]
    else:
        snapshots = snapshots

    return snapshots
