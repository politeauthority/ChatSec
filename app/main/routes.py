from flask import session, redirect, url_for, render_template, request
from datetime import datetime
import hashlib
import avatars
from . import main


@main.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')


@main.route('/chat')
def chat():
    """Chat"""
    if 'avatar' not in session:
        session['avatar'] = avatars.get_avatar()
    data = {
        'user_name': session.get('user_name', ''),
        'avatar': session.get('avatar'),
        'room_key': session.get('room_key', ''),
    }
    if data['user_name'] == '' or data['room_key'] == '':
        return redirect(url_for('.index'))
    return render_template('chat.html', **data)


@main.route('/auth')
def auth():
    session['user_name'] = request.cookies['user_name']
    session['user_key'] = gen_user_key(session['user_name'])
    session['room_key'] = request.cookies['room_key']
    return redirect(url_for('.chat'))


@main.route('/logout')
def logout():
    if 'user_name' in session:
        session.pop('user_name')
    if 'user_key' in session:
        session.pop('user_key')
    if 'room_key' in session:
        session.pop('room_key')
    if 'avatar' in session:
        session.pop('avatar')
    return redirect(url_for('.index'))


def gen_user_key(user_name):
    user_key = user_name + str(datetime.now())
    return hashlib.md5(user_key).hexdigest()

# End File: app/main/routes.py
