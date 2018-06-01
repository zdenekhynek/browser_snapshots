from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        # Send message to both groups
        self.send_message_to_groups(text_data_json)

    def send_message_to_groups(self, data, groups=['race']):
        for group in groups:
            async_to_sync(self.channel_layer.group_send)(
                group,
                {
                    'type': 'chat_message',
                    'data': data
                }
            )

    # Receive message from room group
    def chat_message(self, event):
        data = event['data']

        # Send message to WebSocket
        self.send(text_data=json.dumps(data))
