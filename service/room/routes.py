from firebase_admin import firestore
from flask import Blueprint, request
from utils import db
from utils.exceptions import InvalidQueryParams, InvalidRequestBody
from room.fb_objects import Group
from utils.decorators import check_token

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
@check_token
def get_group_list():
    user_id = request.args.get('uid')
    if user_id is None:
        raise InvalidQueryParams("Param 'uid' is required.")
    offset = request.args.get('offset') if 'offset' in request.args else 0
    limit = request.args.get('limit') if 'limit' in request.args else 100
    filter_completed = request.args.get('state') if 'state' in request.args else False
    query = group_ref.where(u'members', u'array_contains', user_id)
    if filter_completed is not None:
        query = query.where(u'is_completed', u'==', filter_completed)
    results = query.stream()
    data = map(lambda doc: (doc.id, doc.to_dict()), results)
    return {
        "status": "success",
        "data": list(map(group_data_to_dict, data))
    }


@room.route('/room', methods=['POST'])
def create_group():
    organizer_id = request.get_json()["userId"]
    display_name = request.get_json()["displayName"]
    group = Group(organizer_id=organizer_id, room_name=display_name)
    create_group_response = group_ref.add(group.to_dict())
    return {
        "status": "success",
        "data": create_group_response[1].get().to_dict()
    }


@room.route('/room', methods=['GET'])
def get_group_profile():
    group_id = request.args.get('gid')
    group_doc = group_ref.document(group_id)
    raw_group = group_doc.get().to_dict()
    list_uid = raw_group.get("members")
    members = list()
    for uid in list_uid:
        members.append(user_ref.document(uid).get().to_dict())
    raw_group["members"] = members
    return {
        "status": "success",
        "data": raw_group
    }


@room.route('/room', methods=['PUT'])
def update_group_profile():
    request_body = request.get_json()

    if 'groupId' not in request_body:
        raise InvalidRequestBody('No groupId provided')

    # validate group_id
    group_id = request_body['groupId']
    if not group_ref.document(group_id).get().exists:
        raise InvalidRequestBody('Invalid groupId provided')

    display_name = request_body['displayName'] if 'displayName' in request_body else ''
    access_link = request_body['link'] if 'link' in request_body else ''
    organizer_uid = request_body['organizer'] if 'organizer' in request_body else ''

    if display_name: group_ref.document(group_id).update({u'roomName': display_name})
    if access_link: group_ref.document(group_id).update({u'accessLink': access_link})

    if organizer_uid:
        # organizer must be in members first.
        if organizer_uid in group_ref.document(group_id).get().to_dict()["members"]:
            group_ref.document(group_id).update({u'organizerUid': organizer_uid})
        else:
            raise InvalidRequestBody('organizer must be in the room!')

    group_doc = group_ref.document(group_id)
    return {
        "status": "success",
        "data": group_doc.get().to_dict()
    }


@room.route('/room/join', methods=['PUT'])
def join_group():
    request_body = request.get_json()

    user_id = request_body['userId']
    group_id = request_body['groupId']

    # validate group_id
    if not group_ref.document(group_id).get().exists:
        raise InvalidRequestBody('Invalid groupId provided')

    # validate user_id
    if not user_ref.document(user_id).get().exists:
        raise InvalidRequestBody('Invalid userId provided')

    group_ref.document(group_id).update({u'members': firestore.ArrayUnion([user_id])})

    return {
        "status": "success",
        "data": group_ref.document(group_id).get().to_dict()
    }

