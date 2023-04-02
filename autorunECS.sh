#!/bin/sh

#This script is ONLY for use with docker / ECS service
#This scripts creates the necessary config file for login in npm

#Create .npmrc file
destDir=/src/info-service

echo '@indophi:registry=https://registry.npmjs.org/\n//registry.npmjs.org/:_authToken='"${NPM_TOKEN}" >> ${destDir}/.npmrc

npm install

return 0
