from flask import session, render_template
from flask.ext.socketio import emit, join_room, leave_room
from .. import socketio
import chat_filters
from datetime import datetime


@socketio.on('joined', namespace='/chat')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    join_room(room)
    msg_info = {
        # 'msg': message['msg'],
        # 'user': session.get('name'),
        # 'avatar': session.get('avatar'),
        # 'date': str(datetime.now()),
    }
    data = {
        'user': session.get('name'),
        'avatar': session.get('avatar'),
        'msg': '@%s joined the room.' % session.get('name')
    }
    data['tpl'] = render_template('msg.html', **data)
    emit('status', data, room=room)


@socketio.on('text', namespace='/chat')
def msg(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    room = session.get('room')
    data = {
        'msg': chat_filters.run(message['msg']),
        'user': session.get('name'),
        'avatar': session.get('avatar'),
        'date': str(datetime.now()),
    }
    data['tpl'] = render_template('msg.html', **data)
    emit('message', data, room=room)


@socketio.on('typing', namespace='/chat')
def typing(message):
    emit('status', {'msg': 'typing'}, room=room)


@socketio.on('left', namespace='/chat')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    leave_room(room)
    msg_info = {
        'msg': message['msg'],
        'user': session.get('name'),
        'date': str(datetime.now()),
    }
    msg_info['tpl'] = render_template('msg.html', **msg_info)
    emit('status', {'msg': session.get('name') + ' has left the room.'}, room=room)

# End File: app/main/events.py
