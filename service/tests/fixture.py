"""
Fixtures are functions, which will run before each test function to which it is applied.
"""
import pytest
from typing import Union

from utils import create_app
from tests.data_mocks import load_to_db, clear_db


class ConnHelper:
    """
    Connection helper class
    """
    token: str
    uid: str

    def __init__(self, token: Union[str, bytes]="", uid=""):
        self.uid = uid
        if isinstance(token, str):
            self.token = token
        else:
            self.token = token.decode()

    @property
    def auth(self):
        """
        :return: token or uid
        """
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
    print("\nBefore all test cases.\nLoading mock data: " + load_result)

    yield ConnHelper(uid="test-user-1")

    clear_result = 'success' if clear_db() else 'failed'
    print("\nAfter all test cases.\nDeleting mock data: " + clear_result)


@pytest.fixture
def client():
    """
    define test client
    :return: app test client
    """
    app = create_app(test_mode=True)
    print("\nA test client is ready.\n")
    return app.test_client()
