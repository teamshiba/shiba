import json
from datetime import datetime
from enum import Enum
from typing import List
from uuid import uuid4

from google.cloud.firestore import DocumentReference, types
from mypy_extensions import TypedDict

from utils.connections import ref_items, ref_groups, ref_votes
from utils.exceptions import DataModelException


class FieldPath(str, Enum):
    creation_time = "creationTime"
    item_id = "itemId"
    item_url = "itemURL"
    name = "name"
    img_url = "imgURL"


class Item:
    creation_time: datetime
    item_id: str
    item_url: str
    name: str
    img_url: str

    def __init__(self, item_id=None, name="", item_url="", img_url=""):
        self.creation_time = datetime.now()
        if item_id is None:
            self.item_id = str(uuid4())
        else:
            self.item_id = item_id
        self.name = name
        self.item_url = item_url
        self.img_url = img_url

    @staticmethod
    def from_dict(source: dict):
        if type(source) is not dict:
            raise DataModelException('Not a dict.')
        return Item(item_id=source.get('itemId'),
                    img_url=source.get('imgUrl'),
                    name=source.get('name'),
                    item_url=source.get('itemUrl'))

    def to_dict(self):
        rv = dict()
        rv[FieldPath.creation_time.value] = str(self.creation_time)
        rv[FieldPath.item_id.value] = self.item_id
        rv[FieldPath.item_url.value] = self.item_url
        rv[FieldPath.name.value] = self.name
        rv[FieldPath.img_url.value] = self.img_url
        return rv

    def __repr__(self):
        return json.dumps(self.to_dict())

    @staticmethod
    def get_list_by_group(list_ids: List[str]):
        # TODO
        raise NotImplemented


class ItemFilter(TypedDict, total=False):
    group_id: str
    gid: str
    voted_by: str
    unvoted_by: str
    offset: int
    limit: int


def db_add_item(item: Item):
    if item.item_id is None:
        t, doc = ref_items.add(item.to_dict())
        doc: DocumentReference = doc
        item_id = doc.id
        doc.update({'itemId': item_id})
        return t
    else:
        res: types.WriteResult = ref_items.document(item.item_id).set(item.to_dict())
        return res.update_time


def filter_items(params):
    group_id = params.get("gid") if 'gid' in params else params.get("group_id")
    voted_by = params.get("voted_by")
    unvoted_by = params.get("unvoted_by")
    offset, limit = params.get('offset'), params.get('limit')
    if group_id is None:
        raise DataModelException("gid is required.")
    if voted_by is not None and unvoted_by is not None:
        raise DataModelException('cannot applied conditions: '
                                 'voted & unvoted simultaneously.')
    set_item_ids: set = set(ref_groups.document(group_id).get().to_dict()["itemList"])
    room_total = len(set_item_ids)
    if voted_by or unvoted_by:
        target_uid = voted_by if voted_by else unvoted_by
        stream_voted = ref_votes.where('groupId', '==', group_id).where(
            'userId', '==', target_uid
        ).select('itemId').get()
        set_voted = set(stream_voted)
        if voted_by:
            set_item_ids = set_item_ids.intersection(set_voted)
        else:
            set_item_ids = set_item_ids.difference(set_voted)

    list_stream = list()
    if set_item_ids:
        query = ref_items.where(u'itemId', u'in', list(set_item_ids))
        if query.get():
            stream = query.stream()
            for doc in stream:
                list_stream.append(doc.to_dict())

    return {
        "roomTotal": room_total,
        "items": list_stream
    }


def add_item_to_store(params: Item):
    item_id = params.item_id
    if item_id is None:
        raise DataModelException("itemId is required.")
    resp = ref_items.document(item_id).set(params.to_dict())
    return resp
