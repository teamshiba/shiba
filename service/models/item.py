from datetime import datetime
from typing import Set
from firebase_admin import firestore
from uuid import uuid4
from enum import Enum
import json
from mypy_extensions import TypedDict
from .connections import ref_items, ref_groups, ref_votes
from utils.exceptions import DataModelException


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


class ItemFilter(TypedDict, total=False):
    group_id: str
    gid: str
    voted_by: str
    unvoted_by: str
    offset: int
    limit: int


def filter_items(params: ItemFilter):
    group_id = params.get("gid") if 'gid' in params else params.get("group_id")
    voted_by = params.get("voted_by")
    unvoted_by = params.get("unvoted_by")
    offset, limit = params.get('offset'), params.get('limit')
    if group_id is None:
        raise DataModelException("gid is required.")
    if voted_by is not None and unvoted_by is not None:
        raise DataModelException('cannot applied conditions: '
                                 'voted & unvoted simultaneously.')
    set_item_ids: Set = set(ref_groups.document(group_id).get().get("itemList"))
    if voted_by or unvoted_by:
        target_uid = voted_by if voted_by else unvoted_by
        stream_voted = ref_votes.where('groupId', '==', group_id).where(
            'userId', '==', target_uid
        ).select('itemId').stream()
        set_voted = set(stream_voted)
        if voted_by:
            set_item_ids = set_item_ids.intersection(set_voted)
        else:
            set_item_ids = set_item_ids.difference(set_voted)
    query = ref_items.where('itemId', 'in', list(set_item_ids))
    stream = query.stream()
    return {
        "roomTotal": len(set_item_ids),
        "items": list(stream)
    }
