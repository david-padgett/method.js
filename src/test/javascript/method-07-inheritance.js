// testpilot.js/src/test/javascript/method-07-inheritance.js

$UnitTest("method - inheritance unit tests");
function Method_Inheritance() {

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

		var obj = new test.type();

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
