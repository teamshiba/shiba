import datetime


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






