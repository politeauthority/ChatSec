#!/bin/env python
"""
"""
from app import create_app, socketio
from flask_debugtoolbar import DebugToolbarExtension
app = create_app()
toolbar = DebugToolbarExtension(app)

if __name__ == '__main__':
    socketio.run(app, host=app.config['WEB_IP'])

# End File: chat.py
