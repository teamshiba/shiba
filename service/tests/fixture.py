import pytest

from utils import create_app
from tests.modify_mockdata import load_to_db, clear_db


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
    create_app(test_mode=True)
    load_result = 'success' if load_to_db() else 'failed'
    print("\n\n\nrun before all.\n\n\nload result: " + load_result)

    yield

    clear_result = 'success' if clear_db() else 'failed'
    print("\n\n\nrun after all.\n\n\ndelete result: " + clear_result)




@pytest.fixture
def client():
    app = create_app(test_mode=True)
    print("\n\n\nget a client.\n\n\n")
    return app.test_client()
