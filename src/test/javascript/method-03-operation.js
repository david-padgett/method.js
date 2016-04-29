// testpilot.js/src/test/javascript/method-03-operation.js

$UnitTest("method - operation unit tests");
function Method_Operation() {

	$BeforeClass("create the test namespace");
	this.beforeClass = function() {
		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);

		test = method.createNamespace();

		$AssertEquals(test.$method().__getName(), "test", "test namespace has correct name : " + test.$method().__getName());
		$AssertEquals(method.$method().__namespaces.length, 3, "method has 3 namespaces: " + method.$method().__namespaces.length);
	}

	$AfterClass("destroy the test namespace");
	this.afterClass = function() {
		test.$method().__delete();

		$Error(function() {

			var obj = test;

		}, new ReferenceError("test is not defined"), "new namespace is no longer valid");

		$AssertEquals(method.$method().__namespaces.length, 2, "method has 2 namespaces: " + method.$method().__namespaces.length);
	}

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

		// Error is not detected immediately, another method API must be invoked
		// before the error introduced above is noticed.

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
