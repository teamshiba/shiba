"""Test API calls handler independently."""
from unittest import TestCase
from unittest.mock import patch, Mock, MagicMock, DEFAULT

from pytest import raises

from routes.item import get_group_item_list, add_item, search_item
from tests.units.mocks import get_mock_request, get_mock_group, get_mock_doc_ref
from tests.units import mocks
from utils.exceptions import HTTPException, UnauthorizedRequest, InvalidRequestBody
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

    def test_search_item_pass(self):
        inbound_request = get_mock_request(args={
            'location': 'NYC',
            'term': 'nothing'
        })
        outbound_request = Mock(return_value=Mock(json=Mock(
            return_value={
                "businesses": [{
                    'url': 'test_url',
                    'image_url': 'test_img'
                }],
                "total": 1,
                "region": {}
            }
        )))
        with patch('routes.item.request', inbound_request):
            with patch('utils.external.requests.request', outbound_request):
                resp = search_item.__wrapped__('test_uid')
                assert 'businesses' in resp
                for item in resp['businesses']:
                    assert 'itemURL' in item
                    assert 'imgURL' in item

    def test_search_item_fail(self):
        inbound_request1 = get_mock_request(args={
            'term': 'nothing'
        })
        inbound_request2 = get_mock_request(args={
            'term': 'nothing',
            'location': 'NYC'
        })
        outbound_request = Mock(return_value=Mock(json=Mock(
            return_value={
                "businesses": [{
                    'url': 'test_url',
                }],
                "total": 1,
                "region": {}
            }
        )))
        with patch('routes.item.request', inbound_request2):
            with patch('utils.external.requests.request', outbound_request):
                resp, code = search_item.__wrapped__('test_uid')
                assert code == 500
                assert 'msg' in resp

                with raises(exceptions.UnauthorizedRequest):
                    search_item.__wrapped__()

        with patch('routes.item.request', inbound_request1):
            with patch('utils.external.requests.request', outbound_request):
                with raises(exceptions.InvalidQueryParams):
                    search_item.__wrapped__('test_uid')


class TestVoting(TestCase):
    def test_put_a_vote_pass(self):
        mock_request = get_mock_request(json={
            'groupId': 'test_gid',
            'itemId': 'test_item_id',
            'type': 1,
            'auth_uid': 'test-user-1'
        })
        mock_doc_ref = get_mock_doc_ref(data={"itemList": ['test_item_id'],
                                              'members': ['test-user-1']})
        mock_ref_groups = mocks.get_mock_collection(mock_doc=mock_doc_ref, stream=[
        ])
        mock_ref_voting = mocks.get_mock_collection(mock_doc=mock_doc_ref)
        mock_group_cls = get_mock_group(role=1)
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.voting import put_a_vote
            with patch.multiple('routes.voting',
                                ref_groups=mock_ref_groups,
                                ref_votes=mock_ref_voting,
                                request=mock_request,
                                Group=mock_group_cls,
                                filter_items=mock_filter_items):
                resp = put_a_vote.__wrapped__('test-user-1')
                assert 'data' in resp

        mock_filter_items.assert_called_once_with({
            'gid': 'test_gid',
            'unvoted_by': 'test-user-1'
        })

    def test_put_a_vote_fail_gid(self):
        mock_request = get_mock_request(json={})
        mock_doc_ref = get_mock_doc_ref(data={"itemList": ['test_item_id'],
                                              'members': ['test-user-1']})
        mock_ref_groups = mocks.get_mock_collection(mock_doc=mock_doc_ref, stream=[
        ])
        mock_ref_voting = mocks.get_mock_collection(mock_doc=mock_doc_ref)
        mock_group_cls = get_mock_group(role=1)
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.voting import put_a_vote
            with patch.multiple('routes.voting',
                                ref_groups=mock_ref_groups,
                                ref_votes=mock_ref_voting,
                                request=mock_request,
                                Group=mock_group_cls,
                                filter_items=mock_filter_items):
                with raises(InvalidRequestBody, match="groupId is required."):
                    put_a_vote.__wrapped__('test-user-1')

    def test_put_a_vote_fail_valid_user(self):
        mock_request = get_mock_request(json={'groupId': 'test_gid',
                                              'itemId': 'test_item_id'})
        mock_doc_ref = get_mock_doc_ref(data={"itemList": ['test_item_id'],
                                              'members': ['test-user-1']})
        mock_ref_groups = mocks.get_mock_collection(mock_doc=mock_doc_ref, stream=[
        ])
        mock_ref_voting = mocks.get_mock_collection(mock_doc=mock_doc_ref)
        mock_group_cls = get_mock_group(role=0)
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.voting import put_a_vote
            with patch.multiple('routes.voting',
                                ref_groups=mock_ref_groups,
                                ref_votes=mock_ref_voting,
                                request=mock_request,
                                Group=mock_group_cls,
                                filter_items=mock_filter_items):
                with raises(UnauthorizedRequest, match="Not a member of target group."):
                    put_a_vote.__wrapped__('test-user-1')

    def test_put_a_vote_fail_item_id(self):
        mock_request = get_mock_request(json={'groupId': 'test_gid'})
        mock_doc_ref = get_mock_doc_ref(data={"itemList": ['test_item_id'],
                                              'members': ['test-user-1']})
        mock_ref_groups = mocks.get_mock_collection(mock_doc=mock_doc_ref, stream=[
        ])
        mock_ref_voting = mocks.get_mock_collection(mock_doc=mock_doc_ref)
        mock_group_cls = get_mock_group(role=1)
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.voting import put_a_vote
            with patch.multiple('routes.voting',
                                ref_groups=mock_ref_groups,
                                ref_votes=mock_ref_voting,
                                request=mock_request,
                                Group=mock_group_cls,
                                filter_items=mock_filter_items):
                with raises(InvalidRequestBody, match="itemId is required."):
                    put_a_vote.__wrapped__('test-user-1')

    def test_put_a_vote_fail_v_type(self):
        mock_request = get_mock_request(json={'groupId': 'test_gid',
                                              'itemId': 'test_item_id'})
        mock_doc_ref = get_mock_doc_ref(data={"itemList": ['test_item_id'],
                                              'members': ['test-user-1']})
        mock_ref_groups = mocks.get_mock_collection(mock_doc=mock_doc_ref, stream=[
        ])
        mock_ref_voting = mocks.get_mock_collection(mock_doc=mock_doc_ref)
        mock_group_cls = get_mock_group(role=1)
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.voting import put_a_vote
            with patch.multiple('routes.voting',
                                ref_groups=mock_ref_groups,
                                ref_votes=mock_ref_voting,
                                request=mock_request,
                                Group=mock_group_cls,
                                filter_items=mock_filter_items):
                with raises(InvalidRequestBody, match="type is required."):
                    put_a_vote.__wrapped__('test-user-1')

    def test_put_a_vote_fail_v_type_num(self):
        mock_request = get_mock_request(json={'groupId': 'test_gid',
                                              'itemId': 'test_item_id',
                                              'type': 0})
        mock_doc_ref = get_mock_doc_ref(data={"itemList": ['test_item_id'],
                                              'members': ['test-user-1']})
        mock_ref_groups = mocks.get_mock_collection(mock_doc=mock_doc_ref, stream=[
        ])
        mock_ref_voting = mocks.get_mock_collection(mock_doc=mock_doc_ref)
        mock_group_cls = get_mock_group(role=1)
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.voting import put_a_vote
            with patch.multiple('routes.voting',
                                ref_groups=mock_ref_groups,
                                ref_votes=mock_ref_voting,
                                request=mock_request,
                                Group=mock_group_cls,
                                filter_items=mock_filter_items):
                with raises(InvalidRequestBody, match="type must be 1 or -1."):
                    put_a_vote.__wrapped__('test-user-1')

    def test_put_a_vote_fail_item_list(self):
        mock_request = get_mock_request(json={
            'groupId': 'test_gid',
            'itemId': 'test_item_id',
            'type': 1,
            'auth_uid': 'test-user-1'})
        mock_doc_ref = get_mock_doc_ref(data={"itemList": [],
                                              'members': ['test-user-1']})
        mock_ref_groups = mocks.get_mock_collection(mock_doc=mock_doc_ref, stream=[
        ])
        mock_ref_voting = mocks.get_mock_collection(mock_doc=mock_doc_ref)
        mock_group_cls = get_mock_group(role=1)
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.voting import put_a_vote
            with patch.multiple('routes.voting',
                                ref_groups=mock_ref_groups,
                                ref_votes=mock_ref_voting,
                                request=mock_request,
                                Group=mock_group_cls,
                                filter_items=mock_filter_items):
                with raises(InvalidRequestBody, match="target item not in that group."):
                    put_a_vote.__wrapped__('test-user-1')

    def test_put_a_vote_fail_members(self):
        mock_request = get_mock_request(json={
            'groupId': 'test_gid',
            'itemId': 'test_item_id',
            'type': 1,
            'auth_uid': 'test-user-1'
        })
        mock_doc_ref = get_mock_doc_ref(data={"itemList": ['test_item_id'],
                                              'members': []})
        mock_ref_groups = mocks.get_mock_collection(mock_doc=mock_doc_ref, stream=[
        ])
        mock_ref_voting = mocks.get_mock_collection(mock_doc=mock_doc_ref)
        mock_group_cls = get_mock_group(role=1)
        mock_filter_items = Mock(return_value={
            'data': []
        })
        with patch('utils.config_g', mocks.get_mock_config_g()):
            from routes.voting import put_a_vote
            with patch.multiple('routes.voting',
                                ref_groups=mock_ref_groups,
                                ref_votes=mock_ref_voting,
                                request=mock_request,
                                Group=mock_group_cls,
                                filter_items=mock_filter_items):
                with raises(InvalidRequestBody, match="that user not in this group."):
                    put_a_vote.__wrapped__('test-user-1')