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
 * MaiaScript core library.
 * @class
 */
function Core() {
    /*
     * This property needs to be updated
     * with each new version of MaiaStudio.
     */
    this.version = "4.0.0";

    this.testResult = {
        "expected": {},
        "obtained": {}
    };

    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
        compiledCode = {
            "xml": "",
            "mil": "",
            "js": ""
        }
    }

    /*
     * The following functions allow you to manipulate MaiaScript objects.
     */

    /**
     * Convert an array to a n x 1 matrix.
     * @param {array}   obj - Array to be Converted.
     * @return {array}  The array converted to a matrix.
     */
    this.arrayToMatrix = function(obj) {
        var newMatrix = [];
        for (var i = 0; i < obj.length; i++) {
            if (Array.isArray(obj[i])) {
                newMatrix.push(obj[i]);
            } else {
                newMatrix.push([obj[i]]);
            }
        }
        return newMatrix;
    }

    /**
     * Copies a matrix.
     * @param {array}  obj - Matrix to be copied.
     * @return {array}  A copy of the matrix.
     */
    this.copyMatrix = function(obj) {
        var newMatrix = [];
        for (var i = 0; i < obj.length; i++) {
            newMatrix[i] = obj[i].slice();
        }
        return newMatrix;
    }

    /**
     * Returns the character at the indicated position.
     * @param {string}   str - The string to look for.
     * @param {number}   pos - The character position.
     * @return {string}  The character at the indicated position.
     */
    this.charAt = function(str, pos) {
        return str.charAt(pos);
    }

    /**
     * Returns the character code at the indicated position.
     * @param {string}   str - The string to look for.
     * @param {number}   pos - The character position.
     * @return {string}  The character code at the indicated position.
     */
    this.charCodeAt = function(str, pos) {
        return str.charCodeAt(pos);
    }

    /**
     * Returns a clone of an object.
     * @param {object}   obj - The object to be cloned.
     * @return {string}  The clone of the object.
     */
    this.clone = function(obj) {
        return Object.assign({}, obj);
    }

    /**
     * Join two matrices.
     * @param {array}   mtx1 - The first matrix.
     * @param {array}   mtx2 - The second matrix.
     * @return {array}  Matrix containing the two indicated matrices.
     */
    this.concat = function(mtx1, mtx2) {
        return mtx.concat(mtx1, mtx2);
    }

    /**
     * Calculates the conjugate of a complex number.
     * @param {number}   num - The complex number.
     * @return {number}  the conjugate of a complex number.
     */
    this.conj = function(num) {
        var res;
        if (core.type(num) == 'complex') {
            res = core.complex(core.toNumber(num.real), -core.toNumber(num.imaginary));
        } else {
            throw new Error('The object passed to the conj() function is not a complex number, in the expression conj(' + core.toString(num) + ').');
        }
        return res;
    }

    /**
     * Returns a complex number, given the real and imaginary part of the number.
     * @param {object}   real - TThe real part of the complex number.
     * @param {number}   img - The imaginary part of the complex number.
     * @return {number}  A complex complex number.
     */
    this.complex = function(real, img) {
        var num;
        if ((typeof real == 'number') && (typeof img == 'number')) {
            num = {
                "real": real,
                "imaginary": img
            }
        } else {
            throw new Error('It is necessary to provide the real and imaginary parts of the number, in the expression complex(' + real + ',' + img + ').');
        }
        return num;
    }

    /**
     * Returns a Date object.
     * @return {object}  A Date object.
     */
    this.date = function() {
        return new Date();
    }

    /**
     * Calculates the determinant matrix.
     * @param {object}  obj - The matrix to calculate the determinant.
     * @return {array}  A (rows x columns) matrix.
     */
    this.det = function(obj) {
        var mtx = [];
        if (core.type(obj) == 'matrix') {
            var dim = core.dim(obj);
            var m = dim[0];
            var n = dim[1];
            if (m == n) {
                // Convert to the diagonal equivalent matrix.
                var cpy = this.copyMatrix(obj);
                mtx = core.ident(m);
                for (var j = 0; j < m; j++) {
                    if (cpy[j][j] != 0) {
                        for (var i = 0; i < m; i++) {
                            if (i != j) {
                                var scale = -cpy[i][j] / cpy[j][j];
                                for (k = j; k < n; k++) {
                                    cpy[i][k] = cpy[i][k] + scale * cpy[j][k];
                                }
                                for (k = 0; k < n; k++) {
                                    mtx[i][k] = mtx[i][k] + scale * mtx[j][k];
                                }
                            }
                        }
                    }
                }
                for (i = 0; i < m; i++) {
                    for (j = 0; j < n; j++) {
                        mtx[i][j] = mtx[i][j] / cpy[i][i];
                    }
                }
                // Calculates the determinant of the matrix.
                var det = 1;
                for (i = 0; i < m; i++) {
                    det = det * cpy[i][i];
                }
            } else {
                throw new Error('The matrix must for function det() must be square, in the expression det(' + core.toString(obj) + ').');
            }
        } else {
            throw new Error('The argument for function det() must be a matrix, in the expression det(' + core.toString(obj) + ').');
        }
        return det;
    }

    /**
     * Calculates the diagonal equivalent matrix.
     * @param {object}  obj - The matrix to calculate the diagonal equivalent matrix.
     * @return {array}  A (rows x columns) matrix.
     */
    this.diag = function(obj) {
        if (core.type(obj) == 'matrix') {
            var dim = core.dim(obj);
            var m = dim[0];
            var n = dim[1];
            // Convert to the diagonal equivalent matrix.
            var cpy = this.copyMatrix(obj);
            for (var j = 0; j < m; j++) {
                if (cpy[j][j] != 0) {
                    for (var i = 0; i < m; i++) {
                        if (i != j) {
                            var scale = -cpy[i][j] / cpy[j][j];
                            for (k = j; k < n; k++) {
                                cpy[i][k] = cpy[i][k] + scale * cpy[j][k];
                            }
                        }
                    }
                }
            }
            // Calculates the determinant of the matrix.
            var det = 1;
            for (i = 0; i < m; i++) {
                det = det * cpy[i][i];
            }
            if (det == 0) {
                throw new Error('The matrix is singular, in the expression diag(' + core.toString(obj) + ').');
            }
        } else {
            throw new Error('The argument for function diag() must be a matrix, in the expression diag(' + core.toString(obj) + ').');
        }
        return cpy;
    }

    /**
     * Returns the dimensions of an array.
     * @param {array}   obj - Object to be measured.
     * @return {array}  Array containing the dimensions of a matrix.
     */
    this.dim = function(obj) {
        var arrayDimensions = [];
        if (Array.isArray(obj)) {
            arrayDimensions.push(obj.length);
            if (Array.isArray(obj[0])) {
                var elementDimension = this.dim(obj[0]);
                if (typeof elementDimension != 'undefined') {
                    arrayDimensions = arrayDimensions.concat(elementDimension);
                }
            }
        }
        return arrayDimensions;
    }

    /**
     * Evaluates a MaiaScript script.
     * @param {string}   stript - The script to be evaluated.
     * @param {object}   namespace - The namespace where evaluate the script.
     * @return {number}  Result of the evaluated script.
     */
    this.eval = function(script, namespace) {
        var result;

        compiledCode.xml = "";

        function getXml(data) {
            compiledCode.xml += data;
        }
        var s = new MaiaScript.XmlSerializer(getXml, true);
        var maiaScriptParser = new MaiaScript(script, s);
        try {
            maiaScriptParser.parse_Program();
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
        var xml = parser.parseFromString(compiledCode.xml, "text/xml");

        var compiler = new MaiaCompiler();
        compiledCode.js = compiler.compile(xml);
        try {
            if (typeof namespace != 'undefined') {
                result = eval(namespace, compiledCode.js);
            } else {
                result = eval(compiledCode.js);
            }
            result = eval(compiledCode.js);
        } catch (e) {
            var evalError = e.message;
            system.log(evalError);
        }
        return result;
    }
    
    /**
     * Creates the identity matrix..
     * @param {number}  rows - Number of rows in the matrix.
     * @return {array}  A (rows x rows) identity matrix.
     */
    this.ident = function(rows) {
        var mtx = core.matrix(0, rows, rows);
        for (var i = 0; i < rows; i++) {
            mtx[i][i] = 1;
        }
        return mtx;
    }

    /**
     * Returns the imaginary part of a complex number.
     * @param {object}   obj - The complex number.
     * @return {number}  The imaginary part of a complex number.
     */
    this.imaginary = function(obj) {
        var num;
        if (typeof obj == 'object') {
            if ('imaginary' in obj) {
                num = obj.imaginary;
            } else {
                throw new Error('The object is not a complex number, in the expression imaginary(' + core.toString(obj) + ').');
            }
        } else {
            throw new Error('The object is not a complex number, in the expression imaginary(' + core.toString(obj) + ').');
        }
        return num;
    }

    /**
     * Returns true if one string is contained in another or in an array.
     * @param {object}    obj - The string containing the other one.
     * @param {string}    text - Search string.
     * @return {boolean}  True if one string is contained in another or in an array.
     */
    this.includes = function(obj, text) {
        return obj.includes(text);
    }

    /**
     * Returns the position of one string in another.
     * @param {string}   str - The string containing the other one.
     * @param {string}   text - Search string.
     * @return {number}  The position of one string in the other.
     */
    this.indexOf = function(str, text) {
        return str.indexOf(text);
    }
    
    /**
     * Calculates the inverse matrix.
     * @param {object}  obj - The matrix to calculate the inverse.
     * @return {array}  A (rows x columns) matrix.
     */
    this.inv = function(obj) {
        var mtx = [];
        if (core.type(obj) == 'matrix') {
            var dim = core.dim(obj);
            var m = dim[0];
            var n = dim[1];
            // Convert to the diagonal equivalent matrix.
            var cpy = this.copyMatrix(obj);
            mtx = core.ident(m);
            for (var j = 0; j < m; j++) {
                if (cpy[j][j] != 0) {
                    for (var i = 0; i < m; i++) {
                        if (i != j) {
                            var scale = -cpy[i][j] / cpy[j][j];
                            for (k = j; k < n; k++) {
                                cpy[i][k] = cpy[i][k] + scale * cpy[j][k];
                            }
                            for (k = 0; k < n; k++) {
                                mtx[i][k] = mtx[i][k] + scale * mtx[j][k];
                            }
                        }
                    }
                }
            }
            for (i = 0; i < m; i++) {
                for (j = 0; j < n; j++) {
                    mtx[i][j] = mtx[i][j] / cpy[i][i];
                }
            }
            // Calculates the determinant of the matrix.
            var det = 1;
            for (i = 0; i < m; i++) {
                det = det * cpy[i][i];
            }
            if (det == 0) {
                throw new Error('The matrix is singular, in the expression inv(' + core.toString(obj) + ').');
            }
        } else {
            throw new Error('The argument for function inv() must be a matrix, in the expression inv(' + core.toString(obj) + ').');
        }
        return mtx;
    }

    /**
     * Join the elements of an array using the indicated separator.
     * @param {array}    mtx - The array to join elements.
     * @param {string}   char - The separator character.
     * @return {string}  The string containing the parts of the array.
     */
    this.join = function(mtx, char) {
        return mtx.split(char);
    }

    /**
     * Returns the last position of one string in another.
     * @param {string}   str - The string containing the other one.
     * @param {string}   text - Search string.
     * @return {number}  The position of last occurrence of string in the other.
     */
    this.lastIndexOf = function(str, text) {
        return str.lastIndexOf(text);
    }

    /**
     * Returns the size of an object.
     * @param {string}   obj - Object to be measured.
     * @return {number}  Object size.
     */
    this.length = function(obj) {
        return obj.length;
    }

    /**
     * Creates a two-dimensional array (matrix).
     * @param {object}  obj - Object to fill the matrix cells.
     * @param {number}  rows - Number of rows in the matrix.
     * @param {number}  columns - Number of columns in the matrix.
     * @return {array}  A (rows x columns) matrix.
     */
    this.matrix = function(obj, rows, columns) {
        var mtx = [];
        if (rows > 1) {
            for (var i = 0; i < rows; i++) {
                if (typeof columns != 'undefined') {
                    var row = [];
                    for (var j = 0; j < columns; j++) {
                        row.push(obj);
                    }
                } else {
                    var row = obj;
                }
                mtx.push(row);
            }
        } else {
            var row = [];
            for (var j = 0; j < columns; j++) {
                row.push(obj);
            }
            mtx = row;
        }
        return mtx;
    }

    /**
     * Convert an n x 1 matrix to an array.
     * @param {array}   obj - Matrix to be Converted.
     * @return {array}  The matrix converted to an array.
     */
    this.matrixToArray = function(obj) {
        var newMatrix = [];
        for (var i = 0; i < obj.length; i++) {
            if (Array.isArray(obj[i])) {
                newMatrix.push(obj[i][0]);
            } else {
                newMatrix.push(obj[i]);
            }
        }
        return newMatrix;
    }

    /**
     * Convert a matrix to an object.
     * @param {array}   obj - Matrix to be Converted.
     * @param {array}   members - Object member names.
     * @return {array}  The matrix converted to an object.
     */
    this.matrixToObject = function(obj, members) {
        var newMatrix = [];
        for (i = 0; i < obj.length; i++) {
            if (core.type(obj[i]) != "undefined") {
                var row = Object();
                for (j = 0; j < core.length(obj[i]); j++) {
                    if (members[j] != "") {
                        if (core.type(obj[i][j]) != "undefined") {
                            row[members[j]] = obj[i][j];
                        }
                    }
                }
                if (Object.keys(row).length != 0) {
                    newMatrix.push(row);
                }
            }
        }
        return newMatrix;
    }

    /**
     * Creates a new instance of an object.
     * @param {object}   obj - The object that will be used as a template.
     * @param {object}   properties - The object properties.
     * @return {number}  A new instance of an object.
     */
    this.new = function(obj, properties) {
        if (typeof properties == 'undefined') {
            var newObject = Object.create(obj);
        } else {
            var newObject = Object.create(obj, properties);
        }
        return newObject;
    }

    /**
     * Creates a unitary matrix.
     * @param {number}  rows - Number of rows in the matrix.
     * @param {number}  columns - Number of columns in the matrix.
     * @return {array}  A (rows x columns) matrix.
     */
    this.one = function(rows, columns) {
        return core.matrix(1, rows, columns);
    }

    /**
     * Opens or creates a database.
     * @param {string}   name - Database name.
     * @param {string}   version - Scheme version.
     * @param {string}   displayName -  The display name of the database.
     * @param {string}   estimatedSize - Estimated maximum size.
     * @return {object}  Reference to the open or created database.
     */
    this.openSQLDatabase = function(name, version, displayName, estimatedSize) {
        var db;

        try {
            db = openDatabase(name, version, displayName, estimatedSize);
        } catch (e) {
            system.log(e.message);
            throw new Error(e.message);
        }

        return db;
    }

    /**
     * Removes an object from the end of an array.
     * @param {array}   mtx - The array to join elements.
     * @param {object}  obj - The separator character.
     * @return {array}  The array with the object removed.
     */
    this.pop = function(mtx, obj) {
        return mtx.pop(obj);
    }

    /**
     * Insert an object at the end of an array.
     * @param {array}   mtx - The array to join elements.
     * @param {object}  obj - The separator character.
     * @return {array}  The array with the added object.
     */
    this.push = function(mtx, obj) {
        return mtx.push(obj);
    }

    /**
     * Returns the real part of a complex number.
     * @param {object}   obj - The complex number.
     * @return {number}  The real part of a complex number.
     */
    this.real = function(obj) {
        var num;
        if (typeof obj == 'object') {
            if ('imaginary' in obj) {
                num = obj.real;
            } else {
                throw new Error('The object is not a complex number, in the expression real(' + core.toString(obj) + ').');
            }
        } else {
            throw new Error('The object is not a complex number, in the expression real(' + core.toString(obj) + ').');
        }
        return num;
    }

    /**
     * Create a RegExp object to compare an expression with a specified pattern (regular expression).
     * @param {string}   pattern - The regular expression.
     * @param {string}   flags - Indicates the marks that can be added.
     * @return {object}  A RegExp object.
     */
    this.regExp = function(pattern, flags) {
        var regexp = new RegExp(pattern, flags);
        return regexp;
    }

    /**
     * Returns a new string with a specified number of copies of the string.
     * @param {object}   str - The object to convert to do string.
     * @param {number}   count - Number of copies.
     * @return {string}  A new string with a specified number of copies of the string.
     */
    this.repeat = function(str, count) {
        return str.repeat(count);
    }

    /**
     * Replaces one character string with another in a string.
     * @param {string}   str - The string containing the other one.
     * @param {string}   string1 - The string to search for.
     * @param {string}   string2 - The replacement string.
     * @return {string}  A new string.
     */
    this.replace = function(str, string1, string2) {
        return str.replace(string1, string2);
    }

    /**
     * Searches a string for a specified value.
     * @param {string}   str - The string containing the other one.
     * @param {string}   text - Search string.
     * @return {number}  The position of the match.
     */
    this.search = function(str, text) {
        return str.search(text);
    }

    /**
     * Insert an object at the beginning of an array.
     * @param {array}   mtx - The array to join elements.
     * @param {object}  obj - The separator character.
     * @return {array}  The array with the added object.
     */
    this.shift = function(mtx, obj) {
        return mtx.shift(obj);
    }

    /**
     * Return a part of a string or array.
     * @param {string}   obj - The string or array containing the other one.
     * @param {number}   start - The start position.
     * @param {number}   end - The final position.
     * @return {string}  The selected part of the string or array.
     */
    this.slice = function(obj, start, end) {
        if (typeof end != 'undefined') {
            return obj.slice(start, end);
        } else {
            return obj.slice(start);
        }
    }

    /**
     * Returns a string filled with n spaces.
     * @param {number}   n - The number of spaces.
     * @return {string}  The string filled with n spaces.
     */
    this.space = function(n) {
        var str = ''
        for (var i = 0; i < n; i++) {
            str += ' ';
        }
        return str;
    }
    
    /**
     * Removes or replaces an object from the specified position in an array.
     * @param {array}   mtx - The array to remove elements.
     * @param {number}  pos - Position from which objects will be removed.
     * @param {number}  count - Number of objects to remove.
     * @param {object}  obj - Object to be inserted in the specified location.
     * @return {array}  The array with the objects removed.
     */
    this.splice = function(mtx, pos, count, obj) {
        if (typeof obj != 'undefined') {
            return mtx.splice(pos, count, obj);
        } else {
            return mtx.splice(pos, count);
        }
    }

    /**
     * Convert a string to an array, using the character indicated as a separator.
     * @param {string}   str - The string to slit.
     * @param {string}   chars - The separator characters.
     * @return {array}   The array containing the parts of the string.
     */
    this.split = function(str, chars) {
        if (typeof chars == 'undefined') {
            chars = ' ';
        }
        var firstChar = chars[0];
        for (var i = 1; i < chars.length; i++) {
            str = str.split(chars[i]).join(firstChar);
        }
        str = str.split(firstChar);
        return str;
    }

    /**
     * Convert a CSV record to an array, using the character indicated as the column separator.
     * @param {string}   str - The string to slit.
     * @param {string}   separator - The separator characters.
     * @param {boolean}  allowRepeatChar - The separator character can be repeated (for formatting).
     * @param {boolean}  doEval - Run core.eval before adding the column to the record.
     * @return {array}   The array containing the parts of the CSV or NULL if the CSV record is not well formed.
     */
    this.splitCSV = function(str, separator, allowRepeatChar, doEval) {
        var record = [];
        var column = '';
        var previous = '';
        var insideAString = false;
        var openParentheses = false;
        var closedParentheses = false;
        var openBrackets = false;
        var closedBrackets = false;
        var openBraces = false;
        var closedBraces = false;
        var i = 0;
        var j = 0;
        if (typeof separator == 'undefined') {
            separator = ',';
        }
        if (typeof allowRepeatChar == 'undefined') {
            var allowRepeatChar = false;
        }
        if (typeof doEval == 'undefined') {
            var doEval = false;
        }
        while (j < str.length) {
            c = str[j];
            if (insideAString) {
                if (((c == '"') || (c == '\'')) && (previous != '\\')) {
                    insideAString = !insideAString;
                    if (doEval) {
                        column += '"';
                    }
                } else {
                    column += c;
                }
            } else {
                if (((c == '"') || (c == '\'')) && (previous != '\\')) {
                    insideAString = !insideAString;
                    if (doEval) {
                        column += '"';
                    }
                } else {
                    if (c == '(') {
                        openParentheses++;
                    } else if (c == ')') {
                        closedParentheses++;
                    }
                    if (c == '[') {
                        openBrackets++;
                    } else if (c == ']') {
                        closedBrackets++;
                    }
                    if (c == '{') {
                        openBraces++;
                    } else if (c == '}') {
                        closedBraces++;
                    }

                    if (openParentheses > 0) {
                        if (openParentheses != closedParentheses) {
                            column += c;
                        } else {
                            openParentheses = 0;
                            closedParentheses = 0;
                        }
                    }
                    if (openBrackets > 0) {
                        if (openBrackets != closedBrackets) {
                            column += c;
                        } else {
                            openBrackets = 0;
                            closedBrackets = 0;
                        }
                    }
                    if (openBraces > 0) {
                        if (openBraces != closedBraces) {
                            column += c;
                        } else {
                            openBraces = 0;
                            closedBraces = 0;
                        }
                    }

                    if ((openParentheses == 0) && (openBrackets == 0) && (openBraces == 0)) {
                        if (separator.includes(c)) {
                            if (allowRepeatChar) {
                                while (separator.includes(str[j])) {
                                    if (j < str.length) {
                                        j++;
                                    }
                                    if (j == str.length) {
                                        break;
                                    }
                                }
                                j--;
                            }
                            if (doEval) {
                                record[i] = core.eval(column);
                            } else {
                                record[i] = column;
                            }
                            column = '';
                            i++;
                        } else {
                            column += c;
                        }
                    }
                }
            }
            previous = c;
            j++;
        }
        if (doEval) {
            record[i] = core.eval(column);
        } else {
            record[i] = column;
        }
        return record;
    }

    /**
     * Return a part of a string.
     * @param {string}   str - The string containing the other one.
     * @param {number}   start - The start position.
     * @param {number}   size - The size of the slice.
     * @return {string}  The selected part of the string.
     */
    this.substr = function(str, start, size) {
        return str.substr(start, size);
    }

    /**
     * Tests a script, checking if the result of its execution corresponds to the expected result, considering the specified tolerance.
     * @param {string}    _script - The script to be evaluated.
     * @param {number}    _times - Number of times the test must be repeated.
     * @param {number}    _value - Expected value.
     * @param {number}    _tolerance - Tolerance.
     * @param {string}    _catchScript - Script to be evaluated if the test fails.
     * @return {boolean}  True if the test was successful or false, otherwise.
     */
    this.testScript = function(_script, _times, _value, _tolerance, _catchScript) {
        if (typeof _times == 'undefined') {
            _times = 1;
        }
        if (typeof _tolerance == 'undefined') {
            _tolerance = 0;
        }
        var _successfulTest = true;
        var _i = 0;
        while (_i < _times) {
            this.testResult.obtained = eval(_script);
            if (typeof _value != 'undefined') {
                if (_tolerance > 0) {
                    if ((typeof this.testResult.obtained == 'number') && (typeof _value == 'number')) {
                        if (!((this.testResult.obtained >= (_value - _tolerance)) && (this.testResult.obtained <= (_value + _tolerance)))) {
                            this.testResult.expected = _value;
                            _successfulTest = false;
                            if (typeof _catchScript != 'undefined') {
                                eval(_catchScript);
                            }
                            break;
                        }
                    } else {
                        throw new Error('The test statement only supports tolerance with numeric values.');
                    }
                } else {
                    if (!core.equal(this.testResult.obtained, _value)) {
                        this.testResult.expected = _value;
                        _successfulTest = false;
                        if (typeof _catchScript != 'undefined') {
                            eval(_catchScript);
                        }
                        break;
                    }
                }
            }
            _i++;
        }
        return _successfulTest;
    }

    /**
     * Converts a string to lower case.
     * @param {string}   text - The string to convert.
     * @return {string}  A new string.
     */
    this.toLowerCase = function(text) {
        return text.toLowerCase();
    }

    /**
     * Converts a string representing a number to a binary number.
     * @param {string}   text - The string representing a number.
     * @return {number}  The string coverted to number.
     */
    this.toNumber = function(text) {
        var num;
        if (core.type(text) == 'string') {
            if (text.includes('i')) {
                var compiler = new MaiaCompiler();
                num = JSON.parse(compiler.parseComplexNumber(text));
            } else {
                num = Number(text);
            }
        } else if (core.type(text) == 'number') {
            num = text;
        }
        return num;
    }

    /**
     * Converts an objecto to string.
     * @param {object}   obj - The object to convert to do string.
     * @param {number}   base - Numerical base for conversion.
     * @return {string}  The object coverted for string.
     */
    this.toString = function(obj, base) {
        var str = '';
        if (typeof obj == 'object') {
            if ('imaginary' in obj) {
                var signal = Math.sign(obj.imaginary) > 0 ? '+' : '-';
                str = (obj.real).toString() + signal + Math.abs(obj.imaginary).toString() + '*i';
            } else {
                str = JSON.stringify(obj);
            }
        } else {
            if (typeof base != 'undefined') {
                str = obj.toString(base);
            } else {
                str = obj.toString();
            }
        }
        return str;
    }

    /**
     * Converts a string to uppercase.
     * @param {string}   text - The string to convert.
     * @return {string}  A new string.
     */
    this.toUpperCase = function(text) {
        return text.toUpperCase();
    }

    /**
     * Removes characters from the beginning and end of a string.
     * @param {string}   str - The string to be trimmed
     * @param {string}   chars - The characters to remove.
     * @return {string}  A new string.
     */
    this.trim = function(str, chars) {
        if (typeof chars == 'undefined') {
            return str.trim();
        }
        if (chars == ']') {
            var chars = '\\]';
        }
        if (chars == '\\') {
            var chars = '\\\\';
        }
        return str.replace(new RegExp('^[' + chars + ']+|[' + chars + ']+$', 'g'), '');
    }

    /**
     * Removes characters from the beginning and end of a string.
     * @param {string}   str - The string to be trimmed
     * @param {string}   chars - The characters to remove.
     * @return {string}  A new string.
     */
    this.trimLeft = function(str, chars) {
        if (typeof chars == 'undefined') {
            return str.trim();
        }
        if (chars == ']') {
            var chars = '\\]';
        }
        if (chars == '\\') {
            var chars = '\\\\';
        }
        return str.replace(new RegExp('^[' + chars + ']+', 'g'), '');
    }

    /**
     * Removes characters from the beginning and end of a string.
     * @param {string}   str - The string to be trimmed
     * @param {string}   chars - The characters to remove.
     * @return {string}  A new string.
     */
    this.trimRight = function(str, chars) {
        if (typeof chars == 'undefined') {
            return str.trim();
        }
        if (chars == ']') {
            var chars = '\\]';
        }
        if (chars == '\\') {
            var chars = '\\\\';
        }
        return str.replace(new RegExp('[' + chars + ']+$', 'g'), '');
    }

    /**
     * Returns the class of a MaiaScript object.
     * @param {object}   obj - A MaiaScript object .
     * @return {string}  The class of a MaiaScript object.
     */
    this.type = function(obj) {
        var classType;
        if (typeof(obj) == 'boolean') {
            classType = 'boolean';
        } else if (typeof(obj) == 'function') {
            classType = 'function';
        } else if (typeof(obj) == 'number') {
            classType = 'number';
        } else if (typeof(obj) == 'string') {
            classType = 'string';
        } else if (typeof(obj) == 'object') {
            if (Array.isArray(obj)) {
                classType = 'matrix';
            } else {
                if ('imaginary' in obj) {
                    classType = 'complex';
                } else {
                    classType = 'object';
                }
            }
        } else if (typeof(obj) == 'undefined') {
            classType = 'undefined';
        }
        return classType;
    }

    /**
     * Removes an object from the beginning of an array.
     * @param {array}   mtx - The array to join elements.
     * @param {object}  obj - The separator character.
     * @return {array}  The array with the object removed.
     */
    this.unshift = function(mtx, obj) {
        return mtx.unshift(obj);
    }

    /**
     * Creates a zero matrix.
     * @param {number}  rows - Number of rows in the matrix.
     * @param {number}  columns - Number of columns in the matrix.
     * @return {array}  A (rows x columns) matrix.
     */
    this.zero = function(rows, columns) {
        return core.matrix(0, rows, columns);
    }

    /*
     * The following functions are used internally by the MaiaScript compiler.
     */

    /**
     * Performs the logical OR operation between two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.logicalOR = function(left, right) {
        return left || right;
    }

    /**
     * Performs the logical XOR operation between two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.logicalXOR = function(left, right) {
        return left ? !right : right;
    }

    /**
     * Performs the logical AND operation between two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.logicalAND = function(left, right) {
        return left && right;
    }

    /**
     * Performs the binary OR operation between two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.bitwiseOR = function(left, right) {
        return left | right;
    }

    /**
     * Performs the binary XOR operation between two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.bitwiseXOR = function(left, right) {
        return left ^ right;
    }

    /**
     * Performs the binary AND operation between two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.bitwiseAND = function(left, right) {
        return left & right;
    }

    /**
     * Returns TRUE if two objects are equal.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.equal = function(left, right) {
        var res;

        Array.prototype.equals = function(array) {
            if (!array) {
                return false;
            }
            if (this.length != array.length) {
                return false;
            }
            for (var i = 0, l = this.length; i < l; i++) {
                if (this[i] instanceof Array && array[i] instanceof Array) {
                    if (!this[i].equals(array[i])) {
                        return false;
                    }
                } else if (this[i] != array[i]) {
                    return false;
                }
            }
            return true;
        }
        Object.defineProperty(Array.prototype, "equals", {
            enumerable: false
        });

        isEquivalent = function(a, b) {
            var aProperties = Object.getOwnPropertyNames(a);
            var aProperties = Object.getOwnPropertyNames(b);
            if (aProperties.length != aProperties.length) {
                return false;
            }
            for (var i = 0; i < aProperties.length; i++) {
                var propertiesName = aProperties[i];
                if (a[propertiesName] !== b[propertiesName]) {
                    return false;
                }
            }
            return true;
        }

        if (Array.isArray(left) && Array.isArray(right)) {
            res = left.equals(right);
        } else {
            if ((typeof left == 'object') && (typeof right == 'object')) {
                res = isEquivalent(left, right);
            } else {
                res = left == right;
            }
        }
        return res;
    }

    /**
     * Returns TRUE if two objects are different.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.different = function(left, right) {
        return !this.equal(left, right);
    }

    /**
     * Returns TRUE if the object on the left is smaller than the object on the right.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.LT = function(left, right) {
        return left < right;
    }

    /**
     * Returns TRUE if the object on the left is less than or equal to the object on the right.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.LE = function(left, right) {
        return left <= right;
    }

    /**
     * Returns TRUE if the object on the left is greater than or equal to the object on the right.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.GE = function(left, right) {
        return left >= right;
    }

    /**
     * Returns TRUE if the object on the left is greater than the object on the right.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.GT = function(left, right) {
        return left > right;
    }

    /**
     * Performs a left shift operation.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.leftShift = function(left, right) {
        return left << right;
    }

    /**
     * Performs a left shift operation.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.rightShift = function(left, right) {
        return left >> right;
    }

    /**
     * Add two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.add = function(left, right) {
        var res;
        if (core.type(left) == 'complex') {
            if (core.type(right) == 'complex') {
                var real = core.toNumber(left.real) + core.toNumber(right.real);
                var img = core.toNumber(left.imaginary) + core.toNumber(right.imaginary);
                res = core.complex(real, img);
            } else if (core.type(right) == 'number') {
                var real = core.toNumber(left.real) + core.toNumber(right);
                var img = core.toNumber(left.imaginary);
                res = core.complex(real, img);
            } else {
                throw new Error('Invalid operand for operator "+", in the expression ' + core.toString(left) + ' + ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'number') {
            if (core.type(right) == 'complex') {
                var real = core.toNumber(left) + core.toNumber(right.real);
                var img = core.toNumber(right.imaginary);
                res = core.complex(real, img);
            } else if (core.type(right) == 'number') {
                res = left + right;
            } else if (core.type(right) == 'string') {
                res = core.toString(left) + right;
            } else {
                throw new Error('Invalid operand for operator "+", in the expression ' + core.toString(left) + ' + ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'matrix') {
            if (core.type(right) == 'matrix') {
                res = [];
                var dimLeft = core.dim(left);
                var dimRight = core.dim(right);
                if ((dimLeft.length > 1) && (dimRight.length > 1)) {
                    if ((dimLeft[0] == dimRight[0]) && (dimLeft[1] == dimRight[1])) {
                        var rows = dimLeft[0];
                        var columns = dimLeft[1];
                        for (var i = 0; i < rows; i++) {
                            var row = [];
                            for (var j = 0; j < columns; j++) {
                                row.push(left[i][j] + right[i][j]);
                            }
                            res.push(row);
                        }
                    } else {
                        throw new Error('Operand invalid for operator "+", in the expression ' + core.toString(left) + ' + ' + core.toString(right) + '. The matrices must have the same dimensions.');
                    }
                } else {
                    if (dimLeft[0] == dimRight[0]) {
                        var columns = dimLeft[0];
                        var row = [];
                        for (var i = 0; i < columns; i++) {
                            row.push(left[i] + right[i]);
                        }
                        res = row;
                    } else {
                        throw new Error('Operand invalid for operator "+", in the expression ' + core.toString(left) + ' + ' + core.toString(right) + '. The matrices must have the same dimensions.');
                    }
                }
            } else {
                throw new Error('Invalid operand for operator "+", in the expression ' + core.toString(left) + ' + ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'string') {
            if (core.type(right) == 'number') {
                res = left + core.toString(right);
            } else if (core.type(right) == 'string') {
                    res = left + right;
            } else {
                throw new Error('Invalid operand for operator "+", in the expression ' + core.toString(left) + ' + ' + core.toString(right) + '.');
            }
        } else {
            res = left + right;
        }
        return res;
    }

    /**
     * Subtracts two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.sub = function(left, right) {
        var res;
        if (core.type(left) == 'complex') {
            if (core.type(right) == 'complex') {
                var real = core.toNumber(left.real) - core.toNumber(right.real);
                var img = core.toNumber(left.imaginary) - core.toNumber(right.imaginary);
                res = core.complex(real, img);
            } else if (core.type(right) == 'number') {
                var real = core.toNumber(left.real) - core.toNumber(right);
                var img = core.toNumber(left.imaginary);
                res = core.complex(real, img);
            } else {
                throw new Error('Invalid operand for operator "-", in the expression ' + core.toString(left) + ' - ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'number') {
            if (core.type(right) == 'complex') {
                var real = core.toNumber(left) - core.toNumber(right.real);
                var img = core.toNumber(right.imaginary);
                res = core.complex(real, img);
            } else if (core.type(right) == 'number') {
                res = left - right;
            } else {
                throw new Error('Invalid operand for operator "-", in the expression ' + core.toString(left) + ' - ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'matrix') {
            if (core.type(right) == 'matrix') {
                res = [];
                var dimLeft = core.dim(left);
                var dimRight = core.dim(right);
                if ((dimLeft.length > 1) && (dimRight.length > 1)) {
                    if ((dimLeft[0] == dimRight[0]) && (dimLeft[1] == dimRight[1])) {
                        var rows = dimLeft[0];
                        var columns = dimLeft[1];
                        for (var i = 0; i < rows; i++) {
                            var row = [];
                            for (var j = 0; j < columns; j++) {
                                row.push(left[i][j] - right[i][j]);
                            }
                            res.push(row);
                        }
                    } else {
                        throw new Error('Operand invalid for operator "-", in the expression ' + core.toString(left) + ' - ' + core.toString(right) + '. The matrices must have the same dimensions.');
                    }
                } else {
                    if (dimLeft[0] == dimRight[0]) {
                        var columns = dimLeft[0];
                        var row = [];
                        for (var i = 0; i < columns; i++) {
                            row.push(left[i] - right[i]);
                        }
                        res = row;
                    } else {
                        throw new Error('Operand invalid for operator "-", in the expression ' + core.toString(left) + ' - ' + core.toString(right) + '. The matrices must have the same dimensions.');
                    }
                }
            } else {
                throw new Error('Invalid operand for operator "-", in the expression ' + core.toString(left) + ' - ' + core.toString(right) + '.');
            }
        } else {
            res = left - right;
        }
        return res;
    }

    /**
     * Performs a power operation between two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.power = function(left, right) {
        // r=abs(a+b*i)=sqrt(a*a+b*b)
        // t=arg(a+b*i)=atan(b/a)
        // pow(a+b*i,n)=pow(r,n)*cos(n*t)+i*pow(r,n)*sin(n*t)
        var res;
        if (core.type(left) == 'complex') {
            if (core.type(right) == 'number') {
                var r = Math.sqrt(core.toNumber(left.real) * core.toNumber(left.real) + core.toNumber(left.imaginary) * core.toNumber(left.imaginary));
                var a = Math.asin(core.toNumber(left.imaginary) / r);
                var real = Math.pow(r, right) * Math.cos(a * right);
                var img = Math.pow(r, right) * Math.sin(a * right);
                res = core.complex(real, img);
            } else {
                throw new Error('Invalid operand for operator "^", in the expression ' + core.toString(left) + ' ^ ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'matrix') {
            if (core.type(right) == 'number') {
                var dimLeft = core.dim(left);
                if (right == -1) {
                    res = core.inv(left);
                } else if (right == 0) {
                    res = core.one(dimLeft[0], dimLeft[1]);
                } else if (right == 1) {
                    res = left;
                } else if (right > 1) {
                    res = 1;
                    for (var i = 0; i < right; i++) {
                        res = core.mul(res, left);
                    }
                }
            } else {
                throw new Error('Invalid operand for operator "^", in the expression ' + core.toString(left) + ' ^ ' + core.toString(right) + '.');
            }
        } else {
            res = Math.pow(left, right);
        }
        return res;
    }

    /**
     * Multiplies two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.mul = function(left, right) {
        var res;
        if (core.type(left) == 'complex') {
            if (core.type(right) == 'complex') {
                var real = core.toNumber(left.real) * core.toNumber(right.real) - core.toNumber(left.imaginary) * core.toNumber(right.imaginary);
                var img = core.toNumber(left.real) * core.toNumber(right.imaginary) + core.toNumber(left.imaginary) * core.toNumber(right.real);
                res = core.complex(real, img);
            } else if (core.type(right) == 'number') {
                var real = core.toNumber(left.real) * core.toNumber(right);
                var img = core.toNumber(left.imaginary);
                res = core.complex(real, img);
            } else {
                throw new Error('Invalid operand for operator "*", in the expression ' + core.toString(left) + ' * ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'number') {
            if (core.type(right) == 'complex') {
                var real = core.toNumber(left) * core.toNumber(right.real);
                var img = core.toNumber(right.imaginary);
                res = core.complex(real, img);
            } else if (core.type(right) == 'matrix') {
                var dimRight = core.dim(right);
                res = core.matrix(0, dimRight[0], dimRight[1]);
                for (var i = 0; i < dimRight[0]; i++) {
                    for (var j = 0; j < dimRight[1]; j++) {
                        res[i][j] = left * right[i][j];
                    }
                }
            } else if (core.type(right) == 'number') {
                res = left * right;
            } else {
                throw new Error('Invalid operand for operator "*", in the expression ' + core.toString(left) + ' * ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'matrix') {
            if (core.type(right) == 'matrix') {
                var dimLeft = core.dim(left);
                var dimRight = core.dim(right);
                res = core.matrix(0, dimLeft[0], dimRight[1]);
                if (dimLeft[1] == dimRight[0]) {
                    for (var i = 0; i < dimLeft[0]; i++) {
                        for (var j = 0; j < dimRight[1]; j++) {
                            for (var k = 0; k < dimRight[0]; k++) {
                                res[i][j] = res[i][j] + left[i][k] * right[k][j];
                            }
                        }
                    }
                } else {
                    throw new Error('Operand invalid for operator "*", in the expression ' + core.toString(left) + ' * ' + core.toString(right) + '. The matrices must have compatible dimensions.');
                }
            } else if (core.type(right) == 'number') {
                dimLeft = core.dim(left);
                res = core.matrix(0, dimLeft[0], dimLeft[1]);
                for (var i = 0; i < dimLeft[0]; i++) {
                    for (var j = 0; j < dimLeft[1]; j++) {
                        res[i][j] = left[i][j] * right;
                    }
                }
            } else {
                throw new Error('Invalid operand for operator "*", in the expression ' + core.toString(left) + ' * ' + core.toString(right) + '.');
            }
        } else {
            res = left * right;
        }
        return res;
    }

    /**
     * Divide two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.div = function(left, right) {
        // (a+b*i)/(c+d*i)=(a*c+b*d)/(c*c+d*d)+i*(b*c-a*d)/(c*c+d*d)
        var res;
        if (core.type(left) == 'complex') {
            if (core.type(right) == 'complex') {
                var real = (core.toNumber(left.real) * core.toNumber(right.real) + core.toNumber(left.imaginary) * core.toNumber(right.imaginary)) / (core.toNumber(right.real) * core.toNumber(right.real) + core.toNumber(right.imaginary) * core.toNumber(right.imaginary));
                var img = (core.toNumber(left.imaginary) * core.toNumber(right.real) - core.toNumber(left.real) * core.toNumber(right.imaginary)) / (core.toNumber(right.real) * core.toNumber(right.real) + core.toNumber(right.imaginary) * core.toNumber(right.imaginary));
                res = core.complex(real, img);
            } else if (core.type(right) == 'number') {
                var real = core.toNumber(left.real) / core.toNumber(right);
                var img = core.toNumber(left.imaginary);
                res = core.complex(real, img);
            } else {
                throw new Error('Invalid operand for operator "/", in the expression ' + core.toString(left) + ' / ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'number') {
            if (core.type(right) == 'complex') {
                var real = core.toNumber(left) / core.toNumber(right.real);
                var img = core.toNumber(right.imaginary);
                res = core.complex(real, img);
            } else if (core.type(right) == 'number') {
                res = left / right;
            } else {
                throw new Error('Invalid operand for operator "/", in the expression ' + core.toString(left) + ' / ' + core.toString(right) + '.');
            }
        } else if (core.type(left) == 'matrix') {
            if (core.type(right) == 'matrix') {
                var dimLeft = core.dim(left);
                var dimRight = core.dim(right);
                if (dimLeft[0] == dimRight[1]) {
                    res = core.mul(core.inv(right), left);
                } else {
                    throw new Error('Operand invalid for operator "*", in the expression ' + core.toString(left) + ' * ' + core.toString(right) + '. The matrices must have compatible dimensions.');
                }
            } else if (core.type(right) == 'number') {
                dimLeft = core.dim(left);
                res = core.matrix(0, dimLeft[0], dimLeft[1]);
                for (var i = 0; i < dimLeft[0]; i++) {
                    for (var j = 0; j < dimLeft[1]; j++) {
                        res[i][j] = left[i][j] * right;
                    }
                }
            } else {
                throw new Error('Invalid operand for operator "*", in the expression ' + core.toString(left) + ' * ' + core.toString(right) + '.');
            }
        } else {
            res = left / right;
        }
        return res;
    }

    /**
     * Calculates the rest of the division between two objects.
     * @param {object}   left - The left operand.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.mod = function(left, right) {
        return left % right;
    }

    /**
     * Performs a binary NOT operation.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.bitwiseNot = function(right) {
        return ~right;
    }

    /**
     * Performs a logical NOT operation.
     * @param {object}   right - The right operand.
     * @return {string}  An string represening the result of the operation.
     */
    this.logicalNot = function(right) {
        return !right;
    }
}

core = new Core();