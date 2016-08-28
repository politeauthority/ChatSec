from flask import session, redirect, url_for, render_template, request
from . import main
import avatars
from datetime import datetime
import hashlib


@main.route('/', methods=['GET', 'POST'])
def index():
    """"Login form to enter a room."""
    if len(request.form) > 0:
        session['username'] = request.form['user_name']
        session['user_key'] = gen_user_key(session['username'])
        session['room'] = request.form['room_name']
        session['password'] = request.form['password']
        return redirect(url_for('.chat'))
    return render_template('index.html')


@main.route('/chat')
def chat():
    """Chat room. The user's name and room must be stored in
    the session."""
    if 'avatar' not in session:
        session['avatar'] = avatars.get_avatar()
    data = {
        'username': session.get('username', ''),
        'avatar': session.get('avatar'),
        'room': session.get('room', ''),
        'password': session.get('password', '')
    }
    print '\n'
    print session
    print ' '
    if data['username'] == '' or data['room'] == '':
        return redirect(url_for('.index'))
    return render_template('chat.html', **data)


@main.route('/logout')
def logout():
    session.pop('username')
    session.pop('room')
    session.pop('password')
    return redirect(url_for('.index'))


def gen_user_key(username):
    user_key = username + str(datetime.now())
    return hashlib.md5(user_key).hexdigest()

# End File: app/main/routes.py
