// method.js/src/test/javascript/method-08-super.js

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
