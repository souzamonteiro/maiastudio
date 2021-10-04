MaiaApp = function() {
    init();
    init = function() {};
    appTitle = "MaiaApp";
    appName = "MaiaApp";
    run = function() {
        if (core.different(core.type(process), "undefined")) {
            command = "node";
            argv = process.argv.slice();
            fs = require("fs");
            readTextFile = fs.readFileSync;;
            readFile = function(input) {
                content = readTextFile(input, "utf-8");
                return (content);
            };;
            system.argv = argv.slice();
            system.argc = argv.length;;
            inputFile = "";
            outputFile = "";;
            if (core.GT(argv.length, 2)) {
                i = 2;
                while (core.LT(i, argv.length)) {
                    if (core.bitwiseOR((core.equal(argv[i], "-h")), (core.equal(argv[i], "--help")))) {
                        system.log(core.add(appTitle, " Command Line Interface (CLI)"));
                        system.log(core.add(core.add("Usage: ", appName), " [options] [input file] [--] [arguments]"));
                        system.log("Options:");
                        system.log("-h     --help               Displays this help message,");
                        system.log("-o     [output file]        Output file name.");
                        process.exit(0);
                    } else if (core.equal(argv[i], "-o")) {
                        i = core.add(i, 1);
                        outputFile = argv[i];
                    } else {
                        inputFile = argv[i];
                        break;
                    };
                    i = core.add(i, 1);
                };
                system.argv = argv.slice(i);
                system.argc = system.argv.length;
                if (core.different(inputFile, "")) {
                    Glob = require("glob");;
                    processFiles = function(er, files) {
                        if (core.equal(files.length, 0)) {
                            system.log(core.add(appTitle, " Command Line Interface (CLI)"));
                            system.log(core.add(core.add("Usage: ", appName), " [options] [input file] [--] [arguments]"));
                        } else {
                            for (i = 0; core.LT(i, files.length); i = core.add(i, 1)) {;
                                file = files[i];;
                                fileName = file.split(".");
                                fileName = fileName.shift();;
                                fileExtension = file.split(".");
                                fileExtension = fileExtension.pop();;
                                fileContents = readFile(String(file));;;
                                if (core.equal(outputFile, "")) {
                                    outputFile = core.add(fileName, ".out");
                                };;
                                errorCallback = function(err) {
                                    if (err) {
                                        throw (err);
                                    };
                                };
                                fs.writeFile(outputFileName, JSON.stringify(graphsData), errorCallback);
                            };
                        };
                    };
                    options = [];;
                    glob = new Glob(inputFile, options, processFiles);
                } else {
                    system.log(core.add(appTitle, " Command Line Interface (CLI)"));
                    system.log(core.add(core.add("Usage: ", appName), " [options] [input file] [--] [arguments]"));
                };
            } else {
                system.log(core.add(appTitle, " Command Line Interface (CLI)"));
                system.log(core.add(core.add("Usage: ", appName), " [options] [input file] [--] [arguments]"));
            };
        };
    };
};
app = new MaiaApp();
if (core.different(core.type(process), "undefined")) {;
    const;
    jsdom = require("jsdom");
    const; {
        JSDOM
    } = jsdom;
    doc = new JSDOM();
    DOMParser = doc.window.DOMParser;
    alert = system.log;
    app.run();
};