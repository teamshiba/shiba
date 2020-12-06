from models.group import Group
from models.voting import Voting
from models.item import Item

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
        params = {'organizerUid': test_id}
        assert Group.update_from_dict(params)['organizerUid'] == test_id


class TestItem:

    def test_from_dict(self):
        item = Item.from_dict({'itemId': test_id})
        assert item.item_id == test_id

    def test_to_dict(self):
        item = Item(item_id=test_id)
        assert item.to_dict()['itemId'] == test_id


class TestVotingModel:

    def test_from_dict(self):
        voting = Voting(item_id=test_id)
        assert voting.item_id == test_id

    def test_to_dict(self):
        voting = Voting(item_id=test_id)
        assert voting.to_dict()['itemId'] == test_id
