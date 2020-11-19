""" Group class related doc."""

import datetime

from firebase_admin import firestore
from google.cloud.firestore import DocumentSnapshot

from utils.connections import ref_groups
from utils.exceptions import InvalidRequestBody, UnauthorizedRequest


class Group():
    """
        Attributes:
        organizer_uid (str): organizer_uid.
        is_completed (bool): is_completed.
        item_list (list): a list of item_id.
        members (list): a list of user_id.
        room_name (str): room_name.
        created_time (data time): created_time.
    """
    def __init__(self, organizer_id='', room_name='', is_completed=False):
        self.organizer_uid = organizer_id
        self.is_completed = is_completed
        self.item_list = []
        self.members = [organizer_id]
        self.room_name = room_name
        self.created_time = datetime.datetime.now()

    def from_dict(self, source):
        """
        :param source: parameter dictionary
        """
        self.organizer_uid = source["organizerUid"]
        self.is_completed = source["isCompleted"]
        self.item_list = source["itemList"]
        self.members = source["members"]
        self.room_name = source["roomName"]
        self.created_time = source["creationTime"]

    def to_dict(self):
        """
        turn Group to dict
        :return: a dictionaty
        """
        return {
            "organizerUid": self.organizer_uid,
            "isCompleted": self.is_completed,
            "itemList": self.item_list,
            "members": self.members,
            "roomName": self.room_name,
            "creationTime": self.created_time
        }

    def __repr__(self):
        return (
            f'Group(\
                        organizerUid={self.organizer_uid}, \
                        isCompleted={self.is_completed}, \
                        itemList={self.item_list}, \
                        members={self.members}, \
                        roomName={self.room_name}, \
                        creationTime={self.created_time}, \
                    )'
        )

    @staticmethod
    def create_from_dict(params: dict):
        """
        :param params: a dictionary with params
        :return: a Group class
        """
        return Group(organizer_id=params.get("organizer", ""),
                     room_name=params.get("roomName", "New matching room"))

    @staticmethod
    def update_from_dict(params: dict):
        """
        :param params: a dictionary with params
        :return: a Group class
        """
        dict_to_update = dict()
        if 'roomName' in params:
            dict_to_update['roomName'] = params.get('roomName')
        if 'organizerUid' in params:
            dict_to_update['organizerUid'] = params.get('organizerUid')
        if 'isCompleted' in params:
            dict_to_update['isCompleted'] = params.get('isCompleted')
        return dict_to_update

    @staticmethod
    def validate_user_role(uid: str, group_id: str = None,
                           group_snap: DocumentSnapshot = None):
        """
        Validate a user's membership in a matching room.
        :param group_snap: snapshot of a document
        :param uid:
        :param group_id:
        :return: didn't join -> 0, a member -> 1, organizer -> 2
        """
        snap = group_snap or ref_groups.document(group_id).get()
        if not snap.exists:
            raise InvalidRequestBody('Invalid groupId provided')
        data = snap.to_dict()
        group_members = data.get("members") or []
        current_organizer = data.get("organizerUid") or ""
        if uid not in group_members:
            return 0
        if uid != current_organizer:
            return 1
        return 2

    @staticmethod
    def append_item_list(uid: str, group_id: str, item_id: str):
        """
        Append item id to group item lists
        :param uid: user id
        :param group_id: group id
        :param item_id: item id
        """
        doc = ref_groups.document(group_id)
        snap = doc.get()
        if Group.validate_user_role(uid=uid, group_snap=snap) > 0:
            doc.update({
                'itemList': firestore.ArrayUnion([item_id])
            })
        else:
            raise UnauthorizedRequest.raise_no_membership()
