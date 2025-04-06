#!/bin/sh
# Check if package.json exists in /app/server
if [ ! -f package.json ]; then
  echo "Initializing Node project in /app/server..."
  npm init -y
  echo "Installing express and mongoose..."
  npm install express mongoose
  echo "Installing nodemon as dev dependency..."
  npm install --save-dev nodemon
  echo "Creating an empty server.js file..."
  touch server.js
fi

#Check if node_modules exists
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  npm install
fi

echo "Starting server with nodemon..."
npx nodemon server.js