// method.js/src/test/javascript/method-01-namespace.js

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
