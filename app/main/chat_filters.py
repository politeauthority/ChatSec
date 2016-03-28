from flask import Markup
import re


def run(msg):
    msg = anchor_urls(msg)
    msg = Markup(msg)
    return msg


def anchor_urls(msg):
    urls = re.findall('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', msg)
    imgs = ''
    for u in urls:
        msg = msg.replace(u, '<a target="_new" href="%(urls)s">%(urls)s</a>' % {'urls': u})
        if u[-4:] in ['.jpg', '.gif', '.png'] or u[-5:] == '.jpeg':
            imgs += """<img src="%s" class="image-responsive">""" % u
    if imgs != '':
        msg += '<br/>' + imgs
    return msg

# End File: app/main/chat_filters.py
