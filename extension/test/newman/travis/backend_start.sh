#!/bin/bash

cd ${CONNECT_DIR}
rm -f connect.out

${EXT_DIR}/extension/node_modules/.bin/nyc sgconnect backend start > connect.out 2>&1 &

echo "=== Waiting for backend ready signal ==="
chmod +x ${EXT_DIR}/${TRAVIS_DIR}/backend_wait.sh
timeout 60s ${EXT_DIR}/${TRAVIS_DIR}/backend_wait.sh

${EXT_DIR}/extension/node_modules/.bin/nyc report --reporter=text-lcov | coveralls
