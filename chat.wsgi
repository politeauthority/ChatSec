#!/usr/bin/python
import sys
sys.path.insert(0, '/chatsec/app')
from app import create_app, socketio

app = create_app()

if __name__ == '__main__':
    socketio.run(app, host=app.config['WEB_IP'])