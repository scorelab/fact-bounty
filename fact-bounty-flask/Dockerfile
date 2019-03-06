from alpine:latest

RUN apk add --no-cache --virtual .pynacl_deps build-base python3-dev libffi-dev && pip3 install --upgrade pip

WORKDIR /app

COPY . /app

RUN pip3 --no-cache-dir install -r requirements.txt

EXPOSE 5000

ENTRYPOINT [ "./boot.sh" ]