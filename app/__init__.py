from flask import Flask
from flask.ext.socketio import SocketIO
from app.main.routes import main

socketio = SocketIO()


def create_app(debug=False):
    """Create an application."""
    app = Flask(__name__, static_url_path='/static')
    app.register_blueprint(main)
    app.config.from_object('config')
    socketio.init_app(app)
    return app

# End File: app/__init__.py
