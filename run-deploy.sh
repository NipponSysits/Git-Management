#!/bin/bash
git pull origin master
meteor build /data/app-bundle/ --directory --architecture=os.linux.x86_64
cd /app
docker-compose restart debugerr