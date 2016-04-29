# method.js
>Create namespaces, types, interfaces, and overloaded type operations in JavaScript.

## License

MIT

## Examples

### Namespaces

Create a new namespace with state and functions.  The namespace is created via the API method.createNamespace().
```javascript
//** Namespaces - create a new namespace via method.createNamespace()
var ns = method.createNamespace();

// Add state & functions to the namespace.
ns.regexp = new RegExp();
ns.date = new Date();
ns.print = function() {
	console.log("regexp:", ns.regexp);
	console.log("date:", ns.date);
}

// Print the namespace state to the console
ns.print();
console.log("namespace:", ns);

// Remove the namespace when it's no longer needed.
method.delete(ns);
```
Output (namespace is an object containing 3 members: regexp, date, and print):
```shell
regexp: /(?:)/
date: Thu Apr 28 2016 13:42:44 GMT-0700 (PDT)
namespace: { '$method': [Function],
  regexp: /(?:)/,
  date: Thu Apr 28 2016 13:42:44 GMT-0700 (PDT),
  print: [Function] }
```
Create a new namespace with state and functions.  The namespace is created via the global helper API $MethodNamespace(), this is equivalent to method.createNamespace().
```javascript
//** Namespaces - create a new namespace via the global helper.
var ns = $MethodNamespace();
ns.num = 100;
ns.str = "hello, world";
ns.combine = function() {
	return (ns.num + ":" + ns.str);
}

console.log("combine:", ns.combine());
console.log("namespace:", ns);
$MethodDelete(ns);
```
Output (namespace is an object containing 3 members: num, str, and combine):
```shell
combine: 100:hello, world
namespace: { '$method': [Function],
  num: 100,
  str: 'hello, world',
  combine: [Function] }
```
Create several new namespaces in a hierarchy.
```javascript
//** Namespaces - create a namespace hierarchy.
var ns = new $MethodNamespace();
ns.lang = new $MethodNamespace();
ns.lang.value = "ns.lang";
ns.lang.reflect = new $MethodNamespace();
ns.lang.reflect.value = "ns.lang.reflect";

console.log("namespace:", ns);
$MethodDelete(ns);
```
Output (namespace is an object that contains additional namespaces):
```shell
namespace: { '$method': [Function],
  lang:
   { '$method': [Function],
     value: 'ns.lang',
     reflect: { '$method': [Function], value: 'ns.lang.reflect' } } }
```

### Types
Create a new type within a namespace.  The type has no parent and does not implement any interfaces.  The new type implements a unique constructor and several instance methods and one class method.
```javascript
//** Types - create a new type within a namespace, the type has no parent type or implemented interfaces.
var ns = $MethodNamespace();
ns.Person = method.createType($NONE, []);

ns.Person.$class($NONE, ns.Person, []).create = function() {
	return (new ns.Person("Not", "Sure", 35));
};

// Add a constructor, 3rd argument (age) defaults to 0
ns.Person.$prototype($NONE, null, [String, String, 0]).Person = function(firstName, lastName, age) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
};

// Add several instance methods to the class.
ns.Person.$prototype($NONE, String, []).getFullName = function() {
	return (this.firstName + " " + this.lastName);
}

ns.Person.$prototype($NONE, String, []).greetings = function() {
	return ("Hello, " + this.getFullName());
}

// Implement toString: no attributes, returns a String, no parameters
ns.Person.$prototype($NONE, String, []).toString = function() {
	return ("Name: " + this.getFullName() + ", Age: " + this.age);
}

// Create a new instance of Person, use default age, output state to console
var youngPerson = new ns.Person("Jonny", "Doe");
console.log("youngPerson:", youngPerson);
console.log("youngPerson toString:", youngPerson.toString());
console.log("youngPerson greetings:", youngPerson.greetings());

// Create a new instance of Person, specify age, output state to console
var experiencedPerson = new ns.Person("John", "Doe", 75);
console.log("experiencedPerson:", experiencedPerson);
console.log("experiencedPerson toString:", experiencedPerson.toString());
console.log("experiencedPerson greetings:", experiencedPerson.greetings());
console.log("class factory:", ns.Person.create());

$MethodDelete(ns);
```
Output (instance of new type contains correct state, toString returns type-specific output):
```shell
youngPerson: { '$method': [Function],
  firstName: 'Jonny',
  lastName: 'Doe',
  age: 0 }
youngPerson toString: Name: Jonny Doe, Age: 0
youngPerson greetings: Hello, Jonny Doe
experiencedPerson: { '$method': [Function],
  firstName: 'John',
  lastName: 'Doe',
  age: 75 }
experiencedPerson toString: Name: John Doe, Age: 75
experiencedPerson greetings: Hello, John Doe
class factory: { '$method': [Function],
  firstName: 'Not',
  lastName: 'Sure',
  age: 35 }
```
Create a new type within a namespace.  The type is a subclass of another type, and overrides a method implemented in the parent type.
```javascript
//** Types - create a new type within a namespace, the type inherits behavior from a parent type.
var ns = $MethodNamespace();

// Create the parent type.
ns.Person = method.createType($NONE, []);

// Add a constructor.
ns.Person.$prototype($NONE, null, [String, String, Number]).Person = function(firstName, lastName, age) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
};

ns.Person.$prototype($NONE, String, []).getFullName = function() {
	return (this.firstName + " " + this.lastName);
}

ns.Person.$prototype($NONE, String, []).greetings = function() {
	return ("Hello, " + this.getFullName());
}

ns.Person.$prototype($NONE, String, []).toString = function() {
	return ("Name: " + this.getFullName() + ", Age: " + this.age);
}

// Create the subclass via the global API $MethodType
ns.Superhero = $MethodType($NONE, [ns.Person]);

// Add a constructor - invoke the parent constructor, set unique state.
ns.Superhero.$prototype($NONE, null, [String, String, Number, Array]).Superhero = function(firstName, lastName, age, superpowers) {
	this.$super(firstName, lastName, age);
	this.superpowers = superpowers;
};

// Implement a powerful specialization of greetings.
ns.Superhero.$prototype($NONE, String, []).greetings = function() {
	return ("HELLO, " + this.getFullName());
}

// Implement a specialization of toString.
ns.Superhero.$prototype($NONE, String, []).toString = function() {
	return (this.super().toString() + ", Superpowers: " + this.superpowers.join());
}

var superhero = new ns.Superhero("Bat", "Man", 50, ["bulletproof", "strong", "very serious person"]);

console.log(superhero);
console.log(superhero.toString());
console.log(superhero.greetings());

$MethodDelete(ns);
```
Output (instance of new sub-type contains correct state, toString returns type-specific output):
```shell
{ '$method': [Function],
  firstName: 'Bat',
  lastName: 'Man',
  age: 50,
  superpowers: [ 'bulletproof', 'strong', 'very serious person' ] }
Name: Bat Man, Age: 50, Superpowers: bulletproof,strong,very serious person
HELLO, Bat Man
```
Create a new type within a namespace.  The type partially implements an interface.
```javascript
//** Types - create a new type within a namespace, the type implements an interface.
var ns = $MethodNamespace();

// Create an interface
ns.EventTarget = $MethodInterface($NONE, []);

// Add operations to the interface
ns.EventTarget.$prototype($PUBLIC, null, [String, Object]).addEventListener = null;
ns.EventTarget.$prototype($PUBLIC, null, [Object]).dispatchEvent = null;
ns.EventTarget.$prototype($PUBLIC, null, [String, Object]).removeEventListener = null;

ns.Element = method.createType($NONE, [ns.EventTarget]);

ns.Element.$prototype($NONE, null, []).Element = function() {
	this.eventListeners = {};
};

ns.Element.$prototype($NONE, null, [String, Object]).addEventListener = function(type, listener) {
	if (this.eventListeners[type] == null) {
		this.eventListeners[type] = [];
	}
	var listeners = this.eventListeners[type];
	listeners.push(listener);
}

var element = new ns.Element();
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

$MethodDelete(ns);
```
Output (instance of new type contains state, invoking the unimplemented API results in error):
```shell
element (0 listeners): { '$method': [Function], eventListeners: {} }
element (2 listeners): { '$method': [Function],
  eventListeners: { mouseover: [ Thu Apr 28 2016 14:35:17 GMT-0700 (PDT), 'sentientString' ] } }
[Error: The abstract operation Element.dispatchEvent(Object) is not implemented.]
```
Create a new type within a namespace.  Define methods internally.
```javascript
//** Types - create a new type within a namespace, methods are defined internally rather than via prototype
var ns = $MethodNamespace();
ns.Person = $MethodType($NONE, []);

// Create the constructor, which contains entire type implementation.
ns.Person.$prototype($NONE, null, [String, String, 0]).Person = function(firstName, lastName, age) {

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
var internalPerson = new ns.Person("John", "Doe", 75);
console.log("internalPerson:", internalPerson);
console.log("internalPerson greetings:", internalPerson.greetings());

console.log("youngInternalPerson:", new ns.Person("Jonny", "Doe").toString());

$MethodDelete(ns);
```
Output (instance of new type contains correct state, toString returns type-specific output):
```shell
internalPerson: { '$method': [Function],
  firstName: 'John',
  lastName: 'Doe',
  age: 75 }
internalPerson greetings: Hello, John Doe
youngInternalPerson: Name: Jonny Doe, Age: 0
```
Create a new type within a namespace.  Define methods internally via an instance initializer.
```javascript
//** Types - create a new type within a namespace, methods are defined via the instance initializer
var ns = $MethodNamespace();
ns.Person = $MethodType($NONE, []);

// Create the instance initializer, which contains entire type implementation, useful when the type has multiple constructors.
ns.Person.$prototype($NONE, null, []).$Person = function() {

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
ns.Person.$prototype($NONE, null, [String, String, 0]).Person = function(firstName, lastName, age) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.age = age;
}

// Create a new instance of Person, specify age, output state to console
var alternativePerson = new ns.Person("Jeremy", "SpokeInClassToday", 18);
console.log("alternativePerson:", alternativePerson);
console.log("alternativePerson greetings:", alternativePerson.greetings());

$MethodDelete(ns);
```
Output (instance of new type contains correct state):
```shell
alternativePerson: { '$method': [Function],
  firstName: 'Jeremy',
  lastName: 'SpokeInClassToday',
  age: 18 }
alternativePerson greetings: Alternative Hello, Jeremy SpokeInClassToday
```