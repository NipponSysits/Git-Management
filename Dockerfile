FROM node:0.10.44
MAINTAINER Touno-K.com
# WORKDIR /app
# PORT 3000

RUN mkdir -p /app/source \
	&& cd /app/source \
	&& git pull origin master \
	&& meteor build /app --directory --architecture=os.linux.x86_64 \
  && cd /app/bundle/programs/server \
  && npm install \
  && cd /app

# VOLUME /app/source 
# VOLUME /app/bundle

CMD ['node','main.js']
# /app/debugger /data/debugger