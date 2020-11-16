from datetime import datetime
from uuid import uuid4
from enum import Enum
import json


class FieldPath(str, Enum):
    creation_time = "creationTime"
    item_id = "itemId"
    item_url = "itemUrl"
    name = "name"


class Item:
    creation_time: datetime
    item_id: str
    item_url: str
    name: str

    def __init__(self, item_id=None, name="", item_url=""):
        self.creation_time = datetime.now()
        if item_id is None:
            self.item_id = str(uuid4())
        else:
            self.item_id = item_id
        self.name = name
        self.item_url = item_url

    def to_dict(self):
        rv = dict()
        rv[FieldPath.creation_time.value] = str(self.creation_time)
        rv[FieldPath.item_id.value] = self.item_id
        rv[FieldPath.item_url.value] = self.item_url
        rv[FieldPath.name.value] = self.name
        return rv

    def __repr__(self):
        return json.dumps(self.to_dict())
