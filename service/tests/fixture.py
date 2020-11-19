import firebase_admin
import pytest
from firebase_admin import auth

from tests.modify_mockdata import load_to_db, clear_db
from utils import create_app

"""
Fixtures are functions, which will run before each test function to which it is applied.
"""


class TestConnection:
    token: str

    def __init__(self, token):
        self.token = token


@pytest.fixture(scope="module", autouse=True)
def connection():
    """
    This would run before all tests.
    Add mock data to firestore.
    :return:
    """
    create_app(test_mode=True)
    load_result = 'success' if load_to_db() else 'failed'
    print("\nBefore all testcases.\nLoading mock data: " + load_result)
    app = firebase_admin.get_app("Shiba")
    token = auth.create_custom_token(uid="test-user-1", app=app)

    yield TestConnection(token=token)

    clear_result = 'success' if clear_db() else 'failed'
    print("\nAfter all testcases.\nDeleting mock data: " + clear_result)


@pytest.fixture
def client():
    app = create_app(test_mode=True)
    print("\nA test client ready.\n")
    return app.test_client()
