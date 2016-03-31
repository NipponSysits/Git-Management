@echo off
SET ON_DATE=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%
SET /P version=<.meteor\deploy\build-versions
SET /A version=%version%+1 > .meteor\deploy\build-versions
meteor build .meteor/deploy/builds_%ON_DATE%_version-%version% --mobile-settings settings.json --server-only --architecture=os.linux.x86_64
@echo on