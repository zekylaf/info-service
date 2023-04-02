FROM quay.io/indophi/ubuntu_18-04
MAINTAINER Laafe

ENV destDir /src/info-service
# Create app directory
RUN mkdir -p ${destDir}
#Set working Directory
WORKDIR ${destDir}

# Install app dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    mongodb-clients \
    git-core \
    libkrb5-dev \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json .

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p ${NVM_DIR}
ENV NODE_VERSION 12.14.0

# Install nvm with node and npm
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm install --loglevel error
# Bundle app source
COPY . .
#Fix Permissions.
RUN mkdir .tmp
RUN chmod -R 1777 .tmp

#Fix autorun permissions
RUN chmod +x "${destDir}/autorunECS.sh"
RUN chown root:root "${destDir}/autorunECS.sh"

# Bundle app source
EXPOSE 3000
#By default run prod, If development is requiered This command would be override by docker-compose up
CMD [ "npm", "start" ]
