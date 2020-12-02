from flask.testing import FlaskClient  # noqa: F401
from models.group import Group
from models.item import Item, db_add_item, filter_items
from models.voting import Voting
from tests.fixture import ConnHelper, client, connection  # noqa: F401

test_id = '12345'


class TestGroupModel:

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
        params = {'organizerUid': test_id}
        assert Group.update_from_dict(params)['organizerUid'] == test_id

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

    def test_from_dict(self):
        item = Item.from_dict({'itemId': test_id})
        assert item.item_id == test_id

    def test_to_dict(self):
        item = Item(item_id=test_id)
        assert item.to_dict()['itemId'] == test_id

    def test_db_add_item(self):
        item = Item(item_id=test_id)
        assert db_add_item(item) is not None

    def test_filter_items(self):
        params = {'gid': '0', 'unvoted_by': '0'}
        assert filter_items(params) is not None


class TestVotingModel:

    def test_from_dict(self):
        voting = Voting(item_id=test_id)
        assert voting.item_id == test_id

    def test_to_dict(self):
        voting = Voting(item_id=test_id)
        assert voting.to_dict()['itemId'] == test_id
