"use strict";

// method.js/src/test/javascript/node-prefix.js

/* global method, test, $After, $AfterClass, $AssertEquals, $AssertFalse, $AssertIdentical, $AssertNotEquals, $AssertNotNull, $AssertNull, $AssertTrue, $Before, $BeforeClass, $Error, $RegisterUnitTest, $Test, $UnitTest, $MethodDelete, $MethodNamespace, $CONSTRUCTOR, $INITIALIZER, $PRIVATE, $PROTECTED, $PUBLIC, $STATIC */
/* eslint-disable no-console */

var __TestPilot = new (require("testpilot.js"))(global);
var rootNamespace = global;
global.method = new (require("./method-node.js"))(rootNamespace);
