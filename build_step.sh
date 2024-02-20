#!/bin/bash

echo "Running build_step.sh"

cd project-frontend
npm install
npm run build
cp -r ./dist ../project-backend/dist
cd ..
cd project-backend
npm install
npm run tsc