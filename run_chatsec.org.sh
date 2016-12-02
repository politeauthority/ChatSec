docker run \
    -d \
    --name chatsec \
    --expose 5000 \
    -e VIRTUAL_HOST=chatsec.org \
    -e FLASK_PORT=8080 \
    -p 80:5000 \
    -p 443:5000 \
    chatsec
