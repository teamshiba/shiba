from datetime import datetime
from uuid import uuid4
from enum import Enum
import json


class FieldPath(str, Enum):
    creation_time = "creationTime"
    group_id = "groupId"
    item_id = "itemId"
    user_id = "userId"
    vote_type = "type"


class Voting:
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

    # TODO
    def from_dict(self, source):
        pass

    def to_dict(self):
        return {
            "creationTime": str(self.creation_time),
            "groupId": self.group_id,
            "itemId": self.item_id,
            "userId": self.user_id,
            "type": self.vote_type
        }

    def __repr__(self):
        return json.dumps(self.to_dict())
