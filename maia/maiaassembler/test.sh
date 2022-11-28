#!/bin/sh

../../bin/maiascript.js src/maiaassembler.maia examples/add.wat
../../bin/maiascript.js src/maiaassembler.maia -o examples/add.txt -d examples/add.wasm
 ../../bin/maiascript.js examples/add.maia > test/add.txt
 