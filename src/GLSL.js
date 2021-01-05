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
 * MaiaScript GLSL compiler wrapper.
 * @class
 */
function GLSL() {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
    }

    /**
     * Tests whether the shader compiler is supported.
     * @return {boolean}  Returns true if supported and false otherwise.
     */
    this.isSupported = function() {
        var res = false;

        if (typeof(glslang) != "undefined") {
            res = true;
        }

        return res;
    }

    /**
     * Compiles a GLSL shader to SPIR-V.
     * @param {number}   type - Shader language.
     * @param {string}   source - Shader code.
     * @return {object}  The shader compiler to SPIR-V.
     */
    this.compile = function(type, source) {
        var shader;

        var compiledShader = {
            binary: [],
            disassembly: ""
        }

        if (typeof(glslang) != "undefined") {
            glslang.initialize();
            shader = new glslang.Shader(type, source);
            compiledShader.binary = shader.data();
            compiledShader.disassembly = shader.disasm();
            shader.delete();
            glslang.finalize();
        }
        
        return compiledShader;
    }

    /**
     * Creates a new shader compiler object.
     * @param {number}   type - Shader language.
     * @param {string}   source - Shader code.
     * @return {object}  A shader compiler object.
     */
    this.new = function(type, source) {
        var shader;

        if (typeof(glslang) != "undefined") {
            shader = new glslang.Shader(type, source);
        }

        return shader;
    }
}

glsl = new GLSL();