#!/bin/sh

rm -rf bin/*
rm -rf build/*
rm -rf docs/*

cp src/maiaassembler.maia build/
cp build/maiaassembler.maia bin/

chmod 755 bin/*

jsdoc -c ./jsdoc.json -d ./docs ./package.json ./src
