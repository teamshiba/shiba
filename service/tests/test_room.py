from flask.testing import FlaskClient

from tests.fixture import ConnHelper, client, connection  # noqa
from utils import format_headers


class TestRoomRoutes:

    def test_get_list_suc(self, client: FlaskClient, connection: ConnHelper):
        with client:
            results = client.get(
                '/room/list',
                headers=format_headers(connection.auth),
                follow_redirects=True
            ).get_json()
            assert "data" in results
            assert len(results['data']) > 0

    def test_get_list_fail(self, client: FlaskClient, connection: ConnHelper):  # noqa
        with client:
            results: dict = client.get(
                '/room/list',
                follow_redirects=True
            ).get_json()
            assert results.get('code') == 401
