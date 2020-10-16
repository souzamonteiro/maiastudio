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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, eithermath.express or implied.
 * See the License for the specific language governing permissions and;
 * limitations under the License.
 */

/**
 * MaiaScript Artificial Neural Network (ANN) library.
 * @class
 */
function ANN() {
    init();

    /**
     * Creates the attributes of the class.
     */
    function init() {
        // Class attributes goes here.
    }

    /**
     * Creates an untrained artificial neural network.
     * @param {string}   topology - Graph topology. It can be:
     *                              complete, random, small world,
     *                              scale-free, hybrid or mlp.
     * @param {number}   numVertices - Number of vertices.
     * @param {number}   numEdges - Number of edges.
     * @param {number}   edgeProbability - Edge probability.
     * @param {number}   averageDegree - Average degree.
     * @param {number}   ni - Number of input neurons.
     * @param {number}   no - Number of output neurons.
     * @param {number}   nl - Number of layers.
     * @param {number}   nhu - Number of hidden units.
     * @return {object}  A neural network.
     */
    this.createANN = function(topology, numVertices, numEdges, edgeProbability, averageDegree, ni, no, nl, nhu) {
        if (typeof topology == 'undefined') {
            topology = 'complete';
        }
        if (typeof numVertices != 'undefined') {
            n = numVertices;
        } else {
            n = 0;
        }
        if (typeof numEdges != 'undefined') {
            m = numEdges;
        } else {
            m = 0;
        }
        if (typeof edgeProbability != 'undefined') {
            p = edgeProbability;
        } else {
            p = 0;
        }
        if (typeof averageDegree != 'undefined') {
            d = averageDegree;
        } else {
            d = 0;
        }
        if (typeof ni == 'undefined') {
            ni = 0;
        }
        if (typeof no == 'undefined') {
            no = 0;
        }
        if (typeof nl == 'undefined') {
            nl = 0;
        }
        if (typeof nhu == 'undefined') {
            nhu = 0;
        }
        // Create a Multi-layer Perceptron (MLP)
        if (topology == 'mlp') {
            n = ni + nl * nhu + no;
        }
        // Create a complete graph.
        if (topology == 'complete') {
            var ANN = core.matrix(1, n + 1, n + 1);
        } else {
            var ANN = core.matrix(0, n + 1, n + 1);
        }
        dimANN = core.dim(ANN);
        // Create a random graph.
        if (topology == 'random') {
            // Calculate the edge probability.
            if (d > 0) {
                p = d / (n - 1);
            }
            // Calculate the number of edge.
            if ((m == 0) && (p > 0)) {
                e = n / 2 * (n - 1) * p;
            } else {
                e = m;
            }
            while (e > 0) {
                i = math.round(math.random() * n);
                j = math.round(math.random() * n);
                if (!((i == j) || (i == 0) || (j == 0))) {
                    if ((ANN[i][j] == 0) && (ANN[j][i] == 0)) {
                        ANN[i][j] = 1;
                        ANN[j][i] = 1;
                        e--;
                    }
                }
            }
        // Create a small world network.
        } else if (topology == 'smallworld') {
            // Create the initial random network.
            for (i = 1; i < dimANN[0]; i = i + 1) {
                while (true) {
                    ki = matrix.count(ANN, i, 1, i, dimANN[1] - 1);
                    if (ki < d) {
                        j = math.round(math.random() * n);
                        if ((i != j) && (j != 0)) {
                            ANN[i][j] = 1;
                            ANN[j][i] = 1;
                        }
                    } else {
                        break;
                    }
                }
            }
            // Rewire network with edge probability p.
            for (i = 1; i < dimANN[0]; i = i + 1) {
                for (j = 1; j < dimANN[1]; j = j + 1) {
                    if (ANN[i][j] == 1) {
                        pij = math.random();
                        if (pij < p) {
                            while (true) {
                                k = math.round(math.random() * n);
                                if ((k != 0) && (i != k) && (ANN[i][k] == 0)) {
                                    ANN[i][j] = 0;
                                    ANN[j][i] = 0;
                                    ANN[i][k] = 1;
                                    ANN[k][i] = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        // Create a scale-free network.
        } else if (topology == 'scalefree') {
            // Create the initial random network.
            for (i = 1; i < dimANN[0]; i = i + 1) {
                while (true) {
                    ki = matrix.count(ANN, i, 1, i, dimANN[1] - 1);
                    if (ki == 0) {
                        j = math.round(math.random() * n);
                        if ((j != 0) && (i != j)) {
                            ANN[i][j] = 1;
                            ANN[j][i] = 1;
                            break;
                        }
                    } else {
                        break;
                    }
                }
            }
            // Add new edges with probability p.
            for (i = 1; i < dimANN[0]; i = i + 1) {
                for (j = 1; j < dimANN[1]; j = j + 1) {
                    if ((i != j) && (ANN[i][j] == 0)) {
                        ki = matrix.count(ANN, i, 1, i, dimANN[1] - 1);
                        if (ki < d) {
                            sk = matrix.sum(ANN, 1, 1, dimANN[0] - 1, dimANN[1] - 1);
                            p = math.random();
                            pi = ki / sk;
                            if (pi < p) {
                                ANN[i][j] = 1;
                                ANN[j][i] = 1;
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
        // Create an hybrid (scale-free small world) network.
        } else if (topology == 'hybrid') {
            // Create the small world network.
            // Create the initial random network.
            for (i = 1; i < dimANN[0]; i = i + 1) {
                while (true) {
                    ki = matrix.count(ANN, i, 1, i, dimANN[1] - 1);
                    if (ki < d) {
                        j = math.round(math.random() * n);
                        if ((j != 0) && (i != j)) {
                            ANN[i][j] = 1;
                            ANN[j][i] = 1;
                        }
                    } else {
                        break;
                    }
                }
            }
            // Rewire network with edge probability p.
            for (i = 1; i < dimANN[0]; i = i + 1) {
                for (j = 1; j < dimANN[1]; j = j + 1) {
                    if (ANN[i][j] == 1) {
                        pij = math.random();
                        if (pij < p) {
                            while (true) {
                                k = math.round(math.random() * n);
                                if ((k != 0) && (i != k) && (ANN[i][k] == 0)) {
                                    ANN[i][j] = 0;
                                    ANN[j][i] = 0;
                                    ANN[i][k] = 1;
                                    ANN[k][i] = 1;
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            // Change it to scale-free.
            // Add new edges with probability p.
            for (i = 1; i < dimANN[0]; i = i + 1) {
                for (j = 1; j < dimANN[1]; j = j + 1) {
                    if ((i != j) && (ANN[i][j] == 0)) {
                        ki = matrix.count(ANN, i, 1, i, dimANN[1] - 1);
                        if (ki < d) {
                            sk = matrix.sum(ANN, 1, 1, dimANN[0] - 1, dimANN[1] - 1);
                            p = math.random();
                            pi = ki / sk;
                            if (pi < p) {
                                ANN[i][j] = 1;
                                ANN[j][i] = 1;
                            }
                        } else {
                            break;
                        }
                    }
                }
            }
        } else if (topology == 'mlp') {
            var lindex = 0;
            var nindex = 1;
            // Create synapses.
            // Connect inputs to the first layer.
            nindex = ni;
            for (var i = 1; i <= ni; i++) {
                for (var j = 1; j <= nhu; j++) {
                    ANN[i][j + nindex] = 1;
                }
            }
            // Connect hidden layers.
            for (var l = 1; l < nl; l++) {
                n1index = ni + (l - 1) * nhu;
                n2index = ni + l * nhu;
                for (var i = 1; i <= nhu; i++) {
                    for (var j = 1; j <= nhu; j++) {
                        ANN[i + n1index][j + n2index] = 1;
                    }
                    //ANN[i + n1index][i + n1index] = 1;
                }
            }
            // Connect last layer to outputs.
            n1index = ni + (nl - 1) * nhu;
            n2index = ni + nl * nhu;
            for (var i = 1; i <= nhu; i++) {
                for (var j = 1; j <= no; j++) {
                    ANN[i + n1index][j + n2index] = 1;
                    //ANN[j + n2index][j + n2index] = 1;
                }
                //ANN[i + n1index, i + n1index] = 1;
            }
            // Add the neurons labels.
            lindex = 0;
            nindex = 1;
            for (var i = 1; i < dimANN[0]; i++) {
                if (lindex == 0) {
                    label = "i" + nindex;
                    nindex++;
                    if (nindex > ni) {
                        lindex++;
                        nindex = 1;
                    }
                } else if ((lindex > 0) & (lindex <= nl)) {
                    label = "h" + lindex + "," + nindex;
                    nindex++;
                    if (nindex > nhu) {
                        lindex++;
                        nindex = 1;
                    }
                } else {
                    label = "o" + nindex;
                    nindex++;
                }
                ANN[0][i] = label;
                ANN[i][0] = label;
            }
        }
        // Add loops (for neural networks).
        if (ni > 0) {
            for (i = ni + 1; i < dimANN[0]; i = i + 1) {
                ANN[i][i] = 1;
            }
        } else {
            // Remove loops.
            for (i = 0; i < dimANN[0]; i = i + 1) {
                ANN[i][i] = 0;
            }
        }
        if (topology == 'mlp') {
            // Add the neurons labels.
            lindex = 0;
            nindex = 1;
            for (i = 1; i < dimANN[0]; i++) {
                if (lindex == 0) {
                    label = "i" + nindex;
                    nindex++;
                    if (nindex > ni) {
                        lindex++;
                        nindex = 1;
                    }
                } else if ((lindex > 0) & (lindex <= nl)) {
                    label = "h" + lindex + "," + nindex;
                    nindex++;
                    if (nindex > nhu) {
                        lindex++;
                        nindex = 1;
                    }
                } else {
                    label = "o" + nindex;
                    nindex++;
                }
                ANN[0][i] = label;
                ANN[i][0] = label;
            }
        } else {
            // Add the vertices labels.
            for (i = 1; i < dimANN[0]; i = i + 1) {
                ANN[0][i] = 'v' + i;
                ANN[i][0] = 'v' + i;
            }
        }
        return ANN;
    }

    /**
     * Returns the labels of an adjacency matrix.
     * @param {object}   ANNMatrix - Adjacency matrix.
     * @return {object}  The labels of an adjacency matrix.
     */
    this.getLabels = function(ANNMatrix) {
        dimANN = core.dim(ANNMatrix);
        var labels = [''];
        for (i = 1; i < dimANN[0]; i++) {
            labels.push(ANNMatrix[i][0]);
        }
        return(labels);
    }

    /**
     * Trains an artificial neural network, represented as an adjacency matrix.
     * @param {object}   ANNMatrix - Adjacency matrix.
     * @param {object}   inMatrix - Input data for training.
     * @param {object}   outMatrix - Output data for training.
     * @param {number}   ni - Number of input neurons.
     * @param {number}   no - Number of output neurons.
     * @param {number}   lRate - Learning rate.
     * @param {string}   AF - Activation function. It can be:
     *                        linear, logistic or tanh.
     * @param {string}   OAF - Activation function of the last layer. It can be:
     *                         linear, logistic or tanh.
     * @return {object}  Trained neural network.
     */
    this.learn = function(ANNMatrix, inMatrix, outMatrix, ni, no, lRate, AF, OAF) {
        if (typeof ni == 'undefined') {
            ni = 0;
        }
        if (typeof no == 'undefined') {
            no = 0;
        }
        if (typeof lRate == 'undefined') {
            lRate = 1;
        }
        if (typeof AF == 'undefined') {
            AF = 'logistic';
        }
        if (typeof OAF == 'undefined') {
            OAF = 'linear';
        }
        var dimANN = core.dim(ANNMatrix);
        var firstOut = dimANN[1] - 1 - no;
        // Clear inputs and outputs.
        for (var i = 0; i < dimANN[0] - 1; i++) {
            ANNMatrix[0][i] = 0.0;
            ANNMatrix[i][0] = 0.0;
            ANNMatrix[i][dimANN[1] - 1] = 0.0;
            ANNMatrix[dimANN[0] - 1][i] = 0.0;
        }
        // Assign inputs.
        for (var j = 0; j < ni; j++) {
            ANNMatrix[j + 1][0] = inMatrix[j];
        }
        // Calculate the neurons output.
        for (var j = ni + 1; j < (dimANN[1] - 1); j++) {
            ANNMatrix[0][j] = 0.0;
            // Weighted sums.
            // x = x1 * w1 + x2 * w2 + ...
            for (var i = 1; i < (dimANN[0] - 1); i++) {
                if (i < j) {
                    if (ANNMatrix[i][j] != 0) {
                        ANNMatrix[0][j] = ANNMatrix[0][j] + ANNMatrix[i][j] * ANNMatrix[i][0];
                    }
                } else if (i == j) {
                    if (ANNMatrix[i][j] != 0) {
                        ANNMatrix[0][j] = ANNMatrix[0][j] + ANNMatrix[i][j];
                    }
                } else {
                    break;
                }
            }
            // Activation function.
            if (j < firstOut) {
                // Linear: f(x) = x
                //         df(x)/dx = 1
                if (AF == 'linear') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = ANNMatrix[0, j];
                    // Calculate df(x)/dx for backpropagation.
                    ANNMatrix[j][dimANN[1] - 1] = 1.0;
                // Logistic: f(x) = 1.0 / (1.0 + e^(-x))
                //          df(x)/dx = f(x) * (1 - f(x))
                } else if (AF == 'logistic') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 1.0 / (1.0 + math.exp(-1.0 * ANNMatrix[0][j]));
                    // Calculate df(x)/dx for backpropagation.
                    ANNMatrix[j][dimANN[1] - 1] = ANNMatrix[j][0] * (1.0 - ANNMatrix[j][0]);
                // Hyperbolic tangent: f(x) = 2 / (1 + e^(-2x)) - 1
                //                     df(x)/dx = 1 - f(x)^2
                } else if (AF == 'tanh') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 2.0 / (1.0 + math.exp(-2.0 * ANNMatrix[0][j])) - 1.0;
                    // Calculate df(x)/dx for backpropagation.
                    ANNMatrix[j][dimANN[1] - 1] = 1.0 - ANNMatrix[j][0] * ANNMatrix[j][0];
                // Logistic: f(x) = 1.0 / (1.0 + e^(-x))
                //          df(x)/dx = f(x) * (1 - f(x))
                } else {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 1.0 / (1.0 + math.exp(-1.0 * ANNMatrix[0][j]));
                    // Calculate df(x)/dx for backpropagation.
                    ANNMatrix[j][dimANN[1] - 1] = ANNMatrix[j][0] * (1.0 - ANNMatrix[j][0]);
                }
            } else {
                // Linear: f(x) = x
                //         df(x)/dx = 1
                if (OAF == 'linear') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = ANNMatrix[0][j];
                    // Calculate df(x)/dx for backpropagation.
                    ANNMatrix[j][dimANN[1] - 1] = 1.0;
                // Logistic: f(x) = 1.0 / (1.0 + e^(-x))
                //          df(x)/dx = f(x) * (1 - f(x))
                } else if (OAF == 'logistic') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 1.0 / (1.0 + math.exp(-1.0 * ANNMatrix[0][j]));
                    // Calculate df(x)/dx for backpropagation.
                    ANNMatrix[j][dimANN[1] - 1] = ANNMatrix[j][0] * (1.0 - ANNMatrix[j][0]);
                // Hyperbolic tangent: f(x) = 2 / (1 + e^(-2x)) - 1
                //                     df(x)/dx = 1 - f(x)^2
                } else if (OAF == 'tanh') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 2.0 / (1.0 + math.exp(-2.0 * ANNMatrix[0][j])) - 1.0;
                    // Calculate df(x)/dx for backpropagation.
                    ANNMatrix[j][dimANN[1] - 1] = 1.0 - ANNMatrix[j][0] * ANNMatrix[j][0];
                // Logistic: f(x) = 1.0 / (1.0 + e^(-x))
                //          df(x)/dx = f(x) * (1 - f(x))
                } else {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 1.0 / (1.0 + math.exp(-1.0 * ANNMatrix[0][j]));
                    // Calculate df(x)/dx for backpropagation.
                    ANNMatrix[j][dimANN[1] - 1] = ANNMatrix[j][0] * (1.0 - ANNMatrix[j][0]);
                }
            }
        }
        // Calculate delta for the output neurons.
        // d = z - y;
        for (var i = 0; i < no; i++) {
            ANNMatrix[dimANN[0] - 1][firstOut + i] = outMatrix[i] - ANNMatrix[firstOut + i][0];
        }
        // Calculate delta for hidden neurons.
        // d1 = w1 * d2 + w2 * d2 + ...
        for (var j = dimANN[1] - 2; j > ni; j--) {
            for (i = ni + 1; i < (dimANN[0] - 1 - no); i++) {
                if (i == j) {
                    break;
                }
                if (ANNMatrix[i][j] != 0) {
                    ANNMatrix[dimANN[0] - 1][i] = ANNMatrix[dimANN[0] - 1][i] + ANNMatrix[i][j] * ANNMatrix[dimANN[0] - 1][j];
                }
            }
        }
        // Adjust weights.
        // x = x1 * w1 + x2 * w2 + ...
        // w1 = w1 + n * d * df(x)/dx * x1
        // w2 = w2 + n * d * df(x)/dx * x2
        for (var j = no + 1; j < (dimANN[1] - 1); j++) {
            for (var i = 1; i < (dimANN[0] - 1 - no); i++) {
                if (i < j) {
                    if (ANNMatrix[i][j] != 0) {
                        ANNMatrix[i][j] = ANNMatrix[i][j] + lRate * ANNMatrix[dimANN[0] - 1][j] * ANNMatrix[j][dimANN[1] - 1] * ANNMatrix[i][0];
                    }
                } else if (i == j) {
                    if (ANNMatrix[i][j] != 0) {
                        ANNMatrix[i][j] = ANNMatrix[i][j] + lRate * ANNMatrix[dimANN[0] - 1][j] * ANNMatrix[j][dimANN[1] - 1];
                    }
                } else {
                    break;
                }
            }
        }
        return ANNMatrix;
    }

    /**
     * It prepares a neural network, represented as an adjacency matrix,
     * replacing cells with value one (1), with random real numbers.
     * @param {object}   ANNMatrix - Adjacency matrix.
     * @param {boolean}  randomize - Fill cells with random real numbers.
     * @param {boolean}  allowLoops - Allow loops.
     * @param {boolean}  negativeWeights - Allow negative weights.
     * @return {object}  Matrix filled with random numbers.
     */
    this.prepare = function(ANNMatrix, randomize, allowLoops, negativeWeights) {
        if (typeof randomize == 'undefined') {
            randomize = false;
        }
        if (typeof allowLoops == 'undefined') {
            allowLoops = false;
        }
        if (typeof negativeWeights == 'undefined') {
            negativeWeights = false;
        }
        var dimANN = core.dim(ANNMatrix);
        // Clear inputs and outputs.
        for (var i = 0; i < dimANN[0]; i++) {
            ANNMatrix[0][i] = 0.0;
            ANNMatrix[i][0] = 0.0;
            if (!allowLoops) {
                ANNMatrix[i][i] = 0.0;
            }
            ANNMatrix[i][dimANN[1] - 1] = 0.0;
            ANNMatrix[dimANN[0] - 1][i] = 0.0;
        }
        // Clear the lower triangular matrix.
        for (i = 1; i < dimANN[0]; i++) {
            for (j = 1; j < dimANN[1]; j++) {
                if (i > j) {
                    ANNMatrix[i][j] = 0.0;
                }
            }
        }
        // Set random weights.
        if (randomize) {
            for (i = 1; i < (dimANN[0] - 1); i++) {
                for (j = 1; j < (dimANN[1] - 1); j++) {
                    if (ANNMatrix[i][j] == 1) {
                        if (negativeWeights) {
                            ANNMatrix[i][j] = 2.0 * math.random() - 1.0;
                        } else {
                            ANNMatrix[i][j] = math.random();
                        }
                    }
                }
            }
        }
        return ANNMatrix;
    }

    /**
     * Sets the labels of an adjacency matrix.
     * @param {object}   ANNMatrix - Adjacency matrix.
     * @param {object}   labels - Matrix labels.
     * @return {object}  The adjacency matrix
     */
    this.setLabels = function(ANNMatrix, labels) {
        dimANN = core.dim(ANNMatrix);
        for (i = 1; i < dimANN[0]; i++) {
            ANNMatrix[i][0] = labels[i];
            ANNMatrix[0][i] = labels[i];
        }
        return(labels);
    }

    /**
     * It processes incoming data using a trained neural network.
     * @param {object}   ANNMatrix - adjacency matrix.
     * @param {object}   inMatrix - Input data for training.
     * @param {number}   ni - Number of input neurons.
     * @param {number}   no - Number of output neurons.
     * @param {string}   AF - Activation function. It can be:
     *                        linear, logistic or tanh.
     * @param {string}   OAF - Activation function of the last layer. It can be:
     *                         linear, logistic or tanh.
     * @param {string}   OF - Output function. It can be:
     *                        linear, step, or none.
     * @param {object}   OFC - Output function coefficients.
     * @return {object}  Trained neural network.
     */
    this.think = function(ANNMatrix, inMatrix, ni, no, AF, OAF, OF, OFC) {
        if (typeof ni == 'undefined') {
            ni = 0;
        }
        if (typeof no == 'undefined') {
            no = 0;
        }
        if (typeof AF == 'undefined') {
            AF = 'logistic';
        }
        if (typeof OAF == 'undefined') {
            OAF = 'linear';
        }
        if (typeof OF == 'undefined') {
            OF = 'none';
        }
        if (typeof OFC == 'undefined') {
            OFC = [1, 0];
        }
        var output = core.matrix(0.0, 1, no);
        var dimANN = core.dim(ANNMatrix);
        var firstOut = dimANN[1] - 1 - no;
        // Clear inputs and outputs.
        for (var i = 0; i < dimANN[0] - 1; i++) {
            ANNMatrix[0][i] = 0.0;
            ANNMatrix[i][0] = 0.0;
            ANNMatrix[i][dimANN[1] - 1] = 0.0;
            ANNMatrix[dimANN[0] - 1][i] = 0.0;
        }
        // Assign inputs.
        for (var j = 0; j < ni; j++) {
            ANNMatrix[j + 1][0] = inMatrix[j];
        }
        // Calculate the neurons output.
        for (var j = ni + 1; j < (dimANN[1] - 1); j++) {
            ANNMatrix[0][j] = 0.0;
            // Weighted sums.
            // x = x1 * w1 + x2 * w2 + ...
            for (var i = 1; i < (dimANN[0] - 1); i++) {
                if (i < j) {
                    if (ANNMatrix[i][j] != 0) {
                        ANNMatrix[0][j] = ANNMatrix[0][j] + ANNMatrix[i][j] * ANNMatrix[i][0];
                    }
                } else if (i == j) {
                    if (ANNMatrix[i][j] != 0) {
                        ANNMatrix[0][j] = ANNMatrix[0][j] + ANNMatrix[i][j];
                    }
                } else {
                    break;
                }
            }
            // Activation function.
            if (j < firstOut) {
                // Linear: f(x) = x
                if (AF == 'linear') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = ANNMatrix[0][j];
                // Logistic: f(x) = 1.0 / (1.0 + e^(-x))
                } else if (AF == 'logistic') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 1.0 / (1.0 + math.exp(-1.0 * ANNMatrix[0][j]));
                // Hyperbolic tangent: f(x) = 2 / (1 + e^(-2x)) - 1
                } else if (AF == 'tanh') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 2.0 / (1.0 + math.exp(-2.0 * ANNMatrix[0][j])) - 1.0;
                // Logistic: f(x) = 1.0 / (1.0 + e^(-x))
                } else {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 1.0 / (1.0 + math.exp(-1.0 * ANNMatrix[0][j]));
                }
            } else {
                // Linear: f(x) = x
                if (OAF == 'linear') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = ANNMatrix[0][j];
                // Logistic: f(x) = 1.0 / (1.0 + e^(-x))
                } else if (OAF == 'logistic') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 1.0 / (1.0 + math.exp(-1.0 * ANNMatrix[0][j]));
                // Hyperbolic tangent: f(x) = 2 / (1 + e^(-2x)) - 1
                } else if (OAF == 'tanh') {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 2.0 / (1.0 + math.exp(-2.0 * ANNMatrix[0][j])) - 1.0;
                // Logistic: f(x) = 1.0 / (1.0 + e^(-x))
                } else {
                    // Calculate y = f(x)
                    ANNMatrix[j][0] = 1.0 / (1.0 + math.exp(-1.0 * ANNMatrix[0][j]));
                }
            }
        }
        // Set the output matrix.
        for (var i = 0; i < no; i++) {
            if (OF == 'linear') {
                output[i] = OFC[0] * ANNMatrix[firstOut + i][0] + OFC[1];
            } else if (OF == 'step') {
                if (OAF == 'linear') {
                    if (ANNMatrix[firstOut + i][0] >= 0.0) {
                        output[i] = 1;
                    } else {
                        output[i] = 0;
                    }
                } else if (OAF == 'logistic') {
                    if (ANNMatrix[firstOut + i][0] >= 0.5) {
                        output[i] = 1;
                    } else {
                        output[i] = 0;
                    }
                } else if (OAF == 'tanh') {
                    if (ANNMatrix[firstOut + i][0] >= 0.0) {
                        output[i] = 1;
                    } else {
                        output[i] = 0;
                    }
                } else {
                    if (ANNMatrix[firstOut + i][0] >= 0.0) {
                        output[i] = 1;
                    } else {
                        output[i] = 0;
                    }
                }
            } else if (OF == 'none') {
                output[i] = ANNMatrix[firstOut + i][0];
            } else {
                output[i] = ANNMatrix[firstOut + i][0];
            }
        }
        return output;
    }

    /**
     * Train an artificial neural network, represented as an adjacency matrix.
     * @param {object}    ANNMatrix - Adjacency matrix.
     * @param {object}    inMatrix - Input data for training.
     * @param {object}    outMatrix - Output data for training.
     * @param {number}    lRate - Learning rate.
     * @param {string}    AF - Activation function. It can be:
     *                         linear, logistic or tanh.
     * @param {string}    OAF - Activation function of the last layer. It can be:
     *                          linear, logistic or tanh.
     * @param {string}    OF - Output function. It can be:
     *                         linear, step or none.
     * @param {string}    OFC - Output function coefficients.
     * @param {number}    maxEpochs - Maximum number of epochs.
     * @param {number}    minimumCorrectness - Minimum correctness.
     * @param {function}  callback - Callback function.
     * @param {number}    interval - Interval between calls from the callback function.
     * @return {object}   Trained neural network.
     */
    this.training = function(ANNMatrix, inMatrix, outMatrix, lRate, AF, OAF, OF, OFC, maxEpochs, minimumCorrectness, callback, interval) {
        if (typeof lRate == 'undefined') {
            lRate = 1;
        }
        if (typeof AF == 'undefined') {
            AF = 'logistic';
        }
        if (typeof OAF == 'undefined') {
            OAF = 'linear';
        }
        if (typeof OF == 'undefined') {
            OF = 'none';
        }
        if (typeof OFC == 'undefined') {
            OFC = [1, 0];
        }
        if (typeof maxEpochs == 'undefined') {
            maxEpochs = 1;
        }
        if (typeof minimumCorrectness == 'undefined') {
            minimumCorrectness = 1;
        }
        if (typeof correctnessMatrix == 'undefined') {
            correctnessMatrix = [];
        }
        if (typeof interval == 'undefined') {
            interval = 0;
        }
        var ANN = core.copyMatrix(ANNMatrix);
        var dimIn = core.dim(inMatrix);
        var dimOut = core.dim(outMatrix);
        var input = core.matrix(0.0, 1, dimIn[1]);
        var output = core.matrix(0.0, 1, dimOut[1]);
        var ANNOut = core.matrix(0.0, 1, dimOut[1]);
        var epochs = 0;
        var epochsCounter = 0;
        var date = core.date();
        var ETL1 = date.getTime();
        var ETL2 = date.getTime();
        var squaredError = core.matrix(0.0, 1, dimIn[0]);
        var ERR = [];
        var SE = 0;
        var RSS = 0;
        var correctness = 0;
        var correctnessMatrix = core.matrix(0.0, maxEpochs + 1, 2);
        while (epochs < maxEpochs) {
            var hits = 0;
            epochs++;
            // Verify learning.
            for (var i = 0; i < dimIn[0]; i++) {
                // Assign inputs and outputs.
                for (var j = 0; j < dimIn[1]; j++) {
                    input[j] = inMatrix[i][j];
                }
                for (var j = 0; j < dimOut[1]; j++) {
                    output[j] = outMatrix[i][j];
                }
                // Verify learning.
                if (OFC != []) {
                    ANNOut = this.think(ANN, input, dimIn[1], dimOut[1], AF, OAF, OF, OFC);
                } else {
                    ANNOut = this.think(ANN, input, dimIn[1], dimOut[1], AF, OAF, OF);
                }
                if (output == ANNOut) {
                    hits++;
                }
                ERR = core.sub(output, ANNOut);
                if (typeof ERR == 'number') {
                    ERR = [ERR];
                }
                SE = matrix.sum2(ERR) / 2.0;
                squaredError[i] = SE;
                RSS = matrix.sum(squaredError);
                correctness = hits / dimIn[0];
                correctnessMatrix[epochs][0] = RSS;
                correctnessMatrix[epochs][1] = correctness;
                if (hits == dimIn[0]) {
                    ANNMatrix = core.copyMatrix(ANN);
                    result = [epochs, RSS, correctnessMatrix];
                    return result;
                }
                if (correctness >= minimumCorrectness) {
                    ANNMatrix = core.copyMatrix(ANN);
                    result = [epochs, RSS, correctnessMatrix];
                    return result;
                }
            }
            // Learn this set.
            for (var i = 0; i < dimIn[0]; i++) {
                // Assign inputs and outputs.
                input = inMatrix[i];
                output = outMatrix[i];
                // Learn this set.
                ANN = this.learn(ANN, input, output, dimIn[1], dimOut[1], lRate, AF, OAF);
            }
            epochsCounter++;
            if (interval != 0) {
                if (typeof callback != 'undefined') {
                    if (epochsCounter >= interval) {
                        ETL2 = date.getTime();
                        var ETL = ETL2 - ETL1;
                        if (typeof callback == 'undefined') {
                            callback(epochs, RSS, correctness, ETL);
                        }
                        epochsCounter = 0;
                        ETL1 = date.getTime();
                    }
                }
            }
        }
        ANNMatrix = ANN;
        result = [epochs, RSS, correctnessMatrix];
        return result;
    }
}

ann = new ANN();