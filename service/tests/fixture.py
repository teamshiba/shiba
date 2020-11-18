import pytest

from utils import create_app

"""
Fixtures are functions, which will run before each test function to which it is applied.
"""


@pytest.fixture
def client():
    app = create_app()
    return app.test_client()
