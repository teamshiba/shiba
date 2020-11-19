import pytest

from utils import create_app
from .data_mocks import load_to_db, clear_db

"""
Fixtures are functions, which will run before each test function to which it is applied.
"""


class ConnHelper:
    token: str
    uid: str

    def __init__(self, token="", uid=""):
        self.uid = uid
        if type(token) is str:
            self.token = token
        else:
            self.token = token.decode()

    @property
    def auth(self):
        return self.token or self.uid


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

    yield ConnHelper(uid="test-user-1")

    clear_result = 'success' if clear_db() else 'failed'
    print("\nAfter all testcases.\nDeleting mock data: " + clear_result)


@pytest.fixture
def client():
    app = create_app(test_mode=True)
    print("\nA test client is ready.\n")
    return app.test_client()
