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
