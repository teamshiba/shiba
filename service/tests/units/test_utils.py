import unittest
from unittest.mock import MagicMock, patch

from pytest import raises

from utils.exceptions import handle_http_exception, LoginRequired, InvalidRequestBody
from utils.external import yelp_search_biz


class TestExceptions(unittest.TestCase):
    def test_handle_http_exception(self):
        login_required = LoginRequired('test')
        resp, code = handle_http_exception(login_required)
        self.assertEqual(code, 401)
        self.assertDictEqual(resp, {
            'code': 401,
            'msg': 'test',
            'name': 'Unauthorized'
        })

    def test_raise_key_error(self):
        with raises(InvalidRequestBody, match="Field 'a' is required."):
            InvalidRequestBody.raise_key_error('a')


class TestExternal(unittest.TestCase):

    @patch('requests.request')
    def test_yelp_search_biz_pass(self, request_mock: MagicMock):
        expected = {
            "businesses": [],
            "total": 0,
            "region": {
                "center": {
                    "longitude": -73.99429321289062,
                    "latitude": 40.70544486444615
                }
            }
        }
        resp_mock = MagicMock()
        resp_mock.json = MagicMock(return_value=expected)
        request_mock.return_value = resp_mock
        res = yelp_search_biz(location='New York City')
        resp_mock.json.assert_any_call()
        self.assertDictEqual(res, expected)

    @patch('requests.request')
    def test_yelp_search_biz_fail(self, request_mock: MagicMock):
        resp_mock = MagicMock()
        resp_mock.json = MagicMock(return_value={})
        request_mock.return_value = resp_mock
        with raises(ValueError):
            yelp_search_biz(term='New York City')
        resp_mock.json.assert_not_called()
