#!/bin/sh

echo "Waiting for postgres..."
echo "$POSTGRES_HOST"
echo "$POSTGRES_PORT"
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done

echo "Running DB migrations..."
alembic upgrade head

echo "Running Products server"
exec uvicorn app.main:app --host 0.0.0.0 --port $FASTAPI_PORT --reload

exec "$@"
