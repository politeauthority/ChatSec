from flask import Flask
from flask.ext.compressor import Compressor
from flask.ext.socketio import SocketIO

socketio = SocketIO()


def create_app(debug=False):
    """Create an application."""
    app = Flask(__name__, static_url_path='/static')
    app.debug = True
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    app.config.from_object('config')
    socketio.init_app(app)
    return app

# End File: app/__init__.py
