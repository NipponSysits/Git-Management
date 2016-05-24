@echo off
rem SET ON_DATE=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%
rem SET /P version=<.meteor\deploy\build-versions
rem SET /A version=%version%+1
rem SET BUNDLE=builds_%ON_DATE%_version-%version%
rem SET DOCKER=pgm.ns.co.th
rem ECHO %version% > .meteor\deploy\build-versions
rem TITLE meteor - versions %version%
meteor build /data/app-bundle/ --directory --architecture=os.linux.x86_64
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
REM meteor build ../bundle --mobile-settings settings.json --architecture=os.linux.x86_64