from firebase_admin import firestore
from flask import Blueprint, request

from models.group import Group
from models.item import filter_items
from utils.connections import ref_groups, ref_users
from utils.decorators import check_token
from utils.exceptions import InvalidQueryParams, InvalidRequestBody, UnauthorizedRequest

room = Blueprint('room', __name__)


def group_data_to_dict(record):
    gid, data = record
    # TODO this format is not the same as in models/group.py
    return {
        "groupId": gid,
        "roomName": data.get('roomName'),
        "organizer": data.get('organizerUid'),
        "isCompleted": data.get('isCompleted')
    }


@room.route('/room/list', methods=['GET'])
@check_token
def get_group_list(auth_uid=None):
    user_id = auth_uid or request.args.get('uid')
    if user_id is None:
        raise InvalidQueryParams("uid is required.")

    offset = request.args.get('offset') if 'offset' in request.args else 0
    limit = request.args.get('limit') if 'limit' in request.args else 100
    state_text = request.args.get('state') or ''
    filter_completed = state_text == 'true'
    query = ref_groups.where(u'members', u'array_contains', user_id)
    if state_text is not '':
        query = query.where(u'isCompleted', u'==', filter_completed)
    results = query.stream()
    data = map(lambda doc: (doc.id, doc.to_dict()), results)
    return {
        "status": "success",
        "data": list(map(group_data_to_dict, data))
    }


@room.route('/room', methods=['POST'])
@check_token
def create_group(auth_uid=None):
    organizer_id = auth_uid
    request_body = request.get_json()
    try:
        display_name = request_body['roomName']
        group = Group(organizer_id=organizer_id, room_name=display_name)
        create_time, doc_ref = ref_groups.add(group.to_dict())
        return {
            "msg": "success",
            "creationTime": str(create_time),
            "data": doc_ref.get().to_dict()
        }
    except KeyError as e:
        InvalidRequestBody.raise_key_error(e)


@room.route('/room/<string:group_id>', methods=['GET'])
@check_token
def get_group_profile(auth_uid=None, group_id=None):
    group_id = group_id or request.args.get('gid') or ''
    group_doc = ref_groups.document(group_id)
    snap = group_doc.get()
    if not snap.exists:
        raise InvalidQueryParams("Group id does not exist.")
    rv = snap.to_dict()
    list_uid = rv.get("members")
    members = list_uid or []
    return_members = []

    # validate request user
    if auth_uid not in members:
        raise UnauthorizedRequest("You are not authorized to access the group profile")

    for user_id in members:
        return_members.append(ref_users.document(user_id).get().to_dict())
    rv["members"] = return_members

    return {
        "status": "success",
        "data": rv
    }


@room.route('/room/<string:group_id>', methods=['PUT'])
@check_token
def update_group_profile(auth_uid=None, group_id=None):
    request_body = request.get_json()

    if 'groupId' not in request_body and group_id is None:
        raise InvalidRequestBody('No groupId provided')

    # validate group_id
    group_id = group_id or request_body['groupId']
    if not ref_groups.document(group_id).get().exists:
        raise InvalidRequestBody('Invalid groupId provided')

    group_doc = ref_groups.document(group_id)
    doc_dict: dict = group_doc.get().to_dict()
    group_members = doc_dict.get("members") or []
    current_organizer = doc_dict.get("organizerUid") or ""

    # TODO use Group.validate_user_role instead.
    # validate request user_id
    if auth_uid not in group_members:
        raise UnauthorizedRequest("You are not authorized to access the group profile")

    dict_to_update = Group.update_from_dict(request_body)
    if current_organizer != auth_uid and (
            'isCompleted' in dict_to_update or 'organizerUid' in dict_to_update
    ):
        raise UnauthorizedRequest("Only the organizer can modify 'status' and change the room host.")

    if len(dict_to_update) > 0:
        group_doc.update(dict_to_update)

    return {
        "msg": "success",
        "data": group_doc.get().to_dict()
    }


@room.route('/room/<group_id>/member', methods=['PUT'])
@check_token
def join_group(auth_uid=None, group_id=""):
    user_id = auth_uid  # the login user joins a target group.

    if not ref_groups.document(group_id).get().exists:
        raise InvalidRequestBody('Invalid groupId provided')

    # validate user_id
    if not ref_users.document(user_id).get().exists:
        raise InvalidRequestBody('Invalid userId provided')

    ref_groups.document(group_id).update({u'members': firestore.ArrayUnion([user_id])})  # noqa

    return {
        "status": "success",
        "data": ref_groups.document(group_id).get().to_dict()
    }


@room.route('/room/<string:group_id>/stats', methods=['GET'])
@check_token
def get_stats(auth_uid=None, group_id=""):
    snap = ref_groups.document(group_id).get()

    role = Group.validate_user_role(auth_uid, group_snap=snap)

    if role < 1:
        UnauthorizedRequest.raise_no_membership()

    res_items = filter_items({
        'gid': group_id
    })
    # query_items_res = Item.get_list_by_group(snap.get('itemList'))

    return {
        "data": [{
            "like": 1,
            "dislike": 2,
            "item": {
                "name": "mock response to be implemented", "itemId": "mock"
            }
        }],
        "isCompleted": snap.get('isCompleted')
    }
