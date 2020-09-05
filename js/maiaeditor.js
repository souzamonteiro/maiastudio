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
 * MaiaScript code editor.
 * @class
 * @param {string}   container - HTML element to setup as an editor.
 * @param {string}   language - Programming language to highlight the syntax.
 * @param {object}   options - Object containing options for configuring the editor.
 * @return {object}  Element configured as source code editor.
 */
function MaiaEditor(container, language, options) {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
    }

    var opts = {
        'indentChars': '    ',
        'commentChars': '//'
    }
    
    if (typeof options != 'undefined') {
        for (key in options) {
            opts[key] = options[key];
        }
    }

    var maiaeditor = this;
    
    // History for undo and redo operations. 
    var editorHistory = [];
    var editorHistoryBackup = [];

    // Element that will contain the editor.
    var editorContainer = document.getElementById(container);
    var language = language;
    
    // Gets the code in the container.
    var code = editorContainer.textContent || '';
    editorContainer.textContent = '';
    // Creates the line number bar.
    var lineNumbers = document.createElement('pre');
    editorContainer.appendChild(lineNumbers);
    // Creates the editor.
    var editor = document.createElement('pre');
    editorContainer.appendChild(editor);
    
    // Place the line number bar to the left of the editor.
    lineNumbers.style.setProperty('mix-blend-mode', 'difference');
    lineNumbers.style.float = 'left';
    lineNumbers.style.width = '5%';
    lineNumbers.style.outline = 'none';
    lineNumbers.style.resize = 'none';
    lineNumbers.style.textAlign = 'right';
    
    // Sets the element's properties so that it can act as a code editor.
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        var contentEditable = 'true';
    } else {
        var contentEditable = 'plaintext-only';
    }
    editor.setAttribute('contentEditable', contentEditable);
    editor.setAttribute('spellcheck', 'false');
    editor.style.float = 'right';
    editor.style.width = '95%';
    editor.style.outline = 'none';
    editor.style.resize = 'none';
    editor.style.textAlign = 'left';

    /**
     * Gets the editor's text.
     * @return {string}  The text in the editor.
     */
    this.getText = function() {
        return editor.textContent;
    }

    /**
     * Gets the editor's text.
     * @return {string}  The text in the editor.
     */
    this.getHtml = function() {
        return editor.innerHTML;
    }

    /**
     * Sets the editor's text.
     * @param {string}  text - Text to be set in the editor.
     * @return          The text in the editor is set.
     */
    this.setText = function(text) {
        editor.textContent = text;
        this.highlightCode(editor);
    }

    /**
     * Replaces text in the editor, based on a regular expression.
     * @param {string}   pattern - Search pattern (regular expression).
     * @param {string}   text - Substitute text.
     * @param {boolear}  flags - Regular expression flags (g, i, m, u, y).
     * @return           Pattern occurrences replaced.
     */
    this.regSub = function(pattern, text, flags) {
        this.saveEditorContent(editor);
        if (typeof flags == 'undefined') {
            var flags = 'i';
        }
        var oldText = this.getText();
        var regex = core.regExp(pattern, flags);
        var newText = oldText.replace(regex, text);
        this.setText(newText);
    }

    /**
     * Gets the indexes of all occurrences of a pattern in text.
     * @param {string}   pattern - Search pattern.
     * @param {string}   text - Text where to look for the pattern.
     * @param {boolear}  caseSensitive - True if case sensitive. False, otherwise.
     * @return {object}  All occurrences of a pattern in text. 
     */
    this.getIndicesOf = function(pattern, text, caseSensitive) {
        if (typeof caseSensitive == 'undefined') {
            var caseSensitive = false;
        }
        var patternLen = pattern.length;
        if (patternLen == 0) {
            return [];
        }
        var startIndex = 0;
        var index;
        var indices = [];
        if (!caseSensitive) {
            text = text.toLowerCase();
            pattern = pattern.toLowerCase();
        }
        while ((index = text.indexOf(pattern, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + patternLen;
        }
        return indices;
    }

    /**
     * Search and highlight text in the editor.
     * @param {string}   text - Search pattern.
     * @param {boolear}  caseSensitive - True if case sensitive. False, otherwise.
     * @return           Pattern occurrence highlighted.
     */
    this.search = function(text, caseSensitive) {
        if (typeof caseSensitive == 'undefined') {
            var caseSensitive = false;
        }
        var innerHTML = editor.innerHTML;
        var highlightedHTML = '';
        var indices = this.getIndicesOf(text, innerHTML, caseSensitive);
        if (indices.length > 0) { 
            var firstIndex = 0;
            for (var i = 0; i < indices.length; i++) {
                highlightedHTML += innerHTML.substring(firstIndex, indices[i]) + '<span style="background-color: yellow;">' + innerHTML.substring(indices[i], indices[i] + text.length) + '</span>';
                firstIndex = indices[i] + text.length;
            }
            highlightedHTML += innerHTML.substring(indices[i] + text.length)
            editor.innerHTML = highlightedHTML;
        }
    }

    /**
     * Visits each of the text nodes in an object.
     * @param {object}  editor - Editor object.
     * @param {object}  visitor - Visiting object.
     * @return {number}  The current position of the cursor.
     */
    function visitElement(editor, visitor) {
        var queue = [];
        if (editor.firstChild) {
            queue.push(editor.firstChild);
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
        visitElement(editor, element => {
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
        visitElement(editor, element => {
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
        // If everything deleted place cursor at editor
        if (!startNode)
            startNode = editor;
        if (!endNode)
            endNode = editor;
        // Flip back the selection
        if (position.dir == '<-') {
            [startNode, startOffset, endNode, endOffset] = [endNode, endOffset, startNode, startOffset];
        }
        sel.setBaseAndExtent(startNode, startOffset, endNode, endOffset);
    }

    /**
     * Highlights the code syntax in the editor.
     * @param {object}   element - Element to do code syntax highlighte.
     * @return           The content of the editor is Highlighted.
     */
    this.highlightCode = function(element) {
        if (typeof element == 'undefined') {
            var thisEditor = editor;
        } else {
            var thisEditor = element;
        }
        
        // Gets the code in the editor.
        var code = thisEditor.textContent || '';
        // Saves the cursor position.
        var position = this.getCursorPosition();
        // Highlights the code syntax in the editor.
        thisEditor.innerHTML = Prism.highlight(code, Prism.languages[language], language);
        // Restores the cursor position.
        this.setCursorPosition(position);
        // Displays line numbers.
        var numberOfLines = code.split(/\r\n|\r|\n/).length + (code.endsWith('\r') || code.endsWith('\n') ? 0 : 1);
        var text = '';
        for (var i = 1; i < numberOfLines; i++) {
            text += `${i} \r\n`;
        }
        lineNumbers.innerText = text;
    }

    /**
     * Saves the current content of the editor.
     * @param {object}  element - Element where to save content.
     * @return          The current content of the editor is saved.
     */
    this.saveEditorContent = function(element) {
        if (typeof element == 'undefined') {
            var element = editor;
        }
        // Place the previous contents on the stack.
        if (editorHistory.length >= 3) {
            editorHistory.shift();
            editorHistoryBackup.shift();
        }
        editorHistory.push(element.textContent);
    }

    /**
     * Restores the editor's previous content.
     * @param {object}  element - Element where to restore content.
     * @return          The editor's previous content is restored.
     */
    this.restoreEditorContent = function(element) {
        // Removes the previous contents from the stack.
        var lastContent = editorHistory.pop();
        // Place the previous contents on the backup stack.
        editorHistoryBackup.push(lastContent);
        // Restores the content.
        editor.textContent = lastContent ? lastContent : editor.textContent;
        // Highlights the code syntax in the editor.
        this.highlightCode(element);
    }

    /**
     * Undo previous restores command.
     * @param {object}  element - Element where to restore content.
     * @return          The editor's previous content is restored.
     */
    this.undoRestoreEditorContent = function(element) {
        if (typeof element == 'undefined') {
            var element = editor;
        }
        // Removes the previous contents from the backup stack.
        var lastContent = editorHistoryBackup.pop();
        // Place the previous contents on the stack.
        editorHistory.push(lastContent);
        // Restores the content.
        editor.textContent = lastContent ? lastContent : editor.textContent;
        // Highlights the code syntax in the editor.
        this.highlightCode(element);
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
     * Indents the selected text.
     * @param {object}  element - Element where the selection is.
     * @return          The selected text indented.
     */
    this.indentSelection = function(element) {
        if (typeof element == 'undefined') {
            var element = editor;
        }
        var text = this.getSelectedText();
        if (typeof text == 'string') {
            this.saveEditorContent(editor);
            var textLines = text.split(/\r\n|\r|\n/);
            var newText = '';
            if (Array.isArray(textLines)) {
                for (var i = 0; i < textLines.length; i++) {
                    newText += opts.indentChars + textLines[i] + (i < textLines.length - 1 ? '\r\n' : '');
                }
                this.replaceSelectedText(newText);
            }
        }
    }

    /**
     * Unindents the selected text.
     * @param {object}  element - Element where the selection is.
     * @return          The selected text unindented.
     */
    this.unindentSelection = function(element) {
        if (typeof element == 'undefined') {
            var element = editor;
        }
        var text = this.getSelectedText();
        if (typeof text == 'string') {
            var textLines = text.split(/\r\n|\r|\n/);
            var newText = '';
            if (Array.isArray(textLines)) {
                this.saveEditorContent(editor);
                for (var i = 0; i < textLines.length; i++) {
                    newText += textLines[i].replace(opts.indentChars, '') + (i < textLines.length - 1 ? '\r\n' : '');
                }
                this.replaceSelectedText(newText);
            }
        }
    }

    /**
     * Comments the selected text.
     * @param {object}  element - Element where the selection is.
     * @return          The selected text commented.
     */
    this.commentSelection = function(element) {
        if (typeof element == 'undefined') {
            var element = editor;
        }
        // Get the selected text.
        var text = this.getSelectedText();
        if (typeof text == 'string') {
            this.saveEditorContent(editor);
            var textLines = text.split(/\r\n|\r|\n/);
            var newText = '';
            if (Array.isArray(textLines)) {
                for (var i = 0; i < textLines.length; i++) {
                    newText += opts.commentChars + textLines[i] + (i < textLines.length - 1 ? '\r\n' : '');
                }
                this.replaceSelectedText(newText);
            }
        }
    }

    /**
     * Uncomments the selected text.
     * @param {object}  element - Element where the selection is.
     * @return          The selected text uncommented.
     */
    this.uncommentSelection = function(element) {
        if (typeof element == 'undefined') {
            var element = editor;
        }
        // Get the selected text.
        var text = this.getSelectedText();
        if (typeof text == 'string') {
            this.saveEditorContent(editor);
            var textLines = text.split(/\r\n|\r|\n/);
            var newText = '';
            if (Array.isArray(textLines)) {
                for (var i = 0; i < textLines.length; i++) {
                    newText += textLines[i].replace(opts.commentChars, '') + (i < textLines.length - 1 ? '\r\n' : '');
                }
                this.replaceSelectedText(newText);
            }
        }
    }

    /**
     * Copy the selected text to clipboard.
     * @return  The selected text copied to clipboard.
     */
    this.copySelection = function() {
        try {
            this.saveEditorContent(editor);
            document.execCommand('copy')
            this.highlightCode(editor);
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
            this.saveEditorContent(editor);
            document.execCommand('cut')
            this.highlightCode(editor);
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
            this.highlightCode(editor);
        } catch (e) {
            alert('This browser does not support past from JavaScript code.');
        }
    }

    // It is necessary to update the HTML content of the element, whenever a key is pressed,
    // in order to keep the syntax coloring consistent.
    editor.addEventListener('keydown', function(event) {
        if (((!event.shiftKey && event.ctrlKey) || (!event.shiftKey && event.metaKey)) && ((event.key == 'Z') || (event.key == 'z'))) {
            maiaeditor.restoreEditorContent(maiaeditor.editor);
        } else if (((event.shiftKey && event.ctrlKey) || (event.shiftKey && event.metaKey)) && ((event.key == 'Z') || (event.key == 'z'))) {
            maiaeditor.undoRestoreEditorContent(maiaeditor.editor);
        } else if (((event.shiftKey && event.ctrlKey) || (event.shiftKey && event.metaKey)) && ((event.key == 'I') || (event.key == 'i'))) {
            maiaeditor.unindentSelection(maiaeditor.editor);
        } else if (((!event.shiftKey && event.ctrlKey) || (!event.shiftKey && event.metaKey)) && ((event.key == 'I') || (event.key == 'i'))) {
            maiaeditor.indentSelection(maiaeditor.editor);
        } else if (((event.shiftKey && event.ctrlKey) || (!event.shiftKey && event.metaKey)) && ((event.key == 'M') || (event.key == 'm'))) {
            maiaeditor.uncommentSelection(maiaeditor.editor);
        } else if (((!event.shiftKey && event.ctrlKey) || (!event.shiftKey && event.metaKey)) && ((event.key == 'M') || (event.key == 'm'))) {
            maiaeditor.commentSelection(maiaeditor.editor);
        } else {
            var openChars = {'{': '}', '[': ']', '(': ')'};
            if (event.key == 'Enter') {
                // Gets the cursor position.
                var sel = window.getSelection();
                var rangeAtCursor = sel.getRangeAt(0);
                // Gets the text to the left of the cursor.
                var rangeLeft = document.createRange();
                rangeLeft.selectNodeContents(editor);
                rangeLeft.setEnd(rangeAtCursor.startContainer, rangeAtCursor.startOffset);
                var textBeforeCursor = rangeLeft.toString();
                // Gets the text to the right of the cursor.
                var rangeRight = document.createRange();
                rangeRight.selectNodeContents(editor);
                rangeRight.setStart(rangeAtCursor.endContainer, rangeAtCursor.endOffset);
                var textAfterCursor = rangeRight.toString();
                // Calculates indentation.
                // Find beginning of previous line.
                var i = textBeforeCursor.length - 1;
                while ((i >= 0) && (textBeforeCursor[i] != '\n')) {
                    i--;
                }
                i++;
                // Find padding of the line.
                var j = i;
                while ((j < textBeforeCursor.length) && (/[ \t]/.test(textBeforeCursor[j]))) {
                    j++;
                }
                var padding = textBeforeCursor.substring(i, j) || '';
                // Checks whether the line contains open braces.
                if (textBeforeCursor[textBeforeCursor.length - 1] == '{') {
                    var indentation = padding + '    ';
                } else {
                    var indentation = padding;
                }
                if (indentation.length > 0) {
                    event.preventDefault();
                    document.execCommand('insertHTML', false, '\r\n' + indentation);
                }
                // Checks whether the line contains close braces.
                if ((indentation != padding) && (textAfterCursor[0] == '}')) {
                    var pos = maiaeditor.getCursorPosition();
                    if (padding.length == 0) {
                        document.execCommand('insertHTML', false, '\r\n\r\n');
                    } else {
                        document.execCommand('insertHTML', false, '\r\n' + padding);
                    }
                    maiaeditor.setCursorPosition(pos);
                }
            } else if (event.key in openChars) {
                var pos = maiaeditor.getCursorPosition();
                event.preventDefault();
                document.execCommand('insertHTML', false, event.key + openChars[event.key]);
                pos.start = ++pos.end;
                maiaeditor.setCursorPosition(pos);
            }
            maiaeditor.saveEditorContent(maiaeditor.editor);
        }
    }, false);

    // It is necessary to update the HTML content of the element, whenever a key is pressed,
    // in order to keep the syntax coloring consistent.
    editor.addEventListener('input', function(event) {
        if (event.defaultPrevented) {
            return;
        }
        if (event.isComposing) {
            return;
        }
        // Highlights the code syntax in the editor.
        maiaeditor.highlightCode(maiaeditor.editor);
    }, false);
    editor.addEventListener('click', function(event) {
        // Highlights the code syntax in the editor.
        if (window.getSelection) {
            var selectedText = window.getSelection().toString();
            if (selectedText.length == 0) {
                maiaeditor.highlightCode(maiaeditor.editor);
            }
        }
    }, false);
    editor.addEventListener('keyup', function(event) {
        // Highlights the code syntax in the editor.
        if (window.getSelection) {
            var selectedText = window.getSelection().toString();
            if (selectedText.length == 0) {
                maiaeditor.highlightCode(maiaeditor.editor);
            }
        }
    }, false);
    // Transfer the text from the container to the editor.
    this.setText(code);
    // Highlights the code syntax in the editor.
    this.highlightCode(editor);
}