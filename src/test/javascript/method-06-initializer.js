// method.js/src/test/javascript/method-06-initializer.js

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
