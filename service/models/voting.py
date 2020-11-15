from datetime import datetime
from uuid import uuid4
from enum import Enum
import json


class FieldPath(Enum):
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

    def to_dict(self):
        return {
            FieldPath.creation_time: self.creation_time,
            FieldPath.group_id: self.group_id,
            FieldPath.item_id: self.item_id,
            FieldPath.user_id: self.user_id,
            FieldPath.vote_type: self.vote_type
        }

    def __repr__(self):
        return json.dumps(self.to_dict())
