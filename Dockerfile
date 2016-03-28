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

RUN mkdir /app
ADD ./ /app

RUN pip install -r /app/requirements.txt

CMD python /app/chat.py
