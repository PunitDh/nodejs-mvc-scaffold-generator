#!/bin/sh

npm run model:generate $@
npm run router:generate $1
# npm run db:migrate
npm run views:generate $1