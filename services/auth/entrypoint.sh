#!/bin/sh

echo "Waiting for postgres..."
echo "$POSTGRES_HOST"
echo "$POSTGRES_PORT"
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done

echo "Running DB migrations..."
python manage.py makemigrations

echo "Running django migrate"
python manage.py migrate

echo "Verifying if fixtures are loaded"
if [ -f "fixture_loaded.txt" ]; then
    echo "Fixtures already loaded"
else 
    echo "Loading fixtures"
    python manage.py loaddata fixtures/initial_data.json
    touch fixture_loaded.txt
fi

if [ "$IS_CONSUMER" = "1" ]
then
    echo "Transactions service message broker consumer starting"
    exec python manage.py start_consumer
else
    echo "Running django server"
    exec python manage.py runserver 0.0.0.0:$DJANGO_PORT
fi

exec "$@"
