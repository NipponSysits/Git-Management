@echo off
CD ..
pscp GitControl-UI.tar.gz core@ssh.touno-k.com:/debugerr/web/WebUI.tar.gz
del GitControl-UI.tar.gz