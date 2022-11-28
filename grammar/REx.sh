#!/bin/sh

java REx -backtrack -javascript -tree MaiaScript.ebnf
java REx -backtrack -javascript -tree ComplexNumber.ebnf
cp -f MaiaScript.js ../src/
cp -f ComplexNumber.js ../src/
java REx -backtrack -javascript -tree -main MaiaScript.ebnf
java -jar rr.war MaiaScript.ebnf > MaiaScript.xhtml
