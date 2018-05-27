from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

def broadcast(data):
    # notify about the new race
    data['type'] = 'chat_message'
    layer = get_channel_layer()
    async_to_sync(layer.group_send)('ipad', {
        'type': 'chat_message',
        'data': data
    })
    async_to_sync(layer.group_send)('desktop', {
        'type': 'chat_message',
        'data': data
    })
