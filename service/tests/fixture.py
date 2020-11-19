import pytest

from utils import create_app

"""
Fixtures are functions, which will run before each test function to which it is applied.
"""


@pytest.fixture
def client():
    app = create_app(test_mode=True)
    return app.test_client()


@pytest.fixture(scope="session", autouse=True)
def before_all_tests():
    """
    This would run before all tests.
    :return:
    """
    pass
