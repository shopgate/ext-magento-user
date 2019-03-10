#!/bin/bash

### If connect.out has "Backend ready" we can continue running other things

until fgrep -q "Backend ready" ${CONNECT_DIR}/connect.out; do sleep 1; done
