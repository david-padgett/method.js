// method.js/src/test/javascript/method-20-readme.js

$UnitTest("method - README.md code");

//** Namespaces - create a new namespace via method.createNamespace()
var ns1 = method.createNamespace();

// Add state & functions to the namespace.
ns1.regexp = new RegExp();
ns1.date = new Date();
ns1.print = function() {
	console.log("regexp:", ns1.regexp);
	console.log("date:", ns1.date);
};

// Print the namespace state to the console
ns1.print();
console.log("namespace:", ns1);

// Remove the namespace when it's no longer needed.
method.delete(ns1);

//** Namespaces - create a new namespace via the global helper.
var ns2 = $MethodNamespace();
ns2.num = 100;
ns2.str = "hello, world";
ns2.combine = function() {
	return (ns2.num + ":" + ns2.str);
};

console.log("combine:", ns2.combine());
console.log("namespace:", ns2);
$MethodDelete(ns2);

//** Namespaces - create a namespace hierarchy.
var ns3 = new $MethodNamespace();
ns3.lang = new $MethodNamespace();
ns3.lang.value = "ns3.lang";
ns3.lang.reflect = new $MethodNamespace();
ns3.lang.reflect.value = "ns3.lang.reflect";

console.log("namespace:", ns3);
$MethodDelete(ns3);

//** Types - create a new type within a namespace, the type has no parent type or implemented interfaces.
var ns4 = $MethodNamespace();
ns4.Person = method.createType($NONE, []);

// Add a class method that returns a new instance of the class.
ns4.Person.$class($NONE, ns4.Person, []).create = function() {
	return (new ns4.Person("Not", "Sure", 35));
};

// Add a constructor, 3rd argument (age) defaults to 0
ns4.Person.$prototype($NONE, null, [String, String, 0]).Person = function(firstName, lastName, age) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
};

// Add several instance methods to the class.
ns4.Person.$prototype($NONE, String, []).getFullName = function() {
	return (this.firstName + " " + this.lastName);
};

ns4.Person.$prototype($NONE, String, []).greetings = function() {
	return ("Hello, " + this.getFullName());
};

// Implement toString: no attributes, returns a String, no parameters
ns4.Person.$prototype($NONE, String, []).toString = function() {
	return ("Name: " + this.getFullName() + ", Age: " + this.age);
};

// Create a new instance of Person, use default age, output state to console
var youngPerson = new ns4.Person("Jonny", "Doe");
console.log("youngPerson:", youngPerson);
console.log("youngPerson toString:", youngPerson.toString());
console.log("youngPerson greetings:", youngPerson.greetings());

// Create a new instance of Person, specify age, output state to console
var experiencedPerson = new ns4.Person("John", "Doe", 75);
console.log("experiencedPerson:", experiencedPerson);
console.log("experiencedPerson toString:", experiencedPerson.toString());
console.log("experiencedPerson greetings:", experiencedPerson.greetings());
console.log("class factory:", ns4.Person.create());

$MethodDelete(ns4);

//** Types - create a new type within a namespace, the type inherits behavior from a parent type.
var ns5 = $MethodNamespace();

// Create the parent type.
ns5.Person = method.createType($NONE, []);

// Add a constructor.
ns5.Person.$prototype($NONE, null, [String, String, Number]).Person = function(firstName, lastName, age) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
};

ns5.Person.$prototype($NONE, String, []).getFullName = function() {
	return (this.firstName + " " + this.lastName);
};

ns5.Person.$prototype($NONE, String, []).greetings = function() {
	return ("Hello, " + this.getFullName());
};

ns5.Person.$prototype($NONE, String, []).toString = function() {
	return ("Name: " + this.getFullName() + ", Age: " + this.age);
};

// Create the subclass via the global API $MethodType
ns5.Superhero = $MethodType($NONE, [ns5.Person]);

// Add a constructor - invoke the parent constructor, set unique state.
ns5.Superhero.$prototype($NONE, null, [String, String, Number, Array]).Superhero = function(firstName, lastName, age, superpowers) {
	this.$super(firstName, lastName, age);
	this.superpowers = superpowers;
};

// Implement a powerful specialization of greetings.
ns5.Superhero.$prototype($NONE, String, []).greetings = function() {
	return ("HELLO, " + this.getFullName());
};

// Implement a specialization of toString.
ns5.Superhero.$prototype($NONE, String, []).toString = function() {
	return (this.super().toString() + ", Superpowers: " + this.superpowers.join());
};

var superhero = new ns5.Superhero("Bat", "Man", 50, ["bulletproof", "strong", "very serious person"]);

console.log(superhero);
console.log(superhero.toString());
console.log(superhero.greetings());

$MethodDelete(ns5);

//** Types - create a new type within a namespace, methods are defined internally rather than via prototype
var ns6 = $MethodNamespace();
ns6.Person = $MethodType($NONE, []);

// Create the constructor, which contains entire type implementation.
ns6.Person.$prototype($NONE, null, [String, String, 0]).Person = function(firstName, lastName, age) {

	// Make it just a little easier to reference this when defining methods.
	var $this = this.$this;

	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;

	$this($NONE, String, []).getFullName = function() {
		return (this.firstName + " " + this.lastName);
	};

	$this($NONE, String, []).greetings = function() {
		return ("Hello, " + this.getFullName());
	};

	$this($NONE, String, []).toString = function() {
		return ("Name: " + this.getFullName() + ", Age: " + this.age);
	};

};

// Create a new instance of Person, specify age, output state to console
var internalPerson = new ns6.Person("John", "Doe", 75);
console.log("internalPerson:", internalPerson);
console.log("internalPerson greetings:", internalPerson.greetings());

console.log("youngInternalPerson:", new ns6.Person("Jonny", "Doe").toString());

$MethodDelete(ns6);

//** Types - create a new type within a namespace, methods are defined via the instance initializer
var ns7 = $MethodNamespace();
ns7.Person = $MethodType($NONE, []);

// Create the instance initializer, which contains entire type implementation, useful when the type has multiple constructors.
ns7.Person.$prototype($NONE, null, []).$Person = function() {

	// Make it just a little easier to reference this when defining methods.
	var $this = this.$this;

	this.firstName = null;
	this.lastName = null;
	this.age = null;

	$this($NONE, String, []).getFullName = function() {
		return (this.firstName + " " + this.lastName);
	};

	$this($NONE, String, []).greetings = function() {
		return ("Alternative Hello, " + this.getFullName());
	};

	$this($NONE, String, []).toString = function() {
		return ("Name: " + this.getFullName() + ", Age: " + this.age);
	};

};

// Create the constructor, which initializes state.
ns7.Person.$prototype($NONE, null, [String, String, 0]).Person = function(firstName, lastName, age) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
};

// Create a new instance of Person, specify age, output state to console
var alternativePerson = new ns7.Person("Jeremy", "SpokeInClassToday", 18);
console.log("alternativePerson:", alternativePerson);
console.log("alternativePerson greetings:", alternativePerson.greetings());

$MethodDelete(ns7);

//** Interfaces - create a new type within a namespace, the type implements an interface.
var ns8 = $MethodNamespace();

// Create an interface
ns8.EventTarget = $MethodInterface($NONE, []);

// Add operations to the interface
ns8.EventTarget.$prototype($PUBLIC, null, [String, Object]).addEventListener = null;
ns8.EventTarget.$prototype($PUBLIC, null, [Object]).dispatchEvent = null;
ns8.EventTarget.$prototype($PUBLIC, null, [String, Object]).removeEventListener = null;

ns8.Element = method.createType($NONE, [ns8.EventTarget]);

ns8.Element.$prototype($NONE, null, []).Element = function() {
	this.eventListeners = {};
};

ns8.Element.$prototype($NONE, null, [String, Object]).addEventListener = function(type, listener) {
	if (this.eventListeners[type] == null) {
		this.eventListeners[type] = [];
	}
	var listeners = this.eventListeners[type];
	listeners.push(listener);
};

var element = new ns8.Element();
console.log("element (0 listeners):", element);
element.addEventListener("mouseover", new Date());
element.addEventListener("mouseover", "sentientString");
console.log("element (2 listeners):", element);

// dispatchEvent() not implemented, will throw an exception.
try  {
	element.dispatchEvent("someData");
}
catch (e) {
	console.log(e);
}

$MethodDelete(ns8);
