"""Test API calls handler independently."""
from unittest import TestCase
from unittest.mock import patch, Mock, MagicMock, DEFAULT

from pytest import raises

from routes.item import get_group_item_list, add_item
from tests.units import mocks
from tests.units.mocks import get_mock_request, get_mock_group, get_mock_doc_ref
from utils.exceptions import HTTPException
from utils import exceptions


class TestRoom(TestCase):

    def test_create_group_pass(self):
        mock_request = get_mock_request(json={
            'roomName': 'test_room_name'
        })
        mock_doc_ref = get_mock_doc_ref(data={
            "msg": "success",
            "creationTime": 'Sun Dec  6 23:29:52 2020',
            "data": {}
        })
        mock_ref_groups = MagicMock(add=Mock(return_value=('Sun Dec  6 23:29:52 2020',
                                                           mock_doc_ref)))

        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.room import create_group
            with patch.multiple('routes.room',
                                ref_groups=mock_ref_groups,
                                request=mock_request):
                resp = create_group.__wrapped__('test_uid')
                self.assertIn('data', resp)
        mock_ref_groups.add.assert_called_once()
        mock_doc_ref.get.assert_called_once()

    def test_create_group_fail(self):
        mock_request = get_mock_request(json={})
        mock_ref_groups = MagicMock(add=MagicMock())

        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.room import create_group
            with patch.multiple('routes.room',
                                ref_groups=mock_ref_groups,
                                request=mock_request):
                with raises(HTTPException, match="Field 'roomName' is required."):
                    create_group.__wrapped__('test_uid')
        mock_request.get_json.assert_called_once()
        mock_ref_groups.add.assert_not_called()

    # def test_join_group(self):
    #     mock_request = get_mock_request(json={})
    #     mock_doc_ref = get_mock_doc_ref(data={
    #         "msg": "success",
    #         "creationTime": 'Sun Dec  6 23:29:52 2020',
    #         "data": {}
    #     })
    #     mock_ref_groups = MagicMock(add=Mock(return_value=('Sun Dec  6 23:29:52 2020',
    #                                                        mock_doc_ref)))
    #     mock_ref_users = MagicMock(add=Mock(return_value=('Sun Dec  6 23:29:52 2020',
    #                                                        mock_doc_ref)))


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
                            request=mock_request):
            resp = get_group_item_list.__wrapped__()
            assert 'data' in resp
            assert type(resp['data']) == list
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
                            request=mock_request):
            with raises(exceptions.UnauthorizedRequest):
                get_group_item_list.__wrapped__()
        mock_filter_items.assert_not_called()
        mock_group.validate_user_role.assert_called_once()

        mock_group = get_mock_group(role=1)
        mock_request = get_mock_request(args={})
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch.multiple('routes.item',
                            Group=mock_group,
                            filter_items=mock_filter_items,
                            request=mock_request):
            with raises(exceptions.InvalidQueryParams):
                get_group_item_list.__wrapped__()
        mock_group.assert_not_called()
        mock_filter_items.assert_not_called()
        mock_group.validate_user_role.assert_not_called()

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
        mock_group_cls = get_mock_group(role=1)
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
        mock_group_cls = get_mock_group(role=1)
        mock_group_cls.append_item_list = Mock(return_value=1)
        with patch.multiple('routes.item',
                            Group=mock_group_cls,
                            db_add_item=DEFAULT,
                            request=mock_request) as values:
            with raises(HTTPException, match='item'):
                add_item.__wrapped__()

            values['db_add_item'].assert_not_called()


# class TestVoting(TestCase):
#     def test_put_a_vote_pass(self):
#         mock_request = get_mock_request(json={
#             'groupId': 'test_gid',
#             'itemId': 'test_item_id',
#             'type': 1,
#             'auth_uid': 'test-user-1'
#         })
#         mock_doc_ref = get_mock_doc_ref(data={
#             "msg": "success",
#             "creationTime": 'Sun Dec  6 23:29:52 2020',
#             "data": {"itemList": 'test_item_id'}
#         })
#         mock_ref_groups = MagicMock(add=Mock(return_value=('Sun Dec  6 23:29:52 2020',
#                                                            mock_doc_ref)))
#         mock_ref_voting = MagicMock(add=Mock(return_value=('Sun Dec  6 23:29:52 2020',
#                                                            mock_doc_ref)))
#         mock_group_cls = get_mock_group(role=1)
#         with patch('utils.config_g', mocks.get_mock_config_g()):
#             from routes.voting import put_a_vote
#             with patch.multiple('routes.voting',
#                                 ref_groups=mock_ref_groups,
#                                 ref_votes=mock_ref_voting,
#                                 request=mock_request,
#                                 Group=mock_group_cls) as values:
#                 resp = put_a_vote.__wrapped__()
#                 assert 'gid' in resp
#
#         mock_request.add.assert_called_once()
#         mock_group_cls.get.assert_called_once()


