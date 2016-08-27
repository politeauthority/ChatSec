from flask import session, redirect, url_for, render_template, request
from . import main
import avatars


@main.route('/', methods=['GET', 'POST'])
def index():
    """"Login form to enter a room."""
    if len(request.form) > 0:
        session['username'] = request.form['username']
        session['room'] = request.form['room']
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
    if data['username'] == '' or data['room'] == '':
        return redirect(url_for('.index'))
    return render_template('chat.html', **data)


@main.route('/logout')
def logout():
    session.destroy()
    return redirect(url_for('.index'))

# End File: app/main/routes.py
