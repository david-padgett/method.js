// method.js/src/test/javascript/method-10-this.js

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
