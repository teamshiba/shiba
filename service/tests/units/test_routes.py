"""Test API calls handler independently."""
from unittest import TestCase
from unittest.mock import patch, Mock, DEFAULT

from pytest import raises

from routes.item import get_group_item_list, add_item
from tests.units.mocks import get_mock_request, get_mock_group
from utils.exceptions import UnauthorizedRequest, HTTPException


class TestItem(TestCase):

    def test_get_item_list_pass(self):
        mock_group = get_mock_group(role=1)
        mock_request = get_mock_request(args={
            'gid': 'test_gid'
        })
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch.multiple('routes.item',
                            Group=mock_group,
                            filter_items=mock_filter_items,
                            request=mock_request) as values:
            get_group_item_list.__wrapped__()
        mock_filter_items.assert_called_once()
        mock_group.validate_user_role.assert_called_once()

    def test_get_item_list_fail(self):
        mock_group = get_mock_group(role=0)
        mock_request = get_mock_request(args={
            'gid': 'test_gid'
        })
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch.multiple('routes.item',
                            Group=mock_group,
                            filter_items=mock_filter_items,
                            request=mock_request) as values:
            with raises(UnauthorizedRequest):
                get_group_item_list.__wrapped__()
        mock_filter_items.assert_not_called()
        mock_group.validate_user_role.assert_called_once()

    def test_add_item_pass(self):
        mock_request = get_mock_request(json={
            'groupId': 'test_gid',
            'item': {
                'itemId': 'test_iid',
                'imgURL': 'url  ,',
                'name': 'name',
                'itemURL': 'url'
            }
        })
        mock_group_cls = get_mock_group(1)
        mock_group_cls.append_item_list = Mock(return_value=1)
        with patch.multiple('routes.item',
                            Group=mock_group_cls,
                            db_add_item=DEFAULT,
                            request=mock_request) as values:
            resp = add_item.__wrapped__()
            self.assertIn('msg', resp)
            values['db_add_item'].assert_called_once()

    def test_add_item_fail(self):
        mock_request = get_mock_request(json={
            'groupId': 'test_gid',
        })
        mock_group_cls = get_mock_group(1)
        mock_group_cls.append_item_list = Mock(return_value=1)
        with patch.multiple('routes.item',
                            Group=mock_group_cls,
                            db_add_item=DEFAULT,
                            request=mock_request) as values:
            with raises(HTTPException, match='item'):
                add_item.__wrapped__()

            values['db_add_item'].assert_not_called()
