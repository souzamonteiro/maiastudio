/**
 * @license
 * Copyright 2020 Roberto Luiz Souza Monteiro,
 *                Renata Souza Barreto,
 *                Hernane Borges de Barros Pereira.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at;
 *
 *   http://www.apache.org/licenses/LICENSE-2.0;
 *
 * Unless required by applicable law or agreed to in writing, software;
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, eitherMath.express or implied.
 * See the License for the specific language governing permissions and;
 * limitations under the License.
 */

 /*
  * The cursor positioning functions, getCursorPosition and setCursorPosition 
  * were based on the CodeJar library positioning code:
  * https://github.com/antonmedv/codejar.git
  */
 
/**
 * MaiaScript console.
 * @class
 * @param {string}   container - HTML element to setup as a terminal.
 * @param {string}   language - Programming language to highlight the syntax.
 * @param {object}   callBack - Callback function to call after press [Enter].
 * @param {object}   options - Object containing options for configuring the console.
 * @return {object}  Element configured as a terminal.
 */
function MaiaConsole(container, language, callBack, options) {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
    }

    var opts = {
        'greetingMessage': '',
        'promptMessage': '>'
    }
    
    if (typeof options != 'undefined') {
        for (key in options) {
            opts[key] = options[key];
        }
    }

    var maiaterminal = this;
    
    // History for undo and redo operations. 
    var terminalHistory = [];
    var terminalHistoryBackup = [];

    // History for undo and redo operations. 
    var commandHistory = [];
    var commandHistoryPosition = -1;
    
    // Element that will contain the terminal.
    var terminalContainer = document.getElementById(container);
    var language = language;
    
    // Gets the code in the container.
    var code = terminalContainer.textContent || '';
    terminalContainer.textContent = '';
    // Creates the line number bar.
    var terminalMargin = document.createElement('pre');
    terminalContainer.appendChild(terminalMargin);
    // Creates the terminal.
    var terminal = document.createElement('pre');
    terminalContainer.appendChild(terminal);

    var terminalCallBack;
    if (typeof callBack != 'undefined') {
        terminalCallBack = callBack;
    }

    // Place the prompt to the left of the terminal.
    terminalMargin.style.setProperty('mix-blend-mode', 'difference');
    terminalMargin.style.float = 'left';
    terminalMargin.style.width = '5%';
    terminalMargin.style.outline = 'none';
    terminalMargin.style.resize = 'none';
    terminalMargin.style.textAlign = 'right';
    
    // Sets the element's properties so that it can act as a code terminal.
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        var contentEditable = 'true';
    } else {
        var contentEditable = 'plaintext-only';
    }
    terminal.setAttribute('contentEditable', contentEditable);
    terminal.setAttribute('spellcheck', 'false');
    terminal.style.float = 'right';
    terminal.style.width = '95%';
    terminal.style.outline = 'none';
    terminal.style.resize = 'none';
    terminal.style.textAlign = 'left';

    /**
     * Add an item to the command history.
     * @param {string}   text - Item to add to the command history.
     * @return {number}  The number of the item added to command history.
     */
    this.addToHistory = function(text) {
        commandHistoryPosition = -1;
        commandHistory.unshift(text.trim());
        return commandHistory.length - 1;
    }
    
    /**
     * Clear the command history.
     * @return  The command history cleared.
     */
    this.clearHistory = function() {
        commandHistory = [];
        commandHistoryPosition = -1;
    }

    /**
     * Set the command history.
     * @param {object}  cmdhistory - The new content of the history.
     * @return          The contents of the history are set.
     */
    this.setHistory = function(cmdhistory) {
        commandHistory = cmdhistory.slice();
        commandHistoryPosition = -1;
    }

    /**
     * Returns the contents of the command history.
     * @return {object}  The contents of the command history.
     */
    this.getHistory = function() {
        return commandHistory;
    }

    /**
     * Returns the next item in the command history.
     * @return {object}  The next item in the command history.
     */
    this.getNextHistoryItem = function() {
        var res;
        if (commandHistoryPosition < commandHistory.length - 1) {
            commandHistoryPosition++;
            res = commandHistory[commandHistoryPosition];
        }
        return res;
    }

    /**
     * Returns the previous item in the command history.
     * @return {object}  The previous item in the command history.
     */
    this.getPreviousHistoryItem = function() {
        var res;
        if (commandHistoryPosition > -1) {
            commandHistoryPosition--;
            res = commandHistory[commandHistoryPosition];
        }
        return res;
    }

    /**
     * Gets the terminal's text.
     * @return {string}  The text in the terminal.
     */
    this.getText = function() {
        return terminal.textContent;
    }

    /**
     * Gets the text of the line before the cursor.
     * @return {string}  The text of the line where the cursor is.
     */
    this.getTextBeforeCursor = function() {
        // Gets the cursor position.
        var sel = window.getSelection();
        var rangeAtCursor = sel.getRangeAt(0);

        // Gets the text to the left of the cursor.
        var rangeLeft = document.createRange();
        rangeLeft.selectNodeContents(terminal);
        rangeLeft.setEnd(rangeAtCursor.startContainer, rangeAtCursor.startOffset);
        var textBeforeCursor = rangeLeft.toString();

        // Find the begin of previous line.
        var i = textBeforeCursor.length - 1;
        if (textBeforeCursor[i] == '\n') {
            i--;
        }
        while ((i >= 0) && (textBeforeCursor[i] != '\n')) {
            i--;
        }
        i++;
        
        var textAtCursor = textBeforeCursor.substr(i, textBeforeCursor.length);
        return textAtCursor;
    }

    /**
     * Gets the text of the line after the cursor.
     * @return {string}  The text of the line where the cursor is.
     */
    this.getTextAfterCursor = function() {
        // Gets the cursor position.
        var sel = window.getSelection();
        var rangeAtCursor = sel.getRangeAt(0);

        // Gets the text to the right of the cursor.
        var rangeRight = document.createRange();
        rangeRight.selectNodeContents(terminal);
        rangeRight.setStart(rangeAtCursor.endContainer, rangeAtCursor.endOffset);
        var textAfterCursor = rangeRight.toString();

        var textAtCursor = textAfterCursor;
        return textAtCursor;
    }

    /**
     * Gets the text of the line where the cursor is.
     * @return {string}  The text of the line where the cursor is.
     */
    this.getTextAtCursor = function() {
        var textAtCursor = this.getTextBeforeCursor() + this.getTextAfterCursor();
        return textAtCursor;
    }

    /**
     * Gets the terminal's text.
     * @return {string}  The text in the terminal.
     */
    this.getHtml = function() {
        return terminal.innerHTML;
    }

    /**
     * Sets the terminal's text.
     * @param {string}  text - Text to be set in the terminal.
     * @return          The text in the terminal is set.
     */
    this.setText = function(text) {
        terminal.textContent = text;
        this.highlightCode(terminal);
        this.moveCursorToEnd();
    }

    /**
     * Appends text in terminal.
     * @param {string}  text - Text to be set in the terminal.
     * @return          The text is appended to terminal.
     */
    this.appendText = function(text) {
        if (typeof text != 'undefined') {
            document.execCommand('insertHTML', false, text);
            this.moveCursorToEnd();
        }
    }

    /**
     * Visits each of the text nodes in an object.
     * @param {object}  terminal - Terminal object.
     * @param {object}  visitor - Visiting object.
     * @return {number}  The current position of the cursor.
     */
    function visitElement(terminal, visitor) {
        var queue = [];
        if (terminal.firstChild) {
            queue.push(terminal.firstChild);
        }
        var element = queue.pop();
        while (element) {
            if (visitor(element) === 'stop') {
                break;
            }
            if (element.nextSibling) {
                queue.push(element.nextSibling);
            }
            if (element.firstChild) {
                queue.push(element.firstChild);
            }
            element = queue.pop();
        }
    }

    /**
     * Gets the current position of the cursor.
     * @return {number}  The current position of the cursor.
     */
    this.getCursorPosition = function() {
        var sel = window.getSelection();
        var position = {'start': 0, 'end': 0, 'dir': 'undefined'};
        visitElement(terminal, element => {
            if (element === sel.anchorNode && element === sel.focusNode) {
                position.start += sel.anchorOffset;
                position.end += sel.focusOffset;
                position.dir = sel.anchorOffset <= sel.focusOffset ? 'ltr' : 'rtl';
                return 'stop';
            }
            if (element === sel.anchorNode) {
                position.start += sel.anchorOffset;
                if (!position.dir) {
                    position.dir = 'ltr';
                } else {
                    return 'stop';
                }
            }
            else if (element === sel.focusNode) {
                position.end += sel.focusOffset;
                if (!position.dir) {
                    position.dir = 'rtl';
                }
                else {
                    return 'stop';
                }
            }
            if (element.nodeType === Node.TEXT_NODE) {
                if (position.dir != 'ltr') {
                    position.start += element.nodeValue.length;
                }
                if (position.dir != 'rtl') {
                    position.end += element.nodeValue.length;
                }
            }
        });
        return position;
    }

    /**
     * Sets the cursor position.
     * @param {object}  position - The cursor position.
     * @return          The current position of the cursor is set.
     */
    this.setCursorPosition = function(position) {
        var sel = window.getSelection();
        var startNode, startOffset = 0;
        var endNode, endOffset = 0;
        if (!position.dir) {
            position.dir = 'ltr';
        }
        if (position.start < 0) {
            position.start = 0;
        }
        if (position.end < 0) {
            position.end = 0;
        }
        // Flip start and end if the direction reversed
        if (position.dir == 'rtl') {
            const { start, end } = position;
            position.start = end;
            position.end = start;
        }
        var current = 0;
        visitElement(terminal, element => {
            if (element.nodeType !== Node.TEXT_NODE) {
                return;
            }
            var len = (element.nodeValue || '').length;
            if (current + len >= position.start) {
                if (!startNode) {
                    startNode = element;
                    startOffset = position.start - current;
                }
                if (current + len >= position.end) {
                    endNode = element;
                    endOffset = position.end - current;
                    return 'stop';
                }
            }
            current += len;
        });
        // If everything deleted place cursor at terminal
        if (!startNode)
            startNode = terminal;
        if (!endNode)
            endNode = terminal;
        // Flip back the selection
        if (position.dir == 'rtl') {
            [startNode, startOffset, endNode, endOffset] = [endNode, endOffset, startNode, startOffset];
        }
        sel.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    }

    /**
     * Moves the cursor to the end of the text in the element.
     * @return  The cursor at the end of the text in the element.
     */
    this.moveCursorToEnd = function() {
        var pos = {'start': terminal.innerText.length, 'end': terminal.innerText.length, 'dir': 'undefined'};
        this.setCursorPosition(pos);
    }

    /**
     * Selects the line where the cursor is.
     * @return  The line where the cursor is, is selected.
     */
    this.selectLineAtCursor = function() {
        // Gets the cursor position.
        var pos = this.getCursorPosition();
        var sel = window.getSelection();
        var rangeAtCursor = sel.getRangeAt(0);

        // Gets the text to the left of the cursor.
        var rangeLeft = document.createRange();
        rangeLeft.selectNodeContents(terminal);
        rangeLeft.setEnd(rangeAtCursor.startContainer, rangeAtCursor.startOffset);
        var textBeforeCursor = rangeLeft.toString();

        // Find the begin of previous line.
        var i = textBeforeCursor.length - 1;
        if (textBeforeCursor[i] == '\n') {
            i--;
        }
        while ((i >= 0) && (textBeforeCursor[i] != '\n')) {
            i--;
        }
        i++;

        // Calculates the offset for the beginning of this line.
        var offset = textBeforeCursor.length - i;
        pos.start = pos.start - offset;
        // Sets the range start to the begin of the line.
        this.setCursorPosition(pos);
    }

    /**
     * Returns the selected text.
     * @return {string}  The selected text.
     */
    this.getSelectedText = function() {
        var res;
        if (window.getSelection) {
            res = window.getSelection().toString();
        }
        return res;
    }

    /**
     * Replaces the selected text with one provided as a parameter.
     * @param {string}  text - Text provided.
     * @return          The selected text replaced.
     */
    this.replaceSelectedText = function(text) {
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        } else if (document.selection && document.selection.createRange) {
            range = document.selection.createRange();
            range.text = text;
        }
    }

    /**
     * Copy the selected text to clipboard.
     * @return  The selected text copied to clipboard.
     */
    this.copySelection = function() {
        try {
            this.saveTerminalContent(terminal);
            document.execCommand('copy')
            this.highlightCode(terminal);
        } catch (e) {
            alert('This browser does not support copy from JavaScript code.');
        }
    }

    /**
     * Cut the selected text from clipboard.
     * @return  The selected text cuted from clipboard.
     */
    this.cutSelection = function() {
        try {
            this.saveTerminalContent(terminal);
            document.execCommand('cut')
            this.highlightCode(terminal);
        } catch (e) {
            alert('This browser does not support cut from JavaScript code.');
        }
    }

    /**
     * Paste the selected text to clipboard.
     * @return  The selected text pasted to clipboard.
     */
    this.pasteSelection = function() {
        try {
            document.execCommand('paste')
            this.highlightCode(terminal);
        } catch (e) {
            alert('This browser does not support past from JavaScript code.');
        }
    }

    /**
     * Highlights the code syntax in the terminal.
     * @param {object}  element - Element to do code syntax highlighte.
     * @return          The content of the terminal is Highlighted.
     */
    this.highlightCode = function(element) {
        if (typeof element == 'undefined') {
            var thisTerminal = terminal;
        } else {
            var thisTerminal = element;
        }
        // Gets the code in the terminal.
        var code = thisTerminal.textContent || '';
        // Saves the cursor position.
        var position = this.getCursorPosition();
        // Highlights the code syntax in the terminal.
        thisTerminal.innerHTML = Prism.highlight(code, Prism.languages[language], language);
        // Restores the cursor position.
        this.setCursorPosition(position);
        // Displays the prompt.
        var numberOfLines = code.split(/\r\n|\r|\n/).length + (code.endsWith('\r') || code.endsWith('\n') ? 0 : 1);
        var text = '';
        for (var i = 1; i < numberOfLines; i++) {
            text += opts.promptMessage + '\r\n';
        }
        terminalMargin.innerText = text;
    }

    /**
     * Saves the current content of the terminal.
     * @param {object}  element - Element where to save content.
     * @return          The current content of the terminal is saved.
     */
    this.saveTerminalContent = function(element) {
        if (typeof element == 'undefined') {
            var element = terminal;
        }
        // Place the previous contents on the stack.
        if (terminalHistory.length >= 3) {
            terminalHistory.shift();
            terminalHistoryBackup.shift();
        }
        terminalHistory.push(element.textContent);
    }

    /**
     * Restores the terminal's previous content.
     * @param {object}  element - Element where to restore content.
     * @return          The terminal's previous content is restored.
     */
    this.restoreTerminalContent = function(element) {
        // Removes the previous contents from the stack.
        var lastContent = terminalHistory.pop();
        // Place the previous contents on the backup stack.
        terminalHistoryBackup.push(lastContent);
        // Restores the content.
        terminal.textContent = lastContent ? lastContent : terminal.textContent;
        // Highlights the code syntax in the terminal.
        this.highlightCode(element);
    }

    /**
     * Undo previous restores command.
     * @param {object}  element - Element where to restore content.
     * @return          The terminal's previous content is restored.
     */
    this.undoRestoreTerminalContent = function(element) {
        if (typeof element == 'undefined') {
            var element = terminal;
        }
        // Removes the previous contents from the backup stack.
        var lastContent = terminalHistoryBackup.pop();
        // Place the previous contents on the stack.
        terminalHistory.push(lastContent);
        // Restores the content.
        terminal.textContent = lastContent ? lastContent : terminal.textContent;
        // Highlights the code syntax in the terminal.
        this.highlightCode(element);
    }

    // It is necessary to update the HTML content of the element, whenever a key is pressed,
    // in order to keep the syntax coloring consistent.
    terminal.addEventListener('keydown', function(event) {
        if (((!event.shiftKey && event.ctrlKey) || (!event.shiftKey && event.metaKey)) && ((event.key == 'Z') || (event.key == 'z'))) {
            maiaterminal.restoreTerminalContent(maiaterminal.terminal);
        } else if (((event.shiftKey && event.ctrlKey) || (event.shiftKey && event.metaKey)) && ((event.key == 'Z') || (event.key == 'z'))) {
            maiaterminal.undoRestoreTerminalContent(maiaterminal.terminal);
        } else {
            var openChars = {'{': '}', '[': ']', '(': ')'};
            if (event.key == 'Enter') {
                //event.preventDefault();
                // Gets the text to the left of the cursor.
                var textAtCursor = maiaterminal.getTextAtCursor();
                if (textAtCursor.trim() == 'clear') {
                    if (opts.greetingMessage.length > 0) {
                        maiaterminal.setText(opts.greetingMessage);
                    } else {
                        maiaterminal.setText('');
                    }
                } else {
                    maiaterminal.addToHistory(textAtCursor);
                    maiaterminal.moveCursorToEnd();
                    if (typeof callBack != 'undefined') {
                        terminalCallBack();
                    }
                }
            } else if (event.key == 'ArrowUp') {
                event.preventDefault();
                var historyItem = maiaterminal.getNextHistoryItem();
                if (historyItem) {
                    maiaterminal.moveCursorToEnd();
                    maiaterminal.selectLineAtCursor();
                    maiaterminal.replaceSelectedText(historyItem);
                    maiaterminal.moveCursorToEnd();
                }
            } else if (event.key == 'ArrowDown') {
                event.preventDefault();
                var historyItem = maiaterminal.getPreviousHistoryItem();
                if (historyItem) {
                    maiaterminal.moveCursorToEnd();
                    maiaterminal.selectLineAtCursor();
                    maiaterminal.replaceSelectedText(historyItem);
                    maiaterminal.moveCursorToEnd();
                }
            } else if (event.key in openChars) {
                var pos = maiaterminal.getCursorPosition();
                event.preventDefault();
                document.execCommand('insertHTML', false, event.key + openChars[event.key]);
                pos.start = ++pos.end;
                maiaterminal.setCursorPosition(pos);
            }
            maiaterminal.saveTerminalContent(maiaterminal.terminal);
        }
    }, false);

    // It is necessary to update the HTML content of the element, whenever a key is pressed,
    // in order to keep the syntax coloring consistent.
    terminal.addEventListener('input', function(event) {
        if (event.defaultPrevented) {
            return;
        }
        if (event.isComposing) {
            return;
        }
        // Highlights the code syntax in the terminal.
        maiaterminal.highlightCode(maiaterminal.terminal);
    }, false);
    // Transfer the text from the container to the terminal.
    if (opts.greetingMessage.length > 0) {
        this.setText(opts.greetingMessage + '\r\n' + code);
    } else {
        this.setText(code);
    }
    // Highlights the code syntax in the terminal.
    this.highlightCode(terminal);
    this.moveCursorToEnd();
}