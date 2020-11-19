from flask.testing import FlaskClient

from tests.fixture import TestConnection, client, connection  # noqa
from utils import format_headers


class TestRoomRoutes:

    def test_get_list_suc(self, client: FlaskClient, connection: TestConnection):
        with client:
            results = client.get(
                '/room/list',
                headers=format_headers(connection.token),
                follow_redirects=True
            ).get_json()
            assert "data" in results
            assert len(results['data']) > 0

    def test_get_list_fail(self, client: FlaskClient, connection: TestConnection):
        with client:
            results: dict = client.get(
                '/room/list',
                headers=format_headers(connection.token),
                follow_redirects=True
            ).get_json()
            assert results.get('code') == 401
