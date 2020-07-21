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

/** Global variables. */
var lang = 'pt-BR';
var editorMode = 'maia';
var flask = {};
var storedCode;
var fileName;
var fileExtension;

compiledCode = {
    'xml': '',
    'mil': '',
    'js': ''
}

/**
 * Call the startup function when the document has finished to load.
 */
$( document ).ready(function() {
    initApp();
});

/**
 * Convert Unicode caracters to Latin1.
 * @param {string}   str - Unicode string.
 * @return {string}  The Unicode string converted do Latin1.
 */
function base64EncodeUnicode(str) {
    // First we escape the string using encodeURIComponent to get the UTF-8 encoding of the characters, 
    // then we convert the percent encodings into raw bytes, and finally feed it to btoa() function.
    utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    });

    return btoa(utf8Bytes);
}

/**
 * Creates a new document.
 */
function newWorkspace() {
    var win = window.open('index.html', '', '');
}

/**
 * Clears the workspace.
 */
function clearWorkspace() {
    var lang = $('#language').val();
    var msg = language.message[lang].cleanUp + '?';
    var res = confirm(msg);

    if (res == true) {
        flask.updateCode('');;
    }
}

/**
 * Download the code being edited.
 */
function downloadCode() {
    const code = flask.getCode();
    var uri = 'data:text/plain;charset=utf-8;base64,' + base64EncodeUnicode(code);
    var downloadLink = document.createElement('a');

    downloadLink.href = uri;
    downloadLink.download = 'untitled.' + editorMode;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/**
 * Upload a file for editing and set the editor mode.
 */
function uploadCode() {
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => { 
        var file = e.target.files[0]; 
        fileName = file.name;
        var fileExtension = fileName.split('.').pop();
        
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        reader.onload = readerEvent => {
            var code = readerEvent.target.result;
            flask.updateCode(code);

            editorMode = fileExtension;

            if (editorMode) {
                $('#editorMode').val(editorMode);
                $('#editorMode').trigger('change');
            }
        }
    }
    input.click();
}

/**
 * Download the code being edited compiled for MIL.
 */
function downloadMil() {
    const code = flask.getCode();
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
            alert(parserError);
            throw parserError;
        }
    }
    var parser = new DOMParser();
    var xml = parser.parseFromString(compiledCode.xml,'text/xml');
    
    var compiler = new MaiaCompiler();
    compiledCode.mil = compiler.xmlToMil(xml);
         
    var uri = 'data:text/json;charset=utf-8;base64,' + base64EncodeUnicode(JSON.stringify(compiledCode.mil, null, 4));
    var downloadLink = document.createElement('a');
    
    downloadLink.href = uri;
    downloadLink.download = 'untitled.mil';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/**
 * Download the code being edited compiled for JavaScript.
 */
function downloadJs() {
    const code = flask.getCode();
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
            alert(parserError);
            throw parserError;
        }
    }
    var parser = new DOMParser();
    var xml = parser.parseFromString(compiledCode.xml,'text/xml');
    
    var compiler = new MaiaCompiler();
    compiledCode.js = compiler.compile(xml);
    
    var uri = 'data:text/js;charset=utf-8;base64,' + base64EncodeUnicode(compiledCode.js);
    var downloadLink = document.createElement('a');
    
    downloadLink.href = uri;
    downloadLink.download = 'untitled.js';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/**
 * Compiles the code being edited and runs on the virtual machine.
 */
function compileAndRun() {
    const code = flask.getCode();

    if (editorMode == 'maia') {
        compiledCode.xml = '';
        function getXml(data) {
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
                alert(parserError);
                throw parserError;
            }
        }
        var parser = new DOMParser();
        var xml = parser.parseFromString(compiledCode.xml,'text/xml');
        
        var compiler = new MaiaCompiler();
        compiledCode.js = compiler.compile(xml);
    } else if (editorMode == 'mil') {
        var mil = JSON.parse(code);
        var nodeInfo = {
            'parentNode': '',
            'childNode': 'maiascript',
            'terminalNode' : ''
        };
        var compiler = new MaiaCompiler();
        compiledCode.js = compiler.parse(mil, nodeInfo);
    } else if (editorMode == 'js') {
        compiledCode.js = code;
    }
    if (editorMode == 'html') {
        var win = window.open('data:text/html;charset=utf-8,' + code, '_blank', 'width=640,height=480');
    } else if ((editorMode == 'maia') || (editorMode == 'mil') || (editorMode == 'js')) {
        try {
            eval(compiledCode.js);
        } catch (e) {
            var evalError = e.message;
            system.log(evalError);
            alert(evalError);
        }
    }
}

/**
 * Save the workspace.
 */
function saveWorkspace() {
    const code = flask.getCode();

    localStorage.setItem('maiascript.maia', code);
    localStorage.setItem('language', $('#language').val());
    localStorage.setItem('editorMode', $('#editorMode').val());
    localStorage.setItem('fileName', fileName);
}

/**
 * Loads the workspace.
 */
function loadWorkspace() {
    $('#language').val(lang);
    $('#editorMode').val(editorMode);

    if (localStorage.getItem('maiascript.maia') != undefined) {
        storedCode = localStorage.getItem('maiascript.maia');
    }

    if (localStorage.getItem('language') != undefined) {
        lang = localStorage.getItem('language');
        if (lang) {
            $('#language').val(lang);
        } else {
            lang = 'pt-BR';
            $('#language').val(lang);
        }
    } else {
        lang = 'pt-BR';
        $('#language').val(lang);
    }

    if (localStorage.getItem('editorMode') != undefined) {
        editorMode = localStorage.getItem('editorMode');
        if (editorMode) {
            $('#editorMode').val(editorMode);
        } else {
            editorMode = 'maia';
            $('#editorMode').val(editorMode);
        }
    } else {
        editorMode = 'maia';
        $('#editorMode').val(editorMode);
    }

    if (localStorage.getItem('fileName') != undefined) {
        fileName = localStorage.getItem('fileName');
    }

    translate(lang);
}

/**
 * Translates the application interface.
 */
function translateApp() {
    lang = $('#language').val();
    translate(lang);

    saveWorkspace();

    return false;
}

/**
 * Sets the editor mode.
 */
function setEditorMode() {
    saveWorkspace();
    reloadApp();
}

/**
 * Displays copyright information.
 */
function aboutApp() {
    var copyright = 'Copyright (C) Roberto Luiz Souza Monteiro,\nRenata Souza Barreto,\nHernane Barrros de Borges Pereira.\n\nwww.maiascript.com';
    
    alert(copyright);
}

/**
 * Saves the workspace when exiting the application.
 */
window.addEventListener('unload', function(event) {
    saveWorkspace();
});

/**
 * Initializes the application.
 */
function initApp() {  
    installLanguages(lang, 'language');
    loadWorkspace();

    flask = new CodeFlask('.sourceCode', {
        language: editorMode,
        lineNumbers: true,
        areaId: 'thing1',
        ariaLabelledby: 'header1',
        handleTabs: true
    });

    flask.addLanguage('maia', Prism.languages['maiascript']);

    window['flask'] = flask;

    if (storedCode) {
        flask.updateCode(storedCode);
    }

    jQuery(function($, undefined) {
        $('#terminal').terminal(function(command) {
            if (command !== '') {
                try {
                    var result = core.eval(command);
                    if (result !== undefined) {
                        this.echo(new String(result));
                    }
                } catch(e) {
                    this.error(new String(e));
                }
            } else {
               this.echo('');
            }
        }, {
            greetings: 'MaiaStudio (The MaiaScript IDE)',
            name: 'terminal',
            height: 100,
            prompt: 'maia> '
        });
    });

    system.log = function (text) {
        var term = $('#terminal').terminal(function(command) {});
        term.echo(text);
    }
}

/**
 * Reload the application and apply the settings.
 */
function reloadApp() {
    window.location.reload();

    return false;
}