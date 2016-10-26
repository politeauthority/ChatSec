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



ADD ./ /chatsec

WORKDIR /chatsec
RUN pip install -r /chatsec/resources/requirements.txt

CMD gunicorn -k gevent -w 1 -b 0.0.0.0:8000  --access-logfile -  chat:app