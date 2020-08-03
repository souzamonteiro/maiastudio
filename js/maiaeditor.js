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

/**
 * MaiaScript code editor.
 * @class
 * @param {string}   container - HTML element to setup as an editor.
 * @param {string}   language - Programming language to highlight the syntax.
 * @return {object}  Element configured as source code editor.
 */
function MaiaEditor(container, language) {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
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

    // Set scrollbars.
    //editorContainer.style.overflowX = 'hidden';
    //editorContainer.style.overflowY = 'hidden';
    //editorContainer.style.resize = 'none';
    
    // Place the line number bar to the left of the editor.
    lineNumbers.style.setProperty('mix-blend-mode', 'difference');
    lineNumbers.style.float = 'left';
    lineNumbers.style.width = '5%';
    lineNumbers.style.outline = 'none';
    lineNumbers.style.overflowX = 'hidden';
    lineNumbers.style.overflowY = 'hidden';
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
    editor.style.overflowX = 'hidden';
    editor.style.overflowY = 'hidden';
    editor.style.resize = 'none';
    editor.style.textAlign = 'left';

    /**
     * Gets the editor's text.
     * @return {string}  The text in the editor.
     */
    this.getText = function(text) {
        return editor.textContent;
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
     * Gets the current position of the cursor.
     * @param {object}   element - Element where the cursor position will be obtained.
     * @return {number}  The current position of the cursor.
     */
    this.getCursorPosition = function(element) {
        var cursorOffset = 0;
        var doc = element.ownerDocument || element.document;
        var win = doc.defaultView || doc.parentWindow;
        var sel;
        if (typeof win.getSelection != 'undefined') {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
                var range = win.getSelection().getRangeAt(0);
                var preCursorRange = range.cloneRange();
                preCursorRange.selectNodeContents(element);
                preCursorRange.setEnd(range.endContainer, range.endOffset);
                cursorOffset = preCursorRange.toString().length;
            }
        } else if ((sel = doc.selection) && sel.type != 'Control') {
            var textRange = sel.createRange();
            var preCursorTextRange = doc.body.createTextRange();
            preCursorTextRange.moveToElementText(element);
            preCursorTextRange.setEndPoint('EndToEnd', textRange);
            cursorOffset = preCursorTextRange.text.length;
        }
        return cursorOffset;
    }

    /**
     * Sets the cursor position.
     * @param {object}  element - Element where the cursor position will be set.
     * @param {object}  offset - The cursor position.
     * @return          The current position of the cursor is set.
     */
    this.setCursorPosition = function(element, offset) {
        var range = document.createRange();
        var sel = window.getSelection();
        // Select appropriate node.
        var currentNode = null;
        var previousNode = null;
        for (var i = 0; i < element.childNodes.length; i++) {
            // Save previous node.
            previousNode = currentNode;
            // Get current node.
            currentNode = element.childNodes[i];
            // If we get span or something else then we should get child node.
            while(currentNode.childNodes.length > 0){
                currentNode = currentNode.childNodes[0];
            }
            // Calculate offset in current node.
            if (previousNode != null) {
                offset -= previousNode.length;
            }
            // Check whether current node has enough length.
            if (offset <= currentNode.length) {
                break;
            }
        }
        // Move cursor to specified offset.
        if (currentNode != null) {
            try {
                range.setStart(currentNode, offset);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            } catch (e) {
                console.log(e.message);
            }
        }
    }

    /**
     * Highlights the code syntax in the editor.
     * @param {object}  element - Element to do code syntax highlighte.
     * @return          The content of the editor is Highlighted.
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
        var position = this.getCursorPosition(thisEditor);
        // Highlights the code syntax in the editor.
        thisEditor.innerHTML = Prism.highlight(code, Prism.languages[language], language);
        // Restores the cursor position.
        this.setCursorPosition(thisEditor, position);
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
            var textLines = text.split(/\r\n|\r|\n/);
            var newText = '';
            if (Array.isArray(textLines)) {
                for (var i = 0; i < textLines.length; i++) {
                    newText += '    ' + textLines[i] + (i < textLines.length - 1 ? '\r\n' : '');
                }
                this.replaceSelectedText(newText);
            }
            this.highlightCode(element);
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
                for (var i = 0; i < textLines.length; i++) {
                    newText += textLines[i].replace('    ', '') + (i < textLines.length - 1 ? '\r\n' : '');
                }
                this.replaceSelectedText(newText);
            }
            this.highlightCode(element);
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
        var text = this.getSelectedText();
        if (typeof text == 'string') {
            var textLines = text.split(/\r\n|\r|\n/);
            var newText = '';
            if (Array.isArray(textLines)) {
                for (var i = 0; i < textLines.length; i++) {
                    newText += '//' + textLines[i] + (i < textLines.length - 1 ? '\r\n' : '');
                }
                this.replaceSelectedText(newText);
            }
            this.highlightCode(element);
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
        var text = this.getSelectedText();
        if (typeof text == 'string') {
            var textLines = text.split(/\r\n|\r|\n/);
            var newText = '';
            if (Array.isArray(textLines)) {
                for (var i = 0; i < textLines.length; i++) {
                    newText += textLines[i].replace('//', '') + (i < textLines.length - 1 ? '\r\n' : '');
                }
                this.replaceSelectedText(newText);
            }
            this.highlightCode(element);
        }
    }

    /**
     * Copy the selected text to clipboard.
     * @return  The selected text copied to clipboard.
     */
    this.copySelection = function() {
        try {
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
    // Transfer the text from the container to the editor.
    editor.textContent = code;
    // Highlights the code syntax in the editor.
    this.highlightCode(editor);
}