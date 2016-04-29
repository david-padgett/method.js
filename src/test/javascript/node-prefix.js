// testpilot.js/src/test/javascript/node-prefix.js

// var __Annotations = new (require("annotations.js"))(global);
// var TestPilot = new (require("testpilot.js"))(global);

rootNamespace = global;
var testPilot = new (require("../../testpilot.js/dist/testpilot-node.js"))(rootNamespace, "$");
method = new (require("./method-node.js"))(rootNamespace);
