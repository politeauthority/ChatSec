from flask import Markup
import re


def run(msg):
    msg = anchor_urls(msg)
    msg = code_block(msg)
    msg = user_mentions(msg)
    msg = Markup(msg)
    return msg


def anchor_urls(msg):
    urls = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', msg)
    imgs = ''
    for u in urls:
        msg = msg.replace(u, '<a target="_new" href="%(urls)s">%(urls)s</a>' % {'urls': u})
        if u[-4:] in ['.jpg', '.gif', '.png'] or u[-5:] == '.jpeg':
            imgs += """<img class="chat_image" src="%s" class="image-responsive">""" % u
    if imgs != '':
        msg += '<br/>' + imgs
    return msg


def code_block(msg):
    if msg[:5] == '/code':
        msg = msg.replace('/code', '<pre class="chat_code">')
        msg += '</pre>'
    return msg


def user_mentions(msg, users=None):
    users = ['alix', 'brian', 'evan']
    for u in users:
        mention_str = '@%s ' % u
        if mention_str in msg:
            replace_str = """<span class="chat_mention">%s</span>""" % mention_str
            msg = msg.replace(mention_str, replace_str)
    return msg

# End File: app/main/chat_filters.py
