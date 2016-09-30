FROM debian:jessie

MAINTAINER Booj Data "alix@politeauthority.com"

EXPOSE 8000

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        apt-utils \
        gcc \
        git \
        python \
        python-dev \
        python-pip \
        gunicorn \
        nano \
        && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone https://github.com/politeauthority/ChatSec.git /chatsec


RUN pip install -r /chatsec/resources/requirements.txt
RUN cd /chatsec/

CMD tail -f /dev/null