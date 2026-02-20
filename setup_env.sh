#!/bin/bash

# Ensure we use the local Node v20
export PATH=$PWD/node_env/bin:$PATH

echo "Using Node.js version: $(node -v)"

# Ensure data directory exists
mkdir -p data/db

# Check/Start MongoDB
if ! pgrep -x "mongod" > /dev/null; then
    echo "MongoDB is not running. Attempting to start local instance..."
    if [ -f "./mongo_env/bin/mongod" ]; then
        echo "Starting local MongoDB..."
        ./mongo_env/bin/mongod --dbpath ./data/db --logpath ./data/db/mongod.log --fork
        sleep 5
    else
        echo "Error: MongoDB not found. Did the download fail?"
        exit 1
    fi
else
    echo "MongoDB is already running."
fi

echo "Installing Backend Dependencies..."
cd backend
npm install
echo "Seeding Database..."
npm run data:import
echo "Backend Setup Complete."
cd ..

echo "Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

echo "Setup Complete!"
echo "To run the app:"
echo "1. Run './run_backend.sh' in one terminal"
echo "2. Run './run_frontend.sh' in another terminal"
