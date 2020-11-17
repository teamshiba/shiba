from firebase_admin import firestore
from flask import Blueprint, request
from models.connections import ref_votes, ref_groups
from models.voting import Voting
from models.item import filter_items
from utils.exceptions import InvalidQueryParams, InvalidRequestBody

voting = Blueprint('voting', __name__)


# PUT /api/voting
@voting.route('/voting', methods=['PUT'])
def put_a_vote(auth_uid=None):
    request_body: dict = request.get_json()
    uid = request_body.get("userId")
    gid = request_body.get("groupId")
    item_id = request_body.get("itemId")
    v_type = request_body.get("type")
    if uid is None:
        raise InvalidRequestBody("userId is required.")
    if gid is None:
        raise InvalidRequestBody("groupId is required.")
    if item_id is None:
        raise InvalidRequestBody("itemId is required.")
    if v_type is None:  # check type
        raise InvalidRequestBody("type is required.")
    if v_type not in [1, -1]:
        raise InvalidRequestBody("type must be 1 or -1.")
    query_vote = ref_votes.where("groupId", '==', gid).where(
        'userId', '==', uid
    ).where('itemId', '==', item_id)
    gen_votes = query_vote.stream()
    if (len(list(gen_votes))) > 0:
        raise InvalidRequestBody("duplicated vote.")
    group_snap = ref_groups.document(gid).get()
    item_list = group_snap.get("itemList")
    members = group_snap.get('members')
    if item_id not in list(item_list):
        raise InvalidRequestBody("target item not in that group.")
    if uid not in list(members):
        raise InvalidRequestBody("that user not in this group.")
    fb_obj = Voting(gid, uid, item_id, v_type)
    data = fb_obj.to_dict()
    resp = ref_votes.add(data)

    # Response are the same format as "PUT /api/item/list"
    return filter_items({
        "gid": gid,
        "unvoted_by": uid
    })
