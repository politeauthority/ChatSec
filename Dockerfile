FROM frolvlad/alpine-python3

ADD ./ /opt/chatsec/

RUN apk add --no-cache \
    bash \
    python3 \
    python-dev \
    py-pip \
    gcc \
    && rm -rf /var/cache/apk/*

WORKDIR /opt/chatsec/
RUN pip3 install -r ./requirements.txt
CMD python chat.py
