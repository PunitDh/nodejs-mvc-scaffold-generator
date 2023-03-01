#!/bin/sh

echo "Running ./db/migrations.js"
node ./db/migrations.js

echo "Updating schema"
node ./bin/schema.js