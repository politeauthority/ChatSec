FROM python:2.7-slim

MAINTAINER Booj Data "alix@politeauthority.com"

EXPOSE 8000

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        apt-utils \
        gcc \
        git \
        && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone https://github.com/politeauthority/ChatSec.git /chatsec

RUN cd /chatsec/
RUN git fetch origin
RUN git checkout gunicorn
RUN pip install -r /chatsec/resources/requirements.txt
ENTRYPOINT ["/usr/local/bin/gunicorn", "--chdir", "/chatsec/" "--config", "/chatsec/resources/gunicorn.conf", "--log-config", "/chatsec/resources/logging.conf", "-b", ":8000", "chat:app"]
