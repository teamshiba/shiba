"""
Load mock data to db
"""
import google

from utils.db import delete_collection
from utils.read_write import json_read

mock_groups = json_read("mocks/groups.json")["data"]
mock_items = json_read("mocks/items.json")["data"]
mock_votes = json_read("mocks/votings.json")["data"]


def load_to_db():
    """
    load mock data to db
    :return: bool
    """
    from models.group import Group
    from models.item import Item
    from models.voting import Voting
    from utils.connections import ref_groups, ref_items, ref_votes

    def create_structure_data(mocks, data_class):
        """
        store the mock json data to list of structural data
        :param mocks: json
        :param data_class: model class
        :return: list of structural data
        """

        structure_list = list()
        for mock in mocks:
            init_data = data_class()
            init_data.from_dict(mock)
            structure_list.append(init_data.to_dict())
        return structure_list

    structure_groups = create_structure_data(mock_groups, Group)
    structure_items = create_structure_data(mock_items, Item)
    structure_votes = create_structure_data(mock_votes, Voting)
    print(structure_groups)

    try:
        for one_group in structure_groups:
            ref_groups.add(one_group)
        for one_item in structure_items:
            ref_items.add(one_item)
        for one_voting in structure_votes:
            ref_votes.add(one_voting)
        return True
    except google.cloud.exceptions.Conflict:
        return False


def clear_db():
    """
    clear db mock data
    :return: bool
    """
    from utils.connections import ref_groups, ref_items, ref_votes
    try:
        delete_collection(ref_groups)
        delete_collection(ref_items)
        delete_collection(ref_votes)
        return True
    except google.cloud.exceptions.Conflict:
        return False
