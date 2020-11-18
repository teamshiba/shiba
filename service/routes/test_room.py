from flask.testing import FlaskClient

from tests.fixture import client, app  # noqa


class TestRoomRoutes:

    def test_get_list(self, client: FlaskClient):  # noqa
        with client:
            results = client.get(
                '/room/list', json={
                    'roomName': 'test_name'}, follow_redirects=True
            ).get_json()
            assert "data" in results
