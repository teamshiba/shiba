all:

report: frontend-cov backend-cov

frontend-cov:
	cd webapp && npm run coverage
	mv webapp/coverage reports/frontend-coverage

backend-cov:
	cd service && pytest --cov-report term-missing --cov=models,utils,routes --cov-branch tests/units

.PHONY: report frontend-cov backend-cov
