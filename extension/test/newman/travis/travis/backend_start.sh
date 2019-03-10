#!/bin/bash

cd ${CONNECT_DIR}
rm -f connect.out

sgconnect backend start > connect.out 2>&1 &

echo "=== Waiting for backend ready signal ==="
chmod +x ${EXT_DIR}/${TRAVIS_DIR}/backend_wait.sh
timeout 60s ${EXT_DIR}/${TRAVIS_DIR}/backend_wait.sh
