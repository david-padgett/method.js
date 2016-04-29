// testpilot.js/src/test/javascript/node-suffix.js

testPilot.runUnitTests();
console.log("\n" + testPilot.getReport());
process.exit(testPilot.getSummary().getUnitTestSummary().failed == 0 ? 0 : 1);
