docker run \
    --name chatsec \
    -d \
    -p '8081:80' \
    -e VIRTUAL_HOST=chatsec.org \
    -e FLASK_PORT=8080 \
    chatsec
