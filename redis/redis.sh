#!/usr/bin/env bash
docker run --rm -ti --name redis -p 6379:6379 -v `pwd`/data/:/data redis:alpine
