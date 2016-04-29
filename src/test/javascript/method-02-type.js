// testpilot.js/src/test/javascript/method-02-type.js

$UnitTest("method - type unit tests");
function Method_Type() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);

		test = method.createNamespace();

		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
//check # of defined types
	}

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
//check # of defined types

		test.$method().__delete();

		$Error(function() {

			var obj = test;

		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");

		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
//check # of defined types
	}

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
