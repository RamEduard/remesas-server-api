#!/bin/bash

export APP_NAME=react-remesas-app
export APP_NAME_V2=react-arbitr-app
export APP_SERVER_NAME=remesas-server-api

echo "Reload container..."

docker pull registry.gitlab.com/rameduard/remesas-server-api:master

docker pull registry.gitlab.com/rameduard/react-remesas-app:master

docker pull registry.gitlab.com/rameduard/react-arbitr-app:master

echo "Stop $APP_NAME container..."

docker container stop $(docker container ls -q --filter name=$APP_NAME)

echo "Remove $APP_NAME container..."

docker container rm $(docker container ls -qa --filter name=$APP_NAME)

echo "Stop $APP_NAME_V2 container..."

docker container stop $(docker container ls -q --filter name=$APP_NAME_V2)

echo "Remove $APP_NAME_V2 container..."

docker container rm $(docker container ls -qa --filter name=$APP_NAME_V2)

echo "Stop $APP_SERVER_NAME container..."

docker container stop $(docker container ls -q --filter name=$APP_SERVER_NAME)

echo "Remove $APP_SERVER_NAME container..."

docker container rm $(docker container ls -qa --filter name=$APP_SERVER_NAME)

echo "Run a new $APP_SERVER_NAME container..."

docker run -d --name="$APP_SERVER_NAME" -p 8080:8080 --network remesas registry.gitlab.com/rameduard/remesas-server-api:master

echo "Run a new $APP_NAME container..."

docker run -d --name="$APP_NAME" -p 3000:80 --network remesas registry.gitlab.com/rameduard/react-remesas-app:master

echo "Run a new $APP_NAME_V2 container..."

docker run -d --name="$APP_NAME_V2" -p 3001:80 --network remesas registry.gitlab.com/rameduard/react-arbitr-app:master