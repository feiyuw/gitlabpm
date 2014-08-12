# entry point of gitlabpm, including package, test and doc
DOC_DIR := doc

.PHONY: all clean test coverage doc package
all: clean test coverage doc package

test:
	@echo building test...

coverage:
	@echo generating test coverage...

clean:
	@echo cleaning...

package:
	@echo building package...

doc:
	@echo generating document...

