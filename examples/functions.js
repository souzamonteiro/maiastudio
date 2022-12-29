var textWasm_1672237512872 = "(module \n(func $f6(export \"f6\") (param $a i32) (param $b i32) (result i32)\n    (i32.add\n      (local.get $a)\n      (local.get $b)\n    )\n\n)\n(func $f7(export \"f7\") (param $a i32) (param $b i32) (result i32)\n    (i32.mul\n      (local.get $a)\n      (local.get $b)\n    )\n\n)\n)";
var binaryWasm_1672237512872 = system.wat2wasm(textWasm_1672237512872);
var wasmModule_1672237512872 = new WebAssembly.Module(binaryWasm_1672237512872);
var wasmInstance_1672237512872 = new WebAssembly.Instance(wasmModule_1672237512872, {});
var {f6, f7} = wasmInstance_1672237512872.exports;
f = function (x) {
    return core.sub(core.add(core.power(core.mul(2,x),2),x),1);
};
system.println(f(2));
g = function (n) {
    if (core.logicalOR(core.equal(n,0),core.equal(n,1))) {
        return 1;
    };
    return core.mul(n,g(core.sub(n,1)));
};
system.println(g(5));
h = function (x,y,z) {
    return core.add(core.add(x,y),z);
};
f1 = async function (x) {
    return x;
};
f2 = function (x) {
    return x;
};
b=f2(2);
system.println(b);
f3 = function (x) {
    this.y=x;
    return this.y;
};
c= new f3(2);
system.println(JSON.stringify(c));
f4 = function (a,b) {
    c=core.add(a,b);
    return c;
};
d=f4(1,2);
system.println(d);
f5 = function (x) {
    y = x + 1;
    return y;
};
e=f5(2);
system.println(e);
f=f6(3,4);
system.println(f);
f=f7(5,6);
system.println(f);
