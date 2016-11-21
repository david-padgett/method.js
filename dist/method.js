"use strict";

/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2016 David Padgett/Summit Street, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* global */
/* eslint-disable no-unused-vars */

/**
 * This function implements a singleton type (e.g: a service) that can install
 * named operations into a namespace.  The operation names are optionally
 * prefixed to prevent collisions with other functions.
 */

function __Service(rootNamespace, namespacePrefix, serviceDelegate) {

	var __THIS = this;
	var __ROOT_NAMESPACE = rootNamespace;
	var __NAMESPACE_PREFIX = namespacePrefix == null ? "$" : namespacePrefix;
	var __SERVICE_MANAGER = new __ServiceManager(serviceDelegate == null ? __THIS : serviceDelegate);

	function __ServiceManager(delegate) {

		this.__delegate = delegate;
		this.__containers = [];

		this.addToNamespace = function addToNamespace(name, value) {
			__ROOT_NAMESPACE[name] = value;
			this.invokeDelegate("addToNamespace");
		};

		this.invokeDelegate = function(operation) {
			if (this.__delegate != null && this.__delegate[operation] != null && this.__delegate[operation].constructor === Function) {
				delegate[operation].apply(delegate, Array.prototype.slice.call(arguments, 1));
			}
		};

		this.initializeDispatcher = function(container, api) {
			var dispatcher = function __ServiceManagerApiDispatcher() {
				var args = Array.prototype.slice.call(arguments, 0);
				return (api.apply(container, args));
			};
			return (dispatcher);
		};

		this.install = function install(containers) {
			this.__containers = this.__containers.concat(containers);
			this.manageAliases(containers, true);
			this.invokeDelegate("install");
		};

		this.manageAliases = function(containers, addFunctions) {
			for (var i = 0; i < containers.length; ++i) {
				var container = containers[i];
				for (var j in container) {
					if (container[j] != null) {
						var name = null;
						var value = null;
						if (container[j].constructor !== Function && j[0] != "_") {
							name = __NAMESPACE_PREFIX + j;
							value = container[j];
						}
						else {
							if (container[j].constructor === Function && container[j].name.length > 0) {
								var api = container[j];
								name = __NAMESPACE_PREFIX + container[j].name;
								value = this.initializeDispatcher(container, api);
							}
						}
						if (name != null && value != null) {
							if (addFunctions) {
								this.addToNamespace(name, value);
							}
							else {
								this.removeFromNamespace(name);
							}
						}
					}
				}
			}
		};

		this.removeFromNamespace = function removeFromNamespace(name) {
			this.invokeDelegate("removeFromNamespace");
			if (!(delete __ROOT_NAMESPACE[name])) {
				__ROOT_NAMESPACE[name] = null;
			}
		};

		this.uninstall = function uninstall() {
			this.invokeDelegate("uninstall");
			this.manageAliases(this.__containers, false);
		};

		if (__ROOT_NAMESPACE == null) {
			throw new Error("Unable to initialize " + __THIS.constructor.name + ": No root namespace provided when instantiated.");
		}

	}

	this._getServiceManager = function() {
		return (__SERVICE_MANAGER);
	};

	__SERVICE_MANAGER.install([__THIS]);
	return (__THIS);
}

function Method(rootNamespace, namespacePrefix) {

	var __THIS = this;
	var __ROOT_NAMESPACE = rootNamespace;
	var __NAMESPACE_PREFIX = namespacePrefix == null ? "$" : namespacePrefix;
	var __SERVICE_PREFIX = __NAMESPACE_PREFIX + this.constructor.name;

	var __INITIALIZER_PREFIX = "$";
	var __OVERRIDABLE_API_NAMES = ["toString"];

	var __NONE = 0x0000;
	var __ABSTRACT = 0x0001;
	var __STATIC = 0x0002;
	var __FINAL = 0x0004;
	var __PUBLIC = 0x0010;
	var __PROTECTED = 0x0020;
	var __PRIVATE = 0x0040;

	var __CONSTRUCTOR = 0x0100;
	var __INITIALIZER = 0x0200;
	var __SPECIAL_OPERATION_FLAGS = 0x0300;
	var __OPERATION_FLAGS = __STATIC | __SPECIAL_OPERATION_FLAGS;

	var __CLASS = 0x1000;
	var __INTERFACE = 0x2000;

	var __ATTRIBUTES = [__NONE, __ABSTRACT, __STATIC, __FINAL, __PUBLIC, __PROTECTED, __PRIVATE, __CONSTRUCTOR, __INITIALIZER, __CLASS, __INTERFACE];
	var __ATTRIBUTE_DESCRIPTIONS = ["", "abstract", "static", "final", "public", "protected", "private", "constructor", "initializer", "class", "interface"];

	var __Modifiers = {
		NONE: __NONE,
		ABSTRACT: __ABSTRACT,
		STATIC: __STATIC,
		FINAL: __FINAL,
		PUBLIC: __PUBLIC,
		PROTECTED: __PROTECTED,
		PRIVATE: __PRIVATE,
		CONSTRUCTOR: __CONSTRUCTOR,
		INITIALIZER: __INITIALIZER,
		CLASS: __CLASS,
		INTERFACE: __INTERFACE
	};

	function __getType(object) {
		if (object == null) {
			return (null);
		}
		if (__isValidType(object)) {
			return (object.$method());
		}
		if (object.constructor === Function && object.name != null) {
			return (object);
		}
		if (object.constructor != null && object.constructor.name != null) {
			return (object.constructor);
		}
		return (Object);
	}

	function __getTypeName(type) {
		return (__hasContext(type) ? type.$method().__getName() : (type != null ? type.name : null));
	}

	function __getTypeNames(types) {
		var typeNames = "";
		for (var i in types) {
			typeNames += (typeNames.length == 0 ? "" : ",") + __getTypeName(__getType(types[i]));
		}
		return (typeNames);
	}

	function __getTypes(objects) {
		var types = [];
		for (var i = 0; i < objects.length; ++i) {
			types[i] = __getType(objects[i]);
		}
		return (types);
	}

	function __hasContext(object) {
		return (object != null && object[__SERVICE_PREFIX] != null);
	}

	function __isAssignableFrom(type, compatibleType) {
		type = __getType(type);
		return (type === compatibleType || type === Object || (__hasContext(type) && type.$method().__isAssignableFrom(compatibleType)));
	}

	function __isValidType(type) {
		return (__hasContext(type) && type.$method().__object == type);
	}

	function __Object(object) {

		var __SELF = this;

		this.__object = object;
		this.__superInvocation = 0;

		this.__object.$method = function() {
			return (__SELF);
		};

	}

	function __Construct(object) {

		var __NAME_DELIMITER = ".";
		var __SELF = this;

		this.__id = ++__Construct.__id;
		this.__object = object;
		this.__parent = null;
		this.__children = [];
		this.__relativeName = null;
		this.__name = null;

		this.__bind = function() {
			if (this.__parent == null) {
				var cache = __Construct.__cache;
				var startPos = cache.indexOf(this.__object) - 1;
				for (var i = startPos; i >= 0; --i) {
					if (cache[i] !== this.__object) {
						var parent = cache[i];
						for (var j in parent) {
							if (parent[j] === this.__object) {
								this.__link(parent);
								if (this.__relativeName == null) {
									this.__relativeName = j;
								}
								else {
									if (!(delete this.__parent[j])) {
										this.__parent[j] = null;
									}
									this.__parent[this.__relativeName] = this.__object;
								}
								return;
							}
						}
					}
				}
			}
		};

		this.__delete = function() {

			while (this.__children.length > 0) {
				this.__children[0].$method().__delete();
			}

			var index = null;
			if (this.__parent != null) {
				index = this.__parent.$method().__children.indexOf(this.__object);
				if (index != -1) {
					this.__parent.$method().__children.splice(index, 1);
				}
				if (this.__relativeName != null && !(delete this.__parent[this.__relativeName])) {
					this.__parent[this.__relativeName] = null;
				}
			}

			index = __Construct.__cache.indexOf(this.__object);
			if (index != -1) {
				__Construct.__cache.splice(index, 1);
			}
			this.__object = null;
			this.__name = null;
			this.__relativeName = null;
			this.__parent = null;
			this.__children = [];
		};

		this.__getName = function() {
			this.__bind();
			if (this.__name == null) {
				this.__name = this.__parent == null ? this.__relativeName : (this.__parent.$method().__getName() != null ? this.__parent.$method().__name + __NAME_DELIMITER : "") + this.__relativeName;
			}
			return (this.__name);
		};

		this.__getRelativeName = function() {
			this.__getName();
			return (this.__relativeName);
		};

		this.__getChildren = function() {
			this.__bind();
			return (this.__children);
		};

		this.__getParent = function() {
			this.__bind();
			return (this.__parent);
		};

		this.__isValid = function() {
			this.__bind();
			return (__Construct.__cache.indexOf(this.__object) != -1 && this.__object.$method() === this);
		};

		this.__link = function(parent) {
			parent.$method().__children.push(this.__object);
			this.__parent = parent;
		};

		this.__object.$method = function() {
			__SELF.__bind();
			return (__SELF);
		};

		__Construct.__cache.push(this.__object);
	}

	__Construct.prototype.toString = function() {
		return (this.__getName());
	};

	__Construct.__id = -1;
	__Construct.__cache = [];

	__Construct.__bind = function() {
		for (var i in __Construct.__cache) {
			if (__Construct.__cache[i].__parent == null) {
				__Construct.__cache[i].$method().__bind();
			}
		}
	};

	__Construct.__create = function(object) {
		var construct = {};
		__Construct.apply(construct, [object]);
		return (construct);

	};

	function __Function(fn, attributes) {

		this.__attributes = attributes;

		__Construct.apply(this, [fn]);

		this.__isAbstract = function() {
			return ((this.__attributes & __ABSTRACT) != 0);
		};

		this.__isFinal = function() {
			return ((this.__attributes & __FINAL) != 0);
		};

		this.__isPrivate = function() {
			return ((this.__attributes & __PRIVATE) != 0);
		};

		this.__isProtected = function() {
			return ((this.__attributes & __PROTECTED) != 0);
		};

		this.__isPublic = function() {
			return ((this.__attributes & __PUBLIC) != 0);
		};

		this.__isStatic = function() {
			return ((this.__attributes & __STATIC) != 0);
		};

	}

	__Function.prototype.toString = function() {
		var str = "";
		for (var i in __ATTRIBUTES) {
			str += this.__attributes & __ATTRIBUTES[i] ? (str.length > 0 ? ", " : "") + __ATTRIBUTE_DESCRIPTIONS[i] : "";
		}
		return ("<" + str + "> " + __Construct.prototype.toString.apply(this, []));
	};

	function __Namespace(ns, name) {

		if (name != null && !/[0-9A-Za-z_]+$/g.test(name)) {
			throw new Error("Namespace name is invalid: " + name);
		}

		__Construct.apply(this, [ns]);
		this.__relativeName = name;
	}

	__Namespace.__create = function(nameOrNamespace) {

		function __MethodNamespace() {
		}

		if (nameOrNamespace != null && nameOrNamespace.constructor !== String) {
			__Namespace.apply({}, [nameOrNamespace, null]);
			return (nameOrNamespace);
		}
		var ns = new __MethodNamespace();
		__Namespace.apply({}, [ns, nameOrNamespace]);
		return (ns);
	};

	function __Type(methodType, attributes) {

		var __SELF = this;

		function __getOperationName(attributes) {
			var operationName = __SELF.__getRelativeName();
			if ((attributes & __INITIALIZER) != 0) {
				operationName = __INITIALIZER_PREFIX + operationName;
			}
			return (operationName);
		}

		this.__superclass = null;
		this.__initialized = false;
		this.__interfaces = [];

		__Function.apply(this, [methodType, attributes]);

		this.__addOperation = function(operationName, attributes, returnType, parameterTypes, implementation) {

			if (this.__isInterface()) {
				attributes = attributes | __ABSTRACT & ~__FINAL;
			}

			if (operationName == this.__getRelativeName()) {
				attributes = attributes | __CONSTRUCTOR;
				returnType = null;
			}

			if (operationName == __INITIALIZER_PREFIX + this.__getRelativeName()) {
				attributes = attributes | __INITIALIZER;
				returnType = null;
			}

			operationName = operationName != null ? operationName : __getOperationName(attributes);
			var operation = this.__getOperation(operationName, attributes);

			if (operation != null && operation !== __Type.__PSEUDO_OPERATION && (attributes & __INITIALIZER) != 0) {
				throw new Error("Cannot redefine an initializer.");
			}

			if (operation == null || operation === __Type.__PSEUDO_OPERATION) {
				operation = new __Operation(operationName, returnType, attributes & __OPERATION_FLAGS);
				operation.__link(this.__object);
				var virtualMethodTable = attributes & __STATIC ? this.__object : this.__object.prototype;
				virtualMethodTable[operation.__getRelativeName()] = operation.__object;
			}

			if (operation.__returnType !== returnType) {
				throw new Error("The return type of operation " + operation.__getName() + "(" + __getTypeNames(parameterTypes) + ") must be " + operation.__returnType.name + ".");
			}

			operation.__addImplementation(attributes, parameterTypes, implementation);
		};

		this.__copyOperations = function(sourceType) {
			if (sourceType != null && sourceType.$method() != null) {
				var source = sourceType.prototype;
				var target = this.__object.prototype;
				for (var memberName in source) {

					var sourceOperation = source[memberName];
					if (sourceOperation.constructor === Function && (target[memberName] == null || __OVERRIDABLE_API_NAMES.indexOf(memberName) != -1)) {

						if (sourceOperation.name != "__MethodOperation") {
							target[memberName] = sourceOperation;
						}
						else {

							var operation = sourceOperation.$method();
							if (!(operation.__attributes & __SPECIAL_OPERATION_FLAGS)) {
								for (var i = 0; i < operation.__children.length; ++i) {
									var implementation = operation.__children[i].$method();
									this.__queueOperation(implementation.__attributes, operation.__returnType, implementation.__parameterTypes)[memberName] = implementation.__object.__implementation;
								}
							}
						}
					}
				}
			}
		};

		this.__extendType = function(parentType) {

			if (parentType == null || parentType.$method() == null) {
				throw new Error("The type " + this.__getName() + " cannot extend null.");
			}

			if (parentType.$method().__isInterface()) {

				if (this.__interfaces.indexOf(parentType) == -1) {
					this.__interfaces.push(parentType);
				}
			}
			else {

				if (this.__superclass != null) {
					throw new Error("The type " + this.__getName() + " already extends " + this.__superclass.__getName() + ".");
				}
				this.__superclass = parentType;
			}

			this.__copyOperations(parentType);
		};

		this.__getType = function() {
			return (this.__object);
		};

		this.__getInterfaces = function() {

			var interfaces = Array.prototype.slice.call(this.__interfaces);
			for (var parentType = this.__superclass; parentType != null; parentType = parentType.__superclass) {
				for (var i = 0; i < parentType.__interfaces.length; ++i) {
					if (interfaces.indexOf(parentType.__interfaces[i]) == -1) {
						interfaces.push(parentType);
					}
				}
			}
			return (interfaces);
		};

		this.__getOperation = function(operationName, attributes) {
			__Type.__bindOperations();
			var specialOperation = (attributes & __SPECIAL_OPERATION_FLAGS) != 0;
			var isStatic = (attributes & __STATIC) != 0;
			var name = operationName != null && !specialOperation ? operationName : __getOperationName(attributes);
			for (var i = 0; i < this.__children.length; ++i) {
				var operation = this.__children[i].$method();
				if (name == operation.__relativeName && operation.__isStatic() === isStatic) {
					return (operation);
				}
			}
			return (specialOperation ? __Type.__PSEUDO_OPERATION : null);
		};

		this.__getOperations = function() {
			__Type.__bindOperations();
			return (Array.prototype.slice.call(this.__children));
		};

		this.__getParentTypes = function() {
			var parentTypes = [];
			for (var parentType = this.__superclass; parentType != null; parentType = parentType.$method().__superclass) {
				parentTypes.push(parentType);
			}
			return (parentTypes.reverse());
		};

		this.__implementsInterface = function(interfaceType) {
			return (this.__getInterfaces().indexOf(interfaceType) != -1);
		};

		this.__isAssignableFrom = function(compatibleType) {
			return (this.__object === compatibleType || this.__isSubclass(compatibleType) || (this.__isInterface() && this.__implementsInterface(compatibleType)));
		};

		this.__isClass = function() {
			return ((this.__attributes & __CLASS) != 0);
		};

		this.__isInterface = function() {
			return ((this.__attributes & __INTERFACE) != 0);
		};

		this.__isSubclass = function(parentType) {
			return (parentType !== this && (parentType === Object || this.__getParentTypes().indexOf(parentType) != -1));
		};

		this.__queueOperation = function(attributes, returnType, parameterTypes) {
			var cache = {};
			__Type.__MODIFIED_TYPES.push([this, attributes, returnType, parameterTypes != null ? parameterTypes : [], cache]);
			return (cache);
		};

		this.toString = function() {
			return (__Function.prototype.toString.apply(this, []));
		};

		this.__object.$class = function(attributes, returnType, parameterTypes) {
			this.$method().__bind();
			__Type.__bindOperations();
			return (this.$method().__queueOperation(attributes | __STATIC, returnType, parameterTypes));
		};

		this.__object.$new = function() {
			this.$method().__bind();
			var type = this;
			arguments.__$new = true;
			var newInstance = new type(arguments);
			delete arguments.__$new;
			return (newInstance);
		};

		this.__object.$prototype = function(attributes, returnType, parameterTypes) {
			this.$method().__bind();
			__Type.__bindOperations();
			return (this.$method().__queueOperation(attributes & ~__STATIC, returnType, parameterTypes));
		};

		this.__object.prototype.$class = function(attributes, returnType, parameterTypes) {
			return (__SELF.__object.$class(attributes, returnType, parameterTypes));
		};

		this.__object.prototype.super = function() {
			this.$method().__superInvocation++;
			return (this);
		};

		this.__object.prototype.$super = function() {
			this.super();
			__SELF.__getOperation(null, __CONSTRUCTOR).__invoke(this, Array.prototype.slice.call(arguments));
		};

		this.__object.prototype.$this = function(attributes, returnType, parameterTypes) {
			return (__SELF.__object.$prototype(attributes, returnType, parameterTypes));
		};

	}

	__Type.__TYPES = [];
	__Type.__MODIFIED_TYPES = [];
	__Type.__PSEUDO_OPERATION = {
		__invoke: function __MethodPseudoOperation() {
		}
	};

	__Type.__bindOperations = function() {
		while (__Type.__MODIFIED_TYPES.length > 0) {
			var operation = __Type.__MODIFIED_TYPES.pop();
			var type = operation[0];
			var prototype = operation[4];
			for (var name in prototype) {
				type.__addOperation(name, operation[1], operation[2], operation[3], prototype[name]);
			}
		}
	};

	__Type.__create = function(attributes, parentTypes) {

		__Type.__bindOperations();

		var methodType = function __MethodType() {
			var context = this.constructor.$method();
			__Type.__bindOperations();
			if (context.__isAbstract() || context.__isStatic() || context.__isInterface()) {
				throw new Error("The " + (context.__isInterface() ? "interface " : ((context.__isAbstract() ? "abstract " : "static ") + "class ")) + context.__getName() + " cannot be instantiated.");
			}

			if (!context.__initialized) {
				context.__getOperation(null, __STATIC | __INITIALIZER).__invoke(context.__object, []);
				context.__initialized = true;
			}

			__Object.apply({}, [this]);
			context.__getOperation(null, __INITIALIZER).__invoke(this, []);
			var args = Array.prototype.slice.call(arguments.length == 1 && arguments[0].__$new == true ? arguments[0] : arguments);
			context.__getOperation(null, __CONSTRUCTOR).__invoke(this, args);
		};

		__Type.apply({}, [methodType, attributes, parentTypes]);

		for (var i = 0; i < parentTypes.length; ++i) {
			methodType.$method().__extendType(parentTypes[i]);
		}

		__Type.__TYPES.push(methodType);
		return (methodType);
	};

	function __Operation(name, returnType, attributes) {

		var __SELF = this;

		function __MethodOperation() {
			return (__SELF.__invoke(this, Array.prototype.slice.call(arguments)));
		}

		this.__returnType = returnType;

		__Function.apply(this, [__MethodOperation, attributes & __OPERATION_FLAGS]);
		this.__relativeName = name;

		this.__addImplementation = function(attributes, parameterTypes, implementation) {
			var previoiusImplementation = this.__getImplementation(parameterTypes);
			if (previoiusImplementation != null && implementation != null) {
				previoiusImplementation.__attributes = attributes;
				previoiusImplementation.__object.__implementation = implementation;
			}
			else {
				implementation = new __Implementation(attributes, parameterTypes, implementation);
				implementation.__link(this.__object);
			}
		};

		this.__getImplementation = function(parameterTypes) {
			for (var i = 0; i < this.__children.length; ++i) {
				var implementation = this.__children[i].$method();
				if (implementation.__matchesParameterTypes(parameterTypes)) {
					return (implementation);
				}
			}
			return (null);
		};

		this.__invocationError = function(parameterTypes) {
			var parameterTypesString = "";
			for (var i = 0; i < parameterTypes.length; ++i) {
				parameterTypesString += (parameterTypesString.length != 0 ? ", " : "") + __getTypeName(parameterTypes[i]);
			}
			throw new Error("Unable to invoke the operation " + this.__name + "(" + __getTypeNames(parameterTypes) + "), no matching implementation.");
		};

		this.__invoke = function(object, parameters) {
			__Type.__bindOperations();
			var operation = this;

			var superInvocation = object == null || object.$method == null ? 0 : object.$method().__superInvocation;
			if (superInvocation > 0) {
				var type = this.__parent.$method().__superclass;
				for (var i = 1; i < superInvocation; ++i) {
					type = type.$method().__superclass;
				}
				operation = type.$method().__getOperation(this.__relativeName, this.__attributes);
			}

			var parameterTypes = __getTypes(parameters);
			var implementation = operation.__getImplementation(parameterTypes);
			if (implementation == null) {
				operation.__invocationError(parameterTypes);
			}

			var result = implementation.__invoke(object, parameters);
			if (superInvocation > 0) {
				object.$method().__superInvocation--;
			}
			if (this.__returnType != null) {
				return (result);
			}
		};

		this.toString = function() {
			return ("(" + this.__returnType.name + ") ");
		};

	}

	function __Implementation(attributes, parameterTypes, implementation) {

		var __SELF = this;

		function __finalizeParameters(parameters) {

			for (var i = 0; i < __SELF.__parameterTypes.length; ++i) {
				var parameter = __SELF.__parameterTypes[i];
				parameters[i] = parameters[i] == null && parameter != null ? parameter : parameters[i];
			}
			return (parameters);
		}

		function __MethodImplementation(implementation) {

			this.__implementation = implementation;
		}

		this.__parameterTypes = parameterTypes;
		this.__parameterTypeNames = "";

		__Function.apply(this, [new __MethodImplementation(implementation), attributes]);

		this.__invoke = function(object, parameters) {

			if (this.__attributes & __ABSTRACT) {
				throw new Error("The abstract operation " + __SELF.__parent.$method().__getName() + "(" + __SELF.__parameterTypeNames + ") is not implemented.");
			}

			parameters = __finalizeParameters(parameters);
			var result = this.__object.__implementation.apply(object, parameters);
			return (result);
		};

		this.__matchesParameterTypes = function(parameterTypes) {
			if (parameterTypes.length > this.__parameterTypes.length) {
				return (false);
			}
			for (var i = 0; i < this.__parameterTypes.length; ++i) {

				if (parameterTypes.length <= i && this.__parameterTypes[i].constructor.constructor === Function) {
					continue;
				}

				if (!__isAssignableFrom(this.__parameterTypes[i], parameterTypes[i])) {
					return (false);
				}
			}
			return (true);
		};

		this.toString = function() {
			return ("(" + this.__parameterTypeNames + ")");
		};

		if (this.__parameterTypes.indexOf(null) != -1) {
			throw new Error("Null parameter types are not permitted within operation implementations.");
		}
		this.__parameterTypeNames = __getTypeNames(this.__parameterTypes);
	}

	this.createInterface = function MethodInterface(attributes, parentTypes) {
		return (__Type.__create((attributes & ~__CLASS) | __INTERFACE, parentTypes));
	};

	this.createNamespace = function MethodNamespace(nameOrNamespace) {
		return (__Namespace.__create(nameOrNamespace));
	};

	this.createType = function MethodType(attributes, parentTypes) {
		return (__Type.__create((attributes & ~__INTERFACE) | __CLASS, parentTypes));
	};

	this.delete = function MethodDelete(object) {
		__Construct.__bind();
		__Type.__bindOperations();
		if (object != null && object.$method() != null) {
			object.$method().__delete();
		}
	};

	this.isAssignableFrom = function(type, compatibleType) {
		return (type === Object || type === compatibleType || (__hasContext(type) && type.$method().__isAssignableFrom(compatibleType)));
	};

	__Service.apply(this, [rootNamespace, namespacePrefix]);

	this._getServiceManager().install([__Modifiers]);
	__Construct.__create(__ROOT_NAMESPACE);
	__Construct.__create(__THIS);
	this.$method().__namespaces = __Construct.__cache;
}

