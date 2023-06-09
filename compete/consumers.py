from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

class GameConsumer(WebsocketConsumer):

    def connect(self):
        self.GROUP_NAME = 'game'
        async_to_sync(self.channel_layer.group_add)(
            self.GROUP_NAME, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.GROUP_NAME, self.channel_name)
        