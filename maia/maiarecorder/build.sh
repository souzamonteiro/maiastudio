#!/bin/sh
rm -rf docs/*

bin/maiascript.js -c -o js/recorder.js ./maia/recorder.maia

jsdoc -c ./jsdoc.json -d ./docs ./package.json ./maia/
