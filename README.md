# ChatSec
===================

End to end AES 256 bit encrypted databaseless chat platform using web sockets.


## Docker instructions

```
docker build -t chat-sec .
./run_chatsec.sh
```

## Environment Variables at play

- CHATSEC_FLASK_ENV
    defaults to 
- CHATSEC_FLASK_PORT
- CHATSEC_FLASK_CSRF_SESSION_KEY
- CHATSEC_FLASK_SECRET_KEY


## Built using 

Javascript AES 256 encryption by <http://www.movable-type.co.uk/scripts/aes.html>

Javascript Cookies by <https://github.com/js-cookie/js-cookie>
