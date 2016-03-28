from flask import session, render_template
from flask.ext.socketio import emit, join_room, leave_room
from .. import socketio
from datetime import datetime


@socketio.on('joined', namespace='/chat')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    room = session.get('room')
    join_room(room)
    emit('status', {'msg': session.get('name') + ' has entered the room.'}, room=room)


@socketio.on('text', namespace='/chat')
def left(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    room = session.get('room')
    msg_info = {
        'msg': message['msg'],
        'user': session.get('name'),
        'date': str(datetime.now()),
    }
    msg_info['tpl'] = render_template('msg.html', **msg_info)
    emit('message', msg_info, room=room)


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
