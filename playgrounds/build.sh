#!/bin/bash

# exit when any command fails
set -e

cd ./vite-vue2.7
rm -rf node_modules
pnpm install
pnpm run build

cd ../vite
rm -rf node_modules
pnpm install
pnpm run build

# cd ../nuxt
# rm -rf node_modules
# pnpm install
# pnpm run build
