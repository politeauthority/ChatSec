from flask import session, render_template
from flask.ext.socketio import emit, join_room, leave_room
from .. import socketio
from datetime import datetime


@socketio.on('joined', namespace='/chat')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    print '\n EVENT:   JOINED\n'
    room_name = session.get('room_name')
    join_room(room_name)
    data = {
        'msg': '@%s joined the room.' % session.get('user_name'),
        'user_name': session.get('user_name'),
        'avatar': session.get('avatar'),
        'sent': str(datetime.now()),
        'data_type': 'joined',
        'room_name': room_name
    }
    data['tpl'] = render_template('msg.html', **data)
    emit('status', data, room=room_name)


@socketio.on('text', namespace='/chat')
def msg(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    print '\n EVENT:   MSG\n'
    room_name = session.get('room_name')
    data = {
        'msg': message['msg'],
        'user_name': session.get('user_name'),
        'avatar': session.get('avatar'),
        'sent': str(datetime.now()),
        'room_name': session.get('room_name'),
        'data_type': 'msg'
    }
    data['tpl'] = render_template('msg.html', **data)
    print data
    emit('message', data, room=room_name)


@socketio.on('typing', namespace='/chat')
def typing(message):
    """Sent by a client when the user is typing."""
    room = session.get('room')
    data = {
        'user_name': session.get('user_name'),
        'avatar': session.get('avatar')
    }
    emit('typing', data, room=room)


@socketio.on('left', namespace='/chat')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    print '\n EVENT:   LEAVE\n'
    print message
    room_name = session.get('room_name')
    leave_room(room_name)
    msg_info = {
        'msg': message['message'],
        'user': session.get('user_name'),
        'date': str(datetime.now()),
    }
    msg_info['tpl'] = render_template('msg.html', **msg_info)
    emit('status',
         {'msg': session.get('user_name') + ' has left the room.'},
         room=room_name)

# End File: app/main/events.py
