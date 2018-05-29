from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast(data, groups=['ipad', 'desktop', 'extension']):
    # notify about the new race
    data['type'] = 'chat_message'
    layer = get_channel_layer()

    for group in groups:
        async_to_sync(layer.group_send)(group, {
            'type': 'chat_message',
            'data': data
        })

