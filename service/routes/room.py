from firebase_admin import firestore
from flask import Blueprint, request
from utils import db
from utils.exceptions import InvalidQueryParams, InvalidRequestBody, UnauthorizedRequest
from models.group import Group
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
def get_group_list(uid=''):
    user_id = request.args.get('uid')
    if user_id is None:
        raise InvalidQueryParams("uid is required.")
    # if user_id != uid:
    #     raise UnauthorizedRequest("id_token not corresponding with uid param")
    offset = request.args.get('offset') if 'offset' in request.args else 0
    limit = request.args.get('limit') if 'limit' in request.args else 100
    filter_completed = request.args.get('state') if 'state' in request.args else False
    query = group_ref.where(u'members', u'array_contains', user_id)
    if filter_completed is not None:
        query = query.where(u'isCompleted', u'==', filter_completed)
    results = query.stream()
    data = map(lambda doc: (doc.id, doc.to_dict()), results)
    return {
        "status": "success",
        "data": list(map(group_data_to_dict, data))
    }


@room.route('/room', methods=['POST'])
@check_token
def create_group(uid):
    organizer_id = uid
    display_name = request.get_json()["displayName"]
    group = Group(organizer_id=organizer_id, room_name=display_name)
    create_group_response = group_ref.add(group.to_dict())
    return {
        "status": "success",
        "data": create_group_response[1].get().to_dict()
    }


@room.route('/room', methods=['GET'])
@check_token
def get_group_profile(uid):
    group_id = request.args.get('gid')
    group_doc = group_ref.document(group_id)
    raw_group = group_doc.get().to_dict()
    list_uid = raw_group["members"]
    members = list()

    # validate request user
    if uid not in members:
        raise UnauthorizedRequest("You are not authorized to access the group profile")

    for user_id in list_uid:
        members.append(user_ref.document(user_id).get().to_dict())
    raw_group["members"] = members
    return {
        "status": "success",
        "data": raw_group
    }


@room.route('/room', methods=['PUT'])
@check_token
def update_group_profile(uid):
    request_body = request.get_json()

    if 'groupId' not in request_body:
        raise InvalidRequestBody('No groupId provided')

    # validate group_id
    group_id = request_body['groupId']
    if not group_ref.document(group_id).get().exists:
        raise InvalidRequestBody('Invalid groupId provided')

    group_doc = group_ref.document(group_id)
    group_members = group_doc.get().todict()['members']

    # validate request user_id
    if uid not in group_members:
        raise UnauthorizedRequest("You are not authorized to access the group profile")

    display_name = request_body['displayName'] if 'displayName' in request_body else ''
    access_link = request_body['link'] if 'link' in request_body else ''
    organizer_uid = request_body['organizer'] if 'organizer' in request_body else ''

    if display_name: group_doc.update({u'roomName': display_name})
    if access_link: group_doc.update({u'accessLink': access_link})
    if organizer_uid: group_doc.update({u'organizerUid': organizer_uid})

    return {
        "status": "success",
        "data": group_doc.get().to_dict()
    }


@room.route('/room/join', methods=['PUT'])
@check_token
def join_group(uid):
    request_body = request.get_json()

    user_id = uid
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

