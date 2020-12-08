all:

report: frontend-report

frontend-report:
	cd webapp && npm run coverage
	mv webapp/coverage reports/frontend-coverage

.PHONY: report frontend-report
