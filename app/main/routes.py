from flask import session, redirect, url_for, render_template, request, send_from_directory
from . import main
from .forms import LoginForm
import avatars
import random


@main.route('/', methods=['GET', 'POST'])
def index():
    """"Login form to enter a room."""
    form = LoginForm()
    if form.validate_on_submit():
        session['name'] = form.name.data
        session['room'] = form.room.data
        session['password'] = form.password.data
        return redirect(url_for('.chat'))
    elif request.method == 'GET':
        form.name.data = session.get('name', '')
        form.room.data = session.get('room', '')
    return render_template('index.html', form=form)


@main.route('/chat')
def chat():
    """Chat room. The user's name and room must be stored in
    the session."""
    if 'avatar' not in session:
        session['avatar'] = avatars.get_avatar()
    data = {
        'name': session.get('name', ''),
        'avatar': session.get('avatar'),
        'room': session.get('room', ''),
        'password': session.get('password', '')
    }
    if data['name'] == '' or data['room'] == '':
        return redirect(url_for('.index'))
    return render_template('chat.html', **data)

# End File: app/main/routes.py
