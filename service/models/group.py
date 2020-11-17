import datetime
from typing import Union

from utils.exceptions import InvalidRequestBody
from .connections import ref_groups


class Group(object):
    def __init__(self, organizer_id, room_name='', is_completed=False):
        self.organizer_uid = organizer_id
        self.is_completed = is_completed
        self.item_list = []
        self.members = [organizer_id]
        self.room_name = room_name
        self.created_time = datetime.datetime.now()
        self.access_link = ''

    def to_dict(self):
        return {
            "organizerUid": self.organizer_uid,
            "isCompleted": self.is_completed,
            "itemList": self.item_list,
            "members": self.members,
            "roomName": self.room_name,
            "creationTime": self.created_time,
            "accessLink": self.access_link
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
                        accessLink={self.access_link}, \
                    )'
        )

    @staticmethod
    def create_from_dict(params: dict):
        return Group(organizer_id=params.get("organizer", ""),
                     room_name=params.get("roomName", "New matching room"))

    @staticmethod
    def update_from_dict(params: dict):
        dict_to_update = dict()
        if 'roomName' in params:
            dict_to_update['roomName'] = params.get('roomName')
        if 'organizerUid' in params:
            dict_to_update['organizerUid'] = params.get('organizerUid')
        if 'isCompleted' in params:
            dict_to_update['isCompleted'] = params.get('isCompleted')
        return dict_to_update

    @staticmethod
    def validate_user_role(uid: str, group_id: str):
        """
        Validate a user's membership in a matching room.
        :param uid:
        :param group_id:
        :return: didn't join -> 0, a member -> 1, organizer -> 2
        """
        snap = ref_groups.document(group_id).get()
        if not snap.exists:
            raise InvalidRequestBody('Invalid groupId provided')
        data = snap.to_dict()
        group_members = data.get("members") or []
        current_organizer = data.get("organizerUid") or ""
        if uid not in group_members:
            return 0
        if uid != current_organizer:
            return 1
        else:
            return 2
