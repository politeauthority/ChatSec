from flask import session, render_template
from flask.ext.socketio import emit, join_room, leave_room
from .. import socketio
from datetime import datetime


@socketio.on('joined', namespace='/chat')
def joined(message):
    """
    Sent by clients when they enter a room.
    A status message is broadcast to all people in the room.

    """
    room_key = session.get('room_key')
    join_room(room_key)
    print('\n\n\n\n')
    print(message)
    print('\n\n\n\n')
    data = {
        'msg': '@%s joined the room.' % session.get('user_name'),
        'user_name': session.get('user_name'),
        'avatar': session.get('avatar'),
        'sent': str(datetime.now()),
        'data_type': 'joined',
        'room_key': room_key
    }
    data['tpl'] = render_template('msg.html', **data)
    emit('status', data, room=room_key)


@socketio.on('text', namespace='/chat')
def msg(message):
    """
    Route for messages sent by a client.

    """
    print('\n\n\n\n')
    print(message)
    print('\n\n\n\n')

    room_key = session.get('room_key')
    data = {
        'msg': message['msg'],
        'user_name': session.get('user_name'),
        'avatar': session.get('avatar'),
        'sent': str(datetime.now()),
        'room_key': session.get('room_key'),
        'data_type': 'msg'
    }
    data['tpl'] = render_template('msg.html', **data)
    emit('message', data, room=room_key)


@socketio.on('typing', namespace='/chat')
def typing(message):
    """
    Sent by a client when the user is typing.

    """
    room_key = session.get('room_key')
    data = {
        'user_name': session.get('user_name'),
        'avatar': session.get('avatar')
    }
    emit('typing', data, room=room_key)


@socketio.on('left', namespace='/chat')
def left(message):
    """
    Sent by clients when they leave a room.
    A status message is broadcast to all people in the room.

    """
    room_key = session.get('room_key')
    leave_room(room_key)
    msg_info = {
        'msg': '',
        'user': session.get('user_name'),
        'date': str(datetime.now()),
    }
    msg_info['tpl'] = render_template('msg.html', **msg_info)
    emit('status',
         {'msg': session.get('user_name') + ' has left the room.'},
         room=room_key)

# End File: app/main/events.py
