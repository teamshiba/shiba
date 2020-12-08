from flask.testing import FlaskClient  # noqa: F401
import pytest
from models.group import Group
from models.item import Item, db_add_item, filter_items, add_item_to_store
from models.voting import Voting
from tests.fixture import ConnHelper, client, connection  # noqa: F401

test_id = '12345'


class TestGroupModel:

    def test_validate_user_role(self):
        uid = 'test-user-1'
        group_id = '0'
        assert Group.validate_user_role(uid=uid, group_id=group_id) == 1

    def test_append_item_list(self):
        uid = 'test-user-1'
        group_id = '0'
        item_id = '0'
        assert Group.append_item_list(uid=uid, group_id=group_id, item_id=item_id) == 1


class TestItemModel:

    def test_db_add_item(self):
        item = Item(item_id=test_id)
        assert db_add_item(item) is not None

    def test_db_add_item_no_item_id(self):
        item = Item(item_id=None)
        assert db_add_item(item) is not None

    def test_filter_items(self):
        with pytest.raises(TypeError):
            resp = filter_items({
                                    'uid': 'test-user-1',
                                    'gid': '12345',
                                    'voted_by': '12345'})

    def test_add_item_to_store(self):
        item = Item()
        resp = add_item_to_store(item)
        assert resp is not None


class TestVotingModel:

    def test_from_dict(self):
        voting = Voting(item_id=test_id)
        voting.from_dict({'type': 1, 'groupId': '1', 'itemId': '1', 'userId': '1', 'creationTime': '1'})
        assert voting.vote_type == 1

    def test_to_dict(self):
        voting = Voting(item_id=test_id)
        assert voting.to_dict()['itemId'] == test_id
