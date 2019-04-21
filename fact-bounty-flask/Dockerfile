from python:3.6-alpine

RUN apk add --no-cache --virtual .pynacl_deps build-base python3-dev libffi-dev && pip3 install --upgrade pip

ENV FLASK_APP app.py
ENV FLASK_CONFIG docker

RUN mkdir -p /usr/fact-bounty/fact-bounty-flask
WORKDIR /usr/fact-bounty/fact-bounty-flask

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip --no-cache-dir install -r docker.txt
COPY . ./

EXPOSE 5000

ENTRYPOINT [ "./boot.sh" ]
