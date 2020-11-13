from flask import Blueprint, request
from service import db

room = Blueprint('room', __name__)

user_ref = db.collection(u'Users')
group_ref = db.collection(u'Groups')


def group_data_to_dict(record):
    gid, data = record
    return {
        "groupId": gid,
        "displayName": data.get('roomName'),
        "organizer": data.get('organizerUid'),
        "isCompleted": data.get('isCompleted')
    }


@room.route('/room/list', methods=['GET'])
def get_group_list():
    user_id = request.args.get('uid')
    offset = request.args.get('offset') if 'offset' in request.args else 0
    limit = request.args.get('limit') if 'limit' in request.args else 100
    filter_completed = request.args.get('state') if 'state' in request.args else None
    query = group_ref.where(u'members', u'array_contains', user_id)
    if filter_completed is not None:
        query = query.where(u'is_completed', u'==', filter_completed)
    results = query.stream()
    data = map(lambda doc: (doc.id, doc.to_dict()), results)
    return {
        "data": list(map(group_data_to_dict, data))
    }


# @room.route('/room', methods=['POST'])
# def create_group():
#     pass
#
#
# @room.route('/room', methods=['GET'])
# def get_group_profile():
#     pass
#
#
# @room.route('/room', methods=['PUT'])
# def update_group_profile():
#     pass


@room.route('/room/join', methods=['PUT'])
def update_group_profile():
    pass
