let wast = require("./wast.js");
var textWat = "(module \n(func (export \"add\") (param $a i32) (param $b i32) (result i32)\n    (i32.add\n      (local.get $a)\n      (local.get $b)\n    )\n)\n)";
var binaryWasm = wast.WebAssemblyText.encode(textWat);
var wasmModule = new WebAssembly.Module(binaryWasm);
var wasmInstance = new WebAssembly.Instance(wasmModule, {});
var {add} = wasmInstance.exports;
y = add(1, 2);
console.log(y);