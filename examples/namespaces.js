function a_() {
    this.b=1;
    this.f = function (n) {
        if (core.logicalOR(core.equal(n,0),core.equal(n,1))) {
            return 1;
        };
        return core.mul(n,this.f(core.sub(n,1)));
    };
};
a = new a_();
system.println(a.b);
system.println(a.f(5));
