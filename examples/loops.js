a=0;
b=[1,2,3];
c={a: 1,b: 2};
do {
    system.println(a);
    a++;
} while (core.LT(a,10));
while (core.LT(a,10)) {
    if (core.equal(core.mod(a,2),0)) {
        continue;
    };
    if (core.GE(a,5)) {
        system.println("Break the loop.");
        break;
    };
    system.println(a);
    a++;
};
for (a=0;core.LT(a,10);a++) {
    system.println(a);
};
for (i=0;core.LT(i,b.length);i++) {
    system.println(b[i]);
};
for (key in c) {
    var value = c[key];
    system.println(core.add(core.add(key,": "),value));
};
