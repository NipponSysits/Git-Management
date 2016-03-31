@echo off
meteor npm install
meteor build ./.script/ --mobile-settings settings.json --architecture=os.linux.x86_64

@echo on