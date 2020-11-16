from firebase_admin import firestore
from flask import Blueprint, request
from models.connections import ref_groups, ref_votes
from models.voting import Voting
from models.item import filter_items
from utils.exceptions import InvalidQueryParams, InvalidRequestBody, DataModelException

router_item = Blueprint('item', __name__)


# GET /api/item/list
@router_item.route('/item/list', methods=['GET'])
def get_group_item_list(auth_uid=None):
    params: dict = request.args.to_dict()
    try:
        return filter_items(params)
    except DataModelException as e:
        raise InvalidQueryParams(e.description)
