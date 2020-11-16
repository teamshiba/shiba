from firebase_admin import firestore
from google.cloud.firestore import CollectionReference
from flask import Blueprint, request
from utils import db
from models.voting import Voting
from models.item import filter_items
from utils.exceptions import InvalidQueryParams, InvalidRequestBody

voting = Blueprint('voting', __name__)

user_ref: CollectionReference = db.collection(u'Users')
group_ref: CollectionReference = db.collection(u'Groups')
voting_ref: CollectionReference = db.collection(u'Votings')


# PUT /api/voting
@voting.route('/voting', methods=['PUT'])
def put_a_vote():
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
    if v_type is None:
        raise InvalidRequestBody("type is required.")
    fb_obj = Voting(gid, uid, item_id, v_type)
    resp = voting_ref.add(fb_obj.to_dict())

    return filter_items({
        "gid": gid,
        "unvoted_by": uid
    })
