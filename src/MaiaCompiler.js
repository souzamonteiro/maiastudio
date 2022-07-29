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
 * MaiaScript compiler class.
 * @class
 */
function MaiaCompiler() {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        binaryExpression = ['operation',
                            'variableAssignment',
                            'logicalORExpression',
                            'logicalXORExpression',
                            'logicalANDExpression',
                            'bitwiseORExpression',
                            'bitwiseXORExpression',
                            'bitwiseANDExpression',
                            'equalityExpression',
                            'relationalExpression',
                            'shiftExpression',
                            'additiveExpression',
                            'powerExpression',
                            'multiplicativeExpression'];
        codeBlockStatement = ['maiascript',
                              'namespace',
                              'function',
                              'if',
                              'do',
                              'while',
                              'for',
                              'foreach',
                              'try',
                              'catch',
                              'test'];
        conditionalExpression = ['if',
                              'do',
                              'while',
                              'for',
                              'foreach',
                              'catch',
                              'test'];
        operators = {'||':   'core.logicalOR',
                     '||||': 'core.logicalXOR',
                     '&&':   'core.logicalAND',
                     '|':    'core.bitwiseOR',
                     '|||':  'core.bitwiseXOR',
                     '&':    'core.bitwiseAND',
                     '==':   'core.equal',
                     '!=':   'core.different',
                     '<':    'core.LT',
                     '<=':   'core.LE',
                     '>=':   'core.GE',
                     '>':    'core.GT',
                     '<<':   'core.leftShift',
                     '>>':   'core.rightShift',
                     '+':    'core.add',
                     '-':    'core.sub',
                     '^':    'core.power',
                     '*':    'core.mul',
                     '/':    'core.div',
                     '%':    'core.mod',
                     '~':    'core.bitwiseNot',
                     '!':    'core.logicalNot'
                    };
    }

    /**
     * Convert XML to JSON.
     * @param {xml}    xml - The XML data.
     * @return {json}  XML data converted to a JSON object.
     */
    this.xmlToJson = function(xml) {
        try {
            var obj = {};
            if (xml.children.length > 0) {
                for (var i = 0; i < xml.children.length; i++) {
                    var item = xml.children.item(i);
                    nodeName = item.nodeName;
                    if (typeof(obj[nodeName]) == 'undefined') {
                        obj[nodeName] = this.xmlToJson(item);
                    } else {
                        if (typeof(obj[nodeName].push) == 'undefined') {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push(this.xmlToJson(item));
                    }
                }
            } else {
                obj = xml.textContent;
            }
            return obj;
        } catch (e) {
            system.log(e.message);
        }
    }
    
    /**
     * Compiles the MaiaScript XML tree for Maia Internal Code (MIL).
     * @param {xml}    xml - The XML data.
     * @param {string} itemName - Name of the item being analyzed.
     * @return {json}  XML data converted to a MIL object.
     */
    this.xmlToMil = function(xml, itemName = '') {
        try {
            var obj = {};

            if (itemName == '') {
                if (xml.children.length > 0) {
                    for (var i = 0; i < xml.children.length; i++) {
                        var item = xml.children.item(i);
                        nodeName = item.nodeName;
                        if (typeof(obj[nodeName]) == 'undefined') {
                            obj[nodeName] = this.xmlToMil(item, nodeName);
                        } else {
                            if (typeof(obj[nodeName].push) == 'undefined') {
                                var old = obj[nodeName];
                                obj[nodeName] = [];
                                obj[nodeName].push(old);
                            }
                            obj[nodeName].push(this.xmlToMil(item, nodeName));
                        }
                    }
                } else {
                    obj = xml.textContent;
                }
            } else {
                if (binaryExpression.includes(itemName)) {
                    if (xml.children.length > 1) {
                        for (var i = 0; i < xml.children.length; i++) {
                            var item = xml.children.item(i);
                            nodeName = item.nodeName;
                            if (nodeName != 'TOKEN') {
                                opName = 'op';
                            } else {
                                opName = nodeName;
                            }
                            if (typeof(obj[opName]) == 'undefined') {
                                obj[opName] = this.xmlToMil(item, nodeName);
                            } else {
                                if (typeof(obj[opName].push) == 'undefined') {
                                    var old = obj[opName];
                                    obj[opName] = [];
                                    obj[opName].push(old);
                                }
                                obj[opName].push(this.xmlToMil(item, nodeName));
                            }
                        }
                    } else if (xml.children.length == 1) {
                        var item = xml.children.item(0);
                        nodeName = item.nodeName;
                        obj = this.xmlToMil(item, nodeName);
                    } else {
                        obj = xml.textContent;
                    }
                } else {
                    if (xml.children.length > 0) {
                        for (var i = 0; i < xml.children.length; i++) {
                            var item = xml.children.item(i);
                            nodeName = item.nodeName;
                            if (typeof(obj[nodeName]) == 'undefined') {
                                obj[nodeName] = this.xmlToMil(item, nodeName);
                            } else {
                                if (typeof(obj[nodeName].push) == 'undefined') {
                                    var old = obj[nodeName];
                                    obj[nodeName] = [];
                                    obj[nodeName].push(old);
                                }
                                obj[nodeName].push(this.xmlToMil(item, nodeName));
                            }
                        }
                    } else {
                        obj = xml.textContent;
                    }
                }
            }
            return obj;
        } catch (e) {
            system.log(e.message);
        }
    }

    /**
     * Compiles a complex number to JSON.
     * @param {string}   text - The expression representing the complex number.
     * @return {string}  Number converted to JSON.
     */
    this.parseComplexNumber = function(text) {
        var complexNumber = {
            'xml': '',
            'text': ''
        }
        maiaScriptComplexNumber = {
            'real': 0,
            'imaginary': 0
        }

        function getXml (data) {
            complexNumber.xml += data;
        }
        var s = new ComplexNumber.XmlSerializer(getXml, true);
        var complexNumberParser = new ComplexNumber(text, s);
        try {
            complexNumberParser.parse_number();
        } catch (pe) {
            if (!(pe instanceof complexNumberParser.ParseException)) {
                throw pe;
            } else {
                var parserError = complexNumberParser.getErrorMessage(pe);
                alert(parserError);
                throw parserError;
            }
        }
        var parser = new DOMParser();
        var xml = parser.parseFromString(complexNumber.xml,"text/xml");
        
        var json = this.xmlToJson(xml);
        if ('number' in json) {
            var number = json['number'];
            if ('complex' in number) {
                var complex = number['complex'];
                if ('imaginary' in complex) {
                    var imaginary = complex['imaginary'];
                    json.number.complex.imaginary = json.number.complex.imaginary.substring(0, json.number.complex.imaginary.length - 2);
                }
            }
            if (typeof json.number.complex.real == 'undefined') {
                json.number.complex.real = 0;
            }
            maiaScriptComplexNumber = {
                'real': core.toNumber(json.number.complex.real),
                'imaginary': core.toNumber(json.number.complex.imaginary)
            }
        }
        complexNumber.text = JSON.stringify(maiaScriptComplexNumber);
        return complexNumber.text;
    }

    /**
     * Compiles the code in Maia Internal Language (MIL) for JavaScript.
     * @param {json}     mil - Code in Maia Internal Language (MIL).
     * @param {string}   parentNodeInfo - Parent node data.
     * @param {boolean}  isKernelFunction - Parent node is a kernel function.
     * @return {string}  MIL code converted to JavaScript.
     */
    this.parse = function(mil, parentNodeInfo, isKernelFunction) {
        var node = {};
        var js = '';
        
        if (typeof isKernelFunction == 'undefined') {
            var isKernelFunction = false;
        }

        if ('maiascript' in mil) {
            node = mil['maiascript'];
            var nodeInfo = {
                'parentNode': 'maiascript',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'maiascript';

            if (typeof node != 'undefined') {
                js = this.parse(node, nodeInfo, isKernelFunction);
                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
            }
        } else if ('expression' in mil) {
            node = mil['expression'];
            var nodeInfo = {
                'parentNode': 'expression',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'expression';

            if (typeof node != 'undefined') {
                if (Array.isArray(node)) {
                    for (var i = 0; i < node.length; i++) {
                        text = this.parse(node[i], nodeInfo, isKernelFunction);
                        parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                        if (codeBlockStatement.includes(parentNodeInfo.parentNode) && (nodeInfo.childNode != 'comment') && (nodeInfo.childNode != 'condition')) {
                            if (parentNodeInfo.parentNode == 'namespace') {
                                if ((parentNodeInfo.terminalNode == 'assignment') || (parentNodeInfo.terminalNode == 'function')) {
                                    js += 'this.' + text + ';';
                                } else {
                                    js += text + ';';
                                }
                            } else {
                                if (conditionalExpression.includes(parentNodeInfo.parentNode)) {
                                    js += text;
                                } else {
                                    js += text + ';';
                                }
                            }
                        } else {
                            js += text;
                        }
                    }
                } else {
                    text = this.parse(node, nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    if (codeBlockStatement.includes(parentNodeInfo.parentNode) && (nodeInfo.childNode != 'comment') && (nodeInfo.childNode != 'condition')) {
                        if (parentNodeInfo.parentNode == 'namespace') {
                            if ((parentNodeInfo.terminalNode == 'assignment') || (parentNodeInfo.terminalNode == 'function')) {
                                js += 'this.' + text + ';';
                            } else {
                                js += text + ';';
                            }
                        } else {
                            if (conditionalExpression.includes(parentNodeInfo.parentNode)) {
                                js += text;
                            } else {
                                js += text + ';';
                            }
                        }
                    } else {
                        js += text;
                    }
                }
            }
        } else if ('statement' in mil) {
            node = mil['statement'];
            var nodeInfo = {
                'parentNode': 'statement',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'statement';

            if (typeof node != 'undefined') {
                js = this.parse(node, nodeInfo, isKernelFunction);
                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
            }
        } else if ('namespace' in mil) {
            node = mil['namespace'];
            var nodeInfo = {
                'parentNode': 'namespace',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'namespace';

            if (typeof node != 'undefined') {
                if ('identifier' in node) {
                    var nodeIdentifier = {
                        'identifier': node['identifier']
                    };
                    var name = this.parse(nodeIdentifier, nodeInfo, isKernelFunction);

                    if ('expression' in node) {
                        var nodeExpression = {
                            'expression': node['expression']
                        };
                        var body = this.parse(nodeExpression, nodeInfo, isKernelFunction);
                    }
                    js = 'function ' + name + '_' + '() {' + body + '};' + name + ' = new ' + name + '_()' ;
                }
            }
        } else if ('function' in mil) {
            node = mil['function'];
            var nodeInfo = {
                'parentNode': 'function',
                'childNode': '',
                'terminalNode' : 'function'
            };
            parentNodeInfo.childNode = 'function';

            if (typeof node != 'undefined') {
                if ('identifier' in node) {
                    var nodeIdentifier = {
                        'identifier': node['identifier']
                    };
                    var name = this.parse(nodeIdentifier, nodeInfo, isKernelFunction);

                    if ('TOKEN' in node) {
                        var statement = node['TOKEN'][0];
                        if (statement == 'async') {
                            js += name + ' = async function ';
                        } else if (statement == 'constructor') {
                            nodeInfo.parentNode = 'namespace';
                            js += name + ' = function ';
                        } else {
                            js += name + ' = function ';
                        }
                    } else {
                        var statement = 'function';
                        js += name + ' = function ';
                    }
                    
                    if ('arguments' in node) {
                        var nodeArguments = {
                            'arguments': node['arguments']
                        };
                        var args = this.parse(nodeArguments, nodeInfo, isKernelFunction);
                        js += '(' + args + ')';
                    } else {
                        js += '()';
                    }
                    if ('expression' in node) {
                        var nodeExpression = {
                            'expression': node['expression']
                        };
                        if (statement == 'kernel') {
                            var body = this.parse(nodeExpression, nodeInfo, true);
                        } else {
                            var body = this.parse(nodeExpression, nodeInfo, isKernelFunction);
                        }
                        js += ' {' + body + '}';
                    } else {
                        js += ' {}';
                    }
                }
            }
            parentNodeInfo.terminalNode = 'function';
        } else if ('include' in mil) {
            node = mil['include'];
            var nodeInfo = {
                'parentNode': 'include',
                'childNode': '',
                'terminalNode' : 'include'
            };
            parentNodeInfo.childNode = 'include';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var returnValue = this.parse(node, nodeInfo, isKernelFunction);
                    js += 'var func_ = core.type(' + returnValue + ') == "function" ? ' + returnValue + ' : ' + returnValue + '.constructor;';
                    js += 'var script_ = func_.toString().substring(func_.toString().indexOf("{") + 1, func_.toString().lastIndexOf("}"));';
                    js += 'eval(script_)';
                }
            }
        } else if ('local' in mil) {
            node = mil['local'];
            var nodeInfo = {
                'parentNode': parentNodeInfo.parentNode,
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'local';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var expressionValue = this.parse(node, nodeInfo, isKernelFunction);
                    js += 'let ' + expressionValue;
                }
            }
        } else if ('if' in mil) {
            node = mil['if'];
            var nodeInfo = {
                'parentNode': 'if',
                'childNode': '',
                'terminalNode' : 'if'
            };
            parentNodeInfo.childNode = 'if';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var body = '';
                    var nodeExpression = node['expression'];
                    if (Array.isArray(nodeExpression)) {
                        var nodeCondition = {
                            'expression': nodeExpression[0]
                        };
                        var condition = this.parse(nodeCondition, nodeInfo, isKernelFunction);

                        for (var i = 1; i < nodeExpression.length; i++) {
                            var commandLine = nodeExpression[i];
                            var bodyExpression = {
                                'expression': commandLine
                            };
                            body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                        }
                        js += 'if (' + condition + ') {' + body + '}';
                    }
                }
                if ('elseif' in node) {
                    var body = '';
                    var nodeElseIf = node['elseif'];
                    if (Array.isArray(nodeElseIf)) {
                        for (var i = 0; i < nodeElseIf.length; i++) {
                            if ('expression' in nodeElseIf[i]) {
                                var nodeElseIfExpression = nodeElseIf[i]['expression'];
                                if (Array.isArray(nodeElseIfExpression)) {
                                    var body = '';
                                    var nodeExpression = nodeElseIfExpression[0];
                                    var nodeCondition = {
                                        'expression': nodeExpression
                                    };
                                    var condition = this.parse(nodeCondition, nodeInfo, isKernelFunction);
                                    
                                    for (var j = 1; j < nodeElseIfExpression.length; j++) {
                                        var commandLine = nodeElseIfExpression[j];
                                        var bodyExpression = {
                                            'expression': commandLine
                                        };
                                        body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                                    }
                                }
                                js += ' else if (' + condition + ') {' + body + '}';
                            }
                        }
                    } else {
                        if ('expression' in nodeElseIf) {
                            var nodeElseIfExpression = nodeElseIf['expression'];
                            if (Array.isArray(nodeElseIfExpression)) {
                                var body = '';
                                var nodeExpression = nodeElseIfExpression[0];
                                var nodeCondition = {
                                    'expression': nodeExpression
                                };
                                var condition = this.parse(nodeCondition, nodeInfo, isKernelFunction);
                                
                                for (var j = 1; j < nodeElseIfExpression.length; j++) {
                                    var commandLine = nodeElseIfExpression[j];
                                    var bodyExpression = {
                                        'expression': commandLine
                                    };
                                    body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                                }
                            }
                            js += ' else if (' + condition + ') {' + body + '}';
                        }
                    }
                }
                if ('else' in node) {
                    var body = '';
                    var nodeElse = node['else'];
                    if ('expression' in nodeElse) {
                        var nodeExpression = nodeElse['expression'];
                        if (Array.isArray(nodeExpression)) {
                            for (var i = 0; i < nodeExpression.length; i++) {
                                var commandLine = nodeExpression[i];
                                var bodyExpression = {
                                    'expression': commandLine
                                };
                                body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                            }
                        } else {
                            var bodyExpression = {
                                'expression': nodeExpression
                            };
                            body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                        }
                        js += ' else {' + body + '}';
                    }
                }
            }
            parentNodeInfo.terminalNode = 'if';
        } else if ('do' in mil) {
            node = mil['do'];
            var nodeInfo = {
                'parentNode': 'do',
                'childNode': '',
                'terminalNode' : 'do'
            };
            parentNodeInfo.childNode = 'do';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var body = '';
                    var nodeExpression = node['expression'];
                    if (Array.isArray(nodeExpression)) {
                        for (var i = 0; i < nodeExpression.length - 1; i++) {
                            var commandLine = nodeExpression[i];
                            var bodyExpression = {
                                'expression': commandLine
                            };
                            body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                        }

                        var nodeCondition = {
                            'expression': nodeExpression[nodeExpression.length - 1]
                        };
                        var condition = this.parse(nodeCondition, nodeInfo, isKernelFunction);
                    }
                    js += 'do {' + body + '} while (' + condition + ')';
                }
            }
            parentNodeInfo.terminalNode = 'do';
        } else if ('while' in mil) {
            node = mil['while'];
            var nodeInfo = {
                'parentNode': 'while',
                'childNode': '',
                'terminalNode' : 'while'
            };
            parentNodeInfo.childNode = 'while';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var body = '';
                    var nodeExpression = node['expression'];
                    if (Array.isArray(nodeExpression)) {
                        var nodeCondition = {
                            'expression': nodeExpression[0]
                        };
                        var condition = this.parse(nodeCondition, nodeInfo, isKernelFunction);

                        for (var i = 1; i < nodeExpression.length; i++) {
                            var commandLine = nodeExpression[i];
                            var bodyExpression = {
                                'expression': commandLine
                            };
                            body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                        }
                    }
                    js += 'while (' + condition + ') {' + body + '}';
                }
            }
            parentNodeInfo.terminalNode = 'while';
        } else if ('for' in mil) {
            node = mil['for'];
            var nodeInfo = {
                'parentNode': 'for',
                'childNode': '',
                'terminalNode' : 'for'
            };
            parentNodeInfo.childNode = 'for';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var body = '';
                    var nodeExpression = node['expression'];
                    if (Array.isArray(nodeExpression)) {
                        var nodeExpression = node['expression'];
                        var nodeBefore = {
                            'expression': nodeExpression[0]
                        };
                        var before = this.parse(nodeBefore, nodeInfo, isKernelFunction);

                        var nodeCondition = {
                            'expression': nodeExpression[1]
                        };
                        var condition = this.parse(nodeCondition, nodeInfo, isKernelFunction);

                        var nodeAfter = {
                            'expression': nodeExpression[2]
                        };
                        var after = this.parse(nodeAfter, nodeInfo, isKernelFunction);

                        for (var i = 3; i < nodeExpression.length; i++) {
                            var commandLine = nodeExpression[i];
                            var bodyExpression = {
                                'expression': commandLine
                            };
                            body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                        }
                    }
                    js += 'for (' + before + ';' + condition + ';' + after + ') {' + body + '}';
                }
            }
            parentNodeInfo.terminalNode = 'for';
        } else if ('foreach' in mil) {
            node = mil['foreach'];
            var nodeInfo = {
                'parentNode': 'foreach',
                'childNode': '',
                'terminalNode' : 'foreach'
            };
            parentNodeInfo.childNode = 'foreach';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var body = '';
                    var nodeExpression = node['expression'];
                    if (Array.isArray(nodeExpression)) {
                        var nodeArray = {
                            'expression': nodeExpression[0]
                        };
                        var arrayName = this.parse(nodeArray, nodeInfo, isKernelFunction);

                        var nodeKeyVar = {
                            'expression': nodeExpression[1]
                        };
                        var keyVarName = this.parse(nodeKeyVar, nodeInfo, isKernelFunction);

                        var nodeValueVar = {
                            'expression': nodeExpression[2]
                        };
                        var valueVarName = this.parse(nodeValueVar, nodeInfo, isKernelFunction);

                        for (var i = 3; i < nodeExpression.length; i++) {
                            var commandLine = nodeExpression[i];
                            var bodyExpression = {
                                'expression': commandLine
                            };
                            body += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                        }
                    }
                    js += 'for (' + keyVarName + ' in ' + arrayName + ') {var ' + valueVarName + ' = ' + arrayName + '[' + keyVarName + '];' + body + '}';
                }
            }
            parentNodeInfo.terminalNode = 'foreach';
        } else if ('try' in mil) {
            node = mil['try'];
            var nodeInfo = {
                'parentNode': 'try',
                'childNode': '',
                'terminalNode' : 'try'
            };
            parentNodeInfo.childNode = 'try';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var nodeExpression = node['expression'];
                    var nodeBody = {
                        'expression': nodeExpression
                    };
                    var body = this.parse(nodeBody, nodeInfo, isKernelFunction);
                    js += 'try {' + body + '}';
                }
                if ('catch' in node) {
                    nodeInfo.parentNode = 'catch';
                    var nodeCatch = node['catch'];
                    if ('expression' in nodeCatch) {
                        var nodeExpression = nodeCatch['expression'];
                        if (Array.isArray(nodeExpression)) {
                            var _catch = '';
                            var nodeVar = {
                                'expression': nodeExpression[0]
                            };
                            var catchVar = this.parse(nodeVar, nodeInfo, isKernelFunction);
                            
                            for (var i = 1; i < nodeExpression.length; i++) {
                                var commandLine = nodeExpression[i];
                                var bodyExpression = {
                                    'expression': commandLine
                                };
                                _catch += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                            }
                        }
                        js += ' catch (' + catchVar + ') {' + _catch + '}';
                    }
                }
            }
            parentNodeInfo.terminalNode = 'try';
        } else if ('test' in mil) {
            node = mil['test'];
            var nodeInfo = {
                'parentNode': 'test',
                'childNode': '',
                'terminalNode' : 'test'
            };
            parentNodeInfo.childNode = 'test';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var nodeExpression = node['expression'];
                    if (Array.isArray(nodeExpression)) {
                        var _script = '';
                        var nodeTimes = {
                            'expression': nodeExpression[0]
                        };
                        var _times = this.parse(nodeTimes, nodeInfo, isKernelFunction);

                        var nodeValue = {
                            'expression': nodeExpression[1]
                        };
                        var _value = this.parse(nodeValue, nodeInfo, isKernelFunction);

                        var nodeTolerance = {
                            'expression': nodeExpression[2]
                        };
                        var _tolerance = this.parse(nodeTolerance, nodeInfo, isKernelFunction);
                        
                        for (var i = 3; i < nodeExpression.length; i++) {
                            var commandLine = nodeExpression[i];
                            var bodyExpression = {
                                'expression': commandLine
                            };
                            _script += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                        }
                    }
                }
                if ('catch' in node) {
                    nodeInfo.parentNode = 'catch';
                    var nodeCatch = node['catch'];
                    if ('expression' in nodeCatch) {
                        var nodeExpression = nodeCatch['expression'];
                        if (Array.isArray(nodeExpression)) {
                            var _catch = '';
                            var nodeVar = {
                                'expression': nodeExpression[0]
                            };
                            var catchVar = this.parse(nodeVar, nodeInfo, isKernelFunction);

                            for (var i = 1; i < nodeExpression.length; i++) {
                                var commandLine = nodeExpression[i];
                                var bodyExpression = {
                                    'expression': commandLine
                                };
                                _catch += this.parse(bodyExpression, nodeInfo, isKernelFunction) + ';';
                            }
                        }
                        js += 'core.testScript(' + '\'' + _script + '\',' + _times + ',' + _value + ',' + _tolerance + ',\'' + 'var ' + catchVar + ' = core.testResult.obtained;' + _catch + '\');';
                    }
                }
            }
            parentNodeInfo.terminalNode = 'test';
        } else if ('break' in mil) {
            node = mil['break'];
            var nodeInfo = {
                'parentNode': 'break',
                'childNode': '',
                'terminalNode' : 'break'
            };
            parentNodeInfo.childNode = 'break';

            if (typeof node != 'undefined') {
                js += 'break';
            }
        } else if ('continue' in mil) {
            node = mil['continue'];
            var nodeInfo = {
                'parentNode': 'continue',
                'childNode': '',
                'terminalNode' : 'continue'
            };
            parentNodeInfo.childNode = 'continue';

            if (typeof node != 'undefined') {
                js += 'continue';
            }
        } else if ('return' in mil) {
            node = mil['return'];
            var nodeInfo = {
                'parentNode': 'return',
                'childNode': '',
                'terminalNode' : 'return'
            };
            parentNodeInfo.childNode = 'return';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var returnValue = this.parse(node, nodeInfo, isKernelFunction);
                    js += 'return (' + returnValue + ')';
                } else {
                    js += 'return';
                }
            }
        } else if ('throw' in mil) {
            node = mil['throw'];
            var nodeInfo = {
                'parentNode': 'throw',
                'childNode': '',
                'terminalNode' : 'throw'
            };
            parentNodeInfo.childNode = 'throw';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var returnValue = this.parse(node, nodeInfo, isKernelFunction);
                    js += 'throw (' + returnValue + ')';
                } else {
                    js += 'throw ()';
                }
            }
        } else if ('operation' in mil) {
            node = mil['operation'];
            var nodeInfo = {
                'parentNode': 'operation',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'operation';
            
            if (typeof node != 'undefined') {
                if ('op' in node) {
                    js += this.parse(node, nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                } else {
                    if ('TOKEN' in node) {
                        var primary = node['primary'];
                        var right = this.parse(primary, nodeInfo, isKernelFunction);
                        parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                        var operator = node['TOKEN'];
                        if (isKernelFunction) {
                            js += operator + right;
                        } else {
                            js += operators[operator] + '(' + right + ')';
                        }
                    } else {
                        js += this.parse(node, nodeInfo, isKernelFunction);
                        parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    }
                }
            }
        } else if ('op' in mil) {
            node = mil['op'];
            var nodeInfo = {
                'parentNode': 'op',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'op';
            if (typeof node != 'undefined') {
                if (Array.isArray(node)) {
                    var nodeInfo = {
                        'parentNode': 'op',
                        'childNode': '',
                        'terminalNode' : ''
                    };
                    var left = this.parse(node[0], nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    var nodeInfo = {
                        'parentNode': 'op',
                        'childNode': '',
                        'terminalNode' : ''
                    };
                    if ('TOKEN' in node[1]) {
                        var operator = node[1]['TOKEN'];
                        if ((operator == '!') || (operator == '~')) {
                            if (isKernelFunction) {
                                var right = operator + this.parse(node[1], nodeInfo, isKernelFunction);
                            } else {    
                                var right = operators[operator] + '(' + this.parse(node[1], nodeInfo, isKernelFunction) + ')';
                            }
                        } else {
                            var right = this.parse(node[1], nodeInfo, isKernelFunction);
                        }
                    } else {
                        var right = this.parse(node[1], nodeInfo, isKernelFunction);
                    }
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    if ('TOKEN' in mil) {
                        var operator = mil['TOKEN'];
                        var j = 0;
                        if (Array.isArray(operator)) {
                            if (operator[j] == '=') {
                                parentNodeInfo.terminalNode = 'assignment';
                                js += left + '=' + right;
                            } else if (operator[j] == ':=') {
                                parentNodeInfo.terminalNode = 'assignment';
                                js += left + '= new ' + right;
                            } else if (operator[j] == '?=') {
                                parentNodeInfo.terminalNode = 'assignment';
                                js += left + '= await ' + right;
                            } else {
                                if (isKernelFunction) {
                                    js += left + operator[j] + right;
                                } else {    
                                    js += operators[operator[j]] + '(' + left + ',' + right + ')';
                                }
                            }
                            j++;
                            for (var i = 2; i < node.length; i++) {
                                var right = this.parse(node[i], nodeInfo, isKernelFunction);
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                                if (operator[j] == '=') {
                                    parentNodeInfo.terminalNode = 'assignment';
                                    js += '=' + right;
                                } else if (operator[j] == ':=') {
                                    parentNodeInfo.terminalNode = 'assignment';
                                    js += '= new ' + right;
                                } else if (operator[j] == '?=') {
                                    parentNodeInfo.terminalNode = 'assignment';
                                    js += '= await ' + right;
                                } else {
                                    if (isKernelFunction) {
                                        js = js + operator[j] + right;
                                    } else {    
                                        js = operators[operator[j]] + '(' + js + ',' + right + ')';
                                    }
                                }
                                j++;
                            }
                        } else {
                            if (operator == '=') {
                                parentNodeInfo.terminalNode = 'assignment';
                                js += left + '=' + right;
                            } else if (operator == ':=') {
                                parentNodeInfo.terminalNode = 'assignment';
                                js += left + '= new ' + right;
                            } else if (operator == '?=') {
                                parentNodeInfo.terminalNode = 'assignment';
                                js += left + '= await ' + right;
                            } else {
                                if (isKernelFunction) {
                                    js += left + operator + right;
                                } else {    
                                    js += operators[operator] + '(' + left + ',' + right + ')';
                                }
                            }
                        }
                    }
                } else {
                    var nodeInfo = {
                        'parentNode': 'op',
                        'childNode': '',
                        'terminalNode' : ''
                    };
                    js += this.parse(node, nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                }
            }
        } else if ('primary' in mil) {
            node = mil['primary'];
            var nodeInfo = {
                'parentNode': parentNodeInfo.childNode,
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'primary';

            if (typeof node != 'undefined') {
                if ('value' in node) {
                    var value = node['value'];
                    if ('TOKEN' in value) {
                        js = value['TOKEN'];
                    } else {
                        js = this.parse(node, nodeInfo, isKernelFunction);
                    }
                } else {
                    js = this.parse(node, nodeInfo, isKernelFunction);
                }
                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
            }
        } else if ('member' in mil) {
            node = mil['member'];
            var nodeInfo = {
                'parentNode': 'member',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'member';

            if (typeof node != 'undefined') {
                if ('identifier' in node) {
                    js += this.parse(node, nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                }
                if ('arguments' in node) {
                    var nodeArguments = {
                        'matrixIndexes': node['arguments']
                    };
                    var args = this.parse(nodeArguments, nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    var tokenType = node['TOKEN'];
                    if (typeof tokenType != 'undefined') {
                        if (tokenType.indexOf('(') != -1) {
                            js += '(' + args.replace(/;/g,',') + ')';
                        } else if (tokenType.indexOf('[') != -1) {
                            var arrayOfArgs = args.split(';');
                            if (Array.isArray(arrayOfArgs)) {
                                for (var i = 0; i < arrayOfArgs.length; i++) {
                                    js += '[' + arrayOfArgs[i] + ']';
                                }
                            } else {
                                js += '[' + arrayOfArgs + ']';
                            }
                        }
                    }
                } else {
                    var tokenType = node['TOKEN'];
                    if (typeof tokenType != 'undefined') {
                        if (tokenType.indexOf('(') != -1) {
                            js += '()';
                        } else if (tokenType.indexOf('[') != -1) {
                            js += '[]';
                        }
                    }
                }
            }
        } else if ('identifier' in mil) {
            node = mil['identifier'];
            var nodeInfo = {
                'parentNode': 'identifier',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'identifier';
            parentNodeInfo.terminalNode = 'identifier';

            if (typeof node != 'undefined') {
                if (Array.isArray(node)) {
                    for (var i = 0; i < node.length; i++) {
                        if (i < (node.length - 1)) {
                            js += node[i] + '.';
                        } else {
                            js += node[i];
                        }
                    }
                } else {
                    js = node;
                }
            }
        } else if ('arguments' in mil) {
            node = mil['arguments'];
            var nodeInfo = {
                'parentNode': 'arguments',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'arguments';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var nodeExpression = node['expression'];
                    if (Array.isArray(nodeExpression)) {
                        for (var i = 0; i < nodeExpression.length; i++) {
                            if (i < (nodeExpression.length - 1)) {
                                js += this.parse(nodeExpression[i], nodeInfo, isKernelFunction) + ',';
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                            } else {
                                js += this.parse(nodeExpression[i], nodeInfo, isKernelFunction);
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                            }
                        }
                    } else {
                        js += this.parse(nodeExpression, nodeInfo, isKernelFunction);
                        parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    }
                }
            } else {
                js = node;
            }
        } else if ('matrixIndexes' in mil) {
            node = mil['matrixIndexes'];
            var nodeInfo = {
                'parentNode': 'arguments',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'arguments';

            if (typeof node != 'undefined') {
                if ('expression' in node) {
                    var nodeExpression = node['expression'];
                    if (Array.isArray(nodeExpression)) {
                        for (var i = 0; i < nodeExpression.length; i++) {
                            if (i < (nodeExpression.length - 1)) {
                                js += this.parse(nodeExpression[i], nodeInfo, isKernelFunction) + ';';
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                            } else {
                                js += this.parse(nodeExpression[i], nodeInfo, isKernelFunction);
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                            }
                        }
                    } else {
                        js += this.parse(nodeExpression, nodeInfo, isKernelFunction);
                        parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    }
                }
            } else {
                js = node;
            }
        } else if ('value' in mil) {
            node = mil['value'];
            var nodeInfo = {
                'parentNode': 'value',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'value';

            if (typeof node != 'undefined') {
                js = this.parse(node, nodeInfo, isKernelFunction);
                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
            }
        } else if ('real' in mil) {
            node = mil['real'];
            var nodeInfo = {
                'parentNode': 'real',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'real';
            parentNodeInfo.terminalNode = 'real';

            if (typeof node == 'string') {
                js = node;
            }
        } else if ('complex' in mil) {
            node = mil['complex'];
            var nodeInfo = {
                'parentNode': 'complex',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'complex';
            parentNodeInfo.terminalNode = 'complex';

            if (typeof node == 'string') {
                js = this.parseComplexNumber(node);
            }
        } else if ('string' in mil) {
            node = mil['string'];
            var nodeInfo = {
                'parentNode': 'string',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'string';
            parentNodeInfo.terminalNode = 'string';

            if (typeof node == 'string') {
                js += node;
            }
        } else if ('array' in mil) {
            node = mil['array'];
            var nodeInfo = {
                'parentNode': 'array',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'array';

            if (typeof node != 'undefined') {
                if ('element' in node) {
                    var nodeElements = node['element'];
                    js += '{';
                    if (Array.isArray(nodeElements)) {
                        for (var i = 0; i < nodeElements.length; i++) {
                            var nodeElement = {
                                'element': nodeElements[i]
                            };
                            if (i < (nodeElements.length - 1)) {
                                js += this.parse(nodeElement, nodeInfo, isKernelFunction) + ',';
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                            } else {
                                js += this.parse(nodeElement, nodeInfo, isKernelFunction);
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                            }
                        }
                    } else {
                        var nodeElement = {
                            'element': nodeElements
                        };
                        js += this.parse(nodeElement, nodeInfo, isKernelFunction);
                        parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    }
                }
                js += '}';
                parentNodeInfo.terminalNode = 'array';
            }
        } else if ('element' in mil) {
            node = mil['element'];
            var nodeInfo = {
                'parentNode': 'element',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'element';

            if (typeof node != 'undefined') {
                if ('key' in node) {
                    var key = node['key'];
                    js += key['string'] + ': ';
                }
                if ('expression' in node) {
                    var nodeExpression = {
                        'expression': node['expression']
                    };
                    var expression = this.parse(nodeExpression, nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    js += expression;
                }
            }
        } else if ('matrix' in mil) {
            node = mil['matrix'];
            var nodeInfo = {
                'parentNode': 'matrix',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'matrix';

            if (typeof node != 'undefined') {
                if ('row' in node) {
                    var nodeRows = node['row'];
                    if (Array.isArray(nodeRows)) {
                        js += '[';
                        for (var i = 0; i < nodeRows.length; i++) {
                            var nodeRow = {
                                'row': nodeRows[i]
                            }
                            if (i < (nodeRows.length - 1)) {
                                js += this.parse(nodeRow, nodeInfo, isKernelFunction) + ',';
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                            } else {
                                js += this.parse(nodeRow, nodeInfo, isKernelFunction);
                                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                            }
                        }
                        js += ']';
                    } else {
                        var nodeRow = {
                            'row': nodeRows
                        }
                        js += this.parse(nodeRow, nodeInfo, isKernelFunction);
                        parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                    }
                } else {
                    js += '[]';
                }
            }
        } else if ('row' in mil) {
            node = mil['row'];
            var nodeInfo = {
                'parentNode': 'row',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'row';

            if (typeof node != 'undefined') {
                js += '[';
                if (Array.isArray(node)) {
                    for (var i = 0; i < node.length; i++) {
                        if (i < (node.length - 1)) {
                            js += this.parse(node[i], nodeInfo, isKernelFunction) + ',';
                            parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                        } else {
                            js += this.parse(node[i], nodeInfo, isKernelFunction);
                            parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                        }
                    }
                } else {
                    js += this.parse(node, nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                }
                js += ']';
            }
        } else if ('column' in mil) {
            node = mil['column'];
            var nodeInfo = {
                'parentNode': 'column',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'column';

            if (typeof node != 'undefined') {
                if (Array.isArray(node)) {
                    for (var i = 0; i < node.length; i++) {
                        if (i < (node.length - 1)) {
                            js += this.parse(node[i], nodeInfo, isKernelFunction) + ',';
                            parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                        } else {
                            js += this.parse(node[i], nodeInfo, isKernelFunction);
                            parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                        }
                    }
                } else {
                    js += this.parse(node, nodeInfo, isKernelFunction);
                    parentNodeInfo.terminalNode = nodeInfo.terminalNode;
                }
            }
        } else if ('parenthesizedExpression' in mil) {
            node = mil['parenthesizedExpression'];
            var nodeInfo = {
                'parentNode': 'parenthesizedExpression',
                'childNode': '',
                'terminalNode' : ''
            };
            parentNodeInfo.childNode = 'parenthesizedExpression';

            if (typeof node != 'undefined') {
                js = '(' + this.parse(node, nodeInfo, isKernelFunction) + ')';
                parentNodeInfo.terminalNode = nodeInfo.terminalNode;
            };
        } else if ('comment' in mil) {
            node = mil['comment'];
            parentNodeInfo.childNode = 'comment';
            parentNodeInfo.terminalNode = 'comment';
            js = '';
        } else if ('TOKEN' in mil) {
            js = '';
        }

        return js;
    }

    /**
     * Compiles the MaiaScript XML tree for JavaScript.
     * @param {xml}      xml - The XML data.
     * @return {string}  XML data converted to JavaScript.
     */
    this.compile = function(xml) {
        var nodeInfo = {
            'parentNode': '',
            'childNode': 'maiascript',
            'terminalNode' : ''
        };

        var mil = {};
        var js = "";

        mil = this.xmlToMil(xml);
        js = this.parse(mil, nodeInfo);
        
        return js;
    }
}
