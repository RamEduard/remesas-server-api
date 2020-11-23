#!/bin/bash

export APP_NAME=remesas-server-api

echo "Reload container..."

docker pull registry.gitlab.com/rameduard/remesas-server-api:master

echo "Stop $APP_NAME container..."

docker container stop $(docker container ls -q --filter name=$APP_NAME)

echo "Remove $APP_NAME container..."

docker container rm $(docker container ls -q --filter name=$APP_NAME)

echo "Run a new $APP_NAME container..."

docker run -d --name remesas-server-api -p 8080:8080 --network remesas registry.gitlab.com/rameduard/remesas-server-api:master