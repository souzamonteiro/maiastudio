try {
    x="50";
    if (core.equal(x,"")) {
        throw ("empty");
    };
    if (isNaN(x)) {
        throw ("not a number");
    };
    x=Number(x);
    if (core.LT(x,5)) {
        throw ("too low");
    };
    if (core.GT(x,10)) {
        throw ("too high");
    };
;
} catch (err) {
    system.print("Error: ");
    system.println(core.add(core.add("input is ",err),"!"));
};
