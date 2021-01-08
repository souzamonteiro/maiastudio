#!/bin/sh

rm -rf build/*
rm -rf docs/*

# Creates uncompressed versions of the library.
cat src/Shebang.js src/MaiaScript.js src/ComplexNumber.js src/MaiaCompiler.js src/ANN.js src/CAS.js src/Core.js src/Math.js src/Matrix.js src/String.js src/System.js src/Task.js src/MaiaVM.js > build/maiascript.js
cat src/MaiaScript.js src/ComplexNumber.js src/MaiaCompiler.js src/ANN.js src/CAS.js src/Core.js src/Math.js src/Matrix.js src/String.js src/System.js src/Task.js > build/libmaia.js

cp build/maiascript.js bin/
cp build/maiascript.js js/
cp build/maiascript.js examples/js/
cp build/libmaia.js js/

chmod 755 bin/*

bin/maiascript.js -c -o build/cna.js ./maia/cna/cna.maia
cp build/cna.js js/

jsdoc -d ./docs ./package.json ./src
jsdoc -c ./jsdoc.json -d ./docs ./maia/cna/package.json ./maia/cna

mkdir docs/grammar
cp -r grammar/MaiaScript.xhtml docs/grammar
