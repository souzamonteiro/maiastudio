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
 * MaiaScript GPU compute library.
 * @class
 */
function MaiaGPU() {
    init();
    
    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
    }
    
    /**
     * Tests whether GPU is supported.
     * @return {boolean}  Returns true if supported and false otherwise.
     */
    this.isSupported = function() {
        var res = false;
        if (typeof(GPU) != "undefined") {
            res = true;
        }
        return res;
    }

    /**
     * Creates a new GPU object.
     * @return {object}  An object to interact with the GPU device.
     */
    this.new = function() {
        var device;
        if (typeof(GPU) != "undefined") {
            device = new GPU();
        }
        return device;
    }
}

gpu = new MaiaGPU();

if (typeof process !== 'undefined') {
    try {
        var {GPU} = require('gpu.js');
    } catch (e) {
        console.error(e.message);
    }
}
