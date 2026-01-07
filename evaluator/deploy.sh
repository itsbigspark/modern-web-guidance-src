#!/bin/bash
rsync -avP --exclude='.git' --exclude='node_modules' --exclude='.env' --exclude='.DS_Store' . /google/data/rw/users/rv/rviscomi/www/spike-test/
