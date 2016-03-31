@echo off
SET ON_DATE=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%
SET /P version=<.meteor\deploy\build-versions
SET /A version=%version%+1
SET BUNDLE=builds_%ON_DATE%_version-%version%
SET DOCKER=pgm.ns.co.th
ECHO %version% > .meteor\deploy\build-versions
TITLE meteor - versions %version%
meteor build --directory .meteor/ --mobile-settings settings.json --server-only --architecture=os.linux.x86_64
:: RENAME debuger-Management.tar.gz %BUNDLE%.tar.gz
:: ECHO 
:: winscp /command ^
::   "open sftp://app:app1234@pgm.ns.co.th/" ^
::   "cd /app" ^
::   "put %BUNDLE%/debuger-Management.tar.gz /app/" ^
::   "exit"
git add -A
git commit -m "versions %version%"
:: git push origin master:master
@echo on