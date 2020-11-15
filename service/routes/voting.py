from firebase_admin import firestore
from google.cloud.firestore import CollectionReference
from flask import Blueprint, request
from utils import db
from models.voting import Voting
from utils.exceptions import InvalidQueryParams, InvalidRequestBody

voting = Blueprint('voting', __name__)

user_ref = db.collection(u'Users')
group_ref = db.collection(u'Groups')
voting_ref: CollectionReference = db.collection(u'Voting')


# PUT /api/voting
@voting.route('/voting', methods=['PUT'])
def put_a_vote():
    request_body: dict = request.get_json()
    uid = request_body.get("userId")
    gid = request_body.get("groupId")
    item_id = request_body.get("itemId")
    v_type = request_body.get("type")
    fb_obj = Voting(gid, uid, item_id, v_type)
    resp = voting_ref.add(fb_obj.to_dict())
    return {
        "roomTotal": 0,
        "items": []
    }
