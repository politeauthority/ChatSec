docker run \
    --name chatsec \
    --expose 5000 \
    -p '8081:5000' \
    -e VIRTUAL_HOST=sellyour.faith \
    -e FLASK_PORT=8080 \
    chatsec
