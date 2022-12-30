#!/bin/sh

rm -rf build/*
rm -rf docs/*

# Creates uncompressed versions of the library.
cat src/Shebang.js src/MaiaScript.js src/MaiaAssemblyCompiler.js src/ComplexNumber.js src/MaiaCompiler.js src/Core.js src/System.js src/Math.js src/Matrix.js src/String.js src/ANN.js src/CAS.js src/GPU.js src/Task.js src/MaiaVM.js > build/maiascript.js
cat src/MaiaScript.js src/MaiaAssemblyCompiler.js src/ComplexNumber.js src/MaiaCompiler.js src/Core.js src/System.js src/Math.js src/Matrix.js src/String.js src/ANN.js src/CAS.js src/GPU.js src/Task.js > build/libmaia.js

cp build/maiascript.js bin/
cp build/maiascript.js js/
cp build/libmaia.js js/

chmod 755 bin/*

jsdoc -d ./docs ./package.json ./src
jsdoc -c ./jsdoc.json -d ./docs ./maia/cna/package.json ./maia/cna
jsdoc -c ./jsdoc.json -d ./docs ./maia/dfa/package.json ./maia/dfa
jsdoc -c ./jsdoc.json -d ./docs ./maia/maiarecorder/package.json ./maia/maiarecorder/maia/
jsdoc -c ./jsdoc.json -d ./docs ./maia/snet/package.json ./maia/snet/
jsdoc -c ./jsdoc.json -d ./docs ./maia/statistics/package.json ./maia/statistics/

mkdir docs/grammar
mkdir docs/guide

cp -r grammar/MaiaScript.xhtml docs/grammar
cp -r md/*.html docs/guide
