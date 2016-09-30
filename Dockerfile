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
        apache2 \
        libapache2-mod-wsgi \
        nano \
        && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN git clone https://github.com/politeauthority/ChatSec.git /chatsec


RUN pip install -r /chatsec/resources/requirements.txt
RUN cp /chatsec/resources/chatsec_httpd.conf /etc/apache2/sites-available/chatsec.conf
RUN a2ensite chatsec.conf
RUN service apache2 restart
CMD /usr/sbin/apache2ctl -D FOREGROUND