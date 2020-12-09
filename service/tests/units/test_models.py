from models.group import Group
from models.voting import Voting
from models.item import Item
import pytest
from unittest.mock import patch, Mock
from utils.exceptions import DataModelException
from tests.units import mocks

test_id = '12345'


class TestGroup:

    def test_group_from_dict(self):
        group = Group(organizer_id=test_id)
        assert group.organizer_uid == test_id

    def test_group_to_dict(self):
        group = Group(organizer_id=test_id)
        assert group.to_dict()["organizerUid"] == test_id

    def test_create_from_dict(self):
        params = {'organizerUid': test_id}
        assert Group.create_from_dict(params).organizer_uid == test_id

    def test_update_from_dict(self):
        params = {'organizerUid': test_id, 'roomName': 'test_room', 'isCompleted': False}
        assert Group.update_from_dict(params)['organizerUid'] == test_id


class TestItem:

    def test_from_dict(self):
        item = Item.from_dict({'itemId': test_id})
        assert item.item_id == test_id

    def test_from_dict_invalid(self):
        with pytest.raises(DataModelException):
            item = Item.from_dict([test_id])

    def test_to_dict(self):
        item = Item(item_id=test_id)
        assert item.to_dict()['itemId'] == test_id

    def test_filter_items(self):
        doc_group = mocks.get_mock_doc_ref(data={
            'isCompleted': True,
            'itemList': ['id1']
        })
        ref_groups = mocks.get_mock_collection(
            mock_doc=doc_group,
            valid_ids=['gid1']
        )
        ref_items = mocks.get_mock_collection(stream=[{'itemId': 'id1'}])
        ref_votes = mocks.get_mock_collection(stream=[{'itemId': 'id1', 'type': 1},
                                                      {'itemId': 'id2', 'type': -1}])
        config = mocks.get_mock_config_g({
            'Users': Mock(),
            'Groups': ref_groups,
            'Votings': ref_votes,
            'Items': ref_items
        })
        with patch('utils.config_g', config):
            from models.item import filter_items
            resp = filter_items({
                'group_id': 'gid1',
                'voted_by': 'user1'
            })
            assert 'items' in resp
            assert 'roomTotal' in resp

            resp = filter_items({
                'group_id': 'gid1',
                'unvoted_by': 'user1'
            })
            assert 'items' in resp
            assert 'roomTotal' in resp


class TestVotingModel:

    def test_from_dict(self):
        voting = Voting(item_id=test_id)
        voting.from_dict({'type': 1, 'groupId': '1', 'itemId': '1', 'userId': '1', 'creationTime': '1'})
        assert voting.vote_type == 1

    def test_to_dict(self):
        voting = Voting(item_id=test_id)
        assert voting.to_dict()['itemId'] == test_id
