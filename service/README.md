# Shiba API service

Description of APIs is put in `docs/service-APIs`.

## Testing

### Coverage report

Install Pytest suite. Run the pytest and generate a coverage report.

```shell script
pip install pytest
pip install pytest-cov
pytest --cov=routes --cov-report=html tests/
``` 

## Static code analysis

### Checkstyle report

Install pylint suite. Run the pylint and generate a checkstyle report.

```shell script
pip install pylint
pylint --reports=y service
``` 

## Buf finder report

```shell script
pip install flake8 flake8-html 
flake8 ./service/ --format=html --htmldir=reports/bugfinder-service --statistics --max-line-length=99
```
