const fs = require('fs');

const wasmBuffer = fs.readFileSync('add.wasm');
const wasmModule = new WebAssembly.Module(wasmBuffer)

const wasmInstance = new WebAssembly.Instance(wasmModule, {});
const {add} = wasmInstance.exports;
for (let i = 0; i < 10; i++) {
  console.log(add(i, i));
}
