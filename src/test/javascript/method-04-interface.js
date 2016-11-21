// method.js/src/test/javascript/method-04-interface.js

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

		// Error is not detected immediately, another method API must be invoked
		// before the error introduced above is noticed.

		$Error(function() {
			protocol.$prototype($PROTECTED, String, [Number]).foobar = null;
		}, new Error("The return type of operation test.protocol.foobar(String) must be String."), "attempt to add an incompatible implementation");
		$AssertEquals(protocol.$method().__getOperations().length, 2, "new interface has 2 operations: " + protocol.$method().__getOperations().length);
		$AssertEquals(protocol.$method().__getOperations()[0].$method().__children.length, 2, "protocol.foobar has 2 implementations: " + protocol.$method().__getOperations()[0].$method().__children.length);
	};

}

$RegisterUnitTest(Method_Interface);
