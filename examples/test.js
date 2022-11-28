system.println("Testing add operator...");
core.testScript('a=1;b=2;c=core.add(a,b);',10,4,0,'var v = core.testResult.obtained;system.print("TEST: Fail testing add operator.");system.print(core.add("      Expected result ",core.testResult.expected));system.print(core.add("      But got ",core.testResult.obtained));');;
