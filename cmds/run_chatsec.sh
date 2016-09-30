docker run \
    --name chatsec \
    -d \
    --expose 5000 \
    -p '8081:80' \
    -e VIRTUAL_HOST=sellyour.faith \
    -e FLASK_PORT=8080 \
    chatsec
