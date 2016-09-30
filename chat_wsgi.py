import sys
sys.path.insert(0, '/chatsec/')
from app import create_app, socketio

application = create_app()
socketio.run(application, host=application.config['WEB_IP'])
