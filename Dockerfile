FROM debian:jessie

MAINTAINER Booj Data "alix@politeauthority.com"

EXPOSE 5000

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        wget \
        git \
        gcc \
        libpq-dev \
        python \
        python-dev \
        python-mysqldb \
        python-pip \
            && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone https://github.com/politeauthority/ChatSec.git chatsec/

RUN pip install -r /chatsec/requirements.txt

CMD python /chatsec/chat.py
