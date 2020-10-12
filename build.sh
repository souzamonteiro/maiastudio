#!/bin/sh

rm -rf build/*
rm -rf doc/*

# Creates an uncompressed version of the library.
cat src/Shebang.js src/MaiaScript.js src/ComplexNumber.js src/MaiaCompiler.js src/Core.js src/ANN.js src/CAS.js src/Math.js src/Matrix.js src/String.js src/System.js src/MaiaVM.js > build/maiascript.js

cp build/maiascript.js bin/
cp build/maiascript.js js/
cp build/maiascript.js examples/js/

chmod 755 bin/*

bin/maiascript.js -c -o build/cna.js ./maia/cna/cna.maia
cp build/cna.js js/

jsdoc -d ./doc ./package.json ./src
jsdoc -c ./jsdoc.json -d ./doc ./maia/cna/package.json ./maia/cna

mkdir doc/grammar
cp -r grammar/diagram.xhtml doc/grammar
