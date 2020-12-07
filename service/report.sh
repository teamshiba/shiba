#!/usr/bin/env bash
# This should be run from root directory (shiba)
pip install requirements.txt
pylint --reports=y --disable=C0415,C0103 --msg-template="$FileDir$/{path}:{line}:{C}:({symbol}){msg}" service/models service/routes service/utils
 > reports/stylecheck-service
flake8 ./service/ --format=html --htmldir=reports/bugfinder-service --statistics --ignore E501 --exclude='test_*.py'
pytest --cov ./service/tests
