#!/bin/sh
set -e

if [ -n "$DATABASE_URL" ]; then
  ./node_modules/.bin/prisma migrate deploy
  ./node_modules/.bin/prisma db seed
fi

exec node server.js
