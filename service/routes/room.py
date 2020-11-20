"""Room APIs"""
from google.cloud.firestore import ArrayUnion
from flask import Blueprint, request

from models.group import Group
from models.item import filter_items
from utils.connections import ref_groups, ref_users, ref_votes
from utils.decorators import check_token
from utils.exceptions import InvalidQueryParams, InvalidRequestBody, UnauthorizedRequest

room = Blueprint('room', __name__)


def group_data_to_dict(record):
    """A helper function for formatting response."""
    gid, data = record
    return {
        "groupId": gid,
        "roomName": data.get('roomName'),
        "organizer": data.get('organizerUid'),
        "isCompleted": data.get('isCompleted')
    }


@room.route('/room/list', methods=['GET'])
@check_token
def get_group_list(auth_uid=None):
    """Get a list of group of one user."""
    user_id = auth_uid or request.args.get('uid')
    if user_id is None:
        raise InvalidQueryParams("uid is required.")

    # offset = request.args.get('offset') if 'offset' in request.args else 0
    # limit = request.args.get('limit') if 'limit' in request.args else 100
    state_text = request.args.get('state') or ''
    filter_completed = state_text == 'true'
    query = ref_groups.where(u'members', u'array_contains', user_id)
    if state_text != '':
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
    """Create a group, whose organizer would be the creator."""
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
        raise InvalidRequestBody.raise_key_error(e)


@room.route('/room/<string:group_id>', methods=['GET'])
@check_token
def get_group_profile(auth_uid=None, group_id=None):
    """Get the profile of a matching group."""
    group_id = group_id or request.args.get('gid') or ''
    group_doc = ref_groups.document(group_id)
    snap = group_doc.get()
    if Group.validate_user_role(auth_uid, group_snap=snap) < 1:
        raise UnauthorizedRequest.error_no_membership()
    if not snap.exists:
        raise InvalidQueryParams("Group id does not exist.")
    rv = snap.to_dict()
    list_uid = rv.get("members")
    members = list_uid or []
    return_members = []

    for user_id in members:
        user_dict = ref_users.document(user_id).get().to_dict()
        user_dict['userId'] = user_id
        return_members.append(user_dict)
    rv["members"] = return_members

    return {
        "status": "success",
        "data": rv
    }


@room.route('/room/<string:group_id>', methods=['PUT'])
@check_token
def update_group_profile(auth_uid=None, group_id=None):
    """
    Update a group profile: room name, organizer, completion state.
    :param auth_uid:
    :param group_id:
    :return:
    """
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

    # validate request user_id
    if auth_uid not in group_members:
        raise UnauthorizedRequest("You are not authorized to access the group profile")

    dict_to_update = Group.update_from_dict(request_body)
    if current_organizer != auth_uid and (
            'isCompleted' in dict_to_update or 'organizerUid' in dict_to_update
    ):
        raise UnauthorizedRequest("Only the organizer can modify 'status' and change the room host")

    if len(dict_to_update) > 0:
        group_doc.update(dict_to_update)

    return {
        "msg": "success",
        "data": group_doc.get().to_dict()
    }


@room.route('/room/<group_id>/member', methods=['PUT'])
@check_token
def join_group(auth_uid=None, group_id=""):
    """
    Join Group Api
    :param auth_uid: uid
    :param group_id: gid
    :return:
    """
    user_id = auth_uid  # the login user joins a target group.

    if not ref_groups.document(group_id).get().exists:
        raise InvalidRequestBody('Invalid groupId provided')

    # validate user_id
    if not ref_users.document(user_id).get().exists:
        raise InvalidRequestBody('Invalid userId provided')

    ref_groups.document(group_id).update({u'members': ArrayUnion([user_id])})  # noqa

    return {
        "status": "success",
        "data": ref_groups.document(group_id).get().to_dict()
    }


@room.route('/room/<string:group_id>/stats', methods=['GET'])
@check_token
def get_stats(auth_uid=None, group_id=""):
    """
    Get statistics
    :param auth_uid: uid
    :param group_id: gid
    :return:
    """
    snap = ref_groups.document(group_id).get()

    role = Group.validate_user_role(auth_uid, group_snap=snap)

    if role < 1:
        raise UnauthorizedRequest.error_no_membership()

    res_items = filter_items({
        'gid': group_id
    })
    list_items = res_items.get('items')
    rv_data = list()
    for it in list_items:
        item_id = it.get('itemId')
        if not item_id:
            raise InvalidRequestBody("Item ID not found.")
        q = ref_votes.where('groupId', '==', group_id).where('itemId', '==', item_id)
        stream = q.stream()
        cnt_like, cnt_hate = 0, 0
        for doc in stream:
            vt = doc.to_dict().get('type')
            if vt > 0:
                cnt_like += 1
            elif vt < 0:
                cnt_hate += 1
        rv_data.append({
            'like': cnt_like,
            'dislike': cnt_hate,
            'items': it
        })

    return {
        "data": rv_data,
        "isCompleted": snap.get('isCompleted')
    }
