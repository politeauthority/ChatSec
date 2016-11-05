# ChatSec
===================

End to end AES 256 bit encrypted databaseless chat platform using web sockets.


## Docker instructions
If you have docker already installed, or don't, this will probably be the easiest way to get ChatSec running.
For more info on docker, go here <https://www.docker.com/>
```
docker build -t chat-sec .
```
This will build the image on your server. 

Chatsec.org makes use jwilder's nginx-proxy <https://github.com/jwilder/nginx-proxy>. This makes attaching a domain name to the chatsec.org server very easy, and set by only the ENV var VIRTUAL_HOST.

```
docker run \
    --name chatsec \
    -d \
    -p '8081:5000' \
    -e VIRTUAL_HOST=example.org \
    chatsec

```

## Environment Variables at play

- CHATSEC_FLASK_ENV
- CHATSEC_FLASK_PORT
- CHATSEC_FLASK_CSRF_SESSION_KEY
- CHATSEC_FLASK_SECRET_KEY


## Built using 

Javascript AES 256 encryption by <http://www.movable-type.co.uk/scripts/aes.html>

Javascript Cookies by <https://github.com/js-cookie/js-cookie>
