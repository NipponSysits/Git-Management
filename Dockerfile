FROM node:0.10.44
MAINTAINER Touno-K.com
# WORKDIR /app
# PORT 3000

ENV METEORD_DIR /app
ENV METEOR_VERSION latest
ENV METEOR_INSTALLER_SHA256 4020ef4d3bc257cd570b5b2d49e3490699c52d0fd98453e29b7addfbdfba9c80
ENV METEOR_LINUX_X86_32_SHA256 latest
ENV METEOR_LINUX_X86_64_SHA256 latest

COPY install_binbuild_tools.sh $METEORD_DIR/rebuild_meteor.sh

RUN curl -SL https://install.meteor.com/ -o /tmp/meteor/inst \
    && sed -e "s/^RELEASE=.*/RELEASE=\"\$METEOR_VERSION\"/" /tmp/meteor/inst > /tmp/meteor/inst-canonical \
    && echo $METEOR_INSTALLER_SHA256 /tmp/meteor/inst-canonical | sha256sum -c \
    # && patch /tmp/meteor/inst /tmp/meteor/meteor-installer.patch \
    && chmod +x /tmp/meteor/inst \
    && /tmp/meteor/inst \
    && rm -rf /tmp/meteor


ADD entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

RUN mkdir -p /app/source && chown -R  www-data:www-data /app/source

VOLUME /app/source
WORKDIR /app/bundle
EXPOSE 3000

ENTRYPOINT ["/usr/bin/entrypoint.sh"]
CMD []

# CMD ['node','main.js']
# https://github.com/CyCoreSystems/docker-meteor/blob/master/Dockerfile
# https://github.com/CyCoreSystems/docker-meteor/blob/master/entrypoint.sh