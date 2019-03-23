#!/bin/bash

### If connect.out has "Backend ready" we can continue running other things

until fgrep -q "Backend ready" ${EXT_DIR}/extension/connect.out; do sleep 1; done
