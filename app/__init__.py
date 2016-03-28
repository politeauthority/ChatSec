from flask import Flask
from flask_debugtoolbar import DebugToolbarExtension
from flask.ext.socketio import SocketIO

socketio = SocketIO()


def create_app(debug=False):
    """Create an application."""
    app = Flask(__name__, static_url_path='/static')
    app.debug = True
    app.config['SECRET_KEY'] = 'gjr39dkjn344_!67#'
    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint)
    socketio.init_app(app)
    return app

# End File: app/__init__.py
