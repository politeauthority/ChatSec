docker run \
    --name chatsec \
    -d \
    -p '8081:5000' \
    -e VIRTUAL_HOST=chatsec.org \
    chatsec
