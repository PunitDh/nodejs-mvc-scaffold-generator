#!/bin/sh

chmod u+x ./bin/*
nvm use
npm i
touch .env
cat .env.sample > .env