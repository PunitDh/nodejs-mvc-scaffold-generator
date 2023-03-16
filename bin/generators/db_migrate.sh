#!/bin/sh

echo "Running migrations...."
node ./bin/migrations.js

node ./bin/schema.js