"""
 Voting class related doc.
"""
from datetime import datetime
from enum import Enum
import json


class FieldPath(str, Enum):
    """
    FieldPath
    """
    creation_time = "creationTime"
    group_id = "groupId"
    item_id = "itemId"
    user_id = "userId"
    vote_type = "type"


class Voting:
    """
    Attributes:
    creation_time (data time): creation_time.
    group_id (str): group_id.
    item_id (str): item_id.
    user_id (str): user_id.
    vote_type (int): like -> 1 ; dislike -> -1.
    """
    creation_time: datetime
    group_id: str
    item_id: str
    user_id: str
    vote_type: int

    def __init__(self, group_id='', user_id='', item_id='', vote_type=0):
        self.creation_time = datetime.now()
        self.group_id = group_id
        self.item_id = item_id
        self.user_id = user_id
        self.vote_type = vote_type

    def from_dict(self, source):
        """
        :param source: parameter dictionary
        """
        self.creation_time = source["creationTime"]
        self.group_id = source["groupId"]
        self.item_id = source["itemId"]
        self.user_id = source["userId"]
        self.vote_type = source["type"]

    def to_dict(self):
        """
        turn Voting to dict
        :return: a dictionary
        """
        return {
            "creationTime": str(self.creation_time),
            "groupId": self.group_id,
            "itemId": self.item_id,
            "userId": self.user_id,
            "type": self.vote_type
        }

    def __repr__(self):
        return json.dumps(self.to_dict())
