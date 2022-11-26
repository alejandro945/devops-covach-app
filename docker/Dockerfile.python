FROM python:3.10.4-alpine3.16 as builder

# set environment variables for pip
ENV PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100

# install build dependencies
RUN apk update \
    && apk add --no-cache make postgresql-dev gcc libffi-dev rust cargo musl-dev openssl-dev curl python3-dev

# Copy requirements
COPY requirements*.txt ./

# build requirements
RUN pip wheel --no-cache-dir -r requirements.txt

FROM python:3.10.4-alpine3.16
# set environment variables for python
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    WHEELS=/app/wheels

WORKDIR /app
RUN mkdir $WHEELS
COPY --from=builder *.whl /app/wheels/

RUN apk add --no-cache postgresql-dev && \
    pip install --no-cache-dir $WHEELS/*.whl


# copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]