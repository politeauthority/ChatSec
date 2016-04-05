docker run \
    --name chat-sec \
    --expose 5000 \
    -p '8081:5000' \
    -e VIRTUAL_HOST=sellyour.faith \
    -e FLASK_PORT=8080 \
    -d \
    chat-sec
