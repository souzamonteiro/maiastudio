#!/bin/sh

rm build/*

# Creates an uncompressed version of the library.
cat src/Header.js src/MaiaScript.js src/ComplexNumber.js src/MaiaCompiler.js src/Core.js src/String.js src/System.js src/Math.js src/Matrix.js src/MaiaVM.js > build/maiascript.js

cp build/maiascript.js bin/
cp build/maiascript.js js/
cp build/maiascript.js examples/js/
