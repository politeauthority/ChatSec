docker stop chatsecg
docker rm chatsecg
docker run \
    --name chatsecg \
    -d \
    -p '8000:8000' \
    -e VIRTUAL_HOST=chatsec.org \
    chatsecg
