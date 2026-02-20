#!/bin/bash

# Ensure we use the local Node v20
export PATH=$PWD/node_env/bin:$PATH

echo "Starting Backend Setup..."

# Ensure data directory exists
mkdir -p data/db

# Check for MongoDB (either system or local)
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is not running. Attempting to start local instance..."
    
    if [ -f "./mongo_env/bin/mongod" ]; then
        echo "Starting local MongoDB..."
        ./mongo_env/bin/mongod --dbpath ./data/db --logpath ./data/db/mongod.log --fork
        sleep 3 # Wait for it to start
    else
        echo "❌  Error: local 'mongod' not found in ./mongo_env/bin/mongod"
        echo "Please install MongoDB or let the script download it."
        exit 1
    fi
else
    echo "MongoDB is already running."
fi

echo "Starting Backend Server..."
cd backend
npm run dev
