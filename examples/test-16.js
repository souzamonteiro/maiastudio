a=4;b=100;if (core.equal(a,1)) {system.println("a == 1");system.println(core.add("b = ",b));} else if (core.equal(a,2)) {system.println("a == 2");system.println(core.add("b = ",b));} else if (core.equal(a,3)) {system.println("a == 3");system.println(core.add("b = ",b));} else {system.println("a != 1 && a != 2 && a != 3");system.println(core.add("b = ",b));};i=0;do {system.println(core.add("i = ",i));i=core.add(i,1);} while (core.LT(i,10));j=0;while (core.LT(j,10)) {system.println(core.add("j = ",j));j=core.add(j,1);};for (k=0;core.LT(k,10);k=core.add(k,1)) {system.println(core.add("k = ",k));system.println(core.add("k^2 = ",core.power(k,2)));};a={"v1": 1,"v2": 2,"v3": 3,"v4": 4};for (k in a) {var v = a[k];system.println(core.add(core.add(k," = "),v));system.println(core.add(core.add(k,"^2 = "),core.power(v,2)));};try {a=1;system.println(a);err=Error("oops");throw (err);} catch (e) {evalError=e.message;system.println(evalError);alert(evalError);};