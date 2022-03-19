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
var terminalMode = 'block';
var terminalHistory = [];
var editor = {};
var terminal = {};
var fullFileName;
var fileName;
var fileExtension;
var fileData;

compiledCode = {
    'xml': '',
    'mil': '',
    'js': ''
}

/**
 * Call the startup function when the document has finished to load.
 */
window.onload = function() {
    initApp();
}

/**
 * Creates a new document.
 */
function newWorkspace() {
    editorMode = 'maia';
    fileName = 'untitled';
    fileExtension = 'maia';
    fullFileName = fileName + '.' + fileExtension;
    fileData = '';
    saveWorkspace();
    var win = window.open('index.html', '', '');
}

/**
 * Clears the workspace.
 */
function clearWorkspace() {
    var lang = document.getElementById('language').value;
    var msg = language.message[lang].cleanUp + '?';
    var res = confirm(msg);

    if (res == true) {
        editorMode = 'maia';
        fileName = 'untitled';
        fileExtension = 'maia';
        fullFileName = fileName + '.' + fileExtension;
        editor.setText('');
        saveWorkspace();
    }
}

/**
 * Download the code being edited.
 */
function downloadCode() {
    var code = editor.getText();
    system.downloadFile(fileName + '.' + fileExtension, code, 'text/' + editorMode)
}

/**
 * Upload a file for editing and set the editor mode.
 */
function uploadCode() {
    var fileObject = {
        'fullFileName': '',
        'fileName': '',
        'fileExtension': '',
        'fileData': ''
    }

    function callBack(fileObject) {
        editor.setText(fileObject.fileData);
        if (['maia', 'mil', 'js', 'json', 'xml', 'html', 'css', 'md'].includes(fileObject.fileExtension)) {
            editorMode = fileObject.fileExtension;
            fileName = fileObject.fileName;
            fileExtension = fileObject.fileExtension;
        } else {
            editorMode = 'maia';
            fileName = 'untitled';
            fileExtension = 'maia';
        }
        fullFileName = fileName + '.' + fileExtension;
        fileData = fileObject.fileData;
        if (editorMode) {
            // Update the select object.
            document.getElementById("editorMode").value = editorMode;
            // Fires the change event.
            editorModeSel = document.getElementById('editorMode');
            var event = document.createEvent('HTMLEvents');
            event.initEvent('change', true, false);
            editorModeSel.dispatchEvent(event);
        }
    }

    system.uploadFile(fileObject, callBack);
}

/**
 * Download the code being edited compiled for MIL.
 */
function downloadMil() {
    var code = editor.getText();
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
            system.showMessageDialog(parserError);
            throw parserError;
        }
    }
    var parser = new DOMParser();
    var xml = parser.parseFromString(compiledCode.xml, 'text/xml');

    var compiler = new MaiaCompiler();
    compiledCode.mil = compiler.xmlToMil(xml);

    system.downloadFile(fileName + '.mil', JSON.stringify(compiledCode.mil, null, 4), 'text/json');
}

/**
 * Download the code being edited compiled for JavaScript.
 */
function downloadJs() {
    var code = editor.getText();
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
            system.showMessageDialog(parserError);
            throw parserError;
        }
    }
    var parser = new DOMParser();
    var xml = parser.parseFromString(compiledCode.xml, 'text/xml');

    var compiler = new MaiaCompiler();
    compiledCode.js = compiler.compile(xml);

    system.downloadFile(fileName + '.js', compiledCode.js, 'text/js');
}

/**
 * Replaces line breaks with the <br /> tag.
 * @param {string}   text - Text to replace line breaks with the <br /> tag.
 * @return {string}  Line breaks replaced by <br />..
 */
function newLineToBr(text) {
    return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
}

/**
 * Download the code being edited compiled for html.
 */
function downloadHtml() {
    if (editorMode == 'md') {
        var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body>' + marked.parse(editor.getText()) + '</body></html>';
    } else {
        var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/themes/prism.min.css" rel="stylesheet"/></head><body><pre>' + newLineToBr(editor.getHtml()) + '</pre></body></html>';
    }
    system.downloadFile(fileName + '.html', html, 'text/html');
}

/**
 * Compiles the code being edited and runs on the virtual machine.
 */
function compileAndRun() {
    var code = editor.getText();
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
                system.showMessageDialog(parserError);
                throw parserError;
            }
        }
        var parser = new DOMParser();
        var xml = parser.parseFromString(compiledCode.xml, 'text/xml');

        var compiler = new MaiaCompiler();
        compiledCode.js = compiler.compile(xml);
    } else if (editorMode == 'mil') {
        var mil = JSON.parse(code);
        var nodeInfo = {
            'parentNode': '',
            'childNode': 'maiascript',
            'terminalNode': ''
        };
        var compiler = new MaiaCompiler();
        compiledCode.js = compiler.parse(mil, nodeInfo);
    } else if (editorMode == 'js') {
        compiledCode.js = code;
    }
    if (editorMode == 'html') {
        var win = window.open("", fileName + '.' + fileExtension, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600,top=0,left=0");
        iframe = win.document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.frameBorder = 0;
        iframe.style = 'border: 0';
        iframe.src = 'data:text/html;charset=utf-8,' + code;
        win.document.body.appendChild(iframe);
    } else if (editorMode == 'md') {
        var html = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head><body>' + marked.parse(code) + '</body></html>';
        var win = window.open("", fileName + '.' + fileExtension, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600,top=0,left=0");
        win.document.body.innerHTML = html;
    } else if ((editorMode == 'maia') || (editorMode == 'mil') || (editorMode == 'js')) {
        try {
            eval(compiledCode.js);
        } catch (e) {
            var evalError = e.message;
            system.log(evalError);
            system.showMessageDialog(evalError);
        }
    }
}

/**
 * Save the workspace.
 */
function saveWorkspace() {
    var code = editor.getText();
    var terminalHistory = terminal.getHistory();
    var data = {
        'language': document.getElementById('language').value,
        'editorMode': document.getElementById('editorMode').value,
        'terminalMode': getComputedStyle(document.getElementById('terminalContent'))['display'],
        'terminalHistory': JSON.stringify(terminalHistory),
        'fullFileName': fullFileName,
        'fileName': fileName,
        'fileExtension': fileExtension,
        'fileData': code
    }
    system.writeDataToStorage(data);
}

/**
 * Loads the workspace.
 */
function loadWorkspace() {
    document.getElementById('language').value = lang;
    document.getElementById('editorMode').value = editorMode;

    var data = {
        'language': {},
        'editorMode': {},
        'terminalMode': {},
        'terminalHistory': {},
        'fullFileName': {},
        'fileName': {},
        'fileExtension': {},
        'fileData': {}
    }

    function callBack() {
        if (typeof data['fullFileName'] != 'undefined') {
            fullFileName = data['fullFileName'];
        }
        if (typeof data['fileName'] != 'undefined') {
            fileName = data['fileName'];
        }
        if (typeof data['fileExtension'] != 'undefined') {
            fileExtension = data['fileExtension'];
        }
        if (typeof data['fileData'] != 'undefined') {
            fileData = data['fileData'];
        }

        if (typeof data['language'] != 'undefined') {
            lang = data['language'];
            if (lang) {
                document.getElementById('language').value = lang;
            } else {
                lang = 'pt-BR';
                document.getElementById('language').value = lang;
            }
        } else {
            lang = 'pt-BR';
            document.getElementById('language').value = lang;
        }

        if (typeof data['editorMode'] != 'undefined') {
            editorMode = data['editorMode'];
            if (editorMode) {
                document.getElementById('editorMode').value = editorMode;
            } else {
                editorMode = 'maia';
                document.getElementById('editorMode').value = editorMode;
            }
        } else {
            editorMode = 'maia';
            document.getElementById('editorMode').value = editorMode;
        }

        if (typeof data['terminalMode'] != 'undefined') {
            terminalMode = data['terminalMode'];
            if (terminalMode) {
                document.getElementById('terminalContent').style.display = terminalMode;
            } else {
                terminalMode = 'block';
                document.getElementById('terminalContent').style.display = terminalMode;
            }
        } else {
            terminalMode = 'block';
            document.getElementById('terminalContent').style.display = terminalMode;
        }
        if (typeof data['terminalHistory'] != 'undefined') {
            if (Array.isArray(data['terminalHistory'])) {
                terminalHistory = data['terminalHistory'];
            } else {
                if (typeof data['terminalHistory'] == 'string') {
                    terminalHistory = JSON.parse(data['terminalHistory']);
                } else {
                    terminalHistory = [];
                }
            }
        } else {
            terminalHistory = [];
        }

        translate(lang);
    }
    system.readDataFromStorage(data, callBack);
}

/**
 * Translates the application interface.
 */
function translateApp() {
    lang = document.getElementById('language').value;
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

    system.showMessageDialog(copyright);
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

    if (editorMode == 'mil') {
        editor = new MaiaEditor('editor', 'json', {
            'indentChars': '    ',
            'commentChars': '//'
        });
    } else {
        editor = new MaiaEditor('editor', editorMode, {
            'indentChars': '    ',
            'commentChars': '//'
        });
    }

    if (fileData) {
        editor.setText(fileData);
    }

    function callBack() {
        var res;
        try {
            if (editorMode == 'maia') {
                res = core.eval(terminal.getTextAtCursor());
            } else {
                res = eval(terminal.getTextAtCursor());
            }
        } catch (e) {
            var evalError = e.message;
            system.log(evalError);
            system.showMessageDialog(evalError);
        }
        if (typeof res != 'undefined') {
            terminal.appendText('\r\n' + res);
        }
    }

    if (editorMode == 'mil') {
        terminal = new MaiaConsole('terminal', 'json', callBack, {
            'greetingMessage': 'MaiaStudio (editorMode: ' + editorMode + ')\r\n',
            'promptMessage': ':'
        });
    } else {
        terminal = new MaiaConsole('terminal', editorMode, callBack, {
            'greetingMessage': 'MaiaStudio (editorMode = "' + editorMode + '")\r\n',
            'promptMessage': ':'
        });
    }
    terminal.setHistory(terminalHistory);

    // We have rewritten system.log so that all output and error messages are displayed on the terminal.
    system.log = function(text) {
        if (typeof text != 'undefined') {
            terminal.appendText('\r\n' + text);
        }
    }

    // This code is used to retract the terminal.
    var coll = document.getElementsByClassName('collapsible');
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener('click', function() {
            var terminalContent = this.nextElementSibling;
            if (terminalContent.style.display === 'block') {
                terminalContent.style.display = 'none';
            } else {
                terminalContent.style.display = 'block';
            }
        });
    }

    // Toolbar buttons event listeners.
    var aboutAppBtn = document.getElementById('aboutApp');
    aboutAppBtn.addEventListener('click', function() {
        aboutApp();
    });
    var newWorkspaceBtn = document.getElementById('newWorkspace');
    newWorkspaceBtn.addEventListener('click', function() {
        newWorkspace();
    });
    var uploadCodeBtn = document.getElementById('uploadCode');
    uploadCodeBtn.addEventListener('click', function() {
        uploadCode();
    });
    var downloadCodeBtn = document.getElementById('downloadCode');
    downloadCodeBtn.addEventListener('click', function() {
        downloadCode();
    });
    var compileAndRunBtn = document.getElementById('compileAndRun');
    compileAndRunBtn.addEventListener('click', function() {
        compileAndRun();
    });
    var downloadMilBtn = document.getElementById('downloadMil');
    downloadMilBtn.addEventListener('click', function() {
        downloadMil();
    });
    var downloadJsBtn = document.getElementById('downloadJs');
    downloadJsBtn.addEventListener('click', function() {
        downloadJs();
    });
    var downloadHtmlBtn = document.getElementById('downloadHtml');
    downloadHtmlBtn.addEventListener('click', function() {
        downloadHtml();
    });
    var copySelectionBtn = document.getElementById('copySelection');
    copySelectionBtn.addEventListener('click', function() {
        editor.copySelection();
    });
    var cutSelectionBtn = document.getElementById('cutSelection');
    cutSelectionBtn.addEventListener('click', function() {
        editor.cutSelection();
    });
    var pasteSelectionBtn = document.getElementById('pasteSelection');
    pasteSelectionBtn.addEventListener('click', function() {
        editor.pasteSelection();
    });
    var uncommentSelectionBtn = document.getElementById('uncommentSelection');
    uncommentSelectionBtn.addEventListener('click', function() {
        editor.uncommentSelection();
    });
    var commentSelectionBtn = document.getElementById('commentSelection');
    commentSelectionBtn.addEventListener('click', function() {
        editor.commentSelection();
    });
    var unindentSelectionBtn = document.getElementById('unindentSelection');
    unindentSelectionBtn.addEventListener('click', function() {
        editor.unindentSelection();
    });
    var indentSelectionBtn = document.getElementById('indentSelection');
    indentSelectionBtn.addEventListener('click', function() {
        editor.indentSelection();
    });
    var restoreEditorContentBtn = document.getElementById('restoreEditorContent');
    restoreEditorContentBtn.addEventListener('click', function() {
        editor.restoreEditorContent();
    });
    var undoRestoreEditorContentBtn = document.getElementById('undoRestoreEditorContent');
    undoRestoreEditorContentBtn.addEventListener('click', function() {
        editor.undoRestoreEditorContent();
    });
    var clearWorkspaceBtn = document.getElementById('clearWorkspace');
    clearWorkspaceBtn.addEventListener('click', function() {
        clearWorkspace();
    });
    var editorModeSel = document.getElementById('editorMode');
    editorModeSel.addEventListener('change', function() {
        setEditorMode();
    });
    var languageSel = document.getElementById('language');
    languageSel.addEventListener('change', function() {
        translateApp();
    });
}

/**
 * Reload the application and apply the settings.
 */
function reloadApp() {
    window.location.reload();

    return false;
}