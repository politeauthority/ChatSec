FROM debian:jessie

MAINTAINER Booj Data "alix@politeauthority.com"

EXPOSE 5000

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        apt-utils \
        gcc \
        git \
        python \
        python-dev \
        python-pip \
        gunicorn \
        && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

ADD ./ /chatsec
RUN pip install -r /chatsec/resources/requirements.txt
RUN cd /chatsec/


CMD python /chatsec/chat.py