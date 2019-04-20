from python:3.6-apline

ENV FLASK_APP app.py
ENV FLASK_CONFIG production

RUN mkdir -p /usr/fact-bounty/fact-bounty-flask
WORKDIR /usr/fact-bounty/fact-bounty-flask

COPY requirements.txt requirements.txt
RUN python -m venv venv
RUN venv/bin/pip --no-cache-dir install -r requirements.txt
COPY . /usr/fact-bounty/fact-bounty-flask

EXPOSE 5000

ENTRYPOINT [ "./boot.sh" ]
