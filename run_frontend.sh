#!/bin/bash

# Ensure we use the local Node v20
export PATH=$PWD/node_env/bin:$PATH

echo "Starting Frontend with Node $(node -v)..."

cd frontend
npm run dev
