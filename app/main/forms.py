from flask.ext.wtf import Form
from wtforms.fields import StringField, SubmitField
from wtforms.validators import Required


class LoginForm(Form):
    """Accepts a nickname and a room."""
    name = StringField('Name', validators=[Required()])
    room = StringField('Room', validators=[Required()])
    password = StringField('Password', validators=[Required()])
    submit = SubmitField('Enter Chatroom')

# End File: app/main/forms.py
