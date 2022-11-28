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
  * MaiaScript Computer Algebra System library.
  * @class 
  */
function CAS() {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
    }

    /**
     * Evaluates expressions using the Algebrite CAS.
     * For complete reference, see the Algebrite documentation
     * at http://algebrite.org
     * @param {string}   expr - Algebraic expression.
     * @return {object}  Result of the expression.
     */
    this.eval = function(expr) {
        var casExpr = core.replace(expr, "**", "^")
        var res;
        if (typeof Algebrite != 'undefined') {
            res = core.replace(Algebrite.run(casExpr), "^", "**");
        } else {
            throw new Error("The Algebrite CAS was not loaded");
        }
        return res;
    }
}

cas = new CAS();

if (typeof process !== 'undefined') {
    try {
        var Algebrite = require('algebrite');
    } catch (e) {
        console.error(e.message);
    }
}
