FROM python:3.8

ARG BUILD_DIR

COPY ${BUILD_DIR} /code/online_chatting

RUN cd /code/online_chatting && \
    pip install -r requirements.txt

RUN chgrp -R 0 /code/online_chatting && \
    chmod -R g=u /code/online_chatting