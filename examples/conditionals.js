a=1;
b=2;
c=core.equal(a,1) ? "Hello" : "World";
if (core.LT(a,b)) {
    system.println(core.add("a = ",a));
    system.println(core.add("b = ",b));
    system.println("a < b");
    if (core.equal(a,1)) {
        system.println("a == 1");
    } else {
        system.println("a != 1");
    };
} else {
    if (core.GT(a,b)) {
        system.println(core.add("a = ",a));
        system.println(core.add("b = ",b));
        system.println("a > b");
    } else {
        system.println(core.add("a = ",a));
        system.println(core.add("b = ",b));
        system.println("a == b");
    };
};
switch (a) {
    case 0 : 
    case 1 : 
        system.println("a == 0 || a == 1 || a == 2");
    case 2 : 
        system.println("a == 2");
        break;
    default : 
        system.println(core.add("a = ",a));
        system.println("a != 1 && a != 2");
};
system.println(core.equal(c,1) ? "Maia" : "Script");
