#!/bin/bash

# Ensure we are in the script's directory
cd "$(dirname "$0")"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Parse optional flag for Raspberry Pi
if [[ "$1" == "--raspi" ]]; then
  export BROWSER=chromium
  echo "Running in Raspberry Pi mode (Chromium)"
fi

# Signal handler to forward signals to child process
cleanup() {
  echo "Stopping application..."
  if [ -n "$APP_PID" ]; then
    kill -TERM "$APP_PID" 2>/dev/null
    wait "$APP_PID" 2>/dev/null
  fi
  exit 0
}

trap cleanup SIGTERM SIGINT SIGHUP

# Start the application
echo "Starting DOOH Loop Player..."
npm start &
APP_PID=$!

# Wait for the application to finish
wait $APP_PID
