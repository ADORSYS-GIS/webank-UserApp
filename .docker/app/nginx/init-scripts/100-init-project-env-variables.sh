#!/usr/bin/env sh

set -ex

projectEnvVariables=$(ls -t /usr/share/nginx/html/assets/projectEnvVariables*.js | head -n1)
envsubst < "$projectEnvVariables" > ./projectEnvVariables_temp
cp ./projectEnvVariables_temp "$projectEnvVariables"
rm ./projectEnvVariables_temp
