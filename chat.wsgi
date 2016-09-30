#!/usr/bin/python
import sys
sys.path.insert(0, '/chatsec/')
from app import create_app, socketio

application = create_app()

if __name__ == '__main__':
    socketio.run(application, host=application.config['WEB_IP'])

# End File: chat.wsgi
