from flask.testing import FlaskClient

from tests.fixture import client, before_all_tests


class TestRoomRoutes:

    def test_get_list(self, client: FlaskClient):
        with client:
            results = client.get(
                '/room/list', json={
                    'roomName': 'test_name'}, follow_redirects=True
            ).get_json()
            assert "data" in results

    def test_get_list_1(self, client: FlaskClient):
        with client:
            results = client.get(
                '/room/list', json={
                    'roomName': 'test_name'}, follow_redirects=True
            ).get_json()
            assert "data" in results
