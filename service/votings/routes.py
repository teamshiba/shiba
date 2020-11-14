from firebase_admin import firestore
from flask import Blueprint, request
from utils import db
from utils.exceptions import InvalidQueryParams, InvalidRequestBody

voting = Blueprint('voting', __name__)

user_ref = db.collection(u'Users')
group_ref = db.collection(u'Groups')
voting_ref = db.collection(u'Voting')

# PUT /api/item/vote
@voting.route('/item/vote', methods=['PUT'])
def get_group_list():
    pass