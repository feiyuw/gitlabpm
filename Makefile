# entry point of gitlabpm, including package, test and doc
DOC_DIR := doc

.PHONY: all clean test coverage doc package
all: clean test coverage doc package

test:
	@echo building test...
	npm install mocha
	npm install proxyquire
	node_modules/mocha/bin/mocha

coverage:
	@echo generating test coverage...

clean:
	@echo cleaning...

package:
	@echo building package...

doc:
	@echo generating document...

