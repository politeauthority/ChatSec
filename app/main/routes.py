from flask import session, redirect, url_for, render_template, request, send_from_directory
from . import main
from .forms import LoginForm
import random


@main.route('/', methods=['GET', 'POST'])
def index():
    """"Login form to enter a room."""
    form = LoginForm()
    if form.validate_on_submit():
        session['name'] = form.name.data
        session['room'] = form.room.data
        return redirect(url_for('.chat'))
    elif request.method == 'GET':
        form.name.data = session.get('name', '')
        form.room.data = session.get('room', '')
    return render_template('index.html', form=form)


@main.route('/chat')
def chat():
    """Chat room. The user's name and room must be stored in
    the session."""
    session['avatar'] = get_avatar()
    data = {
        'name': session.get('name', ''),
        'avatar': session['avatar'],
        'room': session.get('room', ''),
    }
    if data['name'] == '' or data['room'] == '':
        return redirect(url_for('.index'))
    return render_template('chat.html', **data)


def get_avatar():
    imgs = [
        'Baby_48.png',
        'EditorTeacher_48.png',
        'Merchant_48.png',
        'Nurse_48.png',
        'Professor_OldMan_48.png',
        'SPY_48.png',
        'Thief_48.png'
    ]
    return imgs[random.randrange(0, len(imgs) - 1)]

# End File: app/main/routes.py
