"""
    Verify
"""
import requests
from bs4 import BeautifulSoup

current_master_js = 'https://raw.githubusercontent.com/politeauthority/ChatSec/master/app/static/js/main.js'

def run(chatsec_url):
    print chatsec_url
    soup = BeautifulSoup(open("index.html"))
    r = requests.get('https://api.github.com/events')
    print r
    soup = BeautifulSoup(r.text)
    print soup

    return

# End File: app/main/verify.py
