/**
 * @license
 * Copyright 2020 Roberto Luiz Souza Monteiro,
 *                Renata Souza Barreto,
 *                Hernane Borges de Barros Pereira.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * MaiaScript virtual machine.
 * @class
 */
function MaiaVM() {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
        compiledCode = {
            'xml': '',
            'mil': '',
            'js': ''
        }    
    }

    /**
     * Compiles MaiaScript code, contained in <script> tags for JavaScript
     * and inserts the compiled code in a new <script> tag in the <body> tag
     * of the document.
     * 
     * MaiaScript codes must be in <script> tags of type 'text/maiascript',
     * as in the following example:
     * 
     * <script type='text/maiascript'> ... </script>
     * 
     * This method must be called from the onLoad event of the document's
     * <body> tag, as in the following example:
     * 
     * <body onload='maiavm.compile()'> ... </body>
     */
    this.compile = function()
    {
        var scripts = document.querySelectorAll('script[type="text/maiascript"]');
        for (index in scripts) {
            if (typeof scripts[index].getAttribute != 'undefined') {
                var fileName = scripts[index].getAttribute('src');
                if (typeof fileName != 'undefined') {
                    if (fileName) {
                        compiledCode.maia = '';
                        fetch(fileName)
                        .then(response => response.text())
                        .then(data => {
                            var code = data;
                            if (typeof code != 'undefined') {
                                if (typeof code == 'string') {
                                    compiledCode.xml = '';
                                    function getXml (data) {
                                        compiledCode.xml += data;
                                    }
                                    var s = new MaiaScript.XmlSerializer(getXml, true);
                                    var maiaScriptParser = new MaiaScript(code, s);
                                    try {
                                        maiaScriptParser.parse_maiascript();
                                    } catch (pe) {
                                        if (!(pe instanceof maiaScriptParser.ParseException)) {
                                            throw pe;
                                        } else {
                                            var parserError = maiaScriptParser.getErrorMessage(pe);
                                            system.log(parserError);
                                            throw parserError;
                                        }
                                    }
                                    var parser = new DOMParser();
                                    var xml = parser.parseFromString(compiledCode.xml,'text/xml');
                                    var compiler = new MaiaCompiler();
                                    compiledCode.js = compiler.compile(xml);
                                    try {
                                        eval(compiledCode.js);
                                    } catch (e) {
                                        var evalError = e.message;
                                        system.log(evalError);
                                        throw evalError;
                                    }
                                    //document.write('<script type="text/javascript">' + compiledCode.js + '</script>\n');
                                }
                            }
                        });
                    }
                }
            }
            var code = scripts[index].innerHTML;
            if (typeof code != 'undefined') {
                if (typeof code == 'string') {
                    compiledCode.xml = '';
                    function getXml (data) {
                        compiledCode.xml += data;
                    }
                    var s = new MaiaScript.XmlSerializer(getXml, true);
                    var maiaScriptParser = new MaiaScript(code, s);
                    try {
                        maiaScriptParser.parse_maiascript();
                    } catch (pe) {
                        if (!(pe instanceof maiaScriptParser.ParseException)) {
                            throw pe;
                        } else {
                            var parserError = maiaScriptParser.getErrorMessage(pe);
                            system.log(parserError);
                            throw parserError;
                        }
                    }
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(compiledCode.xml,'text/xml');
                    var compiler = new MaiaCompiler();
                    compiledCode.js = compiler.compile(xml);
                    try {
                        eval(compiledCode.js);
                    } catch (e) {
                        var evalError = e.message;
                        system.log(evalError);
                        throw evalError;
                    }
                    //document.write('<script type="text/javascript">' + compiledCode.js + '</script>\n');
                }
            }
        }
    }

    /**
     * Compiles the MaiaScript code passed as a command line argument
     * and executes the code in the JavaScript interpreter from which
     * this method was invoked.
     */
    this.run = function()
    {
        // Supports only the Node.js interpreter.
        if (typeof process !== 'undefined') {
            var command = 'node';
            var argv = process.argv.slice();
            compiledCode.xml = '';
            var fs = require('fs');
            var readTextFile = fs.readFileSync;

            function getXml(data) {
                compiledCode.xml += data;
            }
            
            function read(input) {
                if (/^{.*}$/.test(input)) {
                    return input.substring(1, input.length - 1);
                } else {
                    var content = readTextFile(input, 'utf-8');
                    return content.length > 0 && content.charCodeAt(0) == 0xFEFF ? content.substring(1) : content;
                }
            }
            
            system.argv = argv.slice();
            system.argc = argv.length;
            var justCompile = false;
            var inputFile;
            var outputFile;
            if (argv.length > 1) {
                var i = 2;
                while (i < argv.length) {
                    if (argv[i] == '-c') {
                        justCompile = true;
                    } else if ((argv[i] == '-h') | (argv[i] == '--help')) {
                        system.log('MaiaScript Command Line Interface (CLI)');
                        system.log('Usage: maiascript [options] [script.maia] [--] [arguments]');
                        system.log('Options:');
                        system.log('-c                          Just compile, don\'t run the script;');
                        system.log('-h     --help               Displays this help message;');
                        system.log('-o     <script.js>          Output file name;');
                        system.log('       --                   End of compiler options.\n');
                    } else if (argv[i] == '-o') {
                        i++;
                        outputFile = argv[i];
                    } else if (argv[i] == '--') {
                        break;
                    } else {
                        inputFile = argv[i];
                        break;
                    }
                    i++;
                }
                system.argv = argv.slice(i);
                system.argc = system.argv.length;
                if (typeof inputFile != 'undefined') {
                    var code = read(String(inputFile));
                    var s = new MaiaScript.XmlSerializer(getXml, false);
                    var maiaScriptParser = new MaiaScript(code, s);
                    try {
                        maiaScriptParser.parse_maiascript();
                    } catch (pe) {
                        if (!(pe instanceof maiaScriptParser.ParseException)) {
                            throw pe;
                        } else {
                            var parserError = maiaScriptParser.getErrorMessage(pe);
                            system.log(parserError);
                            throw parserError;
                        }
                    }
                    var parser = new DOMParser();
                    var xml = parser.parseFromString(compiledCode.xml,'text/xml');
                    var compiler = new MaiaCompiler();
                    compiledCode.js = compiler.compile(xml);
                    if (justCompile) {
                        if (typeof outputFile != 'undefined') {
                            fs.writeFile(outputFile, compiledCode.js, function (err) {
                                if (err) {
                                    throw err;
                                }
                            });
                        } else {
                            system.log('MaiaScript Command Line Interface (CLI)');
                            system.log('Usage: maiascript [options] [script.maia] [--] [arguments]');
                        }
                    } else {
                        try {
                            eval(compiledCode.js);
                        } catch (e) {
                            var evalError = e.message;
                            system.log(evalError);
                        }
                    }
                } else {
                    system.log('MaiaScript Command Line Interface (CLI)');
                    system.log('Usage: maiascript [options] [script.maia] [--] [arguments]');
                }
            } else {
                system.log('MaiaScript Command Line Interface (CLI)');
                system.log('Usage: maiascript [options] [script.maia] [--] [arguments]');
            }
        }
    }
}

maiavm = new MaiaVM();

/*
 * Run MaiaScript code if this script has been invoked
 * from the command line.
 */
if (typeof process !== 'undefined') {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    var doc = new JSDOM();
    var DOMParser = doc.window.DOMParser;
    
    const openDatabase = require('websql');
    
    var alert = system.log;

    maiavm.run();
}
