"""
Item class related doc.
"""
import json
from datetime import datetime
from enum import Enum
from uuid import uuid4

from google.cloud.firestore import types
from mypy_extensions import TypedDict


from utils.exceptions import DataModelException


class FieldPath(str, Enum):
    """
    FieldPath
    """
    creation_time = "creationTime"
    item_id = "itemId"
    item_url = "itemURL"
    name = "name"
    img_url = "imgURL"


class Item:
    """
    Attributes:
    creation_time (data time): creation_time.
    item_id (str): item_id.
    item_url (str): item_url.
    name (str): name.
    img_url (str): img_url.
    """
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
        """
        :param source: parameter dictionary
        """
        if not isinstance(source, dict):
            raise DataModelException('Not a dict.')
        return Item(item_id=source.get('itemId'),
                    img_url=source.get('imgURL'),
                    name=source.get('name'),
                    item_url=source.get('itemURL'))

    def to_dict(self):
        """
        turn item to dict
        :return: a dictionary
        """
        r_v = dict()
        r_v[FieldPath.creation_time.value] = str(self.creation_time)
        r_v[FieldPath.item_id.value] = self.item_id
        r_v[FieldPath.item_url.value] = self.item_url
        r_v[FieldPath.name.value] = self.name
        r_v[FieldPath.img_url.value] = self.img_url
        return r_v

    def __repr__(self):
        return json.dumps(self.to_dict())


class ItemFilter(TypedDict, total=False):
    """
    Item Filter Class
    """
    group_id: str
    gid: str
    voted_by: str
    unvoted_by: str
    offset: int
    limit: int


def db_add_item(item: Item):
    """
    add item to db
    :param item: item object
    :return: update time
    """
    from utils.connections import ref_items
    if item.item_id is None:
        add_time, doc = ref_items.add(item.to_dict())
        item_id = doc.id
        doc.update({'itemId': item_id})
        return add_time
    res: types.WriteResult = ref_items.document(item.item_id).set(item.to_dict())
    return res.update_time


def filter_items(params):
    """
    :param params: gid, voted_by, unvoted_by, uid
    :return:
    {
        "roomTotal": room_total,
        "items": item detailed info
    }
    """
    from utils.connections import ref_items, ref_groups, ref_votes
    group_id = params.get("gid") if 'gid' in params else params.get("group_id")
    voted_by = params.get("voted_by")
    unvoted_by = params.get("unvoted_by")
    # offset, limit = params.get('offset'), params.get('limit')
    if group_id is None:
        raise DataModelException("gid is required.")
    if voted_by is not None and unvoted_by is not None:
        raise DataModelException('cannot applied conditions: '
                                 'voted & unvoted simultaneously.')
    set_item_ids: set = set(ref_groups.document(group_id).get().to_dict()["itemList"])
    room_total = len(set_item_ids)
    if voted_by or unvoted_by:
        target_uid = voted_by if voted_by else unvoted_by
        query_voted = ref_votes.where('groupId', '==', group_id).where(
            'userId', '==', target_uid
        )
        if query_voted:
            set_voted = [doc.to_dict()["itemId"] for doc in query_voted.stream()]
        else:
            set_voted = []
        set_voted = set(set_voted)
        if voted_by:
            set_item_ids = set_item_ids.intersection(set_voted)
        else:
            set_item_ids = set_item_ids.difference(set_voted)

    list_stream = list()
    if set_item_ids:
        query = ref_items.where(u'itemId', u'in', list(set_item_ids))
        if query.get():
            for doc in query.stream():
                list_stream.append(doc.to_dict())

    return {
        "roomTotal": room_total,
        "items": list_stream
    }


def add_item_to_store(params: Item):
    """
    add item to item collection
    :param params: Item obj
    :return: firestore add response
    """
    from utils.connections import ref_items
    item_id = params.item_id
    if item_id is None:
        raise DataModelException("itemId is required.")
    resp = ref_items.document(item_id).set(params.to_dict())
    return resp
