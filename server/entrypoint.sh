#!/bin/sh
echo "Installing dependencies..."
npm install

echo "Starting server with nodemon..."
npx nodemon server.js