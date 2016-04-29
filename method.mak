#
# The MIT License (MIT)
#
# Copyright (c) 2015 David Padgett/Summit Street, Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

# method.js/method.mak

MAKEFILE_DIR=node_modules/etc.mak/dist

include $(MAKEFILE_DIR)/javascript_vars.mak

BUILD_DEPENDENCIES=\
	github.com/david-padgett/annotations.js.git \
	github.com/david-padgett/testpilot.js.git

BUILD_TARGETS=\
	method.js \
	method-node.js

TEST_TARGETS=\
	method-node-tests.js

method.js : \
	$(SOURCE_DIR)/main/javascript/method.js

method-node.js : \
	$(SOURCE_DIR)/main/javascript/method-node-prefix.js \
	$(SOURCE_DIR)/main/javascript/method.js \
	$(SOURCE_DIR)/main/javascript/method-node-suffix.js

method-node-tests.js : \
	$(SOURCE_DIR)/test/javascript/node-prefix.js \
	$(SOURCE_DIR)/test/javascript/method-00-initialize.js \
	$(SOURCE_DIR)/test/javascript/method-01-namespace.js \
	$(SOURCE_DIR)/test/javascript/method-02-type.js \
	$(SOURCE_DIR)/test/javascript/method-03-operation.js \
	$(SOURCE_DIR)/test/javascript/method-04-interface.js \
	$(SOURCE_DIR)/test/javascript/method-05-constructor.js \
	$(SOURCE_DIR)/test/javascript/method-06-initializer.js \
	$(SOURCE_DIR)/test/javascript/method-07-inheritance.js \
	$(SOURCE_DIR)/test/javascript/method-08-super.js \
	$(SOURCE_DIR)/test/javascript/method-09-modifiers.js \
	$(SOURCE_DIR)/test/javascript/method-10-this.js \
	$(SOURCE_DIR)/test/javascript/method-20-README.md.js \
	$(SOURCE_DIR)/test/javascript/node-suffix.js

include $(MAKEFILE_DIR)/javascript_rules.mak
