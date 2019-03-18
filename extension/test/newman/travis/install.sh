#!/bin/bash

# the -e flag causes the script to exit as soon as one command returns a non-zero exit code.
set -ev

# Install dependencies
cd ${TRAVIS_BUILD_DIR}/extension
node ./test/newman/setup.js ${MAGENTO_USER} ${MAGENTO_PASS}
npm i > /dev/null 2>&1

# SGConnect create folder structure
mkdir ${CONNECT_DIR}
cd ${CONNECT_DIR}

npm install -g @shopgate/platform-sdk > /dev/null 2>&1
sgconnect login --username "${SG_USER}" --password "${SG_PASS}"
sgconnect init --appId "${APP_ID}" --force

# Clone extension to connect folder structure
rsync -a --exclude 'connect' ${TRAVIS_BUILD_DIR}/ ${EXT_DIR}

# Add empty config.json
cd ${TRAVIS_BUILD_DIR}/frontend
echo '{}' > config.json

# Attach extension now that it exists
cd ${CONNECT_DIR}
sgconnect extension attach ${EXT_NAME}
