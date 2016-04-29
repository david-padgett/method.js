// testpilot.js/src/test/javascript/method-05-constructor.js

$UnitTest("method - constructor unit tests");
function Method_Constructor() {

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
