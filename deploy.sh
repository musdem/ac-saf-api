#!/bin/bash

bash ./backup.sh
git pull
docker-compose stop
docker-compose build
docker-compose up -d
