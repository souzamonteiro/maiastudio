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
 * MaiaScript multi-task library.
 * @class
 */
function Task() {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
    }
    
    /**
     * Tests whether multi-tasking is supported in the browser.
     * @return {boolean}  Returns true if supported and false otherwise.
     */
    this.isSupported = function() {
        var res = false;
        if (typeof(Worker) != "undefined") {
            res = true;
        }
        return res;
    }

    /**
     * Creates a new parallel task.
     * The thread will be created in a new scope.
     * For communication with the master thread, the postMessage function (method) and onmessage event must be used.
     * To finish executing the thread, the terminate method must be executed.
     * To import a script from within the thread, you can use the importScripts function.
     * @param {object}   func - Function that will be executed on a new thread.
     * @return {object}  An object to interact with the created thread.
     */
    this.new = function(func) {
        var worker;
        if (typeof(Worker) != "undefined") {
            var script = func.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
            var blob = new Blob([script], {type:'text/javascript'});
            if (typeof(window) != "undefined") {
                var blobURL = window.URL.createObjectURL(blob);
            } else {
                var blobURL = 'data:,' + script;
            }
            worker = new Worker(blobURL);
        }
        return worker;
    }
}

task = new Task();

if (typeof process !== 'undefined') {
    try {
        var Worker = require('web-worker');
    } catch (e) {
        console.error(e.message);
    }
    try {
        var Blob = require('cross-blob');
    } catch (e) {
        console.error(e.message);
    }
}
