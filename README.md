# MaiaStudio (The MaiaScript IDE)

Copyright (C) 2020, 2021 Roberto Luiz Souza Monteiro, Renata Souza Barreto, Hernane Borges de Barros Pereira.

This software is distributed under the terms of several open sources licenses.

Please read the files LICENSE, COPYING or COPYING.LIB for further information.

maiascript.js is a compiler that implements the MaiaScript programming language.

MaiaScript is a programming language aimed at developing adaptable and
intelligent applications. An adaptive application modifies its code to
suit the conditions of the environment. An intelligent application,
it learns to process the data it receives and adjusts to possible changes
in its characteristics, over time. The MaiaScript language implements the
adaptation paradigm, combining it with a variation of the object-oriented
paradigm, simplified to exclude definitions of types and access restrictions.
These characteristics make MaiaScript a programming language suitable for
rapid learning, both by Computer Science professionals and scientists who
are starting to implement computational algorithms. The characteristics of
this language, also allow the rapid development of complex applications,
especially when adaptability is necessary. MaiaScript also presents a syntax
similar to that used in Mathematics, including libraries for Numerical Calculation,
Complex Network Analysis, Database Access, Regular Expression Processing, and an
abstraction layer between the MaiaScript interpreter and the underlying Operating System.

The complete documentation, including the EBNF grammar file and the compiler's
syntax diagrams (railroad diagrams) can be found in the grammar directory.
For more information send mail to: [mailto:support@maiascript.com](mailto:support@maiascript.com)

MaiaStudio currently implements the following features:
- Syntax highlighting;
- Line number display;
- Auto-indentation;
- Automatic closing of structures;
- Indent and unindent method;
- Comment and uncomment method;
- Undo and redo;
- Search and replace text based on regular expressions;
- Support for any language supported by the Prism syntax highlighter;
- Lightweight and easily extensible editor;
- Simplified API, although powerful;
- GPU support;
- Free software.

In addition to being accessible via the API, some commands are available as shortcut keys:
- [CTRL] + i: indent;
- [SHIFT] + [CTRL] + i: unindent;
- [CTRL] + m: comment;
- [SHIFT] + [CTRL] + m: uncomment;
- [CTRL] + z: undo;
- [SHIFT] + [CTRL] + z: redo,
or on macOS:
- [CMD] + i: indent;
- [SHIFT] + [CMD] + i: unindent;
- [CMD] + m: comment;
- [SHIFT] + [CMD] + m: uncomment;
- [CMD] + z: undo;
- [SHIFT] + [CMD] + z: redo.

You can get the last MaiaStudio version at [http://www.maiascript.com](http://www.maiascript.com)

## COMPUTER ALGEBRA SYSTEM (CAS):

MaiaScript uses the Algebrite CAS to solve complex expressions involving linear algebra,
systems of equations and differential and integral calculus. For complete reference,
see the Algebrite documentation at [http://algebrite.org](http://algebrite.org)

To invoke CAS use the method:

`cas.eval("expression")`

## INSTRUCTIONS FOR USE:

To use the MaiaScript language in HTML documents, just include the
file "js/maiascript.js" in the document and insert the MaiaScript code
in `<script>` tags of type `"text/maiascript"`:

`<script type = "text/maiascript"> ... </script>`

To compile and run the scripts configure the page's onload event to execute
the "maiavm.compile()" method:

`<body onload = "maiavm.compile();" ... </body>`

To run MaiaScript code from the console, you need to install "Node.js" and the
npm packages "jsdom" and "websql". To run a script use:

`node js/maiascript.js "script name".maia`

Or, if you installed the MaiaScript compiler using npm:

`maiascript "script name".maia`

## INSTALL COMMAND LINE INTERFACE (CLI):

To install the MaiaScript compiler command line tool and MaiaStudio use the command:

`npm install -g maiascript-cli`

Or, get it from GitHub:

`git clone https://github.com/souzamonteiro/maiastudio.git`

Or, download the latest zipped version:

`unzip maiastudio-master.zip`

`cd maiastudio-master`

`npm install -g .`

## RUN TESTS:

To run the test scripts execute:

`./test.sh`

## USING THE COMMAND LINE INTERFACE (CLI) AND MAIASTUDIO:

To run the command line tool, use the command:

`maiascript [options] [script.maia] [--] [arguments]`

To see the command line tool options run the command:

`maiascript --help`

To launch MaiaStudio open the file `index.html`, in the main directory of the package, in a browser.

To try MaiaStudio on-line go to [http://www.maiastudio.com.br](http://www.maiastudio.com.br)

Lauro de Freitas, October 2020.

Roberto Luiz Souza Monteiro

