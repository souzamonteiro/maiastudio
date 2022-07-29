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
 * MaiaScript system library.
 * @class
 */
function System() {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
    }

    /**
     * Convert Unicode caracters to Latin1.
     * @param {string}   str - Unicode string.
     * @return {string}  The Unicode string converted to Latin1.
     */
    this.base64EncodeUnicode = function(str) {
        // First we escape the string using encodeURIComponent to get the UTF-8 encoding of the characters, 
        // then we convert the percent encodings into raw bytes, and finally feed it to btoa() function.
        utf8Bytes = encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode('0x' + p1);
        });
        return btoa(utf8Bytes);
    }

    /**
     * Converts an array to a CSV file, using the character indicated as the column separator.
     * @param {array}    csvData - CSV data.
     * @param {string}   recordSeparator - The separator characters.
     * @param {array}    header - Column descriptors.
     * @return {string}  The CSV file data.
     */
    this.createCSV = function(csvData, recordSeparator, header) {
        if (typeof separator != 'undefined') {
            var separator = ',';
        }
        if (typeof csvData != 'undefined') {
            var fileContents = '';
            if (typeof header != 'undefined') {
                for (var i = 0; i < header.length; i++) {
                    fileContents += '"' + header[i] + '"';
                    if (i < header.length - 1) {
                        fileContents += recordSeparator;
                    }
                }
                fileContents += '\n';
            }
            for (var i = 0; i < csvData.length; i++) {
                record = csvData[i];
                for (var j = 0; j < record.length; j++) {
                    if (typeof record[j] == 'string') {
                        fileContents += '"' + record[j] + '"';
                    } else if (typeof record[j] == 'object') {
                        fileContents += JSON.stringify(record[j]);
                    } else {
                        fileContents += record[j];
                    }
                    if (j < record.length - 1) {
                        fileContents += recordSeparator;
                    }
                }
                fileContents += '\n';
            }
            return fileContents;
        } else {
            throw new Error('Invalid argument for function createCSV. Argument must be an array.');
        }
    }

    /**
     * Download a file.
     * @param {string}  fileName - File name.
     * @param {string}  fileData - Data to save.
     * @param {string}  mimeType - Mime type (default: 'text/plain').
     * @return          The file is downloaded.
     */
    this.downloadFile = function(fileName, fileData, mimeType) {
        if (typeof mimeType == 'undefined') {
            var mimeType = 'text/plain';
        }
        var uri = 'data:' + mimeType + ';charset=utf-8;base64,' + this.base64EncodeUnicode(fileData);
        var downloadLink = document.createElement('a');
        downloadLink.href = uri;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    /**
     * Converts a CSV record to an array, using the character indicated as the column separator.
     * @param {string}   csvData - CSV file data.
     * @param {number}   numberOfHeaderLines - Number of header lines and column descriptors to ignore.
     * @param {string}   recordSeparator - The separator characters.
     * @param {boolean}  allowRepeatChar - The separator character can be repeated (for formatting).
     * @param {boolean}  doEval - Run core.eval before adding the column to the record.
     * @return {array}   The array containing the parts of the CSV or NULL if the CSV record is not well formed.
     */
    this.parseCSV = function(csvData, numberOfHeaderLines, recordSeparator, allowRepeatChar, doEval) {
        if (typeof csvData != 'undefined') {
            var fileLines = core.split(csvData, '\r\n');
            var csvArray = [];
            for (i = numberOfHeaderLines; i < fileLines.length; i++) {
                var record = core.splitCSV(fileLines[i], recordSeparator, allowRepeatChar, doEval);
                csvArray.push(record);
            }
            return csvArray;
        } else {
            throw new Error('Invalid argument for function loadCSV. Argument must be a string.');
        }
    }

    /**
     * Displays a message in the console.
     * @param {string}  text - Text to display.
     */
    this.log = function(text) {
        console.log(text);
    }

    /**
     * Loads a CSV file and converts it to an array, using the character indicated as the column separator.
     * @param {string}   inputFile - CSV file.
     * @param {number}   numberOfHeaderLines - Number of header lines and column descriptors to ignore.
     * @param {string}   recordSeparator - The separator characters.
     * @param {boolean}  allowRepeatChar - The separator character can be repeated (for formatting).
     * @param {boolean}  doEval - Run core.eval before adding the column to the record.
     * @return {array}   The array containing the parts of the CSV or NULL if the CSV record is not well formed.
     */
    this.loadCSV = function(inputFile, numberOfHeaderLines, recordSeparator, allowRepeatChar, doEval) {
        if (typeof process != 'undefined') {
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

            if (typeof inputFile != 'undefined') {
                var fileContents = read(String(inputFile));
                return this.parseCSV(fileContents, numberOfHeaderLines, recordSeparator, allowRepeatChar, doEval);
            } else {
                throw new Error('Invalid argument for function parseCSV. Argument must be a string.');
            }
        }
    }
    
    /**
     * Displays a message in the console.
     * @param {string}  text - Text to display.
     */
    this.print = function(text) {
        this.log(text);
    }

   /**
     * Displays a formated string based on format specifiers passed to the function.
     * @param {string}   fmt - A string containing format specifiers.
     * @param {object}   arguments - Objects to be formatted.
     * @return {string}  A formatted string based on format specifiers passed to the function.
     */
    this.printf = function(fmt) {
        this.log(string.sprintFormat(string.sprintfParse(fmt), arguments));
    }

    /**
     * Displays a message on the console and advances the cursor to the next line.
     * @param {string}  text - Text to display.
     */
    this.println = function(text) {
        this.log(text + '\r\n');
    }

    /**
     * Reads data from browser storage.
     * @param {object}  obj - Object to store data: {'key': value, 'key': value, ...}
     * @param {object}  callBack - Callback function to call after access to storage.
     * @return          Data from storage.
     */
    this.readDataFromStorage = function(obj, callBack) {
        for (key in obj) {
            if (typeof localStorage.getItem(key) != 'undefined') {
                obj[key] = localStorage.getItem(key);
            } else {
                obj[key] = {};
            }
        }
        if (typeof callBack != 'undefined') {
            callBack();
        }
    }

    /**
     * Imports a native module.
     * @param {string}   moduleName - Module name.
     * @return {object}  The native module reference.
     */
    this.require = function(moduleName) {
        var moduleReference;
        if (typeof process !== 'undefined') {
            var moduleReference = require(moduleName);
        }
        return moduleReference;
    }
    
    /**
     * Displays a message in a dialog box asking for confirmation.
     * @param {string}   text - Text to display.
     * @return {string}  User choice.
     */
    this.showConfirmDialog = function(text) {
        return confirm(text);
    }

    /**
     * Displays a message in a dialog box asking you to enter text.
     * @param {string}   text - Text to display.
     * @param {string}   defaultText - Default text to display in the text box.
     * @return {string}  User-typed text.
     */
    this.showInputDialog = function(text, defaultText = '') {
        return prompt(text, defaultText);
    }

    /**
     * Displays a message in a dialog box.
     * @param {string}  text - Text to display.
     */
    this.showMessageDialog = function(text) {
        alert(text);
    }

    /**
     * Load a MaiaScript module.
     * @param {string}   inputFile - Module name.
     * @return {object}  The MaiaScript module loaded.
     */
    this.source = function(inputFile) {
        if (typeof process != 'undefined') {
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

            if (typeof inputFile != 'undefined') {
                var code = read(String(inputFile));
                core.eval(code, global);
            } else {
                throw new Error('Invalid argument for function source. Argument must be a string.');
            }
        }
    }

    /**
     * Upload a file.
     * @param {object}    fileObject - File data structure.
     * @param {function}  callBack - callback to be called when the file is loaded.
     * @return            The file is uploaded.
     */
    this.uploadFile = function(fileObject, callBack) {
        var input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => { 
            var file = e.target.files[0]; 
            fileObject.fullFileName = file.name;
            fileObject.fileName = fileObject.fullFileName.split('.').shift();
            fileObject.fileExtension = fileObject.fullFileName.split('.').pop();
            var reader = new FileReader();
            reader.readAsText(file,'UTF-8');
            reader.onload = readerEvent => {
                fileObject.fileData = readerEvent.target.result;
                if (typeof callBack != 'undefined') {
                    callBack(fileObject);
                }
            }
        }
        input.click();
    }

    /**
     * Writes data to storage.
     * @param {object}  obj - Object to store data: {'key': value, 'key': value, ...}
     * @param {object}  callBack - Callback function to call after access to storage.
     * @return          Data written to storage.
     */
    this.writeDataToStorage = function(obj, callBack) {
        for (key in obj) {
            if (typeof obj[key] != 'undefined') {
                localStorage.setItem(key, obj[key]);
            } else {
                localStorage.setItem(key, {});
            }
        }
        if (typeof callBack != 'undefined') {
            callBack();
        }
    }
}

system = new System();
