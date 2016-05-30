FROM node:0.10.44
MAINTAINER Touno-K.com
# WORKDIR /app
# PORT 3000

RUN cd /data/app 
	&& git pull origin master \
	&& meteor build /app --directory --architecture=os.linux.x86_64 \
  && cd /app/bundle/programs/server \
  && npm install 
  && cd /app

CMD ['node','main.js']
# /app/debugger /data/debugger