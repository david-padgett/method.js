// testpilot.js/src/test/javascript/method-09-modifiers.js

$UnitTest("method - modifiers unit tests");
function Method_Modifiers() {

	$BeforeClass();
	this.beforeClass = function() {
	}

	$AfterClass();
	this.afterClass = function() {
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

}

$RegisterUnitTest(Method_Modifiers);
