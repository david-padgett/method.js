// method.js/src/test/javascript/node-suffix.js

__TestPilot.runUnitTests();
console.log("\n" + __TestPilot.getReport());
process.exit(__TestPilot.getSummary().getUnitTestSummary().failed == 0 ? 0 : 1);
