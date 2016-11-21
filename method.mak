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

#** makestuff/src/global/init_rule.mak

REPO_DIR=.makestuff
MAKESTUFF_REPO=github.com/SummitStreet/makestuff@master.git
MAKESTUFF=$(shell python -c 'import os, re, sys ; R, V = re.match(r"(.+?)(@.*)?.git", sys.argv[2]).groups() ; print os.sep.join([sys.argv[1], R, V[1:]])' $(REPO_DIR) $(MAKESTUFF_REPO))

# The default target is 'all'.

all :

### Initialize/bootstrap makestuff environment
### usage: make [-f <makefile>] init [REPO_DIR=<external_repo_base_directory>]

makestuff_init :
	@rm -fr $(MAKESTUFF)
	@python -c 'import os, re, sys ; C = "git clone --branch {1} https://{0}.git {2}" ; R, V = re.match(r"(.+?)(@.*)?.git", sys.argv[2]).groups() ; D = os.sep.join([sys.argv[1], R, V[1:]]) ; None if os.path.isdir(D) else os.system(C.format(R, V[1:], D))' $(REPO_DIR) $(MAKESTUFF_REPO) >/dev/null 2>/dev/null
	@rm -fr $(REPO_DIR)/.tmp ; mv $(MAKESTUFF)/dist $(REPO_DIR)/.tmp ; rm -fr $(MAKESTUFF) ; mv $(REPO_DIR)/.tmp $(MAKESTUFF)

.PHONY : all makestuff_init

-include $(MAKESTUFF)/javascript_vars.mak

BUILD_DEPENDENCIES=\
	github.com/david-padgett/annotations.js.git.npm \
	github.com/david-padgett/testpilot.js.git.npm \
	github.com/SummitStreet/launchpad.git

BUILD_TARGETS=\
	$(DIST_DIR)/method.js \
	$(DIST_DIR)/method-node.js

JAVASCRIPT_TEST_COMPONENTS=\
	$(DIST_DIR)/method-node-tests.js

$(DIST_DIR)/method.js : \
	$(REPO_DIR)/github.com/SummitStreet/launchpad/master/javascript/service.js \
	$(SRC_DIR)/main/javascript/method.js

$(DIST_DIR)/method-node.js : \
	$(SRC_DIR)/main/javascript/method-node-prefix.js \
	$(REPO_DIR)/github.com/SummitStreet/launchpad/master/javascript/service.js \
	$(SRC_DIR)/main/javascript/method.js \
	$(SRC_DIR)/main/javascript/method-node-suffix.js

$(DIST_DIR)/method-node-tests.js : \
	$(SRC_DIR)/test/javascript/node-prefix.js \
	$(SRC_DIR)/test/javascript/method-00-initialize.js \
	$(SRC_DIR)/test/javascript/method-01-namespace.js \
	$(SRC_DIR)/test/javascript/method-02-type.js \
	$(SRC_DIR)/test/javascript/method-03-operation.js \
	$(SRC_DIR)/test/javascript/method-04-interface.js \
	$(SRC_DIR)/test/javascript/method-05-constructor.js \
	$(SRC_DIR)/test/javascript/method-06-initializer.js \
	$(SRC_DIR)/test/javascript/method-07-inheritance.js \
	$(SRC_DIR)/test/javascript/method-08-super.js \
	$(SRC_DIR)/test/javascript/method-09-modifiers.js \
	$(SRC_DIR)/test/javascript/method-10-this.js \
	$(SRC_DIR)/test/javascript/node-suffix.js

-include $(MAKESTUFF)/javascript_rules.mak
