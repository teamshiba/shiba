import pytest

from utils import create_app

"""
Fixtures are functions, which will run before each test function to which it is applied.
"""


@pytest.fixture(scope="module", autouse=True)
def before_all_tests():
    """
    This would run before all tests.
    Add mock data to firestore.
    :return:
    """
    print("\n\n\nrun before all.\n\n\n")


@pytest.fixture
def client():
    app = create_app(test_mode=True)
    print("\n\n\nget a client.\n\n\n")
    return app.test_client()
