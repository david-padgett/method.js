"use strict";

/* global method, test, $After, $AfterClass, $AssertEquals, $AssertFalse, $AssertIdentical, $AssertNotEquals, $AssertNotNull, $AssertNull, $AssertTrue, $Before, $BeforeClass, $Error, $RegisterUnitTest, $Test, $UnitTest, $MethodDelete, $MethodNamespace, $CONSTRUCTOR, $INITIALIZER, $PRIVATE, $PROTECTED, $PUBLIC, $STATIC */
/* eslint-disable no-console */

var __TestPilot = new (require("testpilot.js"))(global);
var rootNamespace = global;
global.method = new (require("./method-node.js"))(rootNamespace);

$UnitTest("method - namespace unit tests");
function Method_Namespace() {

	$BeforeClass();
	this.beforeClass = function() {
	};

	$AfterClass();
	this.afterClass = function() {
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test("examine namespace cache");
	this.namespaceCache = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		$AssertEquals(method.$method().__namespaces[0], rootNamespace, "method has correct 1st namespace");
		$AssertEquals(method.$method().__namespaces[1], method, "method has correct 2nd namespace");
	};

	$Test("examine root namespace");
	this.rootNamespace = function() {
		$AssertNotNull(rootNamespace, "root namespace is not null");
		$AssertNotNull(rootNamespace.$method(), "root namespace has framework state");
		$AssertTrue(rootNamespace.$method().__isValid(), "root namespace is valid");
		$AssertNull(rootNamespace.$method().__getName(), "root namespace has no name: " + rootNamespace.$method().__getName());
	};

	$Test("examine method namespace");
	this.methodNamespace = function() {
		$AssertNotNull(method, "method namespace is not null");
		$AssertNotNull(method.$method(), "method namespace has framework state");
		$AssertTrue(method.$method().__isValid(), "method namespace is valid");
		$AssertNotNull(method.$method().__getName(), "method namespace has a name");
		$AssertEquals(method.$method().__getName(), "method", "method namespace has the correct name: " + method.$method().__getName());
	};

	$Test("create, examine, and delete a single, unnamed namespace in the local scope");
	this.simpleNamespace = function() {
		var ns = method.createNamespace();
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
		$AssertNotNull(ns, "new namespace is not null");
		$AssertNull(ns.$method().__getName(), "new namespace has no name: " + ns.$method().__getName());
		$AssertTrue(ns.$method().__isValid(), "new namespace is in the namespace cache");
		$AssertNull(ns.$method().__getParent(), "new namespace has no parent namespace");
		$AssertEquals(ns.$method().__getChildren().length, 0, "new namespace has no child namespaces");
		method.delete(ns);
		$AssertFalse(ns.$method().__isValid(), "new namespace is no longer in the namespace cache");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Test("create, examine, and delete a single, named namespace in the local scope");
	this.namespaceWithValidName = function() {
		var name = "method_01_namespace_createNamespaceWithValidName";
		var ns = method.createNamespace(name);
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
		$AssertNotNull(ns, "new namespace is not null");
		$AssertEquals(ns.$method().__getName(), name, "new namespace has correct name: " + ns.$method().__getName());
		$AssertEquals(ns.$method().__getRelativeName(), name, "new namespace has correct relative name: " + ns.$method().__getRelativeName());
		$AssertTrue(ns.$method().__isValid(ns), "new namespace is in the namespace cache");
		$AssertNull(ns.$method().__getParent(), "new namespace has no parent namespace");
		$AssertEquals(ns.$method().__getChildren().length, 0, "new namespace has no child namespaces");
		method.delete(ns);
		$AssertFalse(ns.$method().__isValid(), "new namespace is no longer in the namespace cache");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Test("create a single namespace in the local scope with invalid name");
	this.namespaceWithInvalidName = function() {
		var name = "method-01-namespace-createNamedNamespace#@#$";
		var ns = null;
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		$Error(function() {
			ns = method.createNamespace(name);
		}, new Error("Namespace name is invalid: " + name), "new namespace with invalid name");
		$AssertNull(ns, "new namespace was not created");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Test("create, examine, and delete namespacesin the global namespace");
	this.namespaceInGlobalScope = function() {
		global.$$globalNamespace = method.createNamespace();
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
		$AssertNotNull(global.$$globalNamespace, "new namespace is not null");
		$AssertNotNull(global.$$globalNamespace.$method().__getName(), "new namespace name is not null");
		$AssertEquals(global.$$globalNamespace.$method().__getName(), "$$globalNamespace", "new namespace name is correct: " + global.$$globalNamespace.$method().__getName());
		$AssertTrue(global.$$globalNamespace.$method().__isValid(), "new namespace is in the namespace cache");
		$AssertNotNull(global.$$globalNamespace.$method().__getParent(), "new namespace has parent namespace");
		$AssertEquals(global.$$globalNamespace.$method().__getParent(), rootNamespace, "new namespace parent namespace is the root namespace");
		$AssertEquals(global.$$globalNamespace.$method().__getChildren().length, 0, "new namespace has no child namespaces");
		method.delete(global.$$globalNamespace);
		$Error(function() {
			if (global.$$globalNamespace.$method()) {
				(function() {
				})();
			}
		}, null, "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Test("create, examine, and delete multiple, nested namespaces in the root namespace");
	this.rootNamespaceHierarchy = function() {
		var name1 = "ns1";
		rootNamespace.ns1 = method.createNamespace();
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
		var ns1 = rootNamespace.ns1;
		$AssertEquals(ns1.$method().__getName(), name1, "new namespace #1 has correct name: " + ns1.$method().__getName());
		var name2 = "ns1.ns2";
		ns1.ns2 = method.createNamespace();
		$AssertEquals(method.$method().__namespaces.length, 4, "method has 4 namespaces: " + method.$method().__namespaces.length);
		var ns2 = ns1.ns2;
		$AssertIdentical(ns2.$method().__getParent(), ns1, "new namespace #2 has correct parent namespace");
		$AssertEquals(ns1.$method().__getChildren().length, 1, "new namespace #1 has correct number of child namespaces");
		$AssertIdentical(ns1.ns2, ns1.$method().__getChildren()[0], "new namespace #1 has correct child namespace");
		$AssertEquals(ns2.$method().__getName(), name2, "new namespace #2 has correct name: " + ns2.$method().__getName());
		var name3 = "ns1.ns2.ns3";
		ns1.ns2.ns3 = method.createNamespace();
		$AssertEquals(method.$method().__namespaces.length, 5, "method has 5 namespaces: " + method.$method().__namespaces.length);
		var ns3 = ns1.ns2.ns3;
		$AssertIdentical(ns3.$method().__getParent(), ns1.ns2, "new namespace #3 has correct parent namespace");
		$AssertEquals(ns2.$method().__getChildren().length, 1, "new namespace #2 has correct number of child namespaces");
		$AssertIdentical(ns1.ns2.ns3, ns2.$method().__getChildren()[0], "new namespace #2 has correct child namespace");
		$AssertEquals(ns3.$method().__getName(), name3, "new namespace #3 has correct name: " + ns3.$method().__getName());
		$AssertNotNull(ns1.$method().__getParent(), "new namespace has a parent namespace");
		$AssertEquals(ns1.$method().__getParent(), rootNamespace, "new namespace parent namespace is the root namespace");
		$AssertEquals(ns3.$method().__getChildren().length, 0, "new namespace #3 has correct number of child namespaces");
		method.delete(ns1);
		$AssertFalse(ns1.$method().__isValid(), "new namespace #1 is no longer in the namespace cache");
		$AssertFalse(ns2.$method().__isValid(), "new namespace #2 is no longer in the namespace cache");
		$AssertFalse(ns3.$method().__isValid(), "new namespace #3 is no longer in the namespace cache");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Test("create, examine, and delete multiple, nested namespaces in the local namespace");
	this.relativeNamespaceHierarchy = function() {
		var name1 = "ns1";
		method.createNamespace(this);
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
		this.ns1 =  method.createNamespace();
		$AssertEquals(method.$method().__namespaces.length, 4, "method has 4 namespaces: " + method.$method().__namespaces.length);
		$AssertEquals(this.ns1.$method().__getName(), name1, "new namespace #1 has correct name: " + this.ns1.$method().__getName());
		var name2 = "ns1.ns2";
		this.ns1.ns2 = method.createNamespace();
		$AssertEquals(method.$method().__namespaces.length, 5, "method has 5 namespaces: " + method.$method().__namespaces.length);
		$AssertIdentical(this.ns1.ns2.$method().__getParent(), this.ns1, "new namespace #2 has correct parent namespace");
		$AssertEquals(this.ns1.$method().__getChildren().length, 1, "new namespace #1 has correct number of child namespaces");
		$AssertIdentical(this.ns1.ns2, this.ns1.$method().__getChildren()[0], "new namespace #1 has correct child namespace");
		$AssertEquals(this.ns1.ns2.$method().__getName(), name2, "new namespace #2 has correct name: " + this.ns1.ns2.$method().__getName());
		var name3 = "ns1.ns2.ns3";
		this.ns1.ns2.ns3 = method.createNamespace();
		$AssertEquals(method.$method().__namespaces.length, 6, "method has 6 namespaces: " + method.$method().__namespaces.length);
		$AssertIdentical(this.ns1.ns2.ns3.$method().__getParent(), this.ns1.ns2, "new namespace #3 has correct parent namespace");
		$AssertEquals(this.ns1.ns2.$method().__getChildren().length, 1, "new namespace #2 has correct number of child namespaces");
		$AssertIdentical(this.ns1.ns2.ns3, this.ns1.ns2.$method().__getChildren()[0], "new namespace #2 has correct child namespace");
		$AssertEquals(this.ns1.ns2.ns3.$method().__getName(), name3, "new namespace #3 has correct name: " + this.ns1.ns2.ns3.$method().__getName());
		$AssertEquals(this.ns1.ns2.ns3.$method().__getChildren().length, 0, "new namespace #2 has correct number of child namespaces");
		method.delete(this);
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Test("create, examine, and delete a single, unnamed namespace in the local scope");
	this.viaMethodNamespace = function() {
		var ns = new $MethodNamespace();
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
		$AssertNotNull(ns, "new namespace is not null");
		$AssertNull(ns.$method().__getName(), "new namespace has no name: " + ns.$method().__getName());
		$AssertTrue(ns.$method().__isValid(), "new namespace is in the namespace cache");
		$AssertNull(ns.$method().__getParent(), "new namespace has no parent namespace");
		$AssertEquals(ns.$method().__getChildren().length, 0, "new namespace has no child namespaces");
		$MethodDelete(ns);
		$AssertFalse(ns.$method().__isValid(), "new namespace is no longer in the namespace cache");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

}

$RegisterUnitTest(Method_Namespace);

$UnitTest("method - type unit tests");
function Method_Type() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		global.test = method.createNamespace();
		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	};

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();
		$Error(function() {
			if (test) {
				(function() {
				})();
			}
		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test("create the type 'test.type'");
	this.simpleType = function() {
		test.type = method.createType($PUBLIC, []);
		$AssertEquals(test.type.name, "__MethodType", "new type has the correct constructor");
		$AssertEquals(test.type, test.type.$method().__object, "new type __object is type");
		$AssertNotNull(test.type.$method(), "new type is a namespace");
		$AssertEquals(test.type.$method().__getName(), "test.type", "new type name is 'test.type'");
		$AssertNull(test.type.$method().__superclass, "new type __superclass state is null");
		$AssertEquals(test.type.$method().__getParent().$method().__getName(), test.$method().__getName(), "new type parent namespace is correct: " + test.$method().__getName());
		$AssertEquals(test.type.$method().__getParent().type, test.type, "new type is in namespace: " + test.$method().__getName());
		$AssertFalse(test.type.$method().__isAbstract(), "new type is not abstract");
		$AssertFalse(test.type.$method().__isStatic(), "new type is not static");
		$AssertFalse(test.type.$method().__isFinal(), "new type is not final");
		$AssertFalse(test.type.$method().__isInterface(), "new type is not an interface");
		$AssertFalse(test.type.$method().__initialized, "new type is not initialized");
		$AssertTrue(test.type.$method().__interfaces.length == 0, "new type does not implement interfaces");
		$AssertEquals(test.type.$method().__getOperations().length, 0, "new type does not have operations");
	};

	$Test("create an instance of the type 'test.type'");
	this.instantiateType = function() {
		$AssertEquals(test.type.$method().__getName(), "test.type", "type named 'test.type' exists");
		var obj = new test.type();
		$AssertNotNull(obj, "instance of new type is not null");
		$AssertIdentical(test.type, obj.constructor, "constructor of instance of new type is type");
	};

	$Test("create an instance of the type 'test.type'");
	this.instantiateVia$new = function() {
		var obj = test.type.$new();
		$AssertNotNull(obj, "instance of new type is not null");
		$AssertIdentical(test.type, obj.constructor, "constructor of instance of new type is type");
	};

	$Test("create a subclass of 'test.type' named 'test.subclass'");
	this.subclass = function() {
		test.subclass = method.createType($PUBLIC, [test.type]);
		$AssertEquals(test.subclass, test.subclass.$method().__object, "new type __object is type");
		$AssertNotNull(test.subclass.$method(), "new type is a namespace");
		$AssertEquals(test.subclass.$method().__getName(), "test.subclass", "new type name is 'test.subclass'");
		$AssertTrue(test.subclass.$method().__isSubclass(test.type), "test.subclass is a subclass of test.type");
		$AssertTrue(test.subclass.$method().__isAssignableFrom(test.type), "test.subclass is assignable from test.type");
	};

	$Test("create the type 'test.notsubclass' which has no parent class");
	this.notSubclass = function() {
		test.notsubclass = method.createType($PUBLIC, []);
		$AssertNotNull(test.notsubclass.$method(), "test.notsubclass", "new type is a namespace");
		$AssertEquals(test.notsubclass, test.notsubclass.$method().__object, "new type __object is type");
		$AssertEquals(test.notsubclass.$method().__getName(), "test.notsubclass", "new type name is 'test.notsubclass'");
		$AssertFalse(method.isAssignableFrom(test.notsubclass, test.type), "test.notsubclass is not assignable from test.type");
	};

}

$RegisterUnitTest(Method_Type);

$UnitTest("method - operation unit tests");
function Method_Operation() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		global.test = method.createNamespace();
		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	};

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();
		$Error(function() {
			if (test) {
				(function() {
				})();
			}
		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test("add 3 instance methods to the type 'test.type'");
	this.instanceOperations = function() {
		test.type = method.createType($PUBLIC, []);
		$AssertTrue(test.$method().__isValid(test.type), "new type is in the namespace cache");
		$AssertEquals(test.type.name, "__MethodType", "new type has the correct constructor");
		$AssertEquals(test.type, test.type.$method().__object, "new type __object is type");
		$AssertEquals(test.type.$method().__getName(), "test.type", "new type name is 'test.type'");
		var type = test.type;
		$AssertEquals(type.$method().__getOperations().length, 0, "new type has no operations: " + type.$method().__getOperations().length);
		type.$prototype($PUBLIC, String, []).foobar = function() {
			return "foobar";
		};
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[0].$method().__getRelativeName(), "foobar", "new type operation #1 is correct: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type.prototype).indexOf("foobar"), -1, "method is a part of type prototype: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		type.$prototype($PUBLIC, String, []).foobaz = function() {
			return "foobaz";
		};
		$AssertEquals(type.$method().__getOperations().length, 2, "new type has 2 operations: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[1].$method().__getRelativeName(), "foobaz", "new type operation #2 is correct: " + type.$method().__getOperations()[1].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type.prototype).indexOf("foobaz"), -1, "method is a part of type prototype: " + type.$method().__getOperations()[1].$method().__getRelativeName());
		type.$prototype($PUBLIC, String, []).aTowelYouAre = function() {
			return "You're towel";
		};
		$AssertEquals(type.$method().__getOperations().length, 3, "new type has 3 operations: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[2].$method().__getRelativeName(), "aTowelYouAre", "new type operation #3 is correct: " + type.$method().__getOperations()[2].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type.prototype).indexOf("aTowelYouAre"), -1, "method is a part of type prototype: " + type.$method().__getOperations()[2].$method().__getRelativeName());
		$AssertEquals(type.prototype.foobar(), "foobar", "direct invocation of type.prototype.foobar() returns correct result");
		$AssertEquals(type.prototype.foobaz(), "foobaz", "direct invocation of type.prototype.foobaz() returns correct result");
		$AssertEquals(type.prototype.aTowelYouAre(), "You're towel", "direct invocation of type.prototype.aTowelYouAre() returns correct result");
		var obj = new test.type();
		$AssertEquals(obj.foobar(), "foobar", "invocation of type.foobar() returns correct result");
		$AssertEquals(obj.foobaz(), "foobaz", "invocation of type.foobaz() returns correct result");
		$AssertEquals(obj.aTowelYouAre(), "You're towel", "invocation of type.aTowelYouAre() returns correct result");
		type.$method().__delete();
	};

	$Test("add 2 class methods to the type 'test.type'");
	this.staticOperations = function() {
		test.type = method.createType($PUBLIC, []);
		$AssertTrue(test.$method().__isValid(test.type), "new type is in the namespace cache");
		$AssertEquals(test.type.name, "__MethodType", "new type has the correct constructor");
		$AssertEquals(test.type, test.type.$method().__object, "new type __object is type");
		$AssertEquals(test.type.$method().__getName(), "test.type", "new type name is 'test.type'");
		var type = test.type;
		$AssertEquals(type.$method().__getOperations().length, 0, "new type has no operations: " + type.$method().__getOperations().length);
		type.$class($PUBLIC, String, []).helloWorld = function() {
			return "hello world";
		};
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[0].$method().__getRelativeName(), "helloWorld", "new type operation #4 is correct: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type).indexOf("helloWorld"), -1, "method is a part of type: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		type.$class($PUBLIC, String, []).helloFoobar = function() {
			return "hello foobar";
		};
		$AssertEquals(type.$method().__getOperations().length, 2, "new type has 2 operations: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[1].$method().__getRelativeName(), "helloFoobar", "new type operation #5 is correct: " + type.$method().__getOperations()[1].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type).indexOf("helloFoobar"), -1, "method is a part of type: " + type.$method().__getOperations()[1].$method().__getRelativeName());
		$AssertEquals(type.helloWorld(), "hello world", "direct invocation of type.helloWorld() returns correct result");
		$AssertEquals(type.helloFoobar(), "hello foobar", "direct invocation of type.helloFoobar() returns correct result");
		type.$method().__delete();
	};

	$Test("add 2 class methods to the type 'test.type'");
	this.mixedOperations = function() {
		test.type = method.createType($PUBLIC, []);
		var type = test.type;
		$AssertEquals(type.$method().__getOperations().length, 0, "new type has no operations: " + type.$method().__getOperations().length);
		type.$class($PUBLIC, String, []).helloWorld = function() {
			return ("HELLO WORLD");
		};
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		type.$prototype($PUBLIC, String, []).helloWorld = function() {
			return ("hello world");
		};
		$AssertEquals(type.$method().__getOperations().length, 2, "new type has 2 operations: " + type.$method().__getOperations().length);
		$AssertEquals(type.helloWorld(), "HELLO WORLD", "static operation has correct return value: " + type.helloWorld());
		$AssertEquals(new type().helloWorld(), "hello world", "instance operation has correct return value: " + new type().helloWorld());
	};

	$Test("add 1 operation with 4 implementations to 'test.type'");
	this.multipleImplementations = function() {
		test.type = method.createType($PUBLIC, []);
		$AssertTrue(test.$method().__isValid(test.type), "new type is in the namespace cache");
		$AssertEquals(test.type.name, "__MethodType", "new type has the correct constructor");
		$AssertEquals(test.type, test.type.$method().__object, "new type __object is type");
		$AssertEquals(test.type.$method().__getName(), "test.type", "new type name is 'test.type'");
		var type = test.type;
		$AssertEquals(type.$method().__getOperations().length, 0, "new type has no operations: " + type.$method().__getOperations().length);
		type.$prototype($PUBLIC, String, []).foobar = function() {
			return "foobar";
		};
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[0].$method().__getRelativeName(), "foobar", "new type operation #1 is correct: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type.prototype).indexOf("foobar"), -1, "method is a part of type prototype: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 1, "operation has 1 implementation: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$prototype($PUBLIC, String, [String]).foobar = function(value) {
			return "foobar-" + value;
		};
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[0].$method().__getRelativeName(), "foobar", "new type operation #1 is correct: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type.prototype).indexOf("foobar"), -1, "method is a part of type prototype: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 2, "operation has 2 implementations: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$prototype($PROTECTED, String, [Number]).foobar = function(value) {
			return "foobar: " + value;
		};
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 3, "operation has 3 implementations: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$prototype($PRIVATE, String, [Boolean]).foobar = function(value) {
			return "foobar (" + value + ")";
		};
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 4, "operation has 4 implementations: " + type.$method().__getOperations()[0].$method().__children.length);
		$AssertEquals(type.prototype.foobar(), "foobar", "direct invocation of type.prototype.foobar() returns correct result");
		$AssertEquals(type.prototype.foobar("foobar"), "foobar-foobar", "direct invocation of type.prototype.foobar('-foobar') returns correct result");
		$AssertEquals(type.prototype.foobar(10), "foobar: 10", "direct invocation of type.prototype.foobar(10) returns correct result");
		$AssertEquals(type.prototype.foobar(false), "foobar (false)", "direct invocation of type.prototype.foobar(false) returns correct result");
		var obj = new test.type();
		$AssertEquals(obj.foobar(), "foobar", "invocation of type.prototype.foobar() returns correct result");
		$AssertEquals(obj.foobar("foobar"), "foobar-foobar", "invocation of type.prototype.foobar('foobar') returns correct result");
		$AssertEquals(obj.foobar(10), "foobar: 10", "invocation of type.prototype.foobar(10) returns correct result");
		$AssertEquals(obj.foobar(false), "foobar (false)", "invocation of type.prototype.foobar(false) returns correct result");
		type.$method().__delete();
	};

	$Test("add 1 operation with 2 incompatible implementations to 'test.type'");
	this.incompatibleImplementations = function() {
		test.type = method.createType($PUBLIC, []);
		$AssertTrue(test.$method().__isValid(test.type), "new type is in the namespace cache");
		$AssertEquals(test.type.name, "__MethodType", "new type has the correct constructor");
		$AssertEquals(test.type, test.type.$method().__object, "new type __object is type");
		$AssertEquals(test.type.$method().__getName(), "test.type", "new type name is 'test.type'");
		var type = test.type;
		$AssertEquals(type.$method().__getOperations().length, 0, "new type has no operations: " + type.$method().__getOperations().length);
		type.$prototype($PUBLIC, String, []).foobar = function() {
			return "foobar";
		};
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[0].$method().__getRelativeName(), "foobar", "new type operation #1 is correct: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type.prototype).indexOf("foobar"), -1, "method is a part of type prototype: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 1, "operation has 1 implementation: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$prototype($PUBLIC, String, [String]).foobar = function(value) {
			return "foobar" + value;
		};
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 2, "operation has 2 implementations: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$prototype($PUBLIC, null, [String]).foobar = function(value) {
			return "foobar" + value;
		};

		$Error(function() {
			type.$prototype($PROTECTED, String, [Number]).foobar = function(value) {
				return "foobar: " + value;
			};
		}, new Error("The return type of operation test.type.foobar(String) must be String."), "attempt to add an incompatible implementation");
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 2, "operation has 2 implementations: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$method().__delete();
	};

	$Test("invoke an operation with an implementation with default args");
	this.implementationWithDefaultArgs = function() {
		test.type = method.createType($PUBLIC, []);
		var type = test.type;
		$AssertEquals(type.$method().__getOperations().length, 0, "new type has no operations: " + type.$method().__getOperations().length);
		type.$prototype($PUBLIC, String, []).foobar = function() {
			return "foobar";
		};
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[0].$method().__getRelativeName(), "foobar", "new type operation #1 is correct: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type.prototype).indexOf("foobar"), -1, "method is a part of type prototype: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 1, "operation has 1 implementation: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$prototype($PUBLIC, String, [String]).foobar = function(value) {
			return "foobar: " + value;
		};
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 2, "operation has 2 implementations: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$prototype($PUBLIC, String, [Number, 10]).foobar = function(value1, value2) {
			return "foobar: " + (value1 + value2);
		};
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 3, "operation has 3 implementations: " + type.$method().__getOperations()[0].$method().__children.length);
		var obj = new test.type();
		$AssertEquals(obj.foobar(), "foobar", "invocation of type.prototype.foobar() returns correct result");
		$AssertEquals(obj.foobar("foobar"), "foobar: foobar", "invocation of type.prototype.foobar('foobar') returns correct result");
		$AssertEquals(obj.foobar(10), "foobar: 20", "invocation of type.prototype.foobar(10) returns correct result");
		$AssertEquals(obj.foobar(10, 20), "foobar: 30", "invocation of type.prototype.foobar(10, 20) returns correct result");
		type.$method().__delete();
	};

	$Test("invoke operation without a matching implementation");
	this.noValidImplementation = function() {
		test.type = method.createType($PUBLIC, []);
		var type = test.type;
		$AssertEquals(type.$method().__getOperations().length, 0, "new type has no operations: " + type.$method().__getOperations().length);
		type.$prototype($PUBLIC, String, []).foobar = function() {
			return "foobar";
		};
		$AssertEquals(type.$method().__getOperations().length, 1, "new type has 1 operation: " + type.$method().__getOperations().length);
		$AssertEquals(type.$method().__getOperations()[0].$method().__getRelativeName(), "foobar", "new type operation #1 is correct: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(type.prototype).indexOf("foobar"), -1, "method is a part of type prototype: " + type.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 1, "operation has 1 implementation: " + type.$method().__getOperations()[0].$method().__children.length);
		type.$prototype($PUBLIC, String, [String]).foobar = function(value) {
			return "foobar: " + value;
		};
		$AssertEquals(type.$method().__getOperations()[0].$method().__children.length, 2, "operation has 2 implementations: " + type.$method().__getOperations()[0].$method().__children.length);
		var obj = new test.type();
		$AssertEquals(obj.foobar(), "foobar", "invocation of type.prototype.foobar() returns correct result");
		$AssertEquals(obj.foobar("foobar"), "foobar: foobar", "invocation of type.prototype.foobar('foobar') returns correct result");
		$Error(function() {
			obj.foobar(10, "abc");
		}, new Error("Unable to invoke the operation test.type.foobar(Number,String), no matching implementation."), "attempt to add an incompatible implementation");
		type.$method().__delete();
	};

}

$RegisterUnitTest(Method_Operation);

$UnitTest("method - operation unit tests");
function Method_Interface() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		global.test = method.createNamespace();
		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	};

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();
		$Error(function() {
			if (test) {
				(function() {
				})();
			}
		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test("create the interface 'test.protocol'");
	this.simpleInterface = function() {
		test.protocol = method.createInterface($PUBLIC, []);
		$AssertEquals(test.protocol.name, "__MethodType", "new interface has the correct constructor");
		$AssertEquals(test.protocol, test.protocol.$method().__object, "new interface __object is type");
		$AssertNotNull(test.protocol.$method(), "test.protocol", "new interface is a namespace");
		$AssertEquals(test.protocol.$method().__getName(), "test.protocol", "new interface name is 'test.protocol'");
		$AssertNull(test.protocol.$method().__superclass, "new interface __superclass state is null");
		$AssertEquals((test.protocol.$method().__getParent()).$method().__getName(), test.$method().__getName(), "new interface .__getName() state is " + test.$method().__getName());
		$AssertEquals(test.protocol.$method().__getParent().protocol, test.protocol, "new interface is in namespace " + test.$method().__getName());
		$AssertFalse(test.protocol.$method().__isAbstract(), "new interface is not abstract");
		$AssertFalse(test.protocol.$method().__isStatic(), "new interface is not static");
		$AssertFalse(test.protocol.$method().__isFinal(), "new interface is not final");
		$AssertTrue(test.protocol.$method().__isInterface(), "new interface is an interface");
		$AssertFalse(test.protocol.$method().__initialized, "new interface is not initialized");
		$AssertTrue(test.protocol.$method().__interfaces.length == 0, "new interface does not implement interfaces");
		$AssertEquals(test.protocol.$method().__getOperations().length, 0, "new interface does not have operations");
	};

	$Test("create an instance of the interface 'test.protocol'");
	this.instantiateInterface = function() {
		$AssertEquals(test.protocol.$method().__getName(), "test.protocol", "type named 'test.protocol' exists");
		var obj = null;
		$Error(function() {
			obj = new test.protocol();
		}, new Error("The interface test.protocol cannot be instantiated."), "attempt to instantiate an interface");
		$AssertNull(obj, "instance of new interface is null");
	};

	$Test("create a subclass of 'test.protocol' named 'test.subprotocol'");
	this.subclass = function() {
		test.subprotocol = method.createInterface($PUBLIC, [test.protocol]);
		$AssertEquals(test.subprotocol, test.subprotocol.$method().__object, "new interface __object is type");
		$AssertNotNull(test.subprotocol.$method(), "new interface is a namespace");
		$AssertEquals(test.subprotocol.$method().__getName(), "test.subprotocol", "new type name is 'test.subprotocol'");
		$AssertTrue(test.subprotocol.$method().__isAssignableFrom(test.protocol), "test.subprotocol is assignable from test.protocol");
	};

	$Test("create the type 'test.notsubprotocol' which has no parent interfaces");
	this.notSubclass = function() {
		test.notsubprotocol = method.createInterface($PUBLIC, []);
		$AssertNotNull(test.notsubprotocol.$method(), "test.notsubprotocol", "new type is a namespace");
		$AssertEquals(test.notsubprotocol, test.notsubprotocol.$method().__object, "new type __object is type");
		$AssertEquals(test.notsubprotocol.$method().__getName(), "test.notsubprotocol", "new type name is 'test.notsubprotocol'");
		$AssertFalse(method.isAssignableFrom(test.notsubprotocol, test.protocol), "test.notsubprotocol is not assignable from test.protocol");
	};

	$Test("add 2 operations to the type 'test.protocol'");
	this.multipleOperations = function() {
		var protocol = test.protocol;
		$AssertEquals(protocol.$method().__getOperations().length, 0, "new interface has no operations: " + protocol.$method().__getOperations().length);
		protocol.$prototype($PUBLIC, String, [String, Number]).foobar = null;
		$AssertEquals(protocol.$method().__getOperations().length, 1, "new interface has 1 operation: " + protocol.$method().__getOperations().length);
		$AssertEquals(protocol.$method().__getOperations()[0].$method().__getRelativeName(), "foobar", "new interface operation #1 is correct: " + protocol.$method().__getOperations()[0].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(protocol.prototype).indexOf("foobar"), -1, "method is a part of type prototype: " + protocol.$method().__getOperations()[0].$method().__getRelativeName());
		protocol.$prototype($PUBLIC, String, []).foobaz = null;
		$AssertEquals(protocol.$method().__getOperations().length, 2, "new interface has 2 operations: " + protocol.$method().__getOperations().length);
		$AssertEquals(protocol.$method().__getOperations()[1].$method().__getRelativeName(), "foobaz", "new interface operation #2 is correct: " + protocol.$method().__getOperations()[1].$method().__getRelativeName());
		$AssertNotEquals(Object.getOwnPropertyNames(protocol.prototype).indexOf("foobaz"), -1, "method is a part of type prototype: " + protocol.$method().__getOperations()[1].$method().__getRelativeName());
		$Error(function() {
			test.protocol.prototype.foobar.apply(null, ["abc", 10]);
		}, new Error("The abstract operation test.protocol.foobar(String,Number) is not implemented."), "attempt to invoke an interface operation");
		$Error(function() {
			test.protocol.prototype.foobaz.apply(null, []);
		}, new Error("The abstract operation test.protocol.foobaz() is not implemented."), "attempt to invoke an interface operation");
	};

	$Test("add 2 implementations to the type 'test.protocol'");
	this.multipleImplementations = function() {
		var protocol = test.protocol;
		$AssertEquals(protocol.$method().__getOperations().length, 2, "new interface has 2 operations: " + protocol.$method().__getOperations().length);
		protocol.$prototype($PUBLIC, String, []).foobar = null;
		$AssertEquals(protocol.$method().__getOperations().length, 2, "new interface has 2 operations: " + protocol.$method().__getOperations().length);
		$AssertEquals(protocol.$method().__getOperations()[0].$method().__children.length, 2, "protocol.foobar has 2 implementations: " + protocol.$method().__getOperations()[0].$method().__children.length);
		$AssertEquals(protocol.$method().__getOperations()[0].$method().__children[0].$method().__parameterTypes.length, 2, "protocol.foobar implementation #1 has 2 parameters: " + protocol.$method().__getOperations()[0].$method().__children[0].$method().__parameterTypes.length);
		$AssertEquals(protocol.$method().__getOperations()[0].$method().__children[0].$method().__parameterTypes[0], String, "protocol.foobar implementation #1 parameter #1 type is correct: " + protocol.$method().__getOperations()[0].$method().__children[0].$method().__parameterTypes[0].name);
		$AssertEquals(protocol.$method().__getOperations()[0].$method().__children[0].$method().__parameterTypes[1], Number, "protocol.foobar implementation #1 parameter #2 type is correct: " + protocol.$method().__getOperations()[0].$method().__children[0].$method().__parameterTypes[1].name);
		$AssertEquals(protocol.$method().__getOperations()[0].$method().__children[1].$method().__parameterTypes.length, 0, "protocol.foobar implementation #2 has no parameters: " + protocol.$method().__getOperations()[0].$method().__children[1].$method().__parameterTypes.length);
	};

	$Test("add 1 operation with 2 incompatible implementations to 'test.protocol'");
	this.incompatibleImplementations = function() {
		var protocol = test.protocol;
		protocol.$prototype($PUBLIC, null, [String]).foobar = null;

		$Error(function() {
			protocol.$prototype($PROTECTED, String, [Number]).foobar = null;
		}, new Error("The return type of operation test.protocol.foobar(String) must be String."), "attempt to add an incompatible implementation");
		$AssertEquals(protocol.$method().__getOperations().length, 2, "new interface has 2 operations: " + protocol.$method().__getOperations().length);
		$AssertEquals(protocol.$method().__getOperations()[0].$method().__children.length, 2, "protocol.foobar has 2 implementations: " + protocol.$method().__getOperations()[0].$method().__children.length);
	};

}

$RegisterUnitTest(Method_Interface);

$UnitTest("method - constructor unit tests");
function Method_Constructor() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		global.test = method.createNamespace();
		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	};

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();
		$Error(function() {
			if (test) {
				(function() {
				})();
			}
		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test();
	this.test = function() {
	};

	$Test("create the type 'test.type'");
	this.simpleType = function() {
		test.type = method.createType($PUBLIC, []);
		$AssertEquals(test.type.name, "__MethodType", "new type has the correct constructor");
		$AssertEquals(test.type.$method().__getName(), "test.type", "new type name is 'test.type'");
		$AssertEquals(test.type.$method().__getOperations().length, 0, "new type does not have operations");
	};

	$Test("create the default constructor for 'test.type'");
	this.defaultConstructor = function() {
		test.type.$prototype($PUBLIC, null, []).type = function() {
			this.value1 = "abc";
			this.value2 = "def";
		};
		$AssertEquals(test.type.$method().__getOperations().length, 1, "type has 1 operation");
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__attributes & $CONSTRUCTOR, $CONSTRUCTOR, "operation is a constructor");
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__children.length, 1, "operation has 1 implementation: " + test.type.$method().__getOperations()[0].$method().__children.length);
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__children[0].$method().__attributes & $PUBLIC, $PUBLIC, "implementation is public");
		var obj = new test.type();
		$AssertEquals(obj.value1, "abc", "new type has correct value1 state: " + obj.value1);
		$AssertEquals(obj.value2, "def", "new type has correct value2 state: " + obj.value2);
	};

	$Test("create multiple non-default constructors for 'test.type'");
	this.multipleConstructors = function() {
		test.type.$prototype($PUBLIC, null, [String]).type = function(value) {
			this.value1 = "abc: " + value;
			this.value2 = "def: " + value;
		};
		test.type.$prototype($PUBLIC, null, [Number]).type = function(value) {
			this.value1 = "abc (" + value + ")";
			this.value2 = "def (" + (value * 2) + ")";
		};
		$AssertEquals(test.type.$method().__getOperations().length, 1, "type has 1 operation");
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__attributes & $CONSTRUCTOR, $CONSTRUCTOR, "operation is a constructor");
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__children.length, 3, "operation has 3 implementation: " + test.type.$method().__getOperations()[0].$method().__children.length);
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__children[0].$method().__attributes & $PUBLIC, $PUBLIC, "implementation #1 is public");
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__children[1].$method().__attributes & $PUBLIC, $PUBLIC, "implementation #2 is public");
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__children[2].$method().__attributes & $PUBLIC, $PUBLIC, "implementation #3 is public");
		var obj = new test.type();
		$AssertEquals(obj.value1, "abc", "default constructor - new type has correct value1 state: " + obj.value1);
		$AssertEquals(obj.value2, "def", "default constructor - new type has correct value2 state: " + obj.value2);
		obj = new test.type("foobar");
		$AssertEquals(obj.value1, "abc: foobar", "String constructor - new type has correct value1 state: " + obj.value1);
		$AssertEquals(obj.value2, "def: foobar", "String constructor - new type has correct value2 state: " + obj.value2);
		obj = new test.type(10);
		$AssertEquals(obj.value1, "abc (10)", "Number constructor - new type has correct value1 state: " + obj.value1);
		$AssertEquals(obj.value2, "def (20)", "Number constructor - new type has correct value2 state: " + obj.value2);
	};

	$Test("create multiple non-default constructors for 'test.type'");
	this.instantiateVia$newWithArgs = function() {
		var obj = test.type.$new(10);
		$AssertEquals(obj.value1, "abc (10)", "Number constructor - new type has correct value1 state: " + obj.value1);
		$AssertEquals(obj.value2, "def (20)", "Number constructor - new type has correct value2 state: " + obj.value2);
	};

}

$RegisterUnitTest(Method_Constructor);

$UnitTest("method - initializer unit tests");
function Method_Initializer() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		global.test = method.createNamespace();
		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	};

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();
		$Error(function() {
			if (test) {
				(function() {
				})();
			}
		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test("create the type 'test.type'");
	this.simpleType = function() {
		test.type = method.createType($PUBLIC, []);
		$AssertEquals(test.type.name, "__MethodType", "new type has the correct constructor");
		$AssertEquals(test.type.$method().__getName(), "test.type", "new type name is 'test.type'");
		$AssertEquals(test.type.$method().__getOperations().length, 0, "new type does not have operations");
	};

	$Test("create a static initializer for 'test.type'");
	this.staticInitializer = function() {
		test.type.$class($PUBLIC, null, []).$type = function() {
			this.classValue = "test.type";
		};
		$AssertEquals(test.type.$method().__getOperations().length, 1, "type has 1 operation: " + test.type.$method().__getOperations().length);
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__attributes & $STATIC, $STATIC, "operation #1 is static");
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__attributes & $INITIALIZER, $INITIALIZER, "operation #1 is an initializer");
		new test.type();
		$AssertEquals(test.type.classValue, "test.type", "type static initializer sets type state");
	};

	$Test("create a second static initializer for 'test.type'");
	this.secondStaticInitializer = function() {
		test.type.$class($PUBLIC, null, []).$type = function() {
			this.otherClassValue = "test.type";
		};
		$Error(function() {
			new test.type();
		}, new Error("Cannot redefine an initializer."), "attempted to add a 2nd static initializer.");
		new test.type();
		$AssertEquals(test.type.classValue, "test.type", "type static initializer sets type state");
		$AssertNull(test.type.otherClassValue, "type 2nd static initializer did not set additional type state");
	};

	$Test("create an instance initializer for 'test.type'");
	this.instanceInitializer = function() {
		test.type.$prototype($PUBLIC, null, []).type = function() {
			this.value1 = "abc";
			this.value2 = "def";
		};
		test.type.$prototype($PUBLIC, null, [String]).type = function(value) {
			this.value1 = "abc: " + value;
			this.value2 = "def: " + value;
		};
		$AssertEquals(test.type.$method().__getOperations().length, 2, "type has 2 operations: " + test.type.$method().__getOperations().length);
		test.type.$prototype($PUBLIC, null, [Number]).type = function(value) {
			this.value1 = "abc (" + value + ")";
			this.value2 = "def (" + (value * 2) + ")";
		};
		test.type.$prototype($PUBLIC, null, []).$type = function() {
			this.initializedValue = "test.type";
		};
		$AssertEquals(test.type.$method().__getOperations().length, 3, "type has 3 operations: " + test.type.$method().__getOperations().length);
		$AssertEquals(test.type.$method().__getOperations()[1].$method().__attributes & $CONSTRUCTOR, $CONSTRUCTOR, "operation is a constructor");
		$AssertEquals(test.type.$method().__getOperations()[1].$method().__children.length, 3, "operation has 3 implementation: " + test.type.$method().__getOperations()[1].$method().__children.length);
		var obj = new test.type();
		$AssertEquals(obj.value1, "abc", "default constructor - new object has correct value1 state: " + obj.value1);
		$AssertEquals(obj.value2, "def", "default constructor - new object has correct value2 state: " + obj.value2);
		$AssertEquals(obj.initializedValue, "test.type", "default constructor - new object has correct initializedValue state: " + obj.initializedValue);
		obj = new test.type("foobar");
		$AssertEquals(obj.value1, "abc: foobar", "String constructor - new object has correct value1 state: " + obj.value1);
		$AssertEquals(obj.value2, "def: foobar", "String constructor - new object has correct value2 state: " + obj.value2);
		$AssertEquals(obj.initializedValue, "test.type", "default constructor - new object has correct initializedValue state: " + obj.initializedValue);
		obj = new test.type(10);
		$AssertEquals(obj.value1, "abc (10)", "Number constructor - new object has correct value1 state: " + obj.value1);
		$AssertEquals(obj.value2, "def (20)", "Number constructor - new object has correct value2 state: " + obj.value2);
		$AssertEquals(obj.initializedValue, "test.type", "Number constructor - new object has correct initializedValue state: " + obj.initializedValue);
	};

	$Test("create a second static initializer for 'test.type'");
	this.secondInstanceInitializer = function() {
		test.type.$prototype($PUBLIC, null, []).$type = function() {
			this.otherInitializedValue = "test.type";
		};
		$Error(function() {
			new test.type();
		}, new Error("Cannot redefine an initializer."), "attempted to add a 2nd instance initializer.");
		var obj = new test.type();
		$AssertEquals(obj.initializedValue, "test.type", "new object has correct initializedValue state: " + obj.initializedValue);
		$AssertNull(obj.otherInitializedValue, "new object does not have state from 2nd initializer");
	};

}

$RegisterUnitTest(Method_Initializer);

$UnitTest("method - inheritance unit tests");
function Method_Inheritance() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		global.test = method.createNamespace();
		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	};

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();
		$Error(function() {
			if (test) {
				(function() {
				})();
			}
		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test();
	this.simpleType = function() {
		test.type = method.createType($PUBLIC, []);
		test.type.$prototype($PUBLIC, String, [String, String]).add = function(value1, value2) {
			return (value1 + value2);
		};
		test.type.$prototype($PUBLIC, String, [Number, Number]).add = function(value1, value2) {
			return (value1 + value2);
		};
		test.type.$prototype($PUBLIC, String, [Boolean, Boolean]).add = function(value1, value2) {
			return (value1 + value2);
		};
		test.type.$prototype($PUBLIC, String, [String, String]).combine = function(value1, value2) {
			return ("[type]" + value1 + value2);
		};
		$AssertEquals(test.type.$method().__getOperations().length, 2, "new type has 2 operations: " + test.type.$method().__getOperations().length);
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__children.length, 3, "operation has 3 implementations: " + test.type.$method().__getOperations()[0].$method().__children.length);
		var obj = new test.type();
		$AssertEquals(obj.add("a", "b"), "ab", "add(String,String) returns correct result");
		$AssertEquals(obj.add(1, 2), 3, "add(Number,Number) returns correct result");
		$AssertEquals(obj.add(true, false), 1, "add(Boolean,Boolean) returns correct result");
		$AssertEquals(obj.combine("aa", "bb"), "[type]aabb", "combine(String,String) returns correct result");
	};

	$Test();
	this.subclass = function() {
		test.subclass = method.createType($PUBLIC, [test.type]);
		$AssertEquals(test.subclass.$method().__getParentTypes()[0], test.type, "new subclass has correct parent class");
		$AssertEquals(test.subclass.$method().__getOperations().length, 2, "new subclass has 2 operations: " + test.subclass.$method().__getOperations().length);
		$AssertEquals(test.subclass.$method().__getOperations()[0].$method().__children.length, 3, "operation has 3 implementations: " + test.subclass.$method().__getOperations()[0].$method().__children.length);
		test.subclass.$prototype($PUBLIC, String, [String, String]).combine = function(value1, value2) {
			return ("[subclass]" + value1 + value2);
		};
		$AssertEquals(test.subclass.$method().__getOperations().length, 2, "new subclass has 2 operations: " + test.subclass.$method().__getOperations().length);
		$AssertEquals(test.subclass.$method().__getOperations()[0].$method().__children.length, 3, "operation has 3 implementations: " + test.subclass.$method().__getOperations()[0].$method().__children.length);
		var obj = new test.subclass();
		$AssertEquals(obj.add("a", "b"), "ab", "add(String,String) returns correct result: " + obj.add("a", "b"));
		$AssertEquals(obj.add(1, 2), 3, "add(Number,Number) returns correct result: " + obj.add(1, 2));
		$AssertEquals(obj.add(true, false), 1, "add(Boolean,Boolean) returns correct result: " + obj.add(true, false));
		$AssertEquals(obj.combine("aa", "bb"), "[subclass]aabb", "combine(String,String) returns correct result: " + obj.combine("aa", "bb"));
		obj = new test.type();
		$AssertEquals(obj.combine("aa", "bb"), "[type]aabb", "combine(String,String) returns correct result: " + obj.combine("aa", "bb"));
	};

	$Test();
	this.subclassOfSubclass = function() {
		test.subclassOfSubclass = method.createType($PUBLIC, [test.subclass]);
		$AssertEquals(test.subclassOfSubclass.$method().__getParentTypes()[0], test.type, "new subclass has correct parent class #1: " + test.subclassOfSubclass.$method().__getParentTypes()[0].$method().__name);
		$AssertEquals(test.subclassOfSubclass.$method().__getParentTypes()[1], test.subclass, "new subclass has correct parent class #2: " + test.subclassOfSubclass.$method().__getParentTypes()[1].$method().__name);
		$AssertEquals(test.subclassOfSubclass.$method().__getOperations().length, 2, "new subclass has 2 operations: " + test.subclassOfSubclass.$method().__getOperations().length);
		$AssertEquals(test.subclassOfSubclass.$method().__getOperations()[0].$method().__children.length, 3, "operation has 3 implementations: " + test.subclassOfSubclass.$method().__getOperations()[0].$method().__children.length);
		var obj = new test.subclassOfSubclass();
		$AssertEquals(obj.add("a", "b"), "ab", "add(String,String) returns correct result: " + obj.add("a", "b"));
		$AssertEquals(obj.add(1, 2), 3, "add(Number,Number) returns correct result: " + obj.add(1, 2));
		$AssertEquals(obj.add(true, false), 1, "add(Boolean,Boolean) returns correct result: " + obj.add(true, false));
	};

	$Test();
	this.simpleInterface = function() {
		test.protocol = method.createInterface($PUBLIC, []);
		test.protocol.$prototype($PUBLIC, String, [String, String]).add = null;
		test.protocol.$prototype($PUBLIC, String, [Number, Number]).add = null;
		test.protocol.$prototype($PUBLIC, String, [Boolean, Boolean]).add = null;
		$AssertEquals(test.protocol.$method().__getOperations().length, 1, "new interface has 1 operation: " + test.protocol.$method().__getOperations().length);
		$AssertEquals(test.protocol.$method().__getOperations()[0].$method().__children.length, 3, "operation has 3 implementations: " + test.protocol.$method().__getOperations()[0].$method().__children.length);
		$Error(function() {
			test.protocol.prototype.add.apply(null, ["a", "b"]);
		}, new Error("The abstract operation test.protocol.add(String,String) is not implemented."), "attempt to invoke an interface operation");
		$Error(function() {
			test.protocol.prototype.add.apply(null, [1, 2]);
		}, new Error("The abstract operation test.protocol.add(Number,Number) is not implemented."), "attempt to invoke an interface operation");
		$Error(function() {
			var regex = new RegExp();
			test.protocol.prototype.add.apply(null, [regex, regex]);
		}, new Error("Unable to invoke the operation test.protocol.add(RegExp,RegExp), no matching implementation."), "interface operation, no matching implementation");
		$Error(function() {
			test.protocol.prototype.foobar.apply(null, []);
		}, null, "interface operation not defined");
	};

	$Test();
	this.subInterface = function() {
		test.subProtocol = method.createInterface($PUBLIC, [test.protocol]);
		test.subProtocol.$prototype($PUBLIC, String, [Date, Date]).add = null;
		test.subProtocol.$prototype($PUBLIC, String, [Number, Number]).subtract = null;
		$AssertEquals(test.subProtocol.$method().__getOperations().length, 2, "new interface has 2 operations: " + test.subProtocol.$method().__getOperations().length);
		$AssertEquals(test.subProtocol.$method().__getOperations()[0].$method().__children.length, 4, "operation has 4 implementations: " + test.subProtocol.$method().__getOperations()[0].$method().__children.length);
		$Error(function() {
			test.subProtocol.prototype.add.apply(null, ["a", "b"]);
		}, new Error("The abstract operation test.subProtocol.add(String,String) is not implemented."), "attempt to invoke an interface operation/String");
		$Error(function() {
			test.subProtocol.prototype.add.apply(null, [1, 2]);
		}, new Error("The abstract operation test.subProtocol.add(Number,Number) is not implemented."), "attempt to invoke an interface operation/Number");
		$Error(function() {
			test.subProtocol.prototype.add.apply(null, [new Date(), new Date()]);
		}, new Error("The abstract operation test.subProtocol.add(Date,Date) is not implemented."), "attempt to invoke an interface operation/Date");
		$Error(function() {
			var regex = new RegExp();
			test.subProtocol.prototype.add.apply(null, [regex, regex]);
		}, new Error("Unable to invoke the operation test.subProtocol.add(RegExp,RegExp), no matching implementation."), "interface operation, no matching implementation/RegExp");
		$Error(function() {
			test.subProtocol.prototype.foobar.apply(null, []);
		}, null, "interface operation not defined");
	};

	$Test();
	this.subSubInterface = function() {
		test.subSubProtocol = method.createInterface($PUBLIC, [test.subProtocol]);
		test.subSubProtocol.$prototype($PUBLIC, String, [RegExp, RegExp]).add = null;
		test.subSubProtocol.$prototype($PUBLIC, String, [Number, Number]).multiply = null;
		$AssertEquals(test.subSubProtocol.$method().__getOperations().length, 3, "new interface has 3 operations: " + test.subSubProtocol.$method().__getOperations().length);
		$AssertEquals(test.subSubProtocol.$method().__getOperations()[0].$method().__children.length, 5, "operation has 5 implementations: " + test.subSubProtocol.$method().__getOperations()[0].$method().__children.length);
		$Error(function() {
			test.subSubProtocol.prototype.add.apply(null, ["a", "b"]);
		}, new Error("The abstract operation test.subSubProtocol.add(String,String) is not implemented."), "attempt to invoke an interface operation/String");
		$Error(function() {
			test.subSubProtocol.prototype.add.apply(null, [1, 2]);
		}, new Error("The abstract operation test.subSubProtocol.add(Number,Number) is not implemented."), "attempt to invoke an interface operation/Number");
		$Error(function() {
			test.subSubProtocol.prototype.add.apply(null, [new Date(), new Date()]);
		}, new Error("The abstract operation test.subSubProtocol.add(Date,Date) is not implemented."), "attempt to invoke an interface operation/Date");
		$Error(function() {
			test.subSubProtocol.prototype.add.apply(null, [new RegExp(), new RegExp()]);
		}, new Error("The abstract operation test.subSubProtocol.add(RegExp,RegExp) is not implemented."), "attempt to invoke an interface operation/RegExp");
		$Error(function() {
			test.subSubProtocol.prototype.add.apply(null, [new Error(), new Error()]);
		}, new Error("Unable to invoke the operation test.subSubProtocol.add(Error,Error), no matching implementation."), "interface operation, no matching implementation/null");
		$Error(function() {
			test.subSubProtocol.prototype.subtract.apply(null, [0, 0]);
		}, new Error("The abstract operation test.subSubProtocol.subtract(Number,Number) is not implemented."), "attempt to invoke an interface operation/String");
		$Error(function() {
			test.subSubProtocol.prototype.multiply.apply(null, [0, 0]);
		}, new Error("The abstract operation test.subSubProtocol.multiply(Number,Number) is not implemented."), "attempt to invoke an interface operation/String");
		$Error(function() {
			test.subProtocol.prototype.foobar.apply(null, []);
		}, null, "interface operation not defined");
	};

}

$RegisterUnitTest(Method_Inheritance);

$UnitTest("method - super unit tests");
function Method_Super() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		global.test = method.createNamespace();
		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	};

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();
		$Error(function() {
			if (test) {
				(function() {
				})();
			}
		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test();
	this.simpleType = function() {
		test.type = method.createType($PUBLIC, []);
		test.type.$prototype($PUBLIC, null, []).type = function() {
			this.value1 = "abc";
		};
		test.type.$prototype($PUBLIC, String, [String, String]).combine = function(value1, value2) {
			return ("[type]" + value1 + value2);
		};
		$AssertEquals(test.type.$method().__getOperations().length, 2, "new type has 2 operations: " + test.type.$method().__getOperations().length);
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__attributes, $CONSTRUCTOR, "operation #1 is a constructor");
		$AssertEquals(test.type.$method().__getOperations()[0].$method().__children.length, 1, "operation #1 has 1 implementation: " + test.type.$method().__getOperations()[0].$method().__children.length);
		$AssertEquals(test.type.$method().__getOperations()[1].$method().__children.length, 1, "operation #2 has 1 implementation: " + test.type.$method().__getOperations()[1].$method().__children.length);
		var obj = new test.type();
		$AssertEquals(obj.combine("a", "b"), "[type]ab", "combine(String,String) returns correct result: " + obj.combine("a", "b"));
		$AssertEquals(obj.value1, "abc", "value1 contains correct value: " + obj.value1);
	};

	$Test();
	this.subclass = function() {
		test.subclass = method.createType($PUBLIC, [test.type]);
		test.subclass.$prototype($PUBLIC, null, []).subclass = function() {
			this.$super();
			this.value2 = "def";
		};
		$AssertEquals(test.subclass.$method().__getParentTypes()[0], test.type, "new subclass has correct parent class");
		$AssertEquals(test.subclass.$method().__getOperations().length, 2, "new subclass has 2 operations: " + test.subclass.$method().__getOperations().length);
		$AssertEquals(test.subclass.$method().__getOperations()[0].$method().__children.length, 1, "operation #1 has 1 implementation: " + test.subclass.$method().__getOperations()[0].$method().__children.length);
		$AssertEquals(test.subclass.$method().__getOperations()[1].$method().__attributes, $CONSTRUCTOR, "operation #1 is a constructor");
		$AssertEquals(test.subclass.$method().__getOperations()[1].$method().__children.length, 1, "operation #2 has 1 implementation: " + test.subclass.$method().__getOperations()[1].$method().__children.length);
		test.subclass.$prototype($PUBLIC, String, [String, String]).combine = function(value1, value2) {
			return (this.super().combine(value1, value2) + " [subclass]" + value1 + value2);
		};
		var obj = new test.subclass();
		$AssertEquals(obj.combine("a", "b"), "[type]ab [subclass]ab", "combine(String,String) returns correct result: " + obj.combine("a", "b"));
		$AssertEquals(obj.value1, "abc", "value1 contains correct value: " + obj.value1);
		$AssertEquals(obj.value2, "def", "value2 contains correct value: " + obj.value2);
	};

	$Test();
	this.subclassOfSubclass = function() {
		test.subclassOfSubclass = method.createType($PUBLIC, [test.subclass]);
		test.subclassOfSubclass.$prototype($PUBLIC, null, []).subclassOfSubclass = function() {
			this.$super();
			this.value3 = "ghi";
		};
		$AssertEquals(test.subclassOfSubclass.$method().__getParentTypes()[0], test.type, "new subclass has correct parent class #1: " + test.subclassOfSubclass.$method().__getParentTypes()[0].$method().__name);
		$AssertEquals(test.subclassOfSubclass.$method().__getParentTypes()[1], test.subclass, "new subclass has correct parent class #2: " + test.subclassOfSubclass.$method().__getParentTypes()[1].$method().__name);
		$AssertEquals(test.subclassOfSubclass.$method().__getOperations().length, 2, "new subclass has 2 operations: " + test.subclassOfSubclass.$method().__getOperations().length);
		$AssertEquals(test.subclassOfSubclass.$method().__getOperations()[0].$method().__children.length, 1, "operation has 1 implementation: " + test.subclassOfSubclass.$method().__getOperations()[0].$method().__children.length);
		test.subclassOfSubclass.$prototype($PUBLIC, String, [String, String]).combine = function(value1, value2) {
			return (this.super().combine(value1, value2) + " [subclassOfSubclass]" + value1 + value2);
		};
		var obj = new test.subclassOfSubclass();
		$AssertEquals(obj.combine("a", "b"), "[type]ab [subclass]ab [subclassOfSubclass]ab", "combine(String,String) returns correct result: " + obj.combine("a", "b"));
		$AssertEquals(obj.value1, "abc", "value1 contains correct value: " + obj.value1);
		$AssertEquals(obj.value2, "def", "value2 contains correct value: " + obj.value2);
		$AssertEquals(obj.value3, "ghi", "value3 contains correct value: " + obj.value3);
	};

}

$RegisterUnitTest(Method_Super);

$UnitTest("method - modifiers unit tests");
function Method_Modifiers() {

	$BeforeClass();
	this.beforeClass = function() {
	};

	$AfterClass();
	this.afterClass = function() {
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test();
	this.test = function() {
	};

}

$RegisterUnitTest(Method_Modifiers);

$UnitTest("method - this unit tests");
function Method_This() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
		global.test = method.createNamespace();
		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	};

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();
		$Error(function() {
			if (test) {
				(function() {
				})();
			}
		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	};

	$Before();
	this.before = function() {
	};

	$After();
	this.after = function() {
	};

	$Test();
	this.internalType = function() {
		test.type = method.createType($PUBLIC, []);
		test.type.$prototype().type = function() {
			var $this = this.$this;
			$this($PUBLIC, String, []).foobar = function() {
				return ("foobar");
			};
			$this($PUBLIC, String, []).foobaz = function() {
				return ("foobaz");
			};
		};
		var obj = new test.type();
		$AssertEquals(obj.foobar(), "foobar", "invocation of type.prototype.foobar() returns correct result: " + obj.foobar());
		$AssertEquals(obj.foobaz(), "foobaz", "invocation of type.prototype.foobar() returns correct result: " + obj.foobaz());
	};

}

$RegisterUnitTest(Method_This);

__TestPilot.runUnitTests();
console.log("\n" + __TestPilot.getReport());
process.exit(__TestPilot.getSummary().getUnitTestSummary().failed == 0 ? 0 : 1);

