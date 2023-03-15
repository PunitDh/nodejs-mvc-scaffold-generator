#!/bin/sh

echo "Running ./db/migrations.js"
node ./db/migrations.js

node ./bin/schema.js